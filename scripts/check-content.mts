/**
 * Content-layer baseline check.
 *
 * Asserts the record counts captured in the Step 0 audit and the referential
 * integrity the content layer depends on. Phase 2.2 swaps the reader bodies
 * for Payload queries; this script is how that phase proves the migration
 * moved every record and broke no reference.
 *
 * Run: npm run check:content
 */
import { getLocations, getDefaultLocation } from "@/lib/content/locations";
import { getOfferGroups } from "@/lib/content/classes";
import { getScheduleEntries, getScheduleLabels, getScheduleGrid } from "@/lib/content/schedule";
import { getPriceBlocks } from "@/lib/content/pricing";
import { getInstructors } from "@/lib/content/instructors";
import { getPrograms, getProgramsTeaser } from "@/lib/content/programs";
import { getNavigation, getSectionIntros, getFacts, getMarqueeItems, getUiCopy, getContactCopy, getHeroCopy } from "@/lib/content/site";

const fail: string[] = [];
const eq = (label: string, got: unknown, want: unknown) => {
  const ok = got === want;
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}: ${got}${ok ? "" : ` (expected ${want})`}`);
  if (!ok) fail.push(label);
};

const locations = await getLocations();
eq("locations", locations.length, 2);
eq("default location", (await getDefaultLocation()).slug, "bialogard");

const groups = await getOfferGroups();
eq("offer groups", groups.length, 4);
eq("offer items", groups.reduce((n, g) => n + g.items.length, 0), 20);
eq("offer CTAs", groups.filter((g) => g.scheduleFilter).length, 2);

const entries = await getScheduleEntries();
eq("schedule entries", entries.length, 25);
eq("schedule Białogard", entries.filter((e) => e.location === "bialogard").length, 13);
eq("schedule Kołobrzeg", entries.filter((e) => e.location === "kolobrzeg").length, 12);
eq("schedule labels", (await getScheduleLabels()).length, 4);

const blocks = await getPriceBlocks();
eq("price blocks", blocks.length, 6);
eq("price rows", blocks.reduce((n, b) => n + b.rows.length, 0), 24);

eq("instructors", (await getInstructors()).length, 5);
const programs = await getPrograms();
eq("programs", programs.length, 2);
eq("program sessions", programs.reduce((n, p) => n + p.sessions.length, 0), 4);
eq("program session rows", programs.reduce((n, p) => n + p.sessions.reduce((m, s) => m + s.rows.length, 0), 0), 10);
eq("teaser posters", (await getProgramsTeaser()).posters.length, 3);
eq("nav items", (await getNavigation()).length, 6);
eq("section intros", (await getSectionIntros()).length, 5);
eq("facts", (await getFacts()).length, 3);
eq("marquee items", (await getMarqueeItems()).length, 10);
eq("contact links", (await getContactCopy()).links.length, 4);
eq("hero headline lines", (await getHeroCopy()).headline.length, 3);

// referential integrity
const labelSlugs = new Set((await getScheduleLabels()).map((l) => l.slug));
const locationSlugs = new Set(locations.map((l) => l.slug));
const badLabels = entries.flatMap((e) => e.labels.filter((l) => !labelSlugs.has(l)));
const badLocs = [...entries.map((e) => e.location), ...blocks.map((b) => b.location)].filter((l) => !locationSlugs.has(l));
const badFilters = groups.map((g) => g.scheduleFilter).filter((f): f is string => !!f && !labelSlugs.has(f));
eq("entries -> unknown labels", badLabels.length, 0);
eq("rows -> unknown locations", badLocs.length, 0);
eq("offer -> unknown filters", badFilters.length, 0);
eq("duplicate entry slugs", entries.length - new Set(entries.map((e) => e.slug)).size, 0);

const grid = await getScheduleGrid();
eq("grid locations", grid.length, 2);
eq("grid entries total", grid.reduce((n, g) => n + g.days.reduce((m, d) => m + d.entries.length, 0), 0), 25);
eq("grid day columns", grid.map((g) => g.days.length).join("/"), "4/3");
const untagged = entries.filter((e) => e.labels.length === 0);
eq("entries with no label", untagged.length, 0);

console.log(fail.length ? `\n${fail.length} FAILED` : "\nall checks passed");
process.exit(fail.length ? 1 : 0);
