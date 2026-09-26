/**
 * axe-core audit of both routes, in both themes, at every breakpoint.
 *
 * The acceptance bar is no critical or serious issues. Moderate and minor are
 * reported too rather than hidden, so regressions are visible.
 *
 * Both themes matter: contrast is the one rule that can pass in Theme A and
 * fail in Theme B, since they share everything except colour.
 *
 * Run: npm run check:a11y -- --url http://localhost:8135
 */
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

function arg(name: string, fallback?: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const base = arg("url", "http://localhost:8135")!.replace(/\/$/, "");
const executablePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const ROUTES = ["/", "/programs/"];
const WIDTHS = [360, 768, 1280, 1920];
const THEMES = ["a", "b"];

const browser = await chromium.launch({ executablePath });
let blocking = 0;
let advisory = 0;

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    for (const theme of THEMES) {
      const context = await browser.newContext({
        viewport: { width, height: Math.round(width * 0.75) },
        storageState: {
          cookies: [],
          origins: [
            {
              origin: new URL(base).origin,
              localStorage: [{ name: "ms-theme", value: theme }],
            },
          ],
        },
      });
      const page = await context.newPage();
      await page.goto(base + route, { waitUntil: "networkidle" });

      // Reveal everything first: an element at opacity 0 is skipped by the
      // colour-contrast rule, which would hide most of the page from the audit.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.35;
        let y = 0;
        for (let g = 0; g < 400; g += 1) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
          const max =
            document.documentElement.scrollHeight - window.innerHeight;
          if (y >= max) break;
          y = Math.min(y + step, max);
        }
      });
      /* Wait out the reveal transition. --dur-reveal is 640ms plus up to
         three stagger steps; sampling early makes axe read a mid-fade colour
         and report contrast failures that do not exist at rest. */
      await page.waitForTimeout(1500);

      const results = await new AxeBuilder({ page })
        /* best-practice is included because axe tags heading-order there rather
           than under a WCAG success criterion — Lighthouse reports it, so the
           two gates should agree. */
        .withTags([
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "wcag22aa",
          "best-practice",
        ])
        /* The contact map is a Google Maps embed. axe audits into the iframe
           and flags Google's own controls, which are not ours to fix and not
           what this gate is measuring. */
        .exclude("iframe")
        .analyze();

      const bad = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );
      const meh = results.violations.filter(
        (v) => v.impact !== "critical" && v.impact !== "serious",
      );
      blocking += bad.length;
      advisory += meh.length;

      const tag = `${route} ${width} theme-${theme}`;
      console.log(
        `${bad.length ? "FAIL" : "ok  "}  ${tag.padEnd(28)} critical/serious=${bad.length} other=${meh.length}`,
      );
      for (const v of [...bad, ...meh]) {
        console.log(`      [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
        for (const node of v.nodes.slice(0, 3)) {
          console.log(`        ${node.target.join(" ")}`);
          if (node.failureSummary) {
            console.log(
              `          ${node.failureSummary.split("\n").slice(1).join(" ").trim()}`,
            );
          }
        }
      }

      await context.close();
    }
  }
}

await browser.close();
console.log(
  `\ncritical/serious: ${blocking}   moderate/minor: ${advisory}`,
);
process.exit(blocking ? 1 : 0);
