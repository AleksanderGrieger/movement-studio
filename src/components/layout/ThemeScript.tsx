import {
  DEFAULT_THEME,
  THEME_ATTRIBUTE,
  THEME_DARK,
  THEME_LIGHT,
  THEME_STORAGE_KEY,
} from "./theme";

/**
 * Applies the saved theme before first paint.
 *
 * This runs synchronously in <head>, ahead of any rendering, so a returning
 * light-mode visitor never sees a frame of the dark default (§6.1). Without
 * it the theme swap would be visible on every page load, which is worse than
 * having no toggle.
 *
 * Kept deliberately tiny and dependency-free: it blocks parsing. The values
 * are interpolated from theme.ts at build time rather than written out again
 * here, so this script cannot drift from the toggle that writes the storage
 * it reads.
 *
 * To follow the OS instead of defaulting to dark, replace the fallback with:
 *   matchMedia('(prefers-color-scheme: light)').matches ? 'b' : 'a'
 * That is a client decision, not a technical one (§6.1, §11.7).
 */
const script = [
  "try{",
  `var k=${JSON.stringify(THEME_STORAGE_KEY)},t=localStorage.getItem(k);`,
  `if(t!==${JSON.stringify(THEME_DARK)}&&t!==${JSON.stringify(THEME_LIGHT)})`,
  `t=${JSON.stringify(DEFAULT_THEME)};`,
  `document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},t)`,
  "}catch(e){}",
].join("");

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
