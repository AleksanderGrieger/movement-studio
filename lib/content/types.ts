/**
 * Movement Studio — content contract.
 *
 * These types are the public API between the site and its content source.
 * Phase 2.1 backs them with JSON in lib/content/data/; Phase 2.2 replaces the
 * reader bodies with Payload queries. The SIGNATURES MUST NOT CHANGE.
 *
 * Design rules applied throughout:
 *
 * 1. No presentation in the data. No CSS class names, no JSX, no image
 *    imports. The one deliberate exception is ScheduleLabel.colorToken — see
 *    the note on that type.
 * 2. No closed unions over things a CMS editor can add. Locations and
 *    schedule labels are open `string` slugs, because in Payload both become
 *    collections and an editor adding a third location must not require a
 *    type change. SectionId is the exception: those five anchors are IA
 *    structure, not content.
 * 3. Every user-visible Polish string lives here, including aria-labels and
 *    alt text. Nothing is hardcoded in TSX.
 * 4. Media carries explicit intrinsic dimensions, because next/image needs
 *    them and a CMS can always supply them.
 */

/* ========================================================================
   Shared primitives
   ======================================================================== */

/**
 * A slug is a stable, URL-safe identifier that outlives copy edits.
 * Deliberately `string`, not a union — see rule 2 above.
 */
export type Slug = string;

/**
 * An image with everything next/image needs and everything a screen reader
 * needs. `alt` is content: it is authored per image, in Polish, and is `""`
 * only for genuinely decorative art.
 *
 * Phase 2.2: `src` becomes a CMS media URL. Nothing else changes.
 */
