# The CMS

Content for movement-studio lives in Payload, in [`cms/`](../cms). This
document is how to run it, how to publish a change, and what goes wrong when
something is missing.

## Why it is a separate app

The site is `output: "export"` — a folder of static HTML on GitHub Pages, with
no server behind it. Payload needs a Node runtime and a Postgres database, so
it cannot live inside that export, and nothing the site renders may query it:
a request at render time is a request that never happens once the HTML is on a
CDN.

So the two are separate, and the join between them is a **snapshot** taken at
build time. The CMS is the source of truth; the site holds a copy of it from
the moment it was last built.

```
  cms/  ──(npm run content:fetch)──▶  lib/content/.snapshot/content.json
   │                                   public/assets/cms/*
   │                                            │
   └── Postgres                                 └──▶ lib/content/*.ts ──▶ src/
```

`cms/` keeps its own `package.json`, its own lockfile and its own
`node_modules`. Root `npm ci` never installs any of it — movement-studio still
ships `next`, `react` and `react-dom` and nothing else.

## Running it locally

Payload 3.92 needs Node 22.23.4 or newer. The site builds on Node 20, so if
you use nvm, expect to switch between them.

```bash
cd cms
npm install
cp .env.example .env          # then fill in PAYLOAD_SECRET
npm run db:up                 # Postgres 16 in Docker, on host port 5433
npm run dev                   # http://localhost:3100/admin
```

`openssl rand -hex 32` generates a `PAYLOAD_SECRET`. The first visit to
`/admin` asks you to create an account; after that it is a normal login.

`npm run db:down` stops Postgres and keeps the data. The database lives in a
Docker volume, so it survives both.

### Filling an empty database

```bash
npm run seed
```

Reads the nine JSON files in `cms/src/scripts/seed-data/` — the content layer
as it stood before the migration — and makes the database match them. It is
idempotent: everything is matched by slug, so running it twice changes
nothing.

It is a **migration, not a fixture**. A record whose slug is not in those
files gets deleted, which on a database an editor has been working in means
losing their work. Run it to bootstrap, not to refresh.

It finishes by printing the record-count table from
[`content-layer.md` §2](content-layer.md) and exits non-zero if any count is
off.

## Publishing a change

1. Edit in `/admin` and save.
2. Payload POSTs a `repository_dispatch` to GitHub, which reruns the Pages
   workflow: fetch the snapshot, build, deploy.
3. The change is live when the workflow finishes — a couple of minutes.

Saves are debounced by ten seconds, so editing six fields in a row is one
deploy rather than six.

This needs two variables in the CMS's environment:

| variable | what it is |
|---|---|
| `GITHUB_DISPATCH_TOKEN` | fine-grained PAT, repository permission **Contents: read and write** |
| `GITHUB_DISPATCH_REPO` | `owner/repo` the site deploys from |

**With either unset, saving publishes nothing.** That is deliberate, and it is
how a local CMS should behave — a developer's experiments must not deploy the
live site.

### Publishing by hand

If the hook is not configured, or it failed: **Actions → Deploy Next.js site
to Pages → Run workflow**. There is nothing to commit first. The content is
not in git, so a manual run publishes whatever the CMS holds at that moment.

This is also the answer when someone asks why their edit is not live: the site
is only ever as current as its last build.

## The snapshot

`npm run content:fetch` (in the site, not the CMS) writes:

- `lib/content/.snapshot/content.json` — every collection and global, about
  56 kB
- `public/assets/cms/` — every media file referenced by that content

Both are **gitignored**. A committed snapshot is a snapshot someone ships
without noticing it no longer matches what editors have published.

Images are downloaded rather than linked at the CMS. Linking would put a
cross-origin request in front of the largest contentful paint and make every
page view depend on the admin staying up.

The readers in `lib/content/*.ts` read the snapshot and nothing else reads
it — components see types, never storage. No `.json` is imported anywhere
outside `lib/content/`:

```bash
grep -rn "from ['\"].*\.json['\"]" src/
```

In CI the fetch runs from two repository secrets:

| secret | required | what it is |
|---|---|---|
| `PAYLOAD_URL` | yes | where the CMS is reachable, e.g. `https://cms.movement-studio.pl` |
| `PAYLOAD_API_KEY` | no | only if the read API is locked down; see below |

Read access to content is currently **public**. It is the public website's own
copy, published the moment it is saved, so reading it through the API reveals
nothing visiting the site would not — and it removes a failure mode from the
deploy, because a token cannot expire halfway through a release. Writing needs
a login. To lock reading down, change `publicRead` in
[`cms/src/fields/access.ts`](../cms/src/fields/access.ts), give a user an API
key, and set `PAYLOAD_API_KEY`; the fetch script already sends it.

## What breaks the build, and why

Each of these stops the build on purpose. The alternative is a site that
renders with a section quietly missing, which looks like a styling bug and
gets deployed before anyone traces it back to the content.

| what happened | what you see | the fix |
|---|---|---|
| No snapshot | `No content snapshot at …` | `npm run content:fetch` |
| CMS unreachable | `cannot reach the CMS at …` | start it, or check `PAYLOAD_URL` |
| `PAYLOAD_URL` unset in CI | `PAYLOAD_URL is not set` before the build runs | add the repository secret |
| A section intro deleted | `nothing for "faq" — that section would render with no accessible name` | restore it in **Nagłówki sekcji** |
| A required field emptied | `site.hero.lead: is empty` | fill it in |
| A price saved as text | `pricing[0].rows[2].price: expected a number` | fix the field |
| An `aria-label` that replaces a visible label | `replaces the visible text "…" instead of containing it` | use **Doprecyzowanie** instead — see below |
| An entry id typo | `"entry.123x": is not entry.<digits>` | copy it again from the Google form |

### The aria-label trap

Two fields on every link look interchangeable and are not:

- **Nazwa dla czytników ekranu** *replaces* the accessible name. Only for a
  link with no visible text of its own — a link wrapping a poster.
- **Doprecyzowanie** is *appended*, invisibly, after the visible text. This is
  the one you want when the text shows but needs context: the Facebook link
  reads "Movement Studio" with "Facebook" appended.

Using the first on a link that shows text means the accessible name no longer
contains the visible label, which is a WCAG 2.5.3 failure. It has happened
here once already, which is why the fetch script now refuses to build on it.

## Checking it

From the site, with the CMS running:

```bash
npm run content:fetch
npm run check:content                              # counts + referential integrity
npm run check:forms                                # fields vs the live Google Forms
npm run build && npx serve out -p 8143
npm run check:ui   -- --url http://localhost:8143
npm run check:a11y -- --url http://localhost:8143
npm run check:lh   -- --url http://localhost:8143
```

`check:content` is the one that matters: it asserts every record count and
every cross-reference, so a green run is the proof that nothing was dropped.

## A note on rich text

There is no rich-text editor anywhere in this CMS, and that is a decision, not
an omission. The content contract keeps HTML out of the data: a paragraph
break is a record, emphasis is a separate run of text, and a link after an
answer is a link field. A rich-text field would be the one place an editor
could enter markup the site has no safe way to render.
