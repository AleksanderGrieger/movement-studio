# Content layer — handoff to Phase 2.2

Phase 2.2 replaces the JSON files under `lib/content/data/` with Payload CMS.
This document is written for a session with no memory of the one that built
this, and should be enough to swap the data source without reading any
component code.

**The contract is `lib/content/types.ts`.** Every reader in `lib/content/*.ts`
returns one of those types. Phase 2.2 rewrites the reader *bodies* and must not
change a single signature.

**The rule that keeps this workable:** nothing outside `lib/content/` may
import a `.json` file. If you find yourself importing JSON in a component, the
layer has been bypassed. Verify with:

```bash
grep -rn "from ['\"].*\.json['\"]" src/
```

---

## 1. How to verify a migration

```bash
npm run check:content   # record counts + referential integrity — the baseline
npm run check:ui        # §6 interaction spec, needs a served build
npm run check:a11y      # axe, both routes x 4 breakpoints x 2 themes
npm run check:lh        # Lighthouse, median of 3 runs
npm run shoot           # screenshots at 360/768/1280/1920, both themes
```

`check:content` is the one that matters most here. It asserts every record
count and every cross-reference below. **If it passes after the Payload swap,
the migration moved everything.** If it fails, the count it names tells you
what was dropped.

The browser-driven scripts need a served build:

```bash
npm run build && npx serve out -p 8143
npm run check:ui -- --url http://localhost:8143
```

They drive the system Chrome, because Playwright ships no bundled Chromium for
mac12-arm64. `CHROME_PATH` overrides the binary.

---

## 2. Record counts — the baseline Phase 2.2 must match

| domain | records | breakdown |
|---|---|---|
| locations | **2** | Białogard (default), Kołobrzeg |
| offer groups | **4** | dorośli 6, pary 3, dzieci 7, na zamówienie 4 |
| offer items | **20** | numbered 01–20 at render time, not stored |
| schedule labels | **4** | dorosli, dzieci, nabor, sportowa |
| weekdays | **7** | Monday = order 1; Fri/Sat/Sun currently carry no classes |
| schedule entries | **25** | Białogard 13 (Pn 5, Wt 1, Śr 4, Cz 3), Kołobrzeg 12 (Wt 4, Śr 4, Cz 4) |
| price blocks | **6** | 3 per location: Dorośli, Dzieci, Inne |
| price rows | **24** | BG 3+7+3, KG 3+5+3 |
| instructors | **5** | |
| programs | **2** | NOWEFIO, Społecznik |
| program sessions | **4** | 2 each |
| program session rows | **10** | 3+3, 2+2 |
| teaser posters | **3** | |
| nav items | **6** | 5 anchors + /programs |
| section intros | **5** | offer, schedule, pricelist, about-us, contact |
| facts | **3** | |
| marquee items | **10** | |
| contact links | **4** | phone, email, Instagram, Facebook |

---

## 3. Exported functions

All are `async` even though the JSON reads are synchronous — the signatures
were shaped for Payload from the start.

### `lib/content/locations.ts` — backed by `data/locations.json`

```ts
getLocations(): Promise<Location[]>          // sorted by order
getDefaultLocation(): Promise<Location>      // isDefault, falling back to first
```

### `lib/content/classes.ts` — backed by `data/offer.json`

```ts
getOfferGroups(): Promise<OfferGroup[]>      // groups and items both sorted
```

### `lib/content/schedule.ts` — backed by `data/schedule.json`

```ts
getScheduleLabels(): Promise<ScheduleLabel[]>
getWeekdays(): Promise<Weekday[]>
getScheduleEntries(): Promise<ScheduleEntry[]>   // flat, sorted by start time
getScheduleGrid(): Promise<ScheduleGrid[]>       // derived, never stored
```

`getScheduleGrid()` groups entries by location and day and **omits days with
no classes at that location**. An empty Friday column would read as a loading
failure; the design's `.is-empty` state is for a day emptied by the *filter*,
not one that never had classes.

### `lib/content/pricing.ts` — backed by `data/pricing.json`

```ts
getPriceBlocks(): Promise<PriceBlock[]>
getPriceBlocksByLocation(location: string): Promise<PriceBlock[]>
```

### `lib/content/instructors.ts` — backed by `data/instructors.json`

```ts
getInstructors(): Promise<Instructor[]>
getFoundersIntro(): Promise<FoundersIntro>
```

### `lib/content/programs.ts` — backed by `data/programs.json`

