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
import { snapshot } from "./snapshot";

/**
 * Page copy.
 *
 * Every user-visible Polish string on the site comes from here or from one of
 * the other content modules — including aria-labels, button text and alt
 * text. Nothing is hardcoded in TSX.
 */

/** Document title and meta description. */
export async function getSiteMeta(): Promise<SiteMeta> {
  return snapshot().site.meta;
}

/** Main navigation. Anchors take part in scroll-spy; /programs does not (§2). */
export async function getNavigation(): Promise<NavItem[]> {
  return snapshot().site.navigation;
}

export async function getHeaderCopy(): Promise<HeaderCopy> {
  return snapshot().site.header;
}

export async function getFooterCopy(): Promise<FooterCopy> {
  return snapshot().site.footer;
}

export async function getHeroCopy(): Promise<HeroCopy> {
  return snapshot().site.hero;
}

/** The numbered heading blocks, in IA order. */
export async function getSectionIntros(): Promise<SectionIntro[]> {
  return snapshot().site.sections;
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
    throw new Error(
      `Missing section copy for "${id}" in the content snapshot. ` +
        `Add a Nagłówki sekcji entry for it in the CMS and refetch.`,
    );
  }
  return section;
}

export async function getFacts(): Promise<Fact[]> {
  return snapshot().site.facts.slice().sort((a, b) => a.order - b.order);
}

/** Decorative style-name ticker. Rendered aria-hidden (§10). */
export async function getMarqueeItems(): Promise<MarqueeItems> {
  return snapshot().site.marquee;
}

/** Labels for the interactive controls: location toggles, filter, footnote. */
export async function getUiCopy(): Promise<UiCopy> {
  return snapshot().site.ui;
}

export async function getContactCopy(): Promise<ContactCopy> {
  return snapshot().site.contact;
}
