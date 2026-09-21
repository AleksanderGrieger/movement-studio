/**
 * Behavioural checks for the home page's interactive parts.
 *
 * These cover the §6 interaction spec: the schedule filter's single-select
 * radiogroup and subtraction behaviour, the shared location state across
 * three sections, the offer deep links, scroll-spy, and the theme toggle.
 *
 * Run: npm run check:ui -- --url http://localhost:8127
 */
import { chromium, type Page } from "playwright";

function arg(name: string, fallback?: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const url = arg("url", "http://localhost:8127")!;
const executablePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const failures: string[] = [];
function check(label: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(
    `${ok ? "ok  " : "FAIL"}  ${label}: ${JSON.stringify(got)}${
      ok ? "" : ` (expected ${JSON.stringify(want)})`
    }`,
  );
  if (!ok) failures.push(label);
}

/** Row counts in the visible schedule panel. */
async function rows(page: Page) {
  return page.evaluate(() => {
    const panel = [...document.querySelectorAll(".panel")].find(
      (p) => !(p as HTMLElement).hidden && p.querySelector(".days"),
    );
    if (!panel) return null;
    const all = [...panel.querySelectorAll(".day li")];
    return {
      total: all.length,
      dim: all.filter((li) => li.classList.contains("is-dim")).length,
      emptyDays: panel.querySelectorAll(".day.is-empty").length,
      filtering: !!panel.querySelector(".days.is-filtering"),
    };
  });
}

const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors: string[] = [];
page.on("console", (m) => {
  if (m.type() === "error" && !m.text().includes("404")) errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(url, { waitUntil: "networkidle" });

/* ---------- schedule filter ---------- */
const initial = await rows(page);
check("schedule: Białogard rows shown by default", initial?.total, 13);
check("schedule: nothing dimmed initially", initial?.dim, 0);
check(
  "schedule: 'Wszystkie' checked when no filter",
  await page.getAttribute(".chip.chip-reset", "aria-checked"),
  "true",
);

await page.getByRole("radio", { name: "Dorośli" }).click();
const adults = await rows(page);
check("filter dorośli: rows still in the DOM", adults?.total, 13);
check("filter dorośli: non-matches dimmed", adults?.dim, 10);
check("filter dorośli: grid marked filtering", adults?.filtering, true);
check(
  "filter dorośli: chip filled",
  await page.getAttribute('[role="radio"][aria-checked="true"]', "class"),
  "chip",
);

// Białogard has one adults class on Thursday-less days; Czwartek is all-kids,
// so it should read as empty rather than unfiltered.
check("filter dorośli: fully-dimmed day marked empty", adults?.emptyDays, 1);

/* ---------- single-select ---------- */
await page.getByRole("radio", { name: "Dzieci" }).click();
const kids = await rows(page);
check("filter dzieci replaces dorośli (single-select)", kids?.dim, 3);
check(
  "only one chip checked",
  await page.locator('[role="radio"][aria-checked="true"]').count(),
  1,
);

/* ---------- roving tabindex + arrow keys ---------- */
check(
  "roving tabindex: exactly one chip tabbable",
  await page.locator('[role="radio"][tabindex="0"]').count(),
  1,
);
await page.getByRole("radio", { name: "Dzieci" }).focus();
await page.keyboard.press("ArrowRight");
check(
  "ArrowRight moves and selects",
  await page.evaluate(() => document.activeElement?.textContent),
  "Nabór",
);
await page.keyboard.press("Home");
check(
  "Home returns to Wszystkie",
  await page.evaluate(() => document.activeElement?.textContent),
  "Wszystkie",
);
check("Home clears the filter", (await rows(page))?.dim, 0);

/* ---------- location: one state, three sections ---------- */
await page.getByRole("button", { name: "Kołobrzeg" }).first().click();
check("location: Kołobrzeg schedule rows", (await rows(page))?.total, 12);
check(
  "location: all three toggles follow",
  await page.evaluate(() =>
    [...document.querySelectorAll('.toggle button[aria-pressed="true"]')].map(
      (b) => b.textContent,
    ),
  ),
  ["Kołobrzeg", "Kołobrzeg", "Kołobrzeg"],
);
check(
  "location: exactly one panel visible per group",
  await page.evaluate(
    () =>
      [...document.querySelectorAll(".panel")].filter(
        (p) => !(p as HTMLElement).hidden,
      ).length,
  ),
  3,
);

/* ---------- filter survives a location switch ---------- */
await page.getByRole("radio", { name: "Dorośli" }).click();
const kgAdults = await rows(page);
await page.getByRole("button", { name: "Białogard" }).first().click();
const bgAdults = await rows(page);
check("filter persists across location switch", bgAdults?.dim, 10);
check("Kołobrzeg dimmed count differs from Białogard", kgAdults?.dim, 9);

/* ---------- offer deep link ---------- */
await page.getByRole("radio", { name: "Wszystkie" }).click();
await page
  .getByRole("link", { name: "Zobacz terminy zajęć dla dzieci" })
  .click();
await page.waitForTimeout(400);
check(
  "offer CTA presets the filter",
  await page.evaluate(
    () =>
      document.querySelector('[role="radio"][aria-checked="true"]')
        ?.textContent,
  ),
  "Dzieci",
);

/* ---------- scroll-spy ---------- */
await page.evaluate(() =>
  document
    .getElementById("pricelist")
    ?.scrollIntoView({ behavior: "instant", block: "center" }),
);
await page.waitForTimeout(600);
check(
  "scroll-spy marks the current section",
  await page.evaluate(() =>
    document.querySelector('.nav a[aria-current="true"]')?.getAttribute("href"),
  ),
  "/#pricelist",
);

/* Nav anchors are route-absolute so they also work from /programs. From the
   home page they must still be a same-document scroll, not a reload. */
let reloaded = false;
page.once("load", () => {
  reloaded = true;
});
await page.locator('.nav a[href="/#about-us"]').click();
await page.waitForTimeout(600);
check("home nav anchor scrolls without reloading", reloaded, false);
check(
  "home nav anchor lands on the section",
  await page.evaluate(
    () =>
      Math.abs(
        document.getElementById("about-us")!.getBoundingClientRect().top,
      ) < 200,
  ),
  true,
);

/* ---------- theme toggle ---------- */
await page.locator(".theme-toggle").click();
check(
  "theme toggle switches to light",
  await page.getAttribute("html", "data-theme"),
  "b",
);
await page.reload({ waitUntil: "networkidle" });
check(
  "theme persists across reload",
  await page.getAttribute("html", "data-theme"),
  "b",
);

check("no console errors", errors, []);

/* ---------- reduced motion (§7.4) ----------
   Every animation and transition collapses, but the filter, the toggles and
   the theme swap stay fully functional — only their transitions go. The
   reveal must fail OPEN: .r starts at opacity 0, so getting this wrong blanks
   the page for anyone who asks for less motion. */
const reducedContext = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
const reduced = await reducedContext.newPage();
await reduced.goto(url, { waitUntil: "networkidle" });
await reduced.waitForTimeout(1200);

const motion = (await reduced.evaluate(`(function(){
  var all = Array.prototype.slice.call(document.querySelectorAll('.r'));
  var hidden = 0;
  for (var i = 0; i < all.length; i++) {
    if (getComputedStyle(all[i]).opacity !== '1') hidden++;
  }
  function p(sel, prop){ var e = document.querySelector(sel); return e ? getComputedStyle(e)[prop] : null; }
  return {
    hiddenReveals: hidden,
    heroLines: p('.hero h1 .line > span', 'transform'),
    marquee: p('.marquee .track', 'animationName'),
    parallax: p('.media .frame', 'transform'),
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior
  };
})()`)) as Record<string, unknown>;

check("reduced motion: nothing left hidden", motion.hiddenReveals, 0);
check("reduced motion: hero lines un-translated", motion.heroLines, "none");
check("reduced motion: marquee stopped", motion.marquee, "none");
check("reduced motion: parallax cancelled", motion.parallax, "none");
check("reduced motion: smooth scrolling off", motion.scrollBehavior, "auto");

await reduced.getByRole("radio", { name: "Dorośli" }).click();
await reduced.waitForTimeout(250);
check(
  "reduced motion: filter still works",
  // Scoped to the visible panel: the hidden Kołobrzeg grid is filtered too,
  // which is correct, but counting both would assert 19 rather than 13-3.
  await reduced.evaluate(`(function(){
    var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
    for (var i = 0; i < panels.length; i++) {
      if (!panels[i].hidden && panels[i].querySelector('.days')) {
        return panels[i].querySelectorAll('.day li.is-dim').length;
      }
    }
    return -1;
  })()`),
  10,
);
await reduced.locator(".theme-toggle").click();
await reduced.waitForTimeout(150);
check(
  "reduced motion: theme toggle still works",
  await reduced.getAttribute("html", "data-theme"),
  "b",
);

await browser.close();
console.log(
  failures.length ? `\n${failures.length} FAILED` : "\nall checks passed",
);
process.exit(failures.length ? 1 : 0);