export interface ImageRef {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * A video with a poster frame. Muted and decorative; carries no information.
 *
 * `poster` is nullable because the approved hero clip does not exist yet — the
 * supplied master is an unprocessed 13 MB QuickTime and §1.3's ffmpeg encode
 * has not been run. Null means the hero renders without a poster rather than
 * pointing at a missing file; it must not become a reason to block paint on
 * the video (§12).
 */
export interface VideoRef {
  src: string;
  poster: ImageRef | null;
  width: number;
  height: number;
  /** Describes the footage for assistive tech (§10). */
  ariaLabel: string;
}

/**
 * A run of text, so emphasis can be expressed without putting HTML in the
 * data. Used by the hero headline, where one word is set in italic.
 */
export interface TextRun {
  text: string;
  emphasis?: boolean;
}

/** A link, with two different ways of clarifying its accessible name. */
export interface LinkRef {
  /** Visible label. */
  label: string;
  href: string;
  /**
   * REPLACES the accessible name. Only for links with no visible text of
   * their own — a link wrapping an image, say. Using it on a link that does
   * show text breaks WCAG 2.5.3 Label in Name, which requires the accessible
   * name to contain the visible text.
   */
  ariaLabel?: string;
  /**
   * APPENDED to the visible label for assistive tech, as visually hidden
   * text. This is the right field when the visible text is shown but needs
   * disambiguating — "Movement Studio" meaning the Facebook page, say.
   */
  context?: string;
  /** Opens in a new tab and gets rel="noopener". */
  external?: boolean;
}

/** A term/description pair, rendered as <dt>/<dd>. */
export interface DefinitionPair {
  term: string;
  value: string;
}

/* ========================================================================
   Locations

   One location state drives #schedule, #pricelist and #contact (§6.4), so
   locations are a first-class entity rather than a field repeated on three
   other types.
   ======================================================================== */

export interface Location {
  slug: Slug;
  /** Toggle button label, e.g. "Białogard". */
  name: string;
  /** Address lines, rendered inside <address>. */
  address: string[];
  /**
   * Opening hours as label/value pairs rather than structured times.
   *
   * Deliberate: design-decisions.md §11.2 flags that the published office
   * hours contradict the class schedule and are awaiting a client answer. A
   * structured {day, open, close} shape would force us to invent a resolution
   * to that contradiction. Pairs let the client's eventual answer land as a
   * content edit rather than a schema change.
   */
  hours: DefinitionPair[];
  /** Contact-section map. Null until real embeds are approved (§11.4). */
  map: MapRef | null;
  /** Presentation order, and the default is the one with the lowest order. */
  order: number;
  /** Exactly one location must be default. Białogard (§2). */
  isDefault: boolean;
}

export interface MapRef {
  /** Embed URL. */
  src: string;
  /** Accessible name for the iframe, in Polish. */
  title: string;
}

/* ========================================================================
   Offer (#offer)

   The prototype regroups the studio's eight source entries into four
   audience groups. That regrouping is content, so it is stored, not derived.
   ======================================================================== */

export interface OfferGroup {
  slug: Slug;
  /** e.g. "Dla dorosłych". */
  title: string;
  items: OfferItem[];
  /**
   * Deep link into the filtered schedule (§6.3). Holds a ScheduleLabel slug.
   * Only the two groups that map onto a schedule label carry one; "Dla par"
   * and "Na zamówienie" have no corresponding label and get no CTA.
   */
  scheduleFilter?: Slug;
  /** CTA label, e.g. "Zobacz terminy zajęć dla dorosłych". Required iff scheduleFilter is set. */
  scheduleFilterLabel?: string;
  order: number;
}

export interface OfferItem {
  slug: Slug;
  /** e.g. "Latino Solo", "Dance Mix — 3–6 lat". */
  title: string;
  body: string;
  order: number;
}

/* ========================================================================
   Schedule (#schedule)
   ======================================================================== */

/**
 * A filter label.
 *
 * §12: "labels come from the class record" and in Payload this becomes a
 * relation, "not a hardcoded enum" — so this is a collection, not a union.
 * §11.3 flags the current four-label taxonomy as unconfirmed with the client,
 * which is the other reason not to freeze it into the type system.
 *
 * `colorToken` is the one presentation value in the content layer. It holds a
 * CSS custom property NAME (e.g. "--label-adults"), never a colour. The
 * alternative — a slug→token map in the component layer — was rejected
 * because it would leave an editor-added fifth label with no colour at all
 * and no way to give it one without a code change.
 */
export interface ScheduleLabel {
  slug: Slug;
  /** Chip label, e.g. "Gr. sportowa". */
  name: string;
  /** Word printed on the row, e.g. "gr. sportowa" (§10: colour is never the only signal). */
  tag: string;
  /** A --label-* custom property name. */
  colorToken: string;
  order: number;
}

export interface Weekday {
  slug: Slug;
  /** e.g. "Poniedziałek". */
  name: string;
  /** Monday = 1, matching ISO-8601. */
  order: number;
}

/**
 * One class occurrence. Flat and one-row-per-class: this is the Payload-native
 * shape, and grouping for the day columns is a view concern handled by
 * getScheduleGrid().
 */
export interface ScheduleEntry {
  slug: Slug;
  location: Slug;
  day: Slug;
  /** 24h "HH:MM", for <time datetime> (§10). */
  start: string;
  /** Present only where the source publishes an end time. */
  end?: string;
  /** e.g. "Latino solo kids". */
  name: string;
  /** ScheduleLabel slugs. */
  labels: Slug[];
  /**
   * Free-text qualifier shown as a plain tag, e.g. "2× w miesiącu".
   * Kept separate from `name` so the filter matches on the class, not the
   * cadence.
   */
  note?: string;
}

/** Day column, as rendered. Produced by getScheduleGrid(), never stored. */
export interface ScheduleDayGroup {
  day: Weekday;
  entries: ScheduleEntry[];
}

/** One location's grid. Produced by getScheduleGrid(), never stored. */
export interface ScheduleGrid {
  location: Location;
  days: ScheduleDayGroup[];
}

/* ========================================================================
   Pricing (#pricelist)
   ======================================================================== */

export interface PriceBlock {
  slug: Slug;
  location: Slug;
  /** e.g. "Dorośli", "Dzieci", "Inne". */
  title: string;
  rows: PriceRow[];
  order: number;
}

export interface PriceRow {
  slug: Slug;
  /** e.g. "Taniec towarzyski — nabór". */
  name: string;
  /**
   * Cadence, split out of the name, e.g. "1× 45 min w tygodniu".
   * The source data bundles this into the name string; the approved design
   * sets it as a separate <small>.
   */
  cadence?: string;
  /**
   * Whole złoty. Numeric rather than a display string so Payload can validate
   * it and so prices stay sortable.
   *
   * Note: the facts strip's "już od 140 zł" is NOT derived from these rows.
   * The cheapest row is Akrobatyka at 120 zł, which is a twice-monthly add-on
   * rather than a monthly pass, so a naive min() would both contradict the
   * approved copy and misrepresent the offer. Separating passes from add-ons
   * would mean inventing a taxonomy the client has not confirmed, so the
   * facts value stays authored copy. See Fact.
   */
  price: number;
  /** ISO 4217. "PLN" throughout. */
  currency: string;
}

/* ========================================================================
   Instructors (#about-us)
   ======================================================================== */

export interface Instructor {
  slug: Slug;
  name: string;
  /** Specialism line, e.g. "Taniec współczesny · Power Dance". */
  role: string;
  /** Short bio, ~2 sentences, per the approved card. */
  bio: string;
  photo: ImageRef;
  order: number;
}

/** The founders' statement above the crew grid. */
export interface FoundersIntro {
  /** Set in the display face at a larger size. */
  statement: string;
  body: string;
}

/* ========================================================================
   Programs (/programs, and its teaser band on the home page)
   ======================================================================== */

export interface Program {
  slug: Slug;
  title: string;
  /** Funding programme, e.g. "NOWEFIO 2021–2030". */
  programme: string;
  summary: string;
  /** Body paragraphs. */
  body: string[];
  posters: ImageRef[];
  sessions: ProgramSession[];
  /** Where the sessions happen — prose, since it differs per programme. */
  venue: string;
  order: number;
}

export interface ProgramSession {
  slug: Slug;
  /** e.g. "27–29.08.2025 — środa–piątek". */
  dates: string;
  rows: ProgramSessionRow[];
}

export interface ProgramSessionRow {
  /** 24h "HH:MM". */
  start: string;
  end?: string;
  /** e.g. "Dla dzieci w wieku przedszkolnym — Mix taneczny". */
  name: string;
}

/**
 * Page-level copy for /programs.
 *
 * The route needs its own <h1> and standfirst: it is a separate document, not
 * a section of the home page, so it cannot borrow the teaser's heading
 * without leaving the page with no top-level heading of its own (§10).
 */
export interface ProgramsPageCopy {
  eyebrow: string;
  title: string;
  intro: string;
  /** Link back into the main offer, so the route is not a dead end. */
  backLink: LinkRef;
  /** Heading above a programme's session table. */
  sessionsHeading: string;
  /** Heading above a programme's venue note. */
  venueHeading: string;
}

/** The home-page band linking to /programs. */
export interface ProgramsTeaser {
  eyebrow: string;
  title: string;
  body: string;
  cta: LinkRef;
  /** Each poster links to /programs and carries its own aria-label. */
  posters: TeaserPoster[];
}

export interface TeaserPoster {
  image: ImageRef;
  href: string;
  ariaLabel: string;
}

/* ========================================================================
   Page copy
   ======================================================================== */

/** The five anchored home sections. IA structure, so a closed union (§2). */
export type SectionId =
  "offer" | "schedule" | "pricelist" | "about-us" | "contact";

/** The numbered heading block that opens each section. */
export interface SectionIntro {
  id: SectionId;
  /** "01", "02", … Stored rather than derived, so reordering is a content edit. */
  number: string;
  /** e.g. "Oferta" — also the nav label. */
  eyebrow: string;
  /** e.g. "Wybierz swoje zajęcia". */
  title: string;
  /** Optional standfirst. */
  intro?: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** Anchors participate in scroll-spy; /programs does not (§2). */
  scrollSpy: boolean;
}

/** Document-level copy. Search results and share cards are user-visible. */
export interface SiteMeta {
  title: string;
  description: string;
}

export interface HeaderCopy {
  skipLink: string;
  logoAriaLabel: string;
  navAriaLabel: string;
  /** Phone CTA in the header bar. */
  cta: LinkRef;
  menuButton: MenuButtonCopy;
  themeToggle: ThemeToggleCopy;
}

export interface MenuButtonCopy {
  /** Visible next to the burger. */
  label: string;
  openAriaLabel: string;
  closeAriaLabel: string;
  panelAriaLabel: string;
}

/**
 * The toggle shows the icon and word of the mode it will switch TO (§6.1),
 * so both states are authored.
 */
export interface ThemeToggleCopy {
  /** Shown while dark is active: "Jasny" / "Włącz tryb jasny". */
  toLight: { label: string; ariaLabel: string };
  /** Shown while light is active: "Ciemny" / "Włącz tryb ciemny". */
  toDark: { label: string; ariaLabel: string };
}

export interface HeroCopy {
  eyebrow: string;
  /** Three masked lines, each revealed on its own stagger step (§7.3). */
  headline: TextRun[][];
  lead: string;
  /** Primary then secondary. */
  actions: LinkRef[];
  /** The three short facts under the buttons. */
  meta: string[];
  video: VideoRef;
  /** Caption on the video frame, e.g. "Scena 2025". */
  badge: string;
}

/**
 * One cell of the facts strip under the marquee.
 *
 * `value` is authored, not derived — including "już od 140 zł". See the note
 * on PriceRow.price for why computing it from the pricelist would be wrong.
 */
export interface Fact {
  term: string;
  value: string;
  order: number;
}

/**
 * Labels for the interactive controls. Separated from section copy because
 * these are UI chrome that Payload will likely expose as a single globals
 * document rather than per-section fields.
 */
export interface UiCopy {
  /** role="group" aria-label per section carrying a location toggle. */
  locationToggle: {
    scheduleAriaLabel: string;
    pricelistAriaLabel: string;
    contactAriaLabel: string;
  };
  scheduleFilter: {
    /** Visible "Pokaż", also the radiogroup's accessible name. */
    legend: string;
    /** The reset chip, "Wszystkie". */
    allLabel: string;
  };
  /** Footnote under the schedule explaining nabór and gr. sportowa. */
  scheduleNote: TextRun[];
}

export interface ContactCopy {
  /** Phone, email, Instagram, Facebook — each with its own visible text (§10). */
  links: LinkRef[];
}

export interface FooterCopy {
  navAriaLabel: string;
  nav: NavItem[];
  logoAriaLabel: string;
  /** Copyright and registered address. The prototype's "Prototyp…" line is dropped (§11.8). */
  legal: string;
}

/** Decorative style-name ticker, aria-hidden (§10). */
export type MarqueeItems = string[];