```ts
getPrograms(): Promise<Program[]>
getProgramsTeaser(): Promise<ProgramsTeaser>
getProgramsPageCopy(): Promise<ProgramsPageCopy>
```

### `lib/content/site.ts` — backed by `data/site.json`

```ts
getSiteMeta(): Promise<SiteMeta>
getNavigation(): Promise<NavItem[]>
getHeaderCopy(): Promise<HeaderCopy>
getFooterCopy(): Promise<FooterCopy>
getHeroCopy(): Promise<HeroCopy>
getSectionIntros(): Promise<SectionIntro[]>
getSectionIntro(id: SectionId): Promise<SectionIntro>   // throws if missing
getFacts(): Promise<Fact[]>
getMarqueeItems(): Promise<MarqueeItems>
getUiCopy(): Promise<UiCopy>
getContactCopy(): Promise<ContactCopy>
```

`getSectionIntro` throws rather than returning undefined. A missing section
intro is a content error that should fail the build, not silently render a
section with no accessible name — every `<section>` is `aria-labelledby` its
own heading.

---

## 4. Types, and which file and fields back them

| type | file | notes |
|---|---|---|
| `Slug` | — | `string`, deliberately not a union. See §5. |
| `ImageRef` | all | `src`, `width`, `height`, `alt`. `src` becomes a CMS media URL; nothing else moves. |
| `VideoRef` | `site.json` → `hero.video` | `poster` is nullable — see §7. |
| `TextRun` | `site.json` | `{ text, emphasis? }`. Keeps HTML out of the data. |
| `LinkRef` | `site.json`, `programs.json` | `ariaLabel` **replaces** the accessible name; `context` is **appended** as hidden text. See §6. |
| `DefinitionPair` | `locations.json` | `hours` |
| `Location` | `locations.json` | `slug, name, address[], hours[], map\|null, order, isDefault` |
| `MapRef` | `locations.json` | Białogard only; Kołobrzeg is `null` |
| `OfferGroup` / `OfferItem` | `offer.json` | `scheduleFilter` holds a `ScheduleLabel.slug` |
| `ScheduleLabel` | `schedule.json` → `labels` | `colorToken` holds a CSS custom-property **name** |
| `Weekday` | `schedule.json` → `weekdays` | |
| `ScheduleEntry` | `schedule.json` → `entries` | flat, one per class |
| `ScheduleDayGroup` / `ScheduleGrid` | — | derived by `getScheduleGrid()`, never stored |
| `PriceBlock` / `PriceRow` | `pricing.json` | `price: number`, `currency: "PLN"` |
| `Instructor` / `FoundersIntro` | `instructors.json` | |
| `Program` / `ProgramSession` / `ProgramSessionRow` | `programs.json` → `programs` | |
| `ProgramsTeaser` / `TeaserPoster` | `programs.json` → `teaser` | |
| `ProgramsPageCopy` | `programs.json` → `page` | |
| `SectionId` | — | closed union of the five anchors — IA structure, not content |
| `SectionIntro`, `NavItem`, `HeaderCopy`, `MenuButtonCopy`, `ThemeToggleCopy`, `HeroCopy`, `Fact`, `UiCopy`, `ContactCopy`, `FooterCopy`, `SiteMeta`, `MarqueeItems` | `site.json` | one key per type name |

### Cross-references the checker enforces

- `ScheduleEntry.location` and `PriceBlock.location` → `Location.slug`
- `ScheduleEntry.day` → `Weekday.slug`
- `ScheduleEntry.labels[]` → `ScheduleLabel.slug`
- `OfferGroup.scheduleFilter` → `ScheduleLabel.slug`
- every `ScheduleEntry.slug` unique; every entry carries at least one label

In Payload these become relations. Keep them as relations, not free text.

---

## 5. Where the JSON shape and the ideal shape diverged

**Locations and schedule labels are open `string` slugs, not unions.**
design-decisions.md §12 says labels become "a relation on the class entity,
not a hardcoded enum", and §11.3 flags the four-label taxonomy as still
unconfirmed with the client. A union would be safer today and a breaking
change the moment an editor adds a third location or a fifth label.
`SectionId` is the deliberate exception — those five anchors are structure.

**`ScheduleLabel.colorToken` is presentation inside the content layer.**
It holds a custom-property *name* (`"--label-adults"`), never a colour. This
is the one acknowledged leak. The alternative — a slug→token map in the
component — would leave an editor-added label with no colour and no way to
give it one without a code change. In Payload, make it a select constrained to
the four `--label-*` names, or widen the palette deliberately.

