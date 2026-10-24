import fs from "node:fs";
import path from "node:path";

import type {
  Audience,
  ContactCopy,
  Fact,
  FaqItem,
  FooterCopy,
  FoundersIntro,
  HeaderCopy,
  HeroCopy,
  Instructor,
  Location,
  MarqueeItems,
  NavItem,
  OfferGroup,
  PriceBlock,
  Program,
  ProgramsPageCopy,
  ProgramsTeaser,
  ScheduleEntry,
  ScheduleLabel,
  SectionIntro,
  SignUpCopy,
  SignUpForm,
  SiteMeta,
  UiCopy,
  Weekday,
} from "./types";

/**
 * The content snapshot, and the only thing in this directory that touches a
 * file.
 *
 * Content lives in Payload, which runs out of process — the site is a static
 * export on GitHub Pages and has no runtime to query it from. So the whole
 * content layer is fetched once before the build, by scripts/fetch-content.mts,
 * and every reader in this directory reads it from here.
 *
 * Read once and kept: a static export renders every page in one process, and
 * re-reading 56 kB of JSON for each of the forty-odd reader calls would be
 * work for nothing.
 *
 * Nothing outside lib/content/ may import this, or the JSON it reads. That is
 * the rule the whole layer rests on: components see types, never storage.
 */

/** Exactly the shape scripts/fetch-content.mts writes. */
export interface Snapshot {
  locations: Location[];
  offer: OfferGroup[];
  schedule: {
    labels: ScheduleLabel[];
    weekdays: Weekday[];
    entries: ScheduleEntry[];
  };
  pricing: PriceBlock[];
  instructors: {
    founders: FoundersIntro;
    instructors: Instructor[];
  };
  programs: {
    page: ProgramsPageCopy;
    teaser: ProgramsTeaser;
    programs: Program[];
  };
  faq: FaqItem[];
  site: {
    meta: SiteMeta;
    navigation: NavItem[];
    header: HeaderCopy;
    footer: FooterCopy;
    hero: HeroCopy;
    marquee: MarqueeItems;
    facts: Fact[];
    sections: SectionIntro[];
    ui: UiCopy;
    contact: ContactCopy;
  };
  forms: {
    audiences: Audience[];
    ui: SignUpCopy;
    forms: SignUpForm[];
  };
}

const SNAPSHOT_PATH = path.join(process.cwd(), "lib", "content", ".snapshot", "content.json");

let cached: Snapshot | undefined;

/**
 * The snapshot, or a build failure that says what to do about it.
 *
 * A missing or unreadable snapshot has to stop the build. The alternative is
 * a site that renders with empty sections, which looks like a styling bug and
 * would be deployed before anyone traced it back to the content.
 */
export function snapshot(): Snapshot {
  if (cached) return cached;

  let raw: string;
  try {
    raw = fs.readFileSync(SNAPSHOT_PATH, "utf8");
  } catch (error) {
    throw new Error(
      `No content snapshot at ${SNAPSHOT_PATH}.\n` +
        `The site builds from a snapshot of the CMS, not from files in this repository.\n` +
        `Run:  npm run content:fetch   (with PAYLOAD_URL pointing at the CMS)\n` +
        `Original error: ${(error as Error).message}`,
    );
  }

  try {
    cached = JSON.parse(raw) as Snapshot;
  } catch (error) {
    throw new Error(
      `The content snapshot at ${SNAPSHOT_PATH} is not valid JSON — refetch it with ` +
        `npm run content:fetch.\nOriginal error: ${(error as Error).message}`,
    );
  }

  return cached;
}
