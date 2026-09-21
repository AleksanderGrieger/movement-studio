# Source assets — not served

Originals kept for re-deriving the files the site actually ships. Nothing in
here is published: it sits outside `public/`, so Next never serves it.

## fonts/

The two supplied desktop font files. The site loads subsetted woff2 builds
from `src/fonts/`, generated with `pyftsubset`:

```
pyftsubset "TAN MERINGUE.ttf" \
  --unicodes="U+0020-007E,U+00A0,U+00D3,U+00F3,U+0104-0107,U+0118-011B,U+0141-0144,U+015A-015B,U+0179-017C,U+2010-2015,U+2018-201A,U+201C-201E,U+2022,U+2026,U+2030,U+2039,U+203A,U+00B7,U+00D7,U+20AC,U+00A9,U+2192" \
  --layout-features='kern,liga,calt' --flavor=woff2 \
  --output-file=../../src/fonts/meringue-subset.woff2
```

Capsuula uses the same unicode range plus `tnum` in `--layout-features`.

**Why these are not in `public/`.** TAN Meringue is commercially licensed and
design-decisions.md §1.1 flags that desktop licences normally exclude webfont
use. Anything under `public/` is served at a guessable URL, so leaving the
complete unsubsetted TTF there would publish the whole font for download.
The shipped subsets contain only the Polish charset the site needs.

Re-verify the webfont licence before production deploy (§1.1).