**The schedule is stored flat; the grid is derived.** One row per class is the
Payload-native shape. Do not model day columns in the CMS.

**Opening hours are `{term, value}` pairs, not structured times.** §11.2 flags
that the published office hours contradict the class schedule and await a
client answer. A `{day, open, close}` shape would force an invented
resolution. Pairs let the real answer land as a content edit. **Revisit this
once the client answers** — structured times are better if they can be
correct.

**Prices are numeric, and the facts strip's price floor is NOT derived.**
The cheapest row is Akrobatyka at 120 zł, a twice-monthly add-on rather than a
monthly pass, so `min(price)` would contradict the approved "już od 140 zł"
and misrepresent the offer. Separating passes from add-ons needs a taxonomy
the client has not confirmed. `Fact.value` stays authored copy.

**The offer regrouping is stored, not derived.** The four groups are the
prototype's editorial regrouping of the studio's eight source entries: "Na
zamówienie" is a new group and "Pierwszy taniec" was moved under "Dla par".
Item numbers 01–20 *are* derived, from the flattened index.

**Schedule labels were assigned by hand, not parsed.** The original source
baked them into the class name (`"Latino solo kids (gr sportowa)"`), so a
parser would be guessing. The approved prototype had already assigned all 25
rows and those assignments were carried over verbatim. Two rows keep the
prototype's hand-editing: `Akrobatyka` and `Impro` take `"2× w miesiącu"` as a
separate `note` field so the filter matches the class rather than the cadence,
and `Akrobatyka`'s "w SP7" moved into the section footnote (`UiCopy.scheduleNote`).

**Instructor bios are not the studio's originals.** The client chose the
prototype's short two-sentence register over the 60–110 word source bios. The
prototype only ever carried three of the five people, so **Maria Murek and
Weronika Wajda's `role` and `bio` were written for this build** and should be
treated as draft copy pending client review.

---

## 6. `ariaLabel` vs `context` on `LinkRef`

These are not interchangeable, and getting it wrong breaks WCAG 2.5.3.

- **`ariaLabel` replaces** the accessible name. Only for links with no visible
  text of their own — the programme poster links, which wrap an image.
- **`context` is appended** as visually hidden text after the visible label.
  Use it when the visible text shows but needs disambiguating: the Facebook
  link reads "Movement Studio", with `context: "Facebook"`.

Putting an `ariaLabel` on a link that shows text makes the accessible name not
contain the visible label, which Lighthouse flags as *Label in Name*. That was
a real defect found and fixed during this phase.

---

## 7. Known gaps carried into Phase 2.2

1. **The hero clip.** `HeroCopy.video.src` points at
   `/assets/video/hero-clip.mp4`. See §10 below for its current state.
   `VideoRef.poster` is nullable for this reason.
2. **Season is stale.** The hero eyebrow and schedule intro say
   "sezon 2025/26", matching the schedule data. §11.1 flags this; the 2026/27
   grid must replace it before launch. The label was deliberately *not* changed
   without a new grid.
3. **Kołobrzeg has no map.** `Location.map` is `null` there. The section
   renders without a map rather than showing a placeholder.
4. **No sponsor-logo strip on /programs.** §11.6 asks for one; no sponsor
   marks were supplied. Funding attribution is carried in body copy.
5. **Office hours contradict the schedule** (§11.2) — unresolved, awaiting the
   client.
6. **Label taxonomy unconfirmed** (§11.3) — the four labels were derived from
   the published schedule's own wording.

---

## 8. Client components, and why each one is client

Everything else is a Server Component.

| component | why |
|---|---|
| `layout/ThemeToggle` | click handling and `localStorage` for the dark/light toggle (§6.1) |
| `layout/StickyHeader` | `.is-stuck` from an IntersectionObserver on a top-of-document sentinel; children pass through untouched |
| `layout/SiteNav` | scroll-spy — `aria-current` cannot be known on the server |
| `layout/MobileNav` | open state, Escape-to-close with focus return, `aria-expanded`/`aria-controls` |
| `layout/RevealObserver` | adds `.is-in` to every `.r`; renders nothing |
| `home/HomeState` | shared location + filter state; renders nothing |
| `home/LocationToggle` | `aria-pressed` buttons writing shared state |
| `home/LocationPanel` | reads shared location to toggle `hidden`; children pass through |
| `home/usePanelVisibility` | hook behind the two panel components |
| `home/ScheduleFilter` | radiogroup with roving tabindex and arrow-key navigation |
| `home/ScheduleGrid` | filters rows live; data arrives as props from the server |
| `home/OfferFilterLink` | sets the filter before the browser scrolls (§6.3) |
| `home/HeroMedia` | lazy video, scroll parallax, live reduced-motion re-check |

