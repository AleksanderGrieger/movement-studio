import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

/**
 * Migrate the JSON content layer into Payload.
 *
 * Idempotent: every record is matched by slug, so running this twice leaves
 * the same database. It is a migration, not a fixture — it makes the database
 * match the source files, which means it also DELETES records whose slug is
 * not in the source. Anything an editor added through the admin and that the
 * source does not know about will be removed, and the script says so as it
 * goes.
 *
 * Slugs and order are preserved exactly. Where `order` is a field on a
 * collection it is copied across; where it lives on a nested array it is
 * carried by array position instead, because a drag in the admin is the
 * editing gesture and two sources of truth would drift. That is lossless
 * here: every nested `order` in the source runs 1..n in array order, and the
 * script checks that assumption rather than trusting it.
 *
 * Ends by printing the record-count table from docs/content-layer.md §2 and
 * exits non-zero if any count is off.
 *
 * Run: npm run seed
 */

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * The source files. They live in the site's content layer until Phase 2.2
 * removes them from there, at which point they move here as the migration's
 * own fixture — a fresh database still needs something to bootstrap from.
 */
const LOCAL_DATA = path.resolve(dirname, 'seed-data')
const SITE_DATA = path.resolve(dirname, '../../../lib/content/data')
const DATA_DIR = fs.existsSync(LOCAL_DATA) ? LOCAL_DATA : SITE_DATA

/** Where the referenced media files are on disk. */
const PUBLIC_DIR = fs.existsSync(LOCAL_DATA)
  ? path.resolve(dirname, 'seed-media')
  : path.resolve(dirname, '../../../public')

/* ---------------------------------------------------------------- sources */

