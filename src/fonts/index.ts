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
 * Body face — Capsuula.
 *
 * Substituted for the prototype's Archivo at the client's request (both faces
 * now come from the repo). Verified against the supplied Capsuula.ttf v1.002
 * before selection, per the procedure in design-decisions.md §13:
 *
 *   1. Polish coverage — 366 glyphs; all of ą ć ę ł ń ó ś ź ż and capitals
 *      present with real (non-blank) outlines.
 *   2. x-height 0.500 em vs Archivo's 0.526, so --size-adjust-body is
 *      recomputed 0.520 / 0.500 = 1.04 (was 0.99).
 *   3. `ch` is a per-face unit — digit advance is 0.510 em vs Archivo's 0.575,
 *      so --measure is recomputed to 62ch to preserve the identical rendered
 *      line length.
 *
 * Capsuula ships a single weight (usWeightClass 400) where Archivo carried a
 * wght 100–900 axis. See --weight-strong in globals.css.
 */
export const capsuula = localFont({
  src: "./capsuula-subset.woff2",
  variable: "--font-capsuula",
  display: "block",
  preload: true,
  weight: "400",
  style: "normal",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const fontVariables = `${meringue.variable} ${capsuula.variable}`;