`layout/ThemeScript` is a Server Component that emits a blocking inline script
into `<head>`, applying the saved theme before first paint.

**A trap worth knowing.** Content inside a `hidden` location panel never
intersects anything, so the reveal observer never fires for it and the panel
the visitor switches *to* stays blank at `opacity: 0`.
`usePanelVisibility` marks such a panel and CSS reveals its contents. The fix
is deliberately declarative: adding `is-in` with `classList` gets wiped the
next time React reconciles those elements' className, which happens on every
filter change in the schedule grid.

---

## 9. Deviations from design-decisions.md

Each is a considered departure, not drift.

| what | why |
|---|---|
| Body face is **Capsuula**, not Archivo | client chose the repo pairing. Applied §13's procedure: Polish coverage verified (366 glyphs, all 18 diacritics with real outlines), `--size-adjust-body` recomputed 0.99 → **1.04** (0.520 / Capsuula's 0.500 x-height), `--measure` 58ch → **62ch** (digit advance 0.510 vs 0.575; `ch` is per-face). Meringue untouched. |
| `--weight-strong` 600 → **400** | Capsuula ships one weight. 600 would be a synthesized faux bold on every eyebrow and button. Emphasis is carried by tracking, colour and size. |
| `--label-intake` (Theme B) `#a35c41` → **`#9e5940`** | §8 measured this token only as a chip dot and cell bar at the 3:1 bar, but the schedule row prints the label as ~11px **text**, needing 4.5:1 — `#a35c41` measures 4.45. The prototype has the same failure. New value: 4.69 on the page, and white-on-fill improves to 5.31. |
| `--tap-target: 44px` added | §10 requires ≥44px but the prototype's own controls measured 41.9px (burger) and 34.9px (theme toggle). |
| Day/price headings h4 → **h3** | they sat directly under the section `h2`, skipping a level. |
| No map placeholder | §11.4's dashed box was prototype scaffolding. |
| Crew grid reserves bottom padding at ≥1280 | the even-card `translateY` stagger overhangs the section boundary whenever the crew is not a multiple of four. The grid now holds 1–10 cards. |
| Five retired routes ship as meta-refresh stubs | static export supports no `redirects()`. Replace with 301s if the host ever gains them. |

---

## 10. State of the build

Both acceptance gates pass:

- **axe**: 0 issues of any severity across 16 combinations (2 routes × 4
  breakpoints × 2 themes).
- **Lighthouse** (median of 3):

  | route | performance | accessibility | best practices | SEO |
  |---|---|---|---|---|
  | `/` | **99** | **100** | 96 | 100 |
  | `/programs/` | **99** | **100** | 100 | 100 |

  CLS is 0 on both. The home page's best-practices 96 is entirely the hero
  clip 404 (§11) — it clears the moment that asset exists.
- Zero `*.module.scss` files. Zero hydration warnings. The only console error
  anywhere is the hero clip 404.
- No horizontal overflow at 360 / 768 / 1280 / 1920.
- 32 interaction checks pass, including the seven covering the reduced-motion
  fallback.
- Build output is 7.3 MB. Anything `public/` holds is deployed, so assets no
  page references live in `assets-source/` instead.

Runtime dependencies are `next`, `react`, `react-dom` — nothing else.

---

## 11. Hero video — current state

`design-decisions.md` §1.3 flags the supplied source as not publishable: a
screen capture of an Instagram reel with a moving `@KOLOBRZEGZBLISKA`
watermark, a music-credit overlay, third-party audio, and mostly children's
competitive ballroom. Its documented remedy is a crop-and-trim to a 6-second
adult contemporary segment with audio stripped:

```
ffmpeg -ss 28.8 -t 6.0 -i hero.MP4 -an \
  -vf "crop=495:1000:220:180,scale=440:-2,fps=25" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 31 -preset slow \
  -movflags +faststart hero-clip.mp4
```

`public/assets/video/` is gitignored: a multi-megabyte master does not belong
in a GitHub Pages repo. Only the encoded clip should be committed, and it
needs a poster frame — `VideoRef.poster` is `null` until one exists.
