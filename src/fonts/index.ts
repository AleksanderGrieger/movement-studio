import localFont from "next/font/local";

/**
 * Display face — TAN Meringue (client-owned, commercial licence).
 *
 * design-decisions.md §1.1: 337 glyphs, complete Polish diacritics with real
 * outlines, cap height 1.000 em, x-height 0.680. Its accented capitals reach
 * y ≈ 1198 against a declared ascent of 1010 — see --display-overshoot in
 * globals.css, which is compensation for that defect and must not be removed.
 *
 * `display: "block"` matches the approved prototype: the hero headline is the
 * LCP element, and a swap would reflow it mid-paint. Preloaded to keep the
 * block period short.
 */
export const meringue = localFont({
  src: "./meringue-subset.woff2",
  variable: "--font-meringue",
  display: "block",
  preload: true,
  weight: "400",
  style: "normal",
  // Meringue's cap height is a full em; a serif fallback keeps the block
  // period from collapsing into a visibly different silhouette.
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

/**
 * Body face — Archivo (SIL OFL 1.1), the prototype's face.
 *
 * Capsuula held this slot for a while as a client substitution; this is the
 * move back. The three tokens that were recomputed for Capsuula go back to
 * their Archivo values with it — they are a set, and changing the face
 * without them is what makes type look subtly wrong:
 *
 *   1. x-height 0.526 em, so --size-adjust-body is 0.520 / 0.526 = 0.99
 *      (was 1.04 for Capsuula's 0.500).
 *   2. `ch` is a per-face unit — digit advance 0.575 em against Capsuula's
 *      0.510 — so --measure goes back to 58ch for the same rendered line
 *      length.
 *   3. Archivo carries a real wght 100-900 axis, so --weight-strong is 600
 *      again rather than the 400 that avoided a synthesized faux bold.
 *
 * Vendored rather than pulled through next/font/google so the build stays
 * offline and matches how Meringue is loaded. Two files because Polish needs
 * both of Google's Latin subsets: ó sits in latin, ą ć ę ł ń ś ź ż in
 * latin-ext. Variable font, hence the 100 900 weight range — next/font keeps
 * the axis, so --weight-strong renders as a real drawn weight.
 */
export const archivo = localFont({
  src: [
    { path: "./archivo-latin.woff2", weight: "100 900", style: "normal" },
    { path: "./archivo-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-archivo",
  display: "block",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const fontVariables = `${meringue.variable} ${archivo.variable}`;
