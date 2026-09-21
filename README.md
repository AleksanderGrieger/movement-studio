# Movement Studio

Production site for [movement-studio.pl](https://www.movement-studio.pl) — a
dance school in Białogard and Kołobrzeg.

Next.js App Router, Tailwind v4, static export to GitHub Pages. Polish
throughout.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export into out/
```

The build is a static export (`output: "export"`), so there is no server at
runtime and no `redirects()` support — see `src/app/legacy-redirect.tsx`.

## Layout

```
lib/content/          the content layer — the only place .json is read
  types.ts            the contract; see docs/content-layer.md
  data/*.json         content
src/app/              routes, and globals.css with the whole token system
src/components/
  sections/           home-page sections, Server Components
  home/               the interactive islands
  layout/             header, footer, theme toggle
  brand/              inline logo lockups
src/fonts/            subsetted woff2 the site ships
assets-source/        originals that are NOT served (see its README)
scripts/              the verification gates
docs/                 design-decisions.md (authoritative) + content-layer.md
```

## Checks

```bash
npm run check:content   # record counts and referential integrity
npm run check:ui        # interaction spec in a real browser
npm run check:a11y      # axe, 2 routes x 4 breakpoints x 2 themes
npm run check:lh        # Lighthouse, median of 3 runs
npm run shoot           # screenshots at every breakpoint, both themes
```

Everything except `check:content` needs a served build:

```bash
npm run build && npx serve out -p 8143
npm run check:a11y -- --url http://localhost:8143
```

These drive the system Chrome (Playwright has no mac12-arm64 Chromium build).
Override with `CHROME_PATH`.

## Conventions

See `CLAUDE.md`. The ones that bite if ignored:

- **Nothing outside `lib/content/` imports a `.json` file.**
- **Design token names are fixed** by `docs/design-decisions.md`.
- Server Components by default; every `'use client'` is justified in its file
  header and listed in `docs/content-layer.md`.
- Theme B overrides **colour only**. Putting a metric in that block makes the
  theme toggle shift the page under the reader.

## Before deploying

`docs/content-layer.md` §7 lists the open gaps. The two that block a real
launch: the hero clip (§11 there) and the stale "sezon 2025/26" label, which
needs the 2026/27 schedule from the client. Re-verify the TAN Meringue webfont
licence as well — `docs/design-decisions.md` §1.1.
