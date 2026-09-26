import type {
  ContactCopy,
  Fact,
  FooterCopy,
  HeaderCopy,
  HeroCopy,
  MarqueeItems,
  NavItem,
  SectionId,
  SectionIntro,
  SiteMeta,
  UiCopy,
} from "./types";
import data from "./data/site.json";

/**
 * Page copy.
 *
 * Every user-visible Polish string on the site comes from here or from one of
 * the other content modules — including aria-labels, button text and alt
 * text. Nothing is hardcoded in TSX.
 */

/** Document title and meta description. */
export async function getSiteMeta(): Promise<SiteMeta> {
  return data.meta as SiteMeta;
}

/** Main navigation. Anchors take part in scroll-spy; /programs does not (§2). */
export async function getNavigation(): Promise<NavItem[]> {
  return data.navigation as NavItem[];
}

export async function getHeaderCopy(): Promise<HeaderCopy> {
  return data.header as HeaderCopy;
}

export async function getFooterCopy(): Promise<FooterCopy> {
  return data.footer as FooterCopy;
}

export async function getHeroCopy(): Promise<HeroCopy> {
  return data.hero as HeroCopy;
}

/** The numbered heading blocks, in IA order. */
export async function getSectionIntros(): Promise<SectionIntro[]> {
  return data.sections as SectionIntro[];
}

/**
 * One section's heading block.
 *
 * Throws rather than returning undefined: a missing section intro is a
 * content error that should fail the build, not render a section with no
 * accessible name (every section is aria-labelledby its own heading, §10).
 */
export async function getSectionIntro(id: SectionId): Promise<SectionIntro> {
  const sections = await getSectionIntros();
  const section = sections.find((candidate) => candidate.id === id);
  if (!section) {
    throw new Error(`Missing section copy for "${id}" in data/site.json`);
  }
  return section;
}

export async function getFacts(): Promise<Fact[]> {
  return (data.facts as Fact[]).slice().sort((a, b) => a.order - b.order);
}

/** Decorative style-name ticker. Rendered aria-hidden (§10). */
export async function getMarqueeItems(): Promise<MarqueeItems> {
  return data.marquee as MarqueeItems;
}

/** Labels for the interactive controls: location toggles, filter, footnote. */
export async function getUiCopy(): Promise<UiCopy> {
  return data.ui as UiCopy;
}

export async function getContactCopy(): Promise<ContactCopy> {
  return data.contact as ContactCopy;
}
