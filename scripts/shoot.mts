/**
 * Screenshot the built export at the four approved breakpoints, in both
 * themes.
 *
 * Exists because the in-editor browser pane reports document.visibilityState
 * "hidden" — the page is never actually rendered there, so IntersectionObserver
 * never fires and captures come back stale. Reveals, scroll-spy and the
 * filter all depend on the observer, so they cannot be verified without a
 * real headless browser.
 *
 * Usage: npm run shoot -- [--url http://localhost:8127] [--out .shots]
 *                        [--only 1280] [--theme a|b] [--anchor offer]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BREAKPOINTS = [360, 768, 1280, 1920];

function arg(name: string, fallback?: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const url = arg("url", "http://localhost:8127")!;
const outDir = arg("out", ".shots")!;
const only = arg("only");
const themes = (arg("theme") ?? "a,b").split(",");
const anchor = arg("anchor");

const widths = only ? [Number(only)] : BREAKPOINTS;

await mkdir(outDir, { recursive: true });
/* Playwright's bundled Chromium has no mac12-arm64 build, so we drive the
   system Chrome instead. CHROME_PATH overrides it on other machines / CI. */
const executablePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await chromium.launch({ executablePath });

for (const width of widths) {
  for (const theme of themes) {
    const context = await browser.newContext({
      viewport: { width, height: Math.round(width * 0.75) },
      deviceScaleFactor: 1,
      // Seed the theme the way a returning visitor would have it, so the
      // pre-paint script applies it with no flash.
      storageState: {
        cookies: [],
        origins: [
          {
            origin: new URL(url).origin,
            localStorage: [{ name: "ms-theme", value: theme }],
          },
        ],
      },
    });

    const page = await context.newPage();
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto(url, { waitUntil: "networkidle" });

    if (anchor) {
      await page.evaluate(
        (id) =>
          document
            .getElementById(id)
            ?.scrollIntoView({ behavior: "instant", block: "start" }),
        anchor,
      );
    } else {
      // Walk the page so every reveal fires before the full-page capture.
      // scrollHeight is re-read every step: it grows as fonts and images
      // settle, and reading it once walks only part of the page.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.35;
        let y = 0;
        for (let guard = 0; guard < 200; guard += 1) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 300));
          const max = document.documentElement.scrollHeight - window.innerHeight;
          if (y >= max) break;
          y = Math.min(y + step, max);
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 200));
      });
    }

    await page.waitForTimeout(1200);

    const name = `${outDir}/${width}-${theme}${anchor ? `-${anchor}` : ""}.png`;
    await page.screenshot({ path: name, fullPage: !anchor });

    /* Elements inside a hidden location panel never intersect anything, so
       they are legitimately unrevealed until the visitor switches to that
       panel — usePanelVisibility handles them then. Only count the ones that
       are on screen and still invisible, which would be a real bug. */
    const notRevealed = await page.evaluate(
      () =>
        [...document.querySelectorAll<HTMLElement>(".r")].filter(
          (el) =>
            !el.classList.contains("is-in") &&
            !el.closest<HTMLElement>(".panel")?.hidden,
        ).length,
    );
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );

    console.log(
      `${name}  unrevealed=${notRevealed}  h-overflow=${overflow}  errors=${errors.length}`,
    );
    if (errors.length) errors.forEach((e) => console.log(`    ! ${e}`));

    await context.close();
  }
}

await browser.close();
