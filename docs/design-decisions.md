# Movement Studio — Design Decisions (Phase 1 handoff, round 2)

Prepared for Phase 2.1, which runs without access to this session or the prototype.
Everything needed to rebuild the design system is in this file. The prototype
(`index.html`) is disposable evidence, not the source of truth.

Site: movement-studio.pl · Language: Polish · Audience: adults 20–40 (both as
students and as parents of the children's groups — confirmed by client).

**Where this landed after three rounds of revision:** Theme C was dropped, and the
switcher is no longer prototype chrome — it is a production dark/light toggle in the
header. **The two themes now differ in colour only.** Typography, scale, spacing and
shape are one shared system, so switching theme cannot move a single pixel. The
schedule gained a single-select group filter that works by dimming non-matches, the
offer sections gained deep links into it, the sticky offer heading was fixed, and
contact became location-aware with icon links.

---

## 1. Asset audit

### 1.1 Typeface: TAN Meringue (client-owned, commercial)

Verified against the supplied `TAN_MERINGUE.ttf` (v1.000):

| property | value |
|---|---|
| mapped glyphs | 337 |
| Polish diacritics | **complete** — `ą ć ę ł ń ó ś ź ż` + capitals, all real outlines |
| missing ASCII | `^` only |
| units per em | 1000 |
| cap height | 1000 (flush with the em top) |
| x-height | 680 |
| typo ascender / descender | 1010 / −341 |
| kerning | GPOS present, no legacy `kern` table |

**Flagged — accent overshoot.** Accented capitals reach y ≈ 1198 against a declared
ascent of 1010, a ~19 % overshoot. `Ś Ć Ń Ó Ź Ż` will collide with the line above or
clip inside any `overflow: hidden` container (the hero mask reveal is exactly that).
Handled by `--display-overshoot`, see §5.4. Do not remove it.

**Flagged — licensing.** TAN is a commercial foundry; desktop licences normally
exclude `@font-face`. Client confirmed the webfont licence is in hand. Re-verify
before production deploy.

### 1.2 Logo

Seven SVGs plus a 25-page PDF family (horizontal wordmark, stacked wordmark, circle
badge, `M` monogram, mono black and mono white lockups). File colours are
**#df3f8f** (pink), **#ee7111** (orange), **#b7d1c8** (mint). The wordmark is *not*
set in Meringue — it is a custom rounded geometric face. Never reset it in a theme
typeface.

The prototype inlines the horizontal lockup (header) and stacked lockup (footer) as
SVG with fills driven by `--logo-1 / --logo-2 / --logo-3`, so the theme toggle
recolours the mark with no file swap and no flash. Illustrator's `.cls-*` classes
were renamed to `.lg-*` / `.lgv-*`, and the `<defs><style>` block plus all `id`
attributes stripped (duplicate `id="Warstwa_1"` otherwise).

### 1.3 Hero video

Source `hero.MP4`: 720×1280 portrait, 63.97 s, 49.2 MB, 6.15 Mbps, H.264 + AAC.

**Flagged — the source is not publishable as delivered.** It is a screen capture of
an Instagram reel: a moving `@KOLOBRZEGZBLISKA` watermark, a music-credit overlay
("J Maksy · Part-Time Lover"), third-party audio, and mostly children's competitive
ballroom.

Processing applied (client chose crop-and-reuse):

```
ffmpeg -ss 28.8 -t 6.0 -i hero.MP4 -an \
  -vf "crop=495:1000:220:180,scale=440:-2,fps=25" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 31 -preset slow \
  -movflags +faststart hero-clip.mp4
```

- 28.8–34.8 s is the only window where the watermark stays bottom-left; crop origin
  x = 220 removes it entirely (verified frame by frame).
- Audio stripped for licensing, so `muted` is not a design choice.
- **49.2 MB → 235 KB.** Poster frame (t = 30.2 s, same crop, 264 px WebP) is 4.9 KB.
- Subject is an adult solo contemporary dancer on a magenta stage — matches both the
  audience and the brand pink.

**Recommendation:** commission a landscape master. 440×889 is the ceiling this
source can deliver; it softens above ~1280 px.

### 1.4 Photography

Four instructor cards (`hania`, `karolina`, `magda`, `milena`), 1080×1080, already
art-directed on the brand's dark background with the name in the logo face and the
photo masked into the `M` arches. Downscaled to 620×620 WebP (~18 KB each). They are
**dark-native squares**, so on Theme B they read as framed dark prints — tested and
acceptable. Cropping to the photo area was tried and rejected: it cuts the baked-in
name in half. For true light-theme parity, request un-composited photos.

Three A4 project posters (NOWEFIO, Program Społecznik) used in the `/programs`
teaser, 340 px WebP.

**Gap:** no studio interior or class-in-progress photography. The contact map is a
labelled placeholder — this prototype loads nothing external.

---

## 2. Section order and rationale

```
header (sticky, scroll-spy, dark/light toggle)
hero            — vibe + the two practical CTAs
marquee         — style names, ambient, aria-hidden
facts           — price floor / two locations / who teaches
#offer     01   — Oferta (group CTAs deep-link into the filtered schedule)
#schedule  02   — Grafik (location toggle + group filter)
#pricelist 03   — Cennik (location toggle)
#about-us  04   — O nas
programs        — /programs teaser (no anchor, not in scroll-spy)
#contact   05   — Kontakt (location toggle + icon links)
footer
```

1. **Goal 2 (schedule + pricing in under 10 s) drives everything.** The hero's
   primary button is `Sprawdź grafik`, not a phone number, and the facts strip
   answers how much / where / who above the first section.
2. **Offer before schedule** because a first-time visitor needs the vocabulary
   ("nabór", "gr. sportowa") before a grid of times means anything. Returning
   students use the sticky nav and skip it. The offer's per-group CTAs close the
   loop: read about the adult classes, jump straight to the adult rows.
3. **Credibility after logistics.** For a local studio the decision order is
   what → when → how much → who; bios convert a *probably*, they don't create one.
4. **Programs between about and contact** — separate route, proves the system
   extends, catches grant traffic without competing with the paid offer.
5. **Contact last** as the terminal action.

**One location decision, three sections.** `#schedule`, `#pricelist` and `#contact`
each carry a location toggle, and all of them are driven by a single state: pressing
Kołobrzeg anywhere switches all three. Default Białogard (registered address, larger
schedule).

---

## 3. Token architecture

**Only colour is themed.** Type, scale, spacing and shape live in `:root` and are
shared; `[data-theme="b"]` overrides colour tokens and nothing else. Switching is one
attribute change on `<html data-theme="a|b">`, and because no metric is theme-bound,
the swap is provably reflow-free (§6.1). No component references a colour, face, size
or spacing value directly.

```
colour   --color-bg --color-surface --color-surface-2
         --color-text --color-text-muted
         --color-accent --color-accent-text --color-accent-soft --color-on-accent
         --color-secondary --color-secondary-text --color-on-secondary
         --color-tertiary --color-border --color-border-strong --color-focus
labels   --label-adults --label-kids --label-intake --label-sport
         (+ a -soft variant used for chip hover, and --on-label for text on a
          label fill — pressed chips)
logo     --logo-1 --logo-2 --logo-3
--- shared, declared once in :root, never themed ---
type     --font-display --font-body --scale-ratio --tracking-display --tracking-body
         --leading-display --leading-body --measure
         --size-adjust-body --size-adjust-display --display-overshoot
         --weight-display --weight-body --weight-strong
         --display-variation --display-case
shape    --radius --arch
motion   (see §7)
```

**Why the `-text` variants exist.** A brand fill and body-size text have different
contrast requirements (3:1 vs 4.5:1). `--color-accent` is the brand value, used for
fills, rules, large display type and the logo. `--color-accent-text` is a tuned
sibling used wherever accent-coloured text or a small icon appears. Same for
secondary. This keeps the brand hexes intact while passing AA — see §7.

**`--color-on-accent` / `--color-on-secondary`** are button label colours, measured
against their own fill, not against the page.

---

## 4. Palettes

### Theme A — "Parkiet" (dark, default)

The studio's current identity, kept because it is already on the door, the posters
and the instructor cards. Retro-pop pink and orange on charcoal: loud, warm,
unmistakably a dance school rather than a gym. This is the default on first visit.

| token | value | note |
|---|---|---|
| `--color-bg` | `#303030` | **locked brand value** |
| `--color-surface` | `#3a3a3a` | derived elevation; also the highlighted-cell fill |
| `--color-surface-2` | `#262626` | derived recession (marquee, programs band) |
| `--color-text` | `#ffffff` | **locked brand value** |
| `--color-text-muted` | `#c4bfbf` | derived |
| `--color-accent` | `#df3f8f` | **changed from `#d626be`** — see §7.1 |
| `--color-accent-text` | `#ea82b6` | derived, AA-safe |
| `--color-accent-soft` | `rgba(223,63,143,.16)` | hover wash |
| `--color-on-accent` | `#141414` | 4.6:1 on the fill |
| `--color-secondary` | `#ec712d` | **locked brand value** |
| `--color-secondary-text` | `#ef8950` | derived, AA-safe |
| `--color-on-secondary` | `#141414` | |
| `--color-tertiary` | `#b7d1c8` | logo mint |
| `--color-border` | `#4d4d4d` | decorative rules |
| `--color-border-strong` | `#7a7a7a` | control boundaries, ≥3:1 |
| `--color-focus` | `#b7d1c8` | mint reads against both pink and charcoal |
| `--logo-1/2/3` | accent / tertiary / secondary | full-colour mark |

### Theme B — "Poranna sala" (light)

**Mood:** an empty studio at 9 a.m. with sunlight on the floor — calm, adult, made
by hand. The decision a 35-year-old is actually making is "will I feel foolish in
there?", and warm paper answers that better than neon does. B carries the same
typography as A; the mood shift is done entirely with colour.

| token | value |
|---|---|
| `--color-bg` | `#f6f0e8` |
| `--color-surface` | `#fffdf9` |
| `--color-surface-2` | `#ece2d5` |
| `--color-text` | `#1f1b18` |
| `--color-text-muted` | `#5c554d` |
| `--color-accent` | `#b4402f` (burnt terracotta) |
| `--color-accent-text` | `#9e3626` |
| `--color-accent-soft` | `rgba(180,64,47,.10)` |
| `--color-on-accent` | `#ffffff` |
| `--color-secondary` | `#245c4f` (deep pine) |
| `--color-secondary-text` | `#1f5346` |
| `--color-on-secondary` | `#ffffff` |
| `--color-tertiary` | `#ad6549` (clay — darkened to clear 3:1) |
| `--color-border` | `#ddd2c4` |
| `--color-border-strong` | `#8d7f6d` |
| `--color-focus` | `#245c4f` |
| `--logo-1/2/3` | all `--color-text` (mono ink lockup) |

The logo goes **monochrome ink** on B rather than keeping brand colours: pink and
orange on cream reads as a printing error. The mono lockup exists in the supplied
PDF family, so this is a file swap in production, not an invention.

### Schedule label palette

Four groups, one colour each, drawn from the theme rather than bolted on. In Theme A
they are the `-text` variants plus two warm neutrals, so every chip clears 3:1 on
both the page and the highlighted-cell fill.

| label | meaning | Theme A | Theme B |
|---|---|---|---|
| `--label-adults` | dorośli | `#ea82b6` | `#b4402f` |
| `--label-kids` | dzieci | `#ef8950` | `#245c4f` |
| `--label-intake` | nabór (beginner intake) | `#b7d1c8` | `#a35c41` |
| `--label-sport` | gr. sportowa (competitive) | `#e0c9a6` | `#7a5c1f` |

Each label carries two companions:

- `--label-*-soft` (12–16 % alpha) — chip hover wash.
- `--on-label` (`#141414` in A, `#ffffff` in B) — text on a label fill, used by the
  selected chip.

There is no highlight fill. Two attempts at one (surface elevation, then a
label-tinted wash over it) both read as noise rather than emphasis, so the filter
now works by subtraction only — see §6.2.

Theme B's nabór colour is `#a35c41`, one step darker than the `--color-tertiary`
clay it derives from, so white chip text clears 4.5:1 on it (4.96 vs 4.44).

Colour is never the sole carrier of meaning: every row prints its labels in words,
the selected chip is filled rather than merely tinted, and the dimming that drives
the filter is carried by scale as well as opacity.

---

## 5. Typography

### 5.1 Pairings and licences

One pairing, both themes:

| display | body | licence |
|---|---|---|
| **TAN Meringue** | **Archivo** | Meringue: commercial (client). Archivo: SIL OFL 1.1 |

**Meringue + Archivo.** Meringue is a high-contrast retro display with an
unusually large x-height and a cap height equal to the full em. It needs a body face
that is metrically plain and optically quiet, or the page becomes two competing
personalities. Archivo is a neutral grotesque whose tall x-height (0.526) matches
Meringue's colour on the page, with a `wdth` axis in reserve. Full Latin Extended-A.

Archivo was verified for complete `ą ć ę ł ń ó ś ź ż` coverage **before**
selection, then subset to the Polish charset (ASCII + the Polish Latin-Ext-A range +
typographic punctuation) with `pyftsubset`, keeping all variable axes:

| face | subset woff2 | axes retained |
|---|---|---|
| Meringue | 10 KB | static |
| Archivo | 59 KB | `wght 100–900`, `wdth 62–125` |

Two faces, 69 KB total. Bricolage Grotesque and Inter Tight went with Theme C;
Fraunces and Karla went when Theme B adopted this pairing.

### 5.2 Optical normalisation

Measured metrics, normalised to the em:

| face | cap/em | x-height/em |
|---|---|---|
| Meringue | **1.000** | 0.680 |
| Archivo | 0.686 | 0.526 |

The two adjustment tokens survive the collapse to one pairing, because they still do
real work between the display and body faces:

```
--size-adjust-body:    0.99   /* 0.520 / Archivo's 0.526 x-height */
--size-adjust-display: 0.80   /* Meringue's cap height is a full em */
```

Meringue's cap height is 1.000 em against a normal face's ~0.69, so it must be set
~20 % smaller to look the same size — the single most important number in this file.
Applied as `font-size: calc(var(--display-step) * var(--size-adjust-display))` and
`--s0: calc(var(--base) * var(--size-adjust-body))`.

They are also the hook for any future face change: swapping a family means
recomputing these two numbers, not retuning the grid.

`--measure` is `58ch`, tuned to Archivo (`ch` is a per-face unit).

### 5.3 Scale

```
--base: clamp(1rem, 0.955rem + 0.22vw, 1.0625rem)
--s0:   calc(var(--base) * var(--size-adjust-body))
--s-1:  calc(var(--s0) / var(--scale-ratio))      --s1: calc(var(--s0) * var(--scale-ratio))
--s-2:  calc(var(--s-1) / var(--scale-ratio))     --s2 … --s7: each × --scale-ratio
```

| ≤767 | ≥768 | ≥1280 | justification |
|---|---|---|---|
| **1.125** | 1.200 | 1.250 | Meringue is already loud; a moderate ratio keeps the display from bullying the schedule grid, which is the page's real job. The ratio widens with the viewport because a 1.125 jump that reads as hierarchy on a phone reads as a rounding error at 1280 |

One ratio for both themes. Mobile floor of 1.125 is met, as specified.

The hero headline is ratio-driven but capped against the viewport so neither theme
can overflow its column:

```
≤767   --display-step: min(var(--s6), 11.5vw)
≥768   --display-step: min(var(--s7), 8vw)
≥1280  --display-step: min(var(--s7), 5.6vw)
```

Section headings `--s4` (mobile) / `--s5` (≥768). Offer item titles `--s1`, day
headings `--s2`, prices `--s1`, eyebrows `--s-1`, chips and tags `--s-2`.

### 5.4 Per-theme type tokens

| token | value |
|---|---|
| `--tracking-display` | `0.005em` |
| `--tracking-body` | `0.005em` |
| `--leading-display` | `1.08` |
| `--leading-body` | `1.6` |
| `--measure` | `58ch` |
| `--weight-display` | `400` |
| `--weight-body` / `--weight-strong` | `400` / `600` |
| `--display-variation` | `normal` |
| `--display-case` | `none` |
| `--display-overshoot` | **`0.14em`** |
| `--radius` | `2px` |

`--display-overshoot` is applied as `padding-top` with an equal negative
`margin-top` on every `.display` element and on each masked hero line, so accented
capitals get room without shifting the baseline. Removing it clips `Ś Ć Ń Ó Ź`.

---

## 6. Interaction specification

### 6.1 Dark / light toggle (production control)

A single `<button id="theme-toggle">` in the header bar, present at every
breakpoint: icon-only below 768 px, icon + word above it. It shows the icon of the
mode it will switch **to** — sun while dark is active, moon while light is.

- `aria-pressed` reflects light mode; `aria-label` swaps between
  `Włącz tryb jasny` and `Włącz tryb ciemny`; the visible word swaps with it.
- Choice persists in `localStorage` under `ms-theme`, inside `try/catch`.
- **Default is Theme A (dark)** for a first visit — the brand is dark-first. The
  code contains a commented one-line alternative that follows
  `prefers-color-scheme` instead; that is a client decision, not a technical one.
- Colour, `fill` and border transitions run 320 ms on `--ease-swing`, so the swap
  reads as a dissolve rather than a flash.
- **Zero layout shift, by construction.** Earlier rounds gave each theme its own
  faces, scale ratio, leading, measure and radius, and the page visibly jumped on
  every toggle — a theme control that moves the content under the reader's finger is
  worse than no control. Type, scale, spacing and shape now live in `:root`, and
  `[data-theme="b"]` sets colour tokens only. Verified by measuring
  `scrollHeight` and the position and height of every section heading before and
  after a toggle at 360 / 768 / 1280 / 1920: **identical to the pixel** at all four.
- The cost is a narrower range for Theme B: it can no longer carry its own voice
  through a serif, so its whole personality is the palette. That is the right trade —
  one type system is also one thing to maintain in Payload, and the light theme reads
  as the same site rather than a second design.

### 6.2 Schedule filter

Five chips: `Wszystkie` (the default) plus one per label. **Single-select** — one
label at a time, and choosing another replaces it.

Single-select is deliberate. The four labels are not one facet: `dorośli` / `dzieci`
is audience, `nabór` / `gr. sportowa` is level. Multi-select with OR logic would
answer "adults **or** beginners" when the gesture of adding a second chip plainly
means "adults **and** beginners" — the filter would do the opposite of what it looks
like it does. The overlap makes it worse: nearly every kids' row also carries a level
label, so `dzieci` + `gr. sportowa` under OR would light up almost the whole grid and
read as broken. At 12–13 rows per location, with the full week visible at once, no
one needs to combine criteria anyway. If the taxonomy ever becomes a single
non-overlapping facet (dance styles, say), OR multi-select becomes the right answer
and this decision should be revisited; if audience **and** level both need filtering,
the correct shape is two single-select rows combined with AND, not one multi-select
row.

- Chips are `<button>`s with `role="radio"` inside a `role="radiogroup"` labelled by
  the "Pokaż" text, using `aria-checked` and a roving `tabindex`: Arrow keys (both
  axes), `Home` and `End` move and select, matching the native radio-group pattern.
  `Wszystkie` is checked exactly when no filter is active, so there is no
  "nothing selected" state to define.
**The filter works by subtraction, not addition.** Matching rows are not styled at
all — they stay in their normal resting state. Everything else recedes:

- Non-matching rows get `.is-dim`: `opacity: .16`, `grayscale(.95)` so their label
  colours stop competing, and `transform: scale(.92)` with
  `transform-origin: left center`, animated over 320 ms on `--ease-swing`. Because
  `transform` does not affect layout, the rows physically shrink while the grid
  holds its geometry — nothing reflows, and the eye reads the untouched rows as the
  answer.
- Dimmed rows also lose their hover response, so a pointer passing over them cannot
  make them jump back to full size.
- A day column whose every row is dimmed gets `.is-empty` (opacity `.45`), so an
  empty Tuesday reads as empty rather than unfiltered.
- The selected chip is **filled** with its label colour, using `--on-label` text —
  the chip row is where the filter state is stated, so the schedule itself does not
  have to shout it. This carries the whole job of reporting state: there is no
  summary or result-count line, because a filled chip above a visibly thinned grid
  already says what happened.

This replaced two earlier attempts that added emphasis to the matches (surface
elevation, then a label-tinted wash with a coloured bar and a filled tag). Both
failed for the same reason: adding weight to two thirds of a grid does not make
those rows stand out, it just makes the grid louder. Removing weight from the
remainder is unambiguous at any tint strength, and it degrades gracefully — even if
the opacity shift is invisible to someone, the scale change is not.
- The filter applies to both location panels at once, so switching town keeps the
  selection.

### 6.3 Offer → schedule deep links

The two offer groups that map onto schedule labels carry a CTA:

| group | CTA | `data-schedule-filter` |
|---|---|---|
| Dla dorosłych | Zobacz terminy zajęć dla dorosłych → | `dorosli` |
| Dla dzieci i młodzieży | Zobacz terminy zajęć dla dzieci → | `dzieci` |

They are ordinary `<a href="#schedule">` links; JS intercepts the click, sets the
filter to that single label, and lets the browser do the scrolling. With JS off the
link still works — it just lands unfiltered. *Dla par* and *Na zamówienie* get no CTA
because no schedule label corresponds to them.

### 6.4 Location toggles

Three toggles (schedule, pricelist, contact) share one state. Pressing any one sets
`aria-pressed` on all three pairs and toggles `hidden` on every `[data-panel]`,
then re-applies the current filter to the panel that just appeared.

---

## 7. Motion specification

Motion is **shared across both themes** — it is the one layer the toggle does not
touch. Every curve is a literal `cubic-bezier`; `ease`, `ease-in` and `ease-out` are
not used, except `linear` for the marquee and colour cross-fades.

### 7.1 Curves

| token | value | used for |
|---|---|---|
| `--ease-momentum` | `cubic-bezier(0.16, 1, 0.30, 1)` | entrances: fast departure, long settle — a dancer landing |
| `--ease-weight` | `cubic-bezier(0.34, 1.20, 0.64, 1)` | lifts and presses; 20 % overshoot gives the element mass |
| `--ease-swing` | `cubic-bezier(0.65, 0, 0.35, 1)` | symmetric two-way changes (colour, theme swap, toggles, filter dim) |
| `--ease-exit` | `cubic-bezier(0.55, 0, 1, 0.45)` | declared for exits; reserved, not yet bound |

### 7.2 Durations and intervals

| token | value |
|---|---|
| `--dur-tap` | `120ms` |
| `--dur-hover` | `180ms` |
| `--dur-ui` | `320ms` |
| `--dur-reveal` | `640ms` |
| `--dur-hero` | `900ms` |
| `--stagger` | `70ms` |
| `--reveal-y` | `1.5rem` |

### 7.3 Every animation in the page

| element | property | duration | curve | delay |
|---|---|---|---|---|
| hero headline lines | `translateY(110% → 0)` inside an `overflow:hidden` mask | 900ms | momentum | `--i × 70ms`, `--i` = 1,2,3 |
| section reveals (`.r`) | `opacity 0→1`, `translateY(1.5rem → 0)` | 640ms | momentum | `--i × 70ms` per group |
| hero parallax | `translate3d(0, ±40px, 0)` on the video frame | frame-synced | none (scroll-linked) | — |
| marquee | `translateX(0 → −50%)` | 38s, `linear infinite` | — | — |
| theme swap | `background-color`, `color`, SVG `fill`, `border-color` | 320ms | swing | — |
| theme toggle (hover) | `translateY(−1px)`, icon `rotate(−18deg)` | 180 / 320ms | weight | — |
| filter chip (hover) | `translateY(−1px)` + `border-color` | 180ms | weight / swing | — |
| filter chip (selected) | `background-color`, `color`, `border-color` | 180ms | swing | — |
| schedule cell (hover / focus-within) | `background-color`, `border-left-color`, `translateX(3px)` | 180ms | swing | — |
| schedule cell (filter dim) | `opacity 1 → .16`, `grayscale(.95)`, `scale(1 → .92)` from the left edge | 320ms | swing | — |
| day column (all rows dimmed) | `opacity 1 → .45` | 320ms | swing | — |
| nav underline | `scaleX(0 → 1)`, origin left | 320ms | momentum | — |
| buttons (hover / focus) | `translateY(−2px)` + colour | 180ms | weight | — |
| buttons (active) | `scale(0.985)` | 120ms | weight | — |
| offer CTA arrow | `translateX(4px)` | 180ms | momentum | — |
| offer row | `background-color` + `padding-left` (12px shift) | 180ms | swing / momentum | — |
| instructor photo | `scale(1.03)` | 320ms | momentum | — |
| contact link icon | `scale(1.12) rotate(−6deg)` | 180ms | weight | — |
| poster thumbnails | `translateY(−6px) rotate(−1deg)` | 320ms | weight | — |
| mobile nav panel | `translateY(−102% → 0)` + `visibility` | 320ms | momentum | visibility delayed to duration on close |
| location toggle | `background-color`, `color` | 320ms | swing | — |
| skip link | `translateY(−200% → 0)` | 320ms | momentum | — |

Reveal observer: `IntersectionObserver`, `rootMargin: '0px 0px -12% 0px'`,
`threshold: 0.08`, unobserved after firing (reveals never replay).
Scroll-spy observer: `rootMargin: '-45% 0px -50% 0px'`, `threshold: 0`, sets
`aria-current="true"`.
Parallax: `progress = 1 − (rect.top + rect.height / 2) / innerHeight`, clamped to
[−1, 1], × 40 px, inside `requestAnimationFrame` with a `ticking` guard, on a
`passive` scroll listener, `will-change: transform` on the frame.

### 7.4 Reduced motion

`@media (prefers-reduced-motion: reduce)` sets every animation and transition to
`0.001ms`, zeroes transition delays, forces `.r { opacity: 1; transform: none }`,
un-translates the hero lines, stops the marquee, cancels the parallax transform with
`!important` (inline styles from JS lose to it), and switches `scroll-behavior` to
`auto`. JS additionally checks `matchMedia` before starting parallax or calling
`video.play()`, and re-checks on `change`. The filter, toggles and theme swap remain
fully functional — only their transitions collapse.

### 7.5 Touch and keyboard parity

Assume 60 %+ mobile. Every hover state is duplicated on `:focus-visible`
(`.btn`, `.chip`, `.theme-toggle`, `.nav a`, `.contact-links a`, `.posters a`,
`.crew li`) and the schedule cell hover is duplicated on `:focus-within`. Nothing is
hover-only. The theme and location toggles are real buttons with `aria-pressed`, the
filter chips are radios with `aria-checked` and arrow-key navigation, and the mobile
nav uses `aria-expanded` + `aria-controls`, closing on `Escape` with focus returned.

---

## 8. Contrast measurements

Every pairing in actual use, computed (WCAG 2.x relative luminance), not estimated.
54 pairings, **zero failures**. Dimmed rows sit deliberately below AA — they are
suppressed content, and the un-dimmed rows beside them carry the full ratios below.

### Theme A — Parkiet (dark, default)

| foreground | background | ratio | required | verdict |
|---|---|---|---|---|
| `--color-text` #ffffff | `--color-bg` #303030 | **13.2:1** | 4.5:1 — body/heading on page | PASS |
| `--color-text` #ffffff | `--color-surface` #3a3a3a | **11.37:1** | 4.5:1 — body on card or highlighted cell | PASS |
| `--color-text` #ffffff | `--color-surface-2` #262626 | **15.13:1** | 4.5:1 — body on sunken | PASS |
| `--color-text-muted` #c4bfbf | `--color-bg` #303030 | **7.26:1** | 4.5:1 — muted body | PASS |
| `--color-text-muted` #c4bfbf | `--color-surface` #3a3a3a | **6.26:1** | 4.5:1 — muted on card | PASS |
| `--color-text-muted` #c4bfbf | `--color-surface-2` #262626 | **8.32:1** | 4.5:1 — muted on sunken | PASS |
| `--color-accent-text` #ea82b6 | `--color-bg` #303030 | **5.26:1** | 4.5:1 — accent text/link | PASS |
| `--color-accent-text` #ea82b6 | `--color-surface` #3a3a3a | **4.53:1** | 4.5:1 — accent text on card | PASS |
| `--color-accent-text` #ea82b6 | `--color-surface-2` #262626 | **6.03:1** | 4.5:1 — accent text on sunken | PASS |
| `--color-secondary-text` #ef8950 | `--color-bg` #303030 | **5.26:1** | 4.5:1 — secondary text | PASS |
| `--color-secondary-text` #ef8950 | `--color-surface` #3a3a3a | **4.53:1** | 4.5:1 — secondary text on card | PASS |
| `--color-accent` #df3f8f | `--color-bg` #303030 | **3.3:1** | 3.0:1 — accent fill / large display | PASS |
| `--color-secondary` #ec712d | `--color-bg` #303030 | **4.38:1** | 3.0:1 — secondary fill / large display | PASS |
| `--color-tertiary` #b7d1c8 | `--color-bg` #303030 | **8.15:1** | 3.0:1 — tertiary UI / large text | PASS |
| `--color-on-accent` #141414 | `--color-accent` #df3f8f | **4.6:1** | 4.5:1 — label on accent button | PASS |
| `--color-on-secondary` #141414 | `--color-secondary` #ec712d | **6.11:1** | 4.5:1 — label on secondary button | PASS |
| `--color-border-strong` #7a7a7a | `--color-bg` #303030 | **3.07:1** | 3.0:1 — input/control boundary | PASS |
| `--color-focus` #b7d1c8 | `--color-bg` #303030 | **8.15:1** | 3.0:1 — focus ring | PASS |
| `--color-focus` #b7d1c8 | `--color-surface` #3a3a3a | **7.02:1** | 3.0:1 — focus ring on card | PASS |
| `--label-adults` #ea82b6 | `--color-bg` #303030 | **5.26:1** | 3.0:1 — filter label dorośli — chip dot, cell bar | PASS |
| `--label-kids` #ef8950 | `--color-bg` #303030 | **5.26:1** | 3.0:1 — filter label dzieci | PASS |
| `--label-intake` #b7d1c8 | `--color-bg` #303030 | **8.15:1** | 3.0:1 — filter label nabór | PASS |
| `--label-sport` #e0c9a6 | `--color-bg` #303030 | **8.22:1** | 3.0:1 — filter label gr. sportowa | PASS |
| `--on-label` #141414 | `--label-adults` #ea82b6 | **7.34:1** | 4.5:1 — chip/tag label on a dorośli fill | PASS |
| `--on-label` #141414 | `--label-kids` #ef8950 | **7.34:1** | 4.5:1 — chip/tag label on a dzieci fill | PASS |
| `--on-label` #141414 | `--label-intake` #b7d1c8 | **11.38:1** | 4.5:1 — chip/tag label on a nabór fill | PASS |
| `--on-label` #141414 | `--label-sport` #e0c9a6 | **11.47:1** | 4.5:1 — chip/tag label on a gr. sportowa fill | PASS |

### Theme B — Poranna sala (light)

| foreground | background | ratio | required | verdict |
|---|---|---|---|---|
| `--color-text` #1f1b18 | `--color-bg` #f6f0e8 | **15.1:1** | 4.5:1 — body/heading on page | PASS |
| `--color-text` #1f1b18 | `--color-surface` #fffdf9 | **16.83:1** | 4.5:1 — body on card or highlighted cell | PASS |
| `--color-text` #1f1b18 | `--color-surface-2` #ece2d5 | **13.36:1** | 4.5:1 — body on sunken | PASS |
| `--color-text-muted` #5c554d | `--color-bg` #f6f0e8 | **6.48:1** | 4.5:1 — muted body | PASS |
| `--color-text-muted` #5c554d | `--color-surface` #fffdf9 | **7.22:1** | 4.5:1 — muted on card | PASS |
| `--color-text-muted` #5c554d | `--color-surface-2` #ece2d5 | **5.73:1** | 4.5:1 — muted on sunken | PASS |
| `--color-accent-text` #9e3626 | `--color-bg` #f6f0e8 | **6.16:1** | 4.5:1 — accent text/link | PASS |
| `--color-accent-text` #9e3626 | `--color-surface` #fffdf9 | **6.87:1** | 4.5:1 — accent text on card | PASS |
| `--color-accent-text` #9e3626 | `--color-surface-2` #ece2d5 | **5.45:1** | 4.5:1 — accent text on sunken | PASS |
| `--color-secondary-text` #1f5346 | `--color-bg` #f6f0e8 | **7.78:1** | 4.5:1 — secondary text | PASS |
| `--color-secondary-text` #1f5346 | `--color-surface` #fffdf9 | **8.67:1** | 4.5:1 — secondary text on card | PASS |
| `--color-accent` #b4402f | `--color-bg` #f6f0e8 | **4.99:1** | 3.0:1 — accent fill / large display | PASS |
| `--color-secondary` #245c4f | `--color-bg` #f6f0e8 | **6.82:1** | 3.0:1 — secondary fill / large display | PASS |
| `--color-tertiary` #ad6549 | `--color-bg` #f6f0e8 | **3.92:1** | 3.0:1 — tertiary UI / large text | PASS |
| `--color-on-accent` #ffffff | `--color-accent` #b4402f | **5.65:1** | 4.5:1 — label on accent button | PASS |
| `--color-on-secondary` #ffffff | `--color-secondary` #245c4f | **7.72:1** | 4.5:1 — label on secondary button | PASS |
| `--color-border-strong` #8d7f6d | `--color-bg` #f6f0e8 | **3.44:1** | 3.0:1 — input/control boundary | PASS |
| `--color-focus` #245c4f | `--color-bg` #f6f0e8 | **6.82:1** | 3.0:1 — focus ring | PASS |
| `--color-focus` #245c4f | `--color-surface` #fffdf9 | **7.6:1** | 3.0:1 — focus ring on card | PASS |
| `--label-adults` #b4402f | `--color-bg` #f6f0e8 | **4.99:1** | 3.0:1 — filter label dorośli — chip dot, cell bar | PASS |
| `--label-kids` #245c4f | `--color-bg` #f6f0e8 | **6.82:1** | 3.0:1 — filter label dzieci | PASS |
| `--label-intake` #a35c41 | `--color-bg` #f6f0e8 | **4.45:1** | 3.0:1 — filter label nabór | PASS |
| `--label-sport` #7a5c1f | `--color-bg` #f6f0e8 | **5.49:1** | 3.0:1 — filter label gr. sportowa | PASS |
| `--on-label` #ffffff | `--label-adults` #b4402f | **5.65:1** | 4.5:1 — chip/tag label on a dorośli fill | PASS |
| `--on-label` #ffffff | `--label-kids` #245c4f | **7.72:1** | 4.5:1 — chip/tag label on a dzieci fill | PASS |
| `--on-label` #ffffff | `--label-intake` #a35c41 | **5.04:1** | 4.5:1 — chip/tag label on a nabór fill | PASS |
| `--on-label` #ffffff | `--label-sport` #7a5c1f | **6.22:1** | 4.5:1 — chip/tag label on a gr. sportowa fill | PASS |

### 8.1 Flagged colour issues

1. **Brand hex changed, with approval.** The brief locked `--color-accent` to
   `#d626be`, but every supplied logo file uses `#df3f8f`. Client chose the logo
   value. `#d626be` no longer appears anywhere — one token to revert if that changes.
2. **Orange left alone.** Logo files use `#ee7111`; the locked token is `#ec712d`.
   The difference is imperceptible side by side (unlike the two pinks), so the locked
   value was kept and `--logo-3` points at it, unifying mark and UI.
3. **`#df3f8f` fails AA as body text: 3.30:1 on `#303030`.** It passes 3:1 for
   fills, large display type and UI boundaries. Compliant sibling supplied as
   `--color-accent-text: #ea82b6` (5.26:1). The brand hex was not silently altered —
   both exist, with defined roles.
4. **`#ec712d` fails AA as body text: 4.38:1 on `#303030`.** Same treatment:
   `--color-secondary-text: #ef8950`.
5. `--color-on-accent` is `#141414`, not black or white: white on `#df3f8f` is
   4.00:1 and `#1e1e1c` is 4.17:1, both short of 4.5:1. `#141414` reaches 4.6:1.
6. Theme B's tertiary was darkened to `#ad6549` to clear 3:1 on cream.
7. `--color-border` is decorative only (1.3–1.6:1). Any boundary that carries
   meaning — inputs, toggles, control edges — uses `--color-border-strong` (≥3:1).
8. Theme A's label colours are the `-text` siblings, not the raw brand hexes,
   because a label bar can land on `--color-surface` where `#df3f8f` measures only
   2.84:1.
9. Theme B's nabór label was darkened from `#ad6549` to `#a35c41` so white text on a
   filled chip clears 4.5:1. `--color-tertiary` itself is unchanged.

---

## 9. Layout, rhythm and breakpoints

Breakpoints: **360 / 768 / 1280 / 1920**, mobile-first, all `min-width`.

```
--unit:      calc(var(--base) * 0.5)
--sp-1 … --sp-9: 0.5 1 1.5 2 3 4 6 8 12 × --unit
--section-y: clamp(calc(var(--unit) * 7), 9vw, calc(var(--unit) * 16))
--gutter:    clamp(calc(var(--unit) * 2), 5vw, calc(var(--unit) * 6))
--wrap:      min(100% - var(--gutter) * 2, 82rem)   /* 88rem ≥1920 */
--header-h:  calc(var(--unit) * 7)
```

Everything vertical derives from `--unit` → `--base`, the only value in absolute
units. No spacing is tied to any face's cap height, so the rhythm survives the face
swap unchanged.

| section | ≤767 | ≥768 | ≥1280 |
|---|---|---|---|
| hero | stacked, video 44:100 capped at `min(62vh, 30rem)` | stacked | 12-col: copy `1/7`, media `8/12` at 3:4, centred |
| facts | stacked | 3 columns | 3 columns |
| offer group | stacked, heading scrolls normally | stacked | `18rem 1fr`, heading sticky under the header |
| schedule days | 1 column | 2 columns | 4 columns |
| crew | 1 column | 2 columns | 4 columns, even cards offset `+--sp-7` |
| contact | 1 column | 2 columns | `1fr 1.5fr` (card / map) |
| contact links | 1 column | 2 columns, max 64rem | same |

**Sticky-heading fix (round 2).** The offer group heading was sticky at every width.
Below 1280 the heading and the list share one column, so a sticky heading parks on
top of the item text — two unreadable layers. Sticky positioning now applies only at
≥1280, where the heading has a column of its own and nothing can pass under it. That
is the general rule: a sticky side label is only safe when it owns its column;
otherwise it needs an opaque background and a reserved band, which costs more space
than it earns on a phone.

Asymmetry devices: the offer's sticky left column against a full-width right list,
the hero's 7/5 split with the arch-masked video, the staggered crew row, and the rule
running from each section heading to the right margin. No three-identical-cards
section anywhere.

`--arch` (`52% 52% 3px 3px / 26% 26% 3px 3px`) is a brand motif lifted from the `M`
monogram's arches, used on the hero video frame.

---

## 10. Accessibility checklist (WCAG 2.2 AA)

- `<html lang="pl">`; all copy, `alt` text and `aria-label`s in Polish.
- Landmarks: `header` / `nav` (labelled) / `main` / `section` with
  `aria-labelledby` / `footer`. Skip link to `#main`, visible on focus.
- Focus ring: `2px solid var(--color-focus)`, `3px` offset, never removed.
- Scroll-spy sets `aria-current="true"`; the theme toggle and the location toggles
  are `<button>`s with `aria-pressed`; the filter is a `role="radiogroup"` of
  `role="radio"` chips with `aria-checked`, a roving `tabindex` and arrow-key
  navigation; both toggle groups have `role="group"` + `aria-label`; the mobile nav
  uses `aria-expanded` + `aria-controls` + `Escape`.
- Every schedule row prints its labels as words and the selected chip is filled, so
  colour is never the only signal. Screen-reader users get the state from the radio
  group itself rather than from a separate announcement.
- Marquee is `aria-hidden="true"` (decorative duplicate of the offer list).
- Contact icons are `aria-hidden` decoration; each link carries its own text.
- Hero video is `muted` + `loop` + `playsinline`, carries no information, has an
  `aria-label`; no autoplaying audio anywhere.
- Times in `<time datetime>`; prices and times use `font-variant-numeric: tabular-nums`.
- Phone as `tel:`, email as `mailto:`.
- Touch targets ≥ 44 px on chips, toggles, nav and buttons.
- Verified: zero console errors or warnings at 360 / 768 / 1280 / 1920, in both
  themes, exercising the theme toggle, filter chips and location toggles
  (Chromium 153, headless). No horizontal overflow at any breakpoint.

---

## 11. Open issues for Phase 2.1

1. **Content is stale.** The live site still publishes "sezon 2025/26". Client
   approved building against it; the 2026/27 grid must replace it before launch.
2. **Contradictory hours.** The contact page publishes `wt–śr 16:00–21:00,
   pt 16:00–19:00`, but the schedule runs Thursday classes and nothing on Friday.
   Rendered here as *office* hours, with Kołobrzeg's derived from its own grid
   (`wt–czw 16:30–20:15`) since none are published. Needs a client answer.
3. **Label taxonomy needs confirming.** The four filter labels (dorośli, dzieci,
   nabór, gr. sportowa) were derived from the published schedule's own wording. If
   the studio thinks in different groupings — by style, by age band — the filter
   should follow them. In Payload this becomes a `labels` relation on the class
   entity, not a hardcoded enum.
4. **Map placeholder** at `min 100% × 16rem`, one per location. Nothing external is
   loaded by the prototype.
5. **No trial-class CTA** — removed at client request. Primary conversion is
   `Sprawdź grafik`; phone and email are the contact path.
6. **`/programs`** is linked from header, footer and teaser band but not built. It
   inherits these tokens; the poster grid and sponsor-logo strip are its new parts.
7. **First-visit theme** is dark by default. Following `prefers-color-scheme`
   instead is one line (§6.1) and is a client decision.
8. **Prototype-only scaffolding to delete:** the `Prototyp…` line in the footer.
   The theme toggle, the filter and the location toggles are all production features.
   The A/B/C overlay control from round 1 is gone; there is no prototype chrome left
   in the markup.

---

## 12. Production notes

- Fonts are base64-inlined in the prototype. In production, emit the two `woff2`
  files and `preload` both — they serve every theme, so there is no conditional
  loading to reason about. Give the fallback stack `size-adjust` descriptors matching
  §5.2 so the swap-in does not shift layout.
- LCP element is the hero headline (text). The video is `preload="none"`, loaded
  through `requestIdleCallback` behind an `IntersectionObserver` with a 200 px
  margin, and never blocks first paint. Keep that shape.
- Logo SVGs must stay inline (or be `<symbol>` references) for `--logo-*` to work.
  An `<img>` cannot be recoloured.
- The filter is a pure view-layer concern: labels come from the class record, and
  nothing about the filter needs server state. Deep links currently use JS; if
  Phase 2.1 wants shareable filtered URLs, promote them to a query parameter
  (`/#schedule?grupa=dzieci`) read on load.
- The single-file prototype is ~0.81 MB with all media inlined; that number means
  nothing for production.

---

## 13. Changing the type system

There is nothing left to recombine — the themes share one typography, and that is
deliberate (§6.1). What remains is how to change it for the whole site.

Every metric hangs off four tokens in `:root`: `--base`, `--scale-ratio`,
`--size-adjust-body` and `--size-adjust-display`. Spacing derives from `--base`, the
scale derives from `--base` and `--scale-ratio`, and the two adjustments keep the
display and body faces optically matched. To swap a family:

1. Verify Polish Latin-Ext-A coverage first — that has already disqualified
   candidates on this project.
2. Measure its cap-height and x-height against the em and recompute the matching
   `--size-adjust-*` (formulae in §5.2).
3. Re-check `--measure`, since `ch` is a per-face unit.
4. If the new display face has accented capitals inside its em box, drop
   `--display-overshoot` toward `0.02em`; Meringue's `0.14em` is compensation for a
   specific defect, not a house style.

No component needs touching. Nothing in the layout is tied to a face's metrics.
