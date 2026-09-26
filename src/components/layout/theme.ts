/**
 * The theme contract, in one place.
 *
 * Three files have to agree on these values: the server markup sets the
 * default on <html>, the pre-paint script in <head> reads storage and
 * overwrites it, and the toggle writes both. They were previously three
 * independent copies of the same magic strings — renaming the storage key
 * broke a returning visitor's saved theme silently, with nothing in dev or in
 * the check scripts to catch it, because the failure only shows on a second
 * visit.
 *
 * No 'use client': plain constants, imported by both server and client files.
 */

/** localStorage key. Namespaced, since this is a shared origin on Pages. */
export const THEME_STORAGE_KEY = "ms-theme";

/** The attribute every themed selector in globals.css keys off. */
export const THEME_ATTRIBUTE = "data-theme";

export type Theme = "a" | "b";

/** Theme A — the brand's dark-first default. */
export const THEME_DARK: Theme = "a";

/** Theme B — light. */
export const THEME_LIGHT: Theme = "b";

/**
 * What a first-time visitor gets (§6.1, §11.7). Dark, because the brand is
 * dark-first — a client decision, not a technical one. To follow the OS
 * instead, see the note in ThemeScript.
 */
export const DEFAULT_THEME: Theme = THEME_DARK;
