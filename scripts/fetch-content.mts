/**
 * Pull the content snapshot the site builds from.
 *
 * movement-studio is a static export on GitHub Pages. Payload needs a Node
 * runtime and a database, so it runs out of process and nothing in src/ may
 * talk to it — a request at render time would be a request that never happens
 * once the HTML is on a CDN. Instead the whole content layer is fetched once,
 * here, and written to lib/content/.snapshot/content.json, which the readers
 * in lib/content/*.ts read and nothing else does.
 *
 * Media is downloaded too, into public/assets/cms/, and every ImageRef.src is
 * rewritten to point there. The alternative — linking images straight at the
 * CMS — would make every page load depend on that host staying up and would
 * put a cross-origin request in front of the largest contentful paint.
 *
 * It fails loudly, on purpose. A fetch error, a missing collection or a field
 * that does not match lib/content/types.ts stops the build rather than
 * shipping a page with a section quietly missing.
 *
 * Run: npm run content:fetch
 *   PAYLOAD_URL      where the CMS is (default http://localhost:3100)
 *   PAYLOAD_API_KEY  optional; sent when the API is not public
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  Audience,
  ContactCopy,
  DefinitionPair,
  Fact,
  FaqItem,
  FooterCopy,
  FoundersIntro,
  HeaderCopy,
  HeroCopy,
  ImageRef,
  Instructor,
  LinkRef,
  Location,
  MarqueeItems,
  NavItem,
  OfferGroup,
  PriceBlock,
  Program,
  ProgramsPageCopy,
  ProgramsTeaser,
  ScheduleEntry,
  ScheduleLabel,
  SectionIntro,
  SignUpCopy,
  SignUpField,
  SignUpForm,
  SiteMeta,
  TextRun,
  UiCopy,
  VideoRef,
  Weekday,
} from "@/lib/content/types";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SNAPSHOT_DIR = path.join(root, "lib/content/.snapshot");
const SNAPSHOT_FILE = path.join(SNAPSHOT_DIR, "content.json");
const MEDIA_DIR = path.join(root, "public/assets/cms");
const MEDIA_PUBLIC_PATH = "/assets/cms";
const LEGACY_DIR = path.join(root, "lib/content/data");

const BASE = (process.env.PAYLOAD_URL ?? "http://localhost:3100").replace(/\/$/, "");
const API_KEY = process.env.PAYLOAD_API_KEY;

/* ============================================================ the transport */

type Json = Record<string, any>;

const headers: Record<string, string> = API_KEY
  ? { Authorization: `users API-Key ${API_KEY}` }
  : {};

async function get(endpoint: string): Promise<Json> {
  const url = `${BASE}${endpoint}`;
  let response: Response;
  try {
    response = await fetch(url, { headers });
  } catch (error) {
    throw new Error(
      `cannot reach the CMS at ${url} — ${(error as Error).message}\n` +
        `  Is it running? PAYLOAD_URL is ${BASE}.`,
    );
  }
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  return (await response.json()) as Json;
}

/** Every document in a collection, in one request. */
async function collection(slug: string, depth = 1): Promise<Json[]> {
  const body = await get(`/api/${slug}?limit=0&depth=${depth}`);
  if (!Array.isArray(body.docs)) throw new Error(`/api/${slug} returned no docs array`);
  return body.docs as Json[];
}

const global = (slug: string, depth = 1): Promise<Json> =>
  get(`/api/globals/${slug}?depth=${depth}`);

/* ================================================================== media */

const downloaded = new Map<string, string>();

/**
 * Copy one media file next to the site's own assets and return its path.
 *
 * Keyed by the CMS filename, so a file referenced from four places is
 * fetched once.
 */
