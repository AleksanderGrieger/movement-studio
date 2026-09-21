/**
 * Applies the saved theme before first paint.
 *
 * This runs synchronously in <head>, ahead of any rendering, so a returning
 * light-mode visitor never sees a frame of the dark default (§6.1). Without
 * it the theme swap would be visible on every page load, which is worse than
 * having no toggle.
 *
 * Kept deliberately tiny and dependency-free: it blocks parsing.
 *
 * Default is Theme A (dark) on a first visit — the brand is dark-first. To
 * follow the OS instead, replace the final line with:
 *   t = matchMedia('(prefers-color-scheme: light)').matches ? 'b' : 'a';
 * That is a client decision, not a technical one (§6.1, §11.7).
 */
const script = `try{var t=localStorage.getItem('ms-theme');if(t!=='a'&&t!=='b')t='a';document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

/** Storage key, shared with ThemeToggle. */
export const THEME_STORAGE_KEY = "ms-theme";