const read = <T>(name: string): T =>
  JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${name}.json`), 'utf8')) as T

type Json = Record<string, any>

const locations = read<Json[]>('locations')
const offer = read<Json[]>('offer')
const schedule = read<Json>('schedule')
const pricing = read<Json[]>('pricing')
const instructors = read<Json>('instructors')
const programs = read<Json>('programs')
const faq = read<Json[]>('faq')
const site = read<Json>('site')
const forms = read<Json>('forms')

/* ------------------------------------------------------------------ utils */

const log = (message: string) => console.log(message)

/** Nested order is carried by position, which only works if it is already 1..n. */
function assertSequential(rows: Json[], label: string): void {
  const orders = rows.map((row) => row.order)
  const expected = rows.map((_, index) => index + 1)
  if (JSON.stringify(orders) !== JSON.stringify(expected)) {
    throw new Error(
      `${label}: nested order must run 1..n in array order to survive the move to array position, got [${orders.join(', ')}]`,
    )
  }
}

/** A group field Payload can store, from a nullable source object. */
const groupOrEmpty = (value: Json | null | undefined, fields: string[]): Json =>
  value ? Object.fromEntries(fields.map((f) => [f, value[f]])) : {}

/* ------------------------------------------------------------------ media */

/**
 * Upload a file once and reuse it.
 *
 * `alt` is the file's own description. Three posters are shown in two places
 * with deliberately different wording — the teaser band has no heading naming
 * the programme, so its alt has to — and that second wording is carried by an
 * override on the placement rather than by a duplicate upload.
 */
async function seedMedia(payload: Payload): Promise<Map<string, number | string>> {
  const wanted = new Map<string, string>()
  const want = (src: string | undefined, alt: string) => {
    if (src) wanted.set(src, alt)
  }

  want(site.hero?.video?.src, site.hero?.video?.ariaLabel ?? '')
  want(site.hero?.video?.poster?.src, site.hero?.video?.poster?.alt ?? '')
  for (const person of instructors.instructors) want(person.photo.src, person.photo.alt)
  for (const program of programs.programs) {
    for (const poster of program.posters) want(poster.src, poster.alt)
  }
  for (const poster of programs.teaser.posters) {
    if (!wanted.has(poster.image.src)) want(poster.image.src, poster.image.alt)
  }

  const byFilename = new Map<string, number | string>()

  for (const [src, alt] of wanted) {
    const filename = path.basename(src)
    const filePath = path.join(PUBLIC_DIR, src)
    if (!fs.existsSync(filePath)) {
      throw new Error(`media file missing: ${filePath} (referenced as ${src})`)
    }

    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const doc = await payload.update({
        collection: 'media',
        id: existing.docs[0].id,
        data: { alt },
      })
      byFilename.set(src, doc.id)
      log(`  media  = ${filename}`)
    } else {
      const doc = await payload.create({ collection: 'media', data: { alt }, filePath })
      byFilename.set(src, doc.id)
      log(`  media  + ${filename}`)
    }
  }

  return byFilename
}

/* ------------------------------------------------------- collection upsert */

type Collection = Parameters<Payload['find']>[0]['collection']

/**
 * Make a collection match the rows given, matched by slug.
 *
 * Returns slug -> id, which is how the relationship fields get wired.
 */
async function sync(
  payload: Payload,
  collection: Collection,
  rows: Json[],
): Promise<Map<string, number | string>> {
  const ids = new Map<string, number | string>()
  const slugs = new Set(rows.map((row) => row.slug as string))

  const existing = await payload.find({ collection, limit: 1000, pagination: false })
  const bySlug = new Map(existing.docs.map((doc: Json) => [doc.slug as string, doc]))

  for (const row of rows) {
    const found = bySlug.get(row.slug)
    if (found) {
      const doc = await payload.update({ collection, id: found.id, data: row })
      ids.set(row.slug, doc.id)
    } else {
      const doc = await payload.create({ collection, data: row })
      ids.set(row.slug, doc.id)
    }
  }

  for (const [slug, doc] of bySlug) {
    if (!slugs.has(slug)) {
      await payload.delete({ collection, id: (doc as Json).id })
      log(`  ${String(collection).padEnd(17)} - ${slug} (not in the source)`)
    }
  }

  log(`  ${String(collection).padEnd(17)} ${rows.length} record(s)`)
  return ids
}

/* ------------------------------------------------------------------- seed */

const payload = await getPayload({ config })

log(`\nSeeding from ${DATA_DIR}\n`)

log('media')
const media = await seedMedia(payload)
const mediaId = (src: string): number | string => {
  const id = media.get(src)
  if (id === undefined) throw new Error(`media not uploaded: ${src}`)
  return id
}

log('\ncollections')

const locationIds = await sync(
  payload,
  'locations',
  locations.map((location) => ({
    slug: location.slug,
    name: location.name,
    address: location.address.map((line: string) => ({ line })),
    hours: location.hours,
    map: groupOrEmpty(location.map, ['src', 'title']),
    order: location.order,
    isDefault: Boolean(location.isDefault),
  })),
)

const weekdayIds = await sync(payload, 'weekdays', schedule.weekdays)

const labelIds = await sync(payload, 'schedule-labels', schedule.labels)

const audienceIds = await sync(payload, 'audiences', forms.audiences)

await sync(
  payload,
  'schedule-entries',
  schedule.entries.map((entry: Json) => ({
    slug: entry.slug,
    location: locationIds.get(entry.location),
    day: weekdayIds.get(entry.day),
    start: entry.start,
    end: entry.end ?? null,
    name: entry.name,
    labels: entry.labels.map((label: string) => labelIds.get(label)),
    note: entry.note ?? null,
  })),
)

await sync(
  payload,
  'price-blocks',
  pricing.map((block) => ({
    slug: block.slug,
    location: locationIds.get(block.location),
    title: block.title,
    rows: block.rows.map((row: Json) => ({
      slug: row.slug,
      name: row.name,
      cadence: row.cadence ?? null,
      price: row.price,
      currency: row.currency,
    })),
    order: block.order,
  })),
)

await sync(
  payload,
  'offer-groups',
  offer.map((group) => {
    assertSequential(group.items, `offer group ${group.slug}`)
    return {
      slug: group.slug,
      title: group.title,
      items: group.items
        .slice()
        .sort((a: Json, b: Json) => a.order - b.order)
        .map((item: Json) => ({ slug: item.slug, title: item.title, body: item.body })),
      scheduleFilter: group.scheduleFilter ? labelIds.get(group.scheduleFilter) : null,
      scheduleFilterLabel: group.scheduleFilterLabel ?? null,
      order: group.order,
    }
  }),
)

await sync(
  payload,
  'instructors',
  instructors.instructors.map((person: Json) => ({
    slug: person.slug,
    name: person.name,
    role: person.role,
    bio: person.bio,
    photo: mediaId(person.photo.src),
    order: person.order,
  })),
)

await sync(
  payload,
  'programs',
  programs.programs.map((program: Json) => ({
    slug: program.slug,
    title: program.title,
    programme: program.programme,
    summary: program.summary,
    body: program.body.map((text: string) => ({ text })),
    posters: program.posters.map((poster: Json) => mediaId(poster.src)),
    sessions: program.sessions.map((session: Json) => ({
      slug: session.slug,
      dates: session.dates,
      rows: session.rows.map((row: Json) => ({
        start: row.start,
        end: row.end ?? null,
        name: row.name,
      })),
    })),
    venue: program.venue,
    order: program.order,
  })),
)

await sync(
  payload,
  'faq-items',
  faq.map((item) => ({
    slug: item.slug,
    question: item.question,
    answer: item.answer.map((text: string) => ({ text })),
    link: groupOrEmpty(item.link, ['label', 'href', 'ariaLabel', 'context', 'external']),
    order: item.order,
  })),
)

await sync(
  payload,
  'forms',
  forms.forms.map((form: Json) => {
    assertSequential(form.fields, `form ${form.slug}`)
    const fields = form.fields
      .slice()
      .sort((a: Json, b: Json) => a.order - b.order)
      .map((field: Json) => {
        const base = { slug: field.slug, entryId: field.entryId, required: field.required }
        if (field.kind === 'choice') {
          assertSequential(field.options, `form ${form.slug} field ${field.slug}`)
          return {
            blockType: 'choiceField',
            ...base,
            label: field.label,
            options: field.options
              .slice()
              .sort((a: Json, b: Json) => a.order - b.order)
              .map((option: Json) => ({ value: option.value, label: option.label })),
          }
        }
        if (field.kind === 'consent') {
          return {
            blockType: 'consentField',
            ...base,
            label: field.label,
            description: field.description,
            value: field.value,
          }
        }
        return {
          blockType: 'textField',
          ...base,
          kind: field.kind,
          label: field.label,
          autoComplete: field.autoComplete ?? null,
        }
      })

    return {
      slug: form.slug,
      location: locationIds.get(form.location),
      audience: audienceIds.get(form.audience),
      formId: form.formId,
      fields,
      order: form.order,
    }
  }),
)

/* ---------------------------------------------------------------- globals */

log('\nglobals')

const updateGlobal = async (slug: string, data: Json) => {
  await payload.updateGlobal({ slug: slug as Parameters<Payload['updateGlobal']>[0]['slug'], data })
  log(`  ${slug}`)
}

assertSequential(site.facts, 'facts')

await updateGlobal('site-meta', site.meta)
await updateGlobal('navigation', { items: site.navigation })
await updateGlobal('header-copy', site.header)
await updateGlobal('footer-copy', site.footer)
await updateGlobal('hero-copy', {
  eyebrow: site.hero.eyebrow,
  headline: site.hero.headline.map((line: Json[]) => ({
    runs: line.map((run) => ({ text: run.text, emphasis: Boolean(run.emphasis) })),
  })),
  lead: site.hero.lead,
  actions: site.hero.actions,
  meta: site.hero.meta.map((text: string) => ({ text })),
  video: {
    file: site.hero.video.src ? mediaId(site.hero.video.src) : null,
    poster: site.hero.video.poster ? mediaId(site.hero.video.poster.src) : null,
    width: site.hero.video.width,
    height: site.hero.video.height,
    ariaLabel: site.hero.video.ariaLabel,
  },
  badge: site.hero.badge,
})
await updateGlobal('section-intros', {
  sections: site.sections.map((section: Json) => ({
    sectionId: section.id,
    number: section.number,
    eyebrow: section.eyebrow,
    title: section.title,
    intro: section.intro ?? null,
  })),
})
await updateGlobal('facts', {
  items: site.facts
    .slice()
    .sort((a: Json, b: Json) => a.order - b.order)
    .map((fact: Json) => ({ term: fact.term, value: fact.value })),
})
await updateGlobal('marquee', { items: site.marquee.map((text: string) => ({ text })) })
await updateGlobal('ui-copy', site.ui)
await updateGlobal('contact-copy', site.contact)
await updateGlobal('founders-intro', instructors.founders)
await updateGlobal('programs-teaser', {
  eyebrow: programs.teaser.eyebrow,
  title: programs.teaser.title,
  body: programs.teaser.body,
  cta: programs.teaser.cta,
  posters: programs.teaser.posters.map((poster: Json) => {
    const id = mediaId(poster.image.src)
    /* The file's own alt is whatever was uploaded with it. Where this
       placement needs different wording, it is carried here. */
    const fileAlt =
      programs.programs
        .flatMap((program: Json) => program.posters)
        .find((candidate: Json) => candidate.src === poster.image.src)?.alt ?? poster.image.alt
    return {
      image: id,
      alt: poster.image.alt === fileAlt ? null : poster.image.alt,
      href: poster.href,
      ariaLabel: poster.ariaLabel,
    }
  }),
})
await updateGlobal('programs-page-copy', programs.page)
await updateGlobal('signup-copy', forms.ui)

/* ------------------------------------------------------------ the counts */

const count = async (collection: Collection): Promise<number> =>
  (await payload.count({ collection })).totalDocs

const all = async (collection: Collection): Promise<Json[]> =>
  (await payload.find({ collection, limit: 1000, pagination: false, depth: 0 })).docs as Json[]

const offerGroups = await all('offer-groups')
const priceBlocks = await all('price-blocks')
const programDocs = await all('programs')
const formDocs = await all('forms')
const teaser = (await payload.findGlobal({ slug: 'programs-teaser' })) as Json
const navigation = (await payload.findGlobal({ slug: 'navigation' })) as Json
const sections = (await payload.findGlobal({ slug: 'section-intros' })) as Json
const factsGlobal = (await payload.findGlobal({ slug: 'facts' })) as Json
const marquee = (await payload.findGlobal({ slug: 'marquee' })) as Json
const contact = (await payload.findGlobal({ slug: 'contact-copy' })) as Json

const sum = (rows: Json[], pick: (row: Json) => number) =>
  rows.reduce((total, row) => total + pick(row), 0)

/** docs/content-layer.md §2. */
const table: Array<[string, number, number]> = [
  ['locations', await count('locations'), 2],
  ['offer groups', offerGroups.length, 4],
  ['offer items', sum(offerGroups, (g) => g.items.length), 20],
  ['schedule labels', await count('schedule-labels'), 4],
  ['weekdays', await count('weekdays'), 7],
  ['schedule entries', await count('schedule-entries'), 30],
  ['price blocks', priceBlocks.length, 6],
  ['price rows', sum(priceBlocks, (b) => b.rows.length), 24],
  ['instructors', await count('instructors'), 5],
  ['programs', programDocs.length, 2],
  ['program sessions', sum(programDocs, (p) => p.sessions.length), 4],
  [
    'program session rows',
    sum(programDocs, (p) => sum(p.sessions, (s: Json) => s.rows.length)),
    10,
  ],
  ['teaser posters', teaser.posters?.length ?? 0, 3],
  ['nav items', navigation.items?.length ?? 0, 7],
  ['section intros', sections.sections?.length ?? 0, 7],
  ['faq items', await count('faq-items'), 6],
  ['facts', factsGlobal.items?.length ?? 0, 3],
  ['marquee items', marquee.items?.length ?? 0, 10],
  ['contact links', contact.links?.length ?? 0, 4],
  ['audiences', await count('audiences'), 2],
  ['sign-up forms', formDocs.length, 4],
  ['sign-up fields', sum(formDocs, (f) => f.fields.length), 20],
]

log('\n| domain               | records | expected |')
log('|----------------------|---------|----------|')
const wrong = table.filter(([, got, want]) => got !== want)
for (const [label, got, want] of table) {
  const mark = got === want ? ' ' : '!'
  log(`|${mark}${label.padEnd(21)}| ${String(got).padStart(7)} | ${String(want).padStart(8)} |`)
}

if (wrong.length > 0) {
  log(`\n${wrong.length} count(s) off:`)
  for (const [label, got, want] of wrong) log(`  ${label}: ${got}, expected ${want}`)
  process.exit(1)
}

log('\nevery count matches docs/content-layer.md §2')
process.exit(0)