async function downloadMedia(doc: Json): Promise<string> {
  const filename = doc.filename as string;
  if (!filename) throw new Error(`media ${doc.id} has no filename`);

  const cached = downloaded.get(filename);
  if (cached) return cached;

  const url = (doc.url as string).startsWith("http") ? (doc.url as string) : `${BASE}${doc.url}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} downloading ${url}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
  fs.writeFileSync(path.join(MEDIA_DIR, filename), bytes);

  const publicPath = `${MEDIA_PUBLIC_PATH}/${filename}`;
  downloaded.set(filename, publicPath);
  return publicPath;
}

/** A Media document as the site's ImageRef. `altOverride` is per placement. */
async function imageRef(doc: Json | null | undefined, altOverride?: string): Promise<ImageRef> {
  if (!doc || typeof doc !== "object") {
    throw new Error("expected a media document, got " + JSON.stringify(doc));
  }
  return {
    src: await downloadMedia(doc),
    width: doc.width as number,
    height: doc.height as number,
    alt: (altOverride || (doc.alt as string)) ?? "",
  };
}

/* ================================================================ shaping */

/** Drop keys the source omits rather than writing them as null. */
function compact<T extends Json>(object: T): T {
  const out: Json = {};
  for (const [key, value] of Object.entries(object)) {
    if (value === null || value === undefined || value === "" || value === false) continue;
    out[key] = value;
  }
  return out as T;
}

const text = (value: unknown): string => (typeof value === "string" ? value : "");

const link = (group: Json | null | undefined): LinkRef =>
  compact({
    label: text(group?.label),
    href: text(group?.href),
    ariaLabel: text(group?.ariaLabel),
    context: text(group?.context),
    external: Boolean(group?.external),
  }) as LinkRef;

const navItem = (row: Json): NavItem => ({
  label: text(row.label),
  href: text(row.href),
  scrollSpy: Boolean(row.scrollSpy),
});

const runs = (rows: Json[] | undefined): TextRun[] =>
  (rows ?? []).map((run) => compact({ text: text(run.text), emphasis: Boolean(run.emphasis) }) as TextRun);

const paragraphs = (rows: Json[] | undefined): string[] => (rows ?? []).map((row) => text(row.text));

const pairs = (rows: Json[] | undefined): DefinitionPair[] =>
  (rows ?? []).map((row) => ({ term: text(row.term), value: text(row.value) }));

/**
 * Deterministic order in the file.
 *
 * The API hands documents back in whatever order the database produced, so
 * without this the snapshot would churn between runs and its diffs would be
 * unreadable. Every reader sorts for itself, so this changes nothing the site
 * renders — it just makes the file stable.
 */
const byOrder = <T extends { order: number; slug?: string }>(rows: T[]): T[] =>
  rows.slice().sort((a, b) => a.order - b.order || (a.slug ?? "").localeCompare(b.slug ?? ""));

/** Classes have no `order` of their own; the grid reads them by start time. */
const byStart = <T extends { start: string; slug: string }>(rows: T[]): T[] =>
  rows.slice().sort((a, b) => a.start.localeCompare(b.start) || a.slug.localeCompare(b.slug));

/** A relationship field, as the related record's slug. */
function relSlug(value: unknown, field: string): string {
  if (value && typeof value === "object" && "slug" in (value as Json)) {
    return text((value as Json).slug);
  }
  throw new Error(
    `${field} did not come back populated — expected the related document, got ${JSON.stringify(value)}`,
  );
}

/* =============================================================== the pull */

async function build() {
  const [
    locationDocs,
    weekdayDocs,
    labelDocs,
    entryDocs,
    priceDocs,
    offerDocs,
    instructorDocs,
    programDocs,
    faqDocs,
    audienceDocs,
    formDocs,
  ] = await Promise.all([
    collection("locations"),
    collection("weekdays"),
    collection("schedule-labels"),
    collection("schedule-entries"),
    collection("price-blocks"),
    collection("offer-groups"),
    collection("instructors"),
    collection("programs"),
    collection("faq-items"),
    collection("audiences"),
    collection("forms"),
  ]);

  const [
    meta,
    navigation,
    header,
    footer,
    hero,
    sections,
    facts,
    marquee,
    ui,
    contact,
    founders,
    teaser,
    page,
    signupCopy,
  ] = await Promise.all([
    global("site-meta"),
    global("navigation"),
    global("header-copy"),
    global("footer-copy"),
    global("hero-copy"),
    global("section-intros"),
    global("facts"),
    global("marquee"),
    global("ui-copy"),
    global("contact-copy"),
    global("founders-intro"),
    global("programs-teaser"),
    global("programs-page-copy"),
    global("signup-copy"),
  ]);

  const locations: Location[] = locationDocs.map((doc) => ({
    slug: text(doc.slug),
    name: text(doc.name),
    address: (doc.address ?? []).map((row: Json) => text(row.line)),
    hours: pairs(doc.hours),
    map: doc.map?.src ? { src: text(doc.map.src), title: text(doc.map.title) } : null,
    order: doc.order as number,
    isDefault: Boolean(doc.isDefault),
  }));

  const offer: OfferGroup[] = offerDocs.map((doc) =>
    compact({
      slug: text(doc.slug),
      title: text(doc.title),
      order: doc.order as number,
      scheduleFilter: doc.scheduleFilter ? relSlug(doc.scheduleFilter, "offer.scheduleFilter") : "",
      scheduleFilterLabel: text(doc.scheduleFilterLabel),
      items: (doc.items ?? []).map((item: Json, index: number) => ({
        slug: text(item.slug),
        title: text(item.title),
        body: text(item.body),
        order: index + 1,
      })),
    }) as OfferGroup,
  );

  const labels: ScheduleLabel[] = labelDocs.map((doc) => ({
    slug: text(doc.slug),
    name: text(doc.name),
    tag: text(doc.tag),
    colorToken: text(doc.colorToken),
    order: doc.order as number,
  }));

  const weekdays: Weekday[] = weekdayDocs.map((doc) => ({
    slug: text(doc.slug),
    name: text(doc.name),
    order: doc.order as number,
  }));

  const entries: ScheduleEntry[] = entryDocs.map((doc) =>
    compact({
      slug: text(doc.slug),
      location: relSlug(doc.location, `entry ${doc.slug} location`),
      day: relSlug(doc.day, `entry ${doc.slug} day`),
      start: text(doc.start),
      end: text(doc.end),
      name: text(doc.name),
      labels: (doc.labels ?? []).map((value: unknown) => relSlug(value, `entry ${doc.slug} label`)),
      note: text(doc.note),
    }) as ScheduleEntry,
  );

  const pricing: PriceBlock[] = priceDocs.map((doc) => ({
    slug: text(doc.slug),
    location: relSlug(doc.location, `price block ${doc.slug} location`),
    title: text(doc.title),
    order: doc.order as number,
    rows: (doc.rows ?? []).map((row: Json) =>
      compact({
        slug: text(row.slug),
        name: text(row.name),
        cadence: text(row.cadence),
        price: row.price as number,
        currency: text(row.currency),
      }),
    ),
  }));

  const instructors: Instructor[] = [];
  for (const doc of instructorDocs) {
    instructors.push({
      slug: text(doc.slug),
      name: text(doc.name),
      role: text(doc.role),
      bio: text(doc.bio),
      photo: await imageRef(doc.photo),
      order: doc.order as number,
    });
  }

  const programs: Program[] = [];
  for (const doc of programDocs) {
    const posters: ImageRef[] = [];
    for (const poster of doc.posters ?? []) posters.push(await imageRef(poster));
    programs.push({
      slug: text(doc.slug),
      title: text(doc.title),
      programme: text(doc.programme),
      summary: text(doc.summary),
      body: paragraphs(doc.body),
      posters,
      sessions: (doc.sessions ?? []).map((session: Json) => ({
        slug: text(session.slug),
        dates: text(session.dates),
        rows: (session.rows ?? []).map((row: Json) =>
          compact({ start: text(row.start), end: text(row.end), name: text(row.name) }),
        ),
      })),
      venue: text(doc.venue),
      order: doc.order as number,
    });
  }

  const faq: FaqItem[] = faqDocs.map((doc) =>
    compact({
      slug: text(doc.slug),
      question: text(doc.question),
      answer: paragraphs(doc.answer),
      link: doc.link?.href ? link(doc.link) : undefined,
      order: doc.order as number,
    }) as FaqItem,
  );

  const teaserPosters: ProgramsTeaser["posters"] = [];
  for (const poster of teaser.posters ?? []) {
    teaserPosters.push({
      image: await imageRef(poster.image, text(poster.alt)),
      href: text(poster.href),
      ariaLabel: text(poster.ariaLabel),
    });
  }

  const video: VideoRef = {
    src: hero.video?.file ? await downloadMedia(hero.video.file) : "",
    poster: hero.video?.poster ? await imageRef(hero.video.poster) : null,
    width: hero.video?.width as number,
    height: hero.video?.height as number,
    ariaLabel: text(hero.video?.ariaLabel),
  };

  const site = {
    meta: { title: text(meta.title), description: text(meta.description) } satisfies SiteMeta,
    navigation: (navigation.items ?? []).map(navItem),
    header: {
      skipLink: text(header.skipLink),
      logoAriaLabel: text(header.logoAriaLabel),
      navAriaLabel: text(header.navAriaLabel),
      cta: link(header.cta),
      menuButton: {
        label: text(header.menuButton?.label),
        openAriaLabel: text(header.menuButton?.openAriaLabel),
        closeAriaLabel: text(header.menuButton?.closeAriaLabel),
        panelAriaLabel: text(header.menuButton?.panelAriaLabel),
      },
      themeToggle: {
        toLight: {
          label: text(header.themeToggle?.toLight?.label),
          ariaLabel: text(header.themeToggle?.toLight?.ariaLabel),
        },
        toDark: {
          label: text(header.themeToggle?.toDark?.label),
          ariaLabel: text(header.themeToggle?.toDark?.ariaLabel),
        },
      },
    } satisfies HeaderCopy,
    footer: {
      navAriaLabel: text(footer.navAriaLabel),
      nav: (footer.nav ?? []).map(navItem),
      logoAriaLabel: text(footer.logoAriaLabel),
      legal: text(footer.legal),
    } satisfies FooterCopy,
    hero: {
      eyebrow: text(hero.eyebrow),
      headline: (hero.headline ?? []).map((line: Json) => runs(line.runs)),
      lead: text(hero.lead),
      actions: (hero.actions ?? []).map(link),
      meta: (hero.meta ?? []).map((row: Json) => text(row.text)),
      video,
      badge: text(hero.badge),
    } satisfies HeroCopy,
    marquee: (marquee.items ?? []).map((row: Json) => text(row.text)) satisfies MarqueeItems,
    facts: (facts.items ?? []).map(
      (row: Json, index: number): Fact => ({
        term: text(row.term),
        value: text(row.value),
        order: index + 1,
      }),
    ),
    sections: (sections.sections ?? []).map(
      (row: Json) =>
        compact({
          id: text(row.sectionId),
          number: text(row.number),
          eyebrow: text(row.eyebrow),
          title: text(row.title),
          intro: text(row.intro),
        }) as SectionIntro,
    ),
    ui: {
      locationToggle: {
        scheduleAriaLabel: text(ui.locationToggle?.scheduleAriaLabel),
        pricelistAriaLabel: text(ui.locationToggle?.pricelistAriaLabel),
        contactAriaLabel: text(ui.locationToggle?.contactAriaLabel),
      },
      scheduleFilter: {
        legend: text(ui.scheduleFilter?.legend),
        allLabel: text(ui.scheduleFilter?.allLabel),
      },
      scheduleNote: runs(ui.scheduleNote),
    } satisfies UiCopy,
    contact: { links: (contact.links ?? []).map(link) } satisfies ContactCopy,
  };

  const programsFile = {
    page: {
      meta: { title: text(page.meta?.title), description: text(page.meta?.description) },
      eyebrow: text(page.eyebrow),
      title: text(page.title),
      intro: text(page.intro),
      backLink: link(page.backLink),
      sessionsHeading: text(page.sessionsHeading),
      venueHeading: text(page.venueHeading),
    } satisfies ProgramsPageCopy,
    teaser: {
      eyebrow: text(teaser.eyebrow),
      title: text(teaser.title),
      body: text(teaser.body),
      cta: link(teaser.cta),
      posters: teaserPosters,
    } satisfies ProgramsTeaser,
    programs,
  };

  const signUpForms: SignUpForm[] = formDocs.map((doc) => ({
    slug: text(doc.slug),
    location: relSlug(doc.location, `form ${doc.slug} location`),
    audience: relSlug(doc.audience, `form ${doc.slug} audience`),
    formId: text(doc.formId),
    order: doc.order as number,
    fields: (doc.fields ?? []).map((field: Json, index: number): SignUpField => {
      const base = {
        slug: text(field.slug),
        entryId: text(field.entryId),
        required: Boolean(field.required),
        order: index + 1,
      };
      if (field.blockType === "choiceField") {
        return {
          ...base,
          kind: "choice",
          label: text(field.label),
          options: (field.options ?? []).map((option: Json, optionIndex: number) => ({
            value: text(option.value),
            label: text(option.label),
            order: optionIndex + 1,
          })),
        };
      }
      if (field.blockType === "consentField") {
        return {
          ...base,
          kind: "consent",
          label: text(field.label),
          description: text(field.description),
          value: text(field.value),
        };
      }
      return compact({
        ...base,
        kind: text(field.kind) as "text" | "email" | "tel",
        label: text(field.label),
        autoComplete: text(field.autoComplete),
      }) as SignUpField;
    }),
  }));

  return {
    locations: byOrder(locations),
    offer: byOrder(offer),
    schedule: { labels: byOrder(labels), weekdays: byOrder(weekdays), entries: byStart(entries) },
    pricing: byOrder(pricing),
    instructors: {
      founders: {
        statement: text(founders.statement),
        body: text(founders.body),
      } satisfies FoundersIntro,
      instructors: byOrder(instructors),
    },
    programs: { ...programsFile, programs: byOrder(programsFile.programs) },
    faq: byOrder(faq),
    site,
    forms: {
      audiences: byOrder(
        audienceDocs.map(
          (doc): Audience => ({
            slug: text(doc.slug),
            name: text(doc.name),
            order: doc.order as number,
          }),
        ),
      ),
      ui: {
        locationToggleAriaLabel: text(signupCopy.locationToggleAriaLabel),
        audienceToggleAriaLabel: text(signupCopy.audienceToggleAriaLabel),
        formAriaLabel: text(signupCopy.formAriaLabel),
        unavailable: text(signupCopy.unavailable),
        requiredNote: text(signupCopy.requiredNote),
        optionalNote: text(signupCopy.optionalNote),
        submitLabel: text(signupCopy.submitLabel),
        submittingLabel: text(signupCopy.submittingLabel),
        errorSummaryTitle: text(signupCopy.errorSummaryTitle),
        success: {
          title: text(signupCopy.success?.title),
          body: text(signupCopy.success?.body),
          againLabel: text(signupCopy.success?.againLabel),
        },
        failure: {
          title: text(signupCopy.failure?.title),
          body: text(signupCopy.failure?.body),
          retryLabel: text(signupCopy.failure?.retryLabel),
        },
        errors: {
          required: text(signupCopy.errors?.required),
          email: text(signupCopy.errors?.email),
          phone: text(signupCopy.errors?.phone),
          choice: text(signupCopy.errors?.choice),
          consent: text(signupCopy.errors?.consent),
        },
      } satisfies SignUpCopy,
      forms: byOrder(signUpForms),
    },
  };
}

export type Snapshot = Awaited<ReturnType<typeof build>>;

/* ============================================================== validation */

/**
 * Check the snapshot against lib/content/types.ts.
 *
 * Not a type assertion — those vanish at compile time and the data arrives at
 * run time. A section intro that lost its title, a price that came back as a
 * string, an image with no dimensions: each would render as a quietly broken
 * page, and each stops the build here instead.
 */
function validate(snapshot: Json): void {
  const problems: string[] = [];
  const at = (path: string, message: string) => problems.push(`${path}: ${message}`);

  const str = (value: unknown, path: string, allowEmpty = false) => {
    if (typeof value !== "string") return at(path, `expected a string, got ${typeof value}`);
    if (!allowEmpty && value.length === 0) at(path, "is empty");
  };
  const num = (value: unknown, path: string) => {
    if (typeof value !== "number" || Number.isNaN(value)) at(path, `expected a number, got ${typeof value}`);
  };
  const bool = (value: unknown, path: string) => {
    if (typeof value !== "boolean") at(path, `expected a boolean, got ${typeof value}`);
  };
  const arr = (value: unknown, path: string, min = 1): value is Json[] => {
    if (!Array.isArray(value)) {
      at(path, `expected an array, got ${typeof value}`);
      return false;
    }
    if (value.length < min) at(path, `has ${value.length} item(s), expected at least ${min}`);
    return true;
  };
  const image = (value: Json, path: string) => {
    str(value?.src, `${path}.src`);
    num(value?.width, `${path}.width`);
    num(value?.height, `${path}.height`);
    str(value?.alt, `${path}.alt`, true);
  };
  const linkRef = (value: Json, path: string) => {
    str(value?.label, `${path}.label`);
    str(value?.href, `${path}.href`);
    if (value?.ariaLabel !== undefined && value?.label) {
      /* aria-label REPLACES the accessible name, so a link that shows text
         and also carries one fails WCAG 2.5.3 unless the name contains the
         visible label. Caught here because nothing else would. */
      if (!String(value.ariaLabel).includes(String(value.label))) {
        at(`${path}.ariaLabel`, `replaces the visible text "${value.label}" instead of containing it`);
      }
    }
  };

  if (arr(snapshot.locations, "locations")) {
    snapshot.locations.forEach((location: Json, i: number) => {
      const p = `locations[${i}]`;
      str(location.slug, `${p}.slug`);
      str(location.name, `${p}.name`);
      if (arr(location.address, `${p}.address`)) location.address.forEach((line: unknown, j: number) => str(line, `${p}.address[${j}]`));
      if (arr(location.hours, `${p}.hours`)) {
        location.hours.forEach((pair: Json, j: number) => {
          str(pair.term, `${p}.hours[${j}].term`);
          str(pair.value, `${p}.hours[${j}].value`);
        });
      }
      if (location.map !== null) {
        str(location.map?.src, `${p}.map.src`);
        str(location.map?.title, `${p}.map.title`);
      }
      num(location.order, `${p}.order`);
      bool(location.isDefault, `${p}.isDefault`);
    });
    if (!snapshot.locations.some((l: Json) => l.isDefault)) at("locations", "no location is the default");
  }

  if (arr(snapshot.offer, "offer")) {
    snapshot.offer.forEach((group: Json, i: number) => {
      const p = `offer[${i}]`;
      str(group.slug, `${p}.slug`);
      str(group.title, `${p}.title`);
      num(group.order, `${p}.order`);
      if (Boolean(group.scheduleFilter) !== Boolean(group.scheduleFilterLabel)) {
        at(p, "scheduleFilter and scheduleFilterLabel must be set together");
      }
      if (arr(group.items, `${p}.items`)) {
        group.items.forEach((item: Json, j: number) => {
          str(item.slug, `${p}.items[${j}].slug`);
          str(item.title, `${p}.items[${j}].title`);
          str(item.body, `${p}.items[${j}].body`);
          num(item.order, `${p}.items[${j}].order`);
        });
      }
    });
  }

  const schedule = snapshot.schedule ?? {};
  if (arr(schedule.labels, "schedule.labels")) {
    schedule.labels.forEach((label: Json, i: number) => {
      const p = `schedule.labels[${i}]`;
      str(label.slug, `${p}.slug`);
      str(label.name, `${p}.name`);
      str(label.tag, `${p}.tag`);
      if (!/^--label-[a-z]+$/.test(String(label.colorToken))) {
        at(`${p}.colorToken`, `"${label.colorToken}" is not a --label-* custom property name`);
      }
      num(label.order, `${p}.order`);
    });
  }
  if (arr(schedule.weekdays, "schedule.weekdays", 7)) {
    schedule.weekdays.forEach((day: Json, i: number) => {
      str(day.slug, `schedule.weekdays[${i}].slug`);
      str(day.name, `schedule.weekdays[${i}].name`);
      num(day.order, `schedule.weekdays[${i}].order`);
    });
  }
  if (arr(schedule.entries, "schedule.entries")) {
    schedule.entries.forEach((entry: Json, i: number) => {
      const p = `schedule.entries[${i}]`;
      str(entry.slug, `${p}.slug`);
      str(entry.location, `${p}.location`);
      str(entry.day, `${p}.day`);
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(entry.start))) at(`${p}.start`, `"${entry.start}" is not HH:MM`);
      if (entry.end !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(String(entry.end))) {
        at(`${p}.end`, `"${entry.end}" is not HH:MM`);
      }
      str(entry.name, `${p}.name`);
      arr(entry.labels, `${p}.labels`);
    });
  }

  if (arr(snapshot.pricing, "pricing")) {
    snapshot.pricing.forEach((block: Json, i: number) => {
      const p = `pricing[${i}]`;
      str(block.slug, `${p}.slug`);
      str(block.location, `${p}.location`);
      str(block.title, `${p}.title`);
      num(block.order, `${p}.order`);
      if (arr(block.rows, `${p}.rows`)) {
        block.rows.forEach((row: Json, j: number) => {
          str(row.slug, `${p}.rows[${j}].slug`);
          str(row.name, `${p}.rows[${j}].name`);
          num(row.price, `${p}.rows[${j}].price`);
          str(row.currency, `${p}.rows[${j}].currency`);
        });
      }
    });
  }

  const people = snapshot.instructors ?? {};
  str(people.founders?.statement, "instructors.founders.statement");
  str(people.founders?.body, "instructors.founders.body");
  if (arr(people.instructors, "instructors.instructors")) {
    people.instructors.forEach((person: Json, i: number) => {
      const p = `instructors.instructors[${i}]`;
      str(person.slug, `${p}.slug`);
      str(person.name, `${p}.name`);
      str(person.role, `${p}.role`);
      str(person.bio, `${p}.bio`);
      image(person.photo, `${p}.photo`);
      num(person.order, `${p}.order`);
    });
  }

  const programs = snapshot.programs ?? {};
  str(programs.page?.meta?.title, "programs.page.meta.title");
  str(programs.page?.meta?.description, "programs.page.meta.description");
  str(programs.page?.eyebrow, "programs.page.eyebrow");
  str(programs.page?.title, "programs.page.title");
  str(programs.page?.intro, "programs.page.intro");
  linkRef(programs.page?.backLink, "programs.page.backLink");
  str(programs.page?.sessionsHeading, "programs.page.sessionsHeading");
  str(programs.page?.venueHeading, "programs.page.venueHeading");
  str(programs.teaser?.eyebrow, "programs.teaser.eyebrow");
  str(programs.teaser?.title, "programs.teaser.title");
  str(programs.teaser?.body, "programs.teaser.body");
  linkRef(programs.teaser?.cta, "programs.teaser.cta");
  if (arr(programs.teaser?.posters, "programs.teaser.posters")) {
    programs.teaser.posters.forEach((poster: Json, i: number) => {
      image(poster.image, `programs.teaser.posters[${i}].image`);
      str(poster.href, `programs.teaser.posters[${i}].href`);
      str(poster.ariaLabel, `programs.teaser.posters[${i}].ariaLabel`);
    });
  }
  if (arr(programs.programs, "programs.programs")) {
    programs.programs.forEach((program: Json, i: number) => {
      const p = `programs.programs[${i}]`;
      str(program.slug, `${p}.slug`);
      str(program.title, `${p}.title`);
      str(program.programme, `${p}.programme`);
      str(program.summary, `${p}.summary`);
      if (arr(program.body, `${p}.body`)) program.body.forEach((line: unknown, j: number) => str(line, `${p}.body[${j}]`));
      if (arr(program.posters, `${p}.posters`)) program.posters.forEach((poster: Json, j: number) => image(poster, `${p}.posters[${j}]`));
      if (arr(program.sessions, `${p}.sessions`)) {
        program.sessions.forEach((session: Json, j: number) => {
          str(session.slug, `${p}.sessions[${j}].slug`);
          str(session.dates, `${p}.sessions[${j}].dates`);
          if (arr(session.rows, `${p}.sessions[${j}].rows`)) {
            session.rows.forEach((row: Json, k: number) => {
              str(row.start, `${p}.sessions[${j}].rows[${k}].start`);
              str(row.name, `${p}.sessions[${j}].rows[${k}].name`);
            });
          }
        });
      }
      str(program.venue, `${p}.venue`);
      num(program.order, `${p}.order`);
    });
  }

  if (arr(snapshot.faq, "faq")) {
    snapshot.faq.forEach((item: Json, i: number) => {
      const p = `faq[${i}]`;
      str(item.slug, `${p}.slug`);
      str(item.question, `${p}.question`);
      if (arr(item.answer, `${p}.answer`)) item.answer.forEach((line: unknown, j: number) => str(line, `${p}.answer[${j}]`));
      if (item.link) linkRef(item.link, `${p}.link`);
      num(item.order, `${p}.order`);
    });
  }

  const site = snapshot.site ?? {};
  str(site.meta?.title, "site.meta.title");
  str(site.meta?.description, "site.meta.description");
  if (arr(site.navigation, "site.navigation")) {
    site.navigation.forEach((item: Json, i: number) => {
      str(item.label, `site.navigation[${i}].label`);
      str(item.href, `site.navigation[${i}].href`);
      bool(item.scrollSpy, `site.navigation[${i}].scrollSpy`);
    });
  }
  str(site.header?.skipLink, "site.header.skipLink");
  str(site.header?.logoAriaLabel, "site.header.logoAriaLabel");
  str(site.header?.navAriaLabel, "site.header.navAriaLabel");
  linkRef(site.header?.cta, "site.header.cta");
  for (const key of ["label", "openAriaLabel", "closeAriaLabel", "panelAriaLabel"]) {
    str(site.header?.menuButton?.[key], `site.header.menuButton.${key}`);
  }
  for (const mode of ["toLight", "toDark"]) {
    str(site.header?.themeToggle?.[mode]?.label, `site.header.themeToggle.${mode}.label`);
    str(site.header?.themeToggle?.[mode]?.ariaLabel, `site.header.themeToggle.${mode}.ariaLabel`);
  }
  str(site.footer?.navAriaLabel, "site.footer.navAriaLabel");
  str(site.footer?.logoAriaLabel, "site.footer.logoAriaLabel");
  str(site.footer?.legal, "site.footer.legal");
  arr(site.footer?.nav, "site.footer.nav");
  str(site.hero?.eyebrow, "site.hero.eyebrow");
  if (arr(site.hero?.headline, "site.hero.headline")) {
    site.hero.headline.forEach((line: Json[], i: number) => {
      if (arr(line, `site.hero.headline[${i}]`)) {
        line.forEach((run: Json, j: number) => str(run.text, `site.hero.headline[${i}][${j}].text`));
      }
    });
  }
  str(site.hero?.lead, "site.hero.lead");
  if (arr(site.hero?.actions, "site.hero.actions")) {
    site.hero.actions.forEach((action: Json, i: number) => linkRef(action, `site.hero.actions[${i}]`));
  }
  arr(site.hero?.meta, "site.hero.meta");
  num(site.hero?.video?.width, "site.hero.video.width");
  num(site.hero?.video?.height, "site.hero.video.height");
  str(site.hero?.video?.ariaLabel, "site.hero.video.ariaLabel");
  if (site.hero?.video?.poster !== null) image(site.hero?.video?.poster, "site.hero.video.poster");
  str(site.hero?.badge, "site.hero.badge");
  arr(site.marquee, "site.marquee");
  if (arr(site.facts, "site.facts")) {
    site.facts.forEach((fact: Json, i: number) => {
      str(fact.term, `site.facts[${i}].term`);
      str(fact.value, `site.facts[${i}].value`);
      num(fact.order, `site.facts[${i}].order`);
    });
  }

  /* The six anchors plus #signup. Closed, unlike every other identifier:
     these are the page's structure, and a section with no intro has no
     accessible name at all. */
  const SECTION_IDS = ["offer", "schedule", "pricelist", "about-us", "faq", "contact", "signup"];
  if (arr(site.sections, "site.sections")) {
    const seen = new Set<string>();
    site.sections.forEach((section: Json, i: number) => {
      const p = `site.sections[${i}]`;
      if (!SECTION_IDS.includes(String(section.id))) at(`${p}.id`, `"${section.id}" is not one of ${SECTION_IDS.join(", ")}`);
      seen.add(String(section.id));
      str(section.number, `${p}.number`);
      str(section.eyebrow, `${p}.eyebrow`);
      str(section.title, `${p}.title`);
    });
    for (const id of SECTION_IDS) {
      if (!seen.has(id)) at("site.sections", `nothing for "${id}" — that section would render with no accessible name`);
    }
  }
  for (const key of ["scheduleAriaLabel", "pricelistAriaLabel", "contactAriaLabel"]) {
    str(site.ui?.locationToggle?.[key], `site.ui.locationToggle.${key}`);
  }
  str(site.ui?.scheduleFilter?.legend, "site.ui.scheduleFilter.legend");
  str(site.ui?.scheduleFilter?.allLabel, "site.ui.scheduleFilter.allLabel");
  arr(site.ui?.scheduleNote, "site.ui.scheduleNote");
  if (arr(site.contact?.links, "site.contact.links")) {
    site.contact.links.forEach((item: Json, i: number) => linkRef(item, `site.contact.links[${i}]`));
  }

  const forms = snapshot.forms ?? {};
  if (arr(forms.audiences, "forms.audiences")) {
    forms.audiences.forEach((audience: Json, i: number) => {
      str(audience.slug, `forms.audiences[${i}].slug`);
      str(audience.name, `forms.audiences[${i}].name`);
      num(audience.order, `forms.audiences[${i}].order`);
    });
  }
  for (const key of [
    "locationToggleAriaLabel",
    "audienceToggleAriaLabel",
    "formAriaLabel",
    "unavailable",
    "requiredNote",
    "optionalNote",
    "submitLabel",
    "submittingLabel",
    "errorSummaryTitle",
  ]) {
    str(forms.ui?.[key], `forms.ui.${key}`);
  }
  for (const key of ["required", "email", "phone", "choice", "consent"]) {
    str(forms.ui?.errors?.[key], `forms.ui.errors.${key}`);
  }
  str(forms.ui?.success?.title, "forms.ui.success.title");
  str(forms.ui?.success?.againLabel, "forms.ui.success.againLabel");
  str(forms.ui?.failure?.title, "forms.ui.failure.title");
  str(forms.ui?.failure?.retryLabel, "forms.ui.failure.retryLabel");
  if (arr(forms.forms, "forms.forms")) {
    forms.forms.forEach((form: Json, i: number) => {
      const p = `forms.forms[${i}]`;
      str(form.slug, `${p}.slug`);
      str(form.location, `${p}.location`);
      str(form.audience, `${p}.audience`);
      str(form.formId, `${p}.formId`);
      num(form.order, `${p}.order`);
      if (arr(form.fields, `${p}.fields`)) {
        form.fields.forEach((field: Json, j: number) => {
          const f = `${p}.fields[${j}]`;
          str(field.slug, `${f}.slug`);
          if (!/^entry\.\d+$/.test(String(field.entryId))) at(`${f}.entryId`, `"${field.entryId}" is not entry.<digits>`);
          bool(field.required, `${f}.required`);
          num(field.order, `${f}.order`);
          str(field.label, `${f}.label`);
          if (field.kind === "choice") arr(field.options, `${f}.options`);
          else if (field.kind === "consent") {
            str(field.description, `${f}.description`);
            str(field.value, `${f}.value`);
          } else if (!["text", "email", "tel"].includes(String(field.kind))) {
            at(`${f}.kind`, `"${field.kind}" is not text, email, tel, choice or consent`);
          }
        });
      }
    });
  }

  if (problems.length > 0) {
    throw new Error(
      `the content snapshot does not match lib/content/types.ts:\n` +
        problems.map((problem) => `  - ${problem}`).join("\n"),
    );
  }
}

/* ========================================= the migration's own proof */

/**
 * Key order is not meaning; compare values.
 *
 * Top-level records are matched by slug rather than by position: a collection
 * is a set, and the order it renders in is carried by the `order` field,
 * which is compared like any other value. Nested arrays are left alone —
 * there, position IS the order, and a price row that moved must show up as a
 * difference.
 */
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) {
    const rows = value.map(canonical);
    const allSlugged = rows.every(
      (row) => row && typeof row === "object" && typeof (row as Json).slug === "string",
    );
    return allSlugged
      ? rows.slice().sort((a, b) => String((a as Json).slug).localeCompare(String((b as Json).slug)))
      : rows;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Json)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, canonical(v)]),
    );
  }
  return value;
}

/**
 * While lib/content/data/ is still around, prove the round-trip through
 * Payload changed nothing — every field of every record, not just the counts.
 *
 * Media paths are compared by filename: the site used to serve images from
 * public/assets/images/, and they now arrive from the CMS into
 * public/assets/cms/. The bytes and the filename are the same; only the
 * directory moved.
 */
function compareWithLegacy(snapshot: Json): void {
  if (!fs.existsSync(LEGACY_DIR)) return;

  const legacy = (name: string) =>
    JSON.parse(fs.readFileSync(path.join(LEGACY_DIR, `${name}.json`), "utf8"));

  const basenames = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(basenames);
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value as Json).map(([key, v]) => [
          key,
          key === "src" && typeof v === "string" && v.startsWith("/assets/")
            ? path.basename(v)
            : basenames(v),
        ]),
      );
    }
    return value;
  };

  const pairsToCheck: Array<[string, unknown, unknown]> = [
    ["locations", snapshot.locations, legacy("locations")],
    ["offer", snapshot.offer, legacy("offer")],
    ["schedule", snapshot.schedule, legacy("schedule")],
    ["pricing", snapshot.pricing, legacy("pricing")],
    ["instructors", snapshot.instructors, legacy("instructors")],
    ["programs", snapshot.programs, legacy("programs")],
    ["faq", snapshot.faq, legacy("faq")],
    ["site", snapshot.site, legacy("site")],
    ["forms", snapshot.forms, legacy("forms")],
  ];

  const differences: string[] = [];
  for (const [name, got, want] of pairsToCheck) {
    const a = JSON.stringify(canonical(basenames(got)), null, 1);
    const b = JSON.stringify(canonical(basenames(want)), null, 1);
    if (a === b) {
      console.log(`  ok    ${name}.json — identical through the CMS`);
    } else {
      const aLines = a.split("\n");
      const bLines = b.split("\n");
      const at = aLines.findIndex((line, i) => line !== bLines[i]);
      differences.push(
        `${name}.json differs near line ${at + 1}:\n` +
          `    snapshot: ${aLines[at]?.trim()}\n` +
          `    data:     ${bLines[at]?.trim()}`,
      );
      console.log(`  FAIL  ${name}.json`);
    }
  }

  if (differences.length > 0) {
    throw new Error(
      `the snapshot does not match lib/content/data/:\n` +
        differences.map((d) => `  - ${d}`).join("\n"),
    );
  }
}

/* =================================================================== main */

console.log(`Fetching content from ${BASE}`);

const snapshot = await build();
validate(snapshot);

console.log("\nComparing against lib/content/data/");
compareWithLegacy(snapshot);

fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
fs.writeFileSync(SNAPSHOT_FILE, `${JSON.stringify(snapshot, null, 2)}\n`);

const size = (fs.statSync(SNAPSHOT_FILE).size / 1024).toFixed(1);
console.log(
  `\nWrote lib/content/.snapshot/content.json (${size} kB) and ${downloaded.size} media file(s) to public/assets/cms/`,
);
