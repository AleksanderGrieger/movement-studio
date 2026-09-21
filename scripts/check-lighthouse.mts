/**
 * Lighthouse gate: Performance >= 90, Accessibility 100 on both routes.
 *
 * Takes the median of several runs. A single run is badly affected by
 * whatever else the machine is doing — the same unchanged build measured 86
 * and 99 minutes apart, purely from CPU contention. The median is the number
 * worth gating on.
 *
 * Run: npm run check:lh -- --url http://localhost:8142 [--runs 3]
 */
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

function arg(name: string, fallback?: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const base = arg("url", "http://localhost:8142")!.replace(/\/$/, "");
const ROUTES = ["/", "/programs/"];

const chrome = await launch({
  chromeFlags: ["--headless=new", "--no-sandbox"],
  chromePath:
    process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

let failed = 0;

const RUNS = Number(arg("runs", "3"));
const median = (xs: number[]) =>
  xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)];

for (const route of ROUTES) {
  const runs = [];
  for (let i = 0; i < RUNS; i += 1) {
    const result = await lighthouse(
      base + route,
      { port: chrome.port, output: "json", logLevel: "error" },
      undefined,
    );
    if (result) runs.push(result.lhr);
  }
  if (runs.length === 0) continue;

  const score = (cat: string) =>
    median(runs.map((r) => Math.round((r.categories[cat].score ?? 0) * 100)));

  const audits = runs[runs.length - 1].audits;
  const perf = score("performance");
  const a11y = score("accessibility");
  const bp = score("best-practices");
  const seo = score("seo");

  const ok = perf >= 90 && a11y === 100;
  if (!ok) failed += 1;

  console.log(
    `${ok ? "ok  " : "FAIL"}  ${route.padEnd(12)} perf=${perf} a11y=${a11y} best-practices=${bp} seo=${seo}  (median of ${runs.length})`,
  );
  console.log(
    `        LCP ${audits["largest-contentful-paint"].displayValue}  ` +
      `CLS ${audits["cumulative-layout-shift"].displayValue}  ` +
      `TBT ${audits["total-blocking-time"].displayValue}  ` +
      `FCP ${audits["first-contentful-paint"].displayValue}`,
  );

  for (const key of Object.keys(audits)) {
    const a = audits[key];
    if (
      a.score !== null &&
      a.score < 0.9 &&
      a.scoreDisplayMode === "metricSavings"
    ) {
      console.log(
        `        · ${a.title}${a.displayValue ? ` — ${a.displayValue}` : ""}`,
      );
    }
  }
}

await chrome.kill();
console.log(
  failed ? `\n${failed} route(s) below the bar` : "\nboth routes meet the bar",
);
process.exit(failed ? 1 : 0);
