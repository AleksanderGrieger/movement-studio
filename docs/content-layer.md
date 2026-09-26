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
| nav items | **7** | 6 anchors + /programs |
| section intros | **6** | offer, schedule, pricelist, about-us, faq, contact |
| faq items | **6** | partner, wiek-dzieci, bez-doswiadczenia, koszt, zajecia-probne, stroj |
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

### `lib/content/faq.ts` — backed by `data/faq.json`

```ts
getFaqItems(): Promise<FaqItem[]>            // sorted by order
```

Order is editorial, not alphabetical: the list walks a first visit, and the
section opens whichever item sorts first, so `order` decides what a visitor
reads without clicking. The count is not fixed — the section renders however
many come back.

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
| `FaqItem` | `faq.json` | `answer` is an array of paragraphs, not one string with markup; an optional `link` rides after the prose rather than inside it |
| `SectionId` | — | closed union of the six anchors — IA structure, not content |
| `SectionIntro`, `NavItem`, `HeaderCopy`, `MenuButtonCopy`, `ThemeToggleCopy`, `HeroCopy`, `Fact`, `UiCopy`, `ContactCopy`, `FooterCopy`, `SiteMeta`, `MarqueeItems` | `site.json` | one key per type name |

### Cross-references the checker enforces

- `ScheduleEntry.location` and `PriceBlock.location` → `Location.slug`
- `ScheduleEntry.day` → `Weekday.slug`
- `ScheduleEntry.labels[]` → `ScheduleLabel.slug`
- `OfferGroup.scheduleFilter` → `ScheduleLabel.slug`
- every `ScheduleEntry.slug` unique; every entry carries at least one label
- every `FaqItem.slug` unique; every item carries at least one answer paragraph
- `FaqItem.link.href`, where it is an anchor, → `SectionIntro.id`

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

**`sections/Faq` is deliberately not on this list.** An accordion is the
textbook reason to reach for client state, and it does not need any: the
section is `<details name="faq">`, so open/close, the keyboard, the accessible
name and the expanded state all come from the browser, the group is mutually
exclusive without a line of script, and the whole thing works with JavaScript
off. `name` is the only part with a support floor, and where it is missing the
panels simply open independently — a worse behaviour, not a broken one. If a
future change needs animated height, prefer CSS over making this a client
component.

**A trap worth knowing.** Content inside a `hidden` location panel never
intersects anything, so the reveal observer never fires for it and the panel
the visitor switches *to* stays blank at `opacity: 0`.
`usePanelVisibility` marks such a panel and CSS reveals its contents. The fix
is deliberately declarative: adding `is-in` with `classList` gets wiped the
next time React reconciles those elements' className, which happens on every
filter change in the schedule grid.

The same hazard bit from the other direction. `RevealObserver` adds `is-in`
to `.r` elements with `classList`, and the schedule's day `<li>` is both a
`.r` element and the thing that marks itself empty under a filter. While that
empty state lived in `className`, every filter change that flipped it made
React rewrite the whole attribute and drop `is-in` — and since the observer
unobserves on first reveal, nothing ever brought the day back. Białogard's
Wtorek holds a single entry, so it flipped on almost every chip and was the
first to vanish. The empty state is therefore an **attribute**, `data-empty`,
not a class. The rule: never put React-controlled state in the `className` of
an element the observer also writes to.

---

## 9. Deviations from design-decisions.md

Each is a considered departure, not drift.

| what | why |
|---|---|
| `--leading-display` 1.08 → **1.34** | §5.4's 1.08 is a normal display leading and Meringue is not a normal face. Measured in the browser: ink runs **1.010em** above the baseline for a plain capital and **0.320em** below for a descender, so two stacked lines need **1.330em** before they stop touching. At 1.08 they overlapped by a quarter of an em and it showed — the `y` of "który" cut through the `T` of "Tobie". **Residual:** accented capitals ascend **1.198em**, so a line opening with `Ó` directly under a descender still wants 1.52. Setting the token there would loosen every heading for a case the copy does not contain; revisit if a headline ever needs it. |
| `.founders .big` leading `× 1.2` → **`+ 0.12`** | the multiplier compounded when the base moved, landing that block at 1.61. Additive keeps its extra air independent of the token. |
| `--header-bg` added, replacing `color-mix()` on `.header` | not a colour change — a build one. The minifier wraps any `color-mix()` in `@supports (color: color-mix(in lab, red, red))` and emits a static fallback beside it with the **default** theme's value inlined (`#303030e0`). Browsers with `color-mix` in srgb but not in lab — Safari 16.2–16.3 — took that fallback, so the page themed to light while the header alone stayed dark. A literal `rgba` per theme has no fallback path. Keep the two values in step with `--color-bg`. |
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

### What was supplied, and why it is still not shippable

The master now in `assets-source/video/hero.mov` is a 16-second trim of the
original: 720×1280, H.264, **with the AAC track still present**. Two problems
remain, and a frame grab confirms both:

1. **The `@KOLOBRZEGZBLISKA` watermark is still in the picture**, roughly
   x 44–263, y 690–786 in the 720×1280 frame — left side, vertically centred.
   §1.3's crop (`crop=495:1000:220:180`) will not remove it: that geometry was
   computed for the 28.8–34.8 s window of the *original* file, where the
   watermark sat bottom-left. This is a different segment, so the crop has to
   be recomputed against it — and cropping left of x = 263 removes 36% of the
   width and pushes the dancer to the frame edge.
2. **The audio is still there**, which §1.3 requires stripping for licensing.

Deciding the crop is an editorial call about a third-party brand mark, not a
mechanical one, which is why it was left open rather than guessed at. §1.3's
own recommendation stands: commission a landscape master. 440×889 is the
ceiling this source can deliver, and it softens above ~1280 px.

**ffmpeg could not be installed on the build machine.** Homebrew no longer
ships bottles for macOS 12, so `brew install ffmpeg` would build some eighty
formulae from source. Do the encode elsewhere.

`public/assets/video/` is gitignored: a multi-megabyte master does not belong
in a GitHub Pages repo, and a static export copies that directory verbatim, so
anything left there is deployed. Only the encoded clip should be committed,
and it needs a poster frame — `VideoRef.poster` is `null` until one exists.

Until the clip lands the hero renders an empty arch frame. That path is
handled deliberately: the `<video>` element is not rendered at all without a
source, so there are no broken-media controls, and the only cost is one 404 in
the console — the sole reason the home page scores 96 rather than 100 on
Lighthouse best-practices.
