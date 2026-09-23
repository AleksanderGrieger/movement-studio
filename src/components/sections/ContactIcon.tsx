/**
 * The channel mark beside a contact link.
 *
 * Purely decorative, and deliberately so: every link in #contact already
 * carries its own visible text, and §10 requires that nothing depend on an
 * icon alone. So these are aria-hidden and carry no title — they are a
 * scanning aid, not the label. `.contact-links a` was already laid out as an
 * inline-flex row with a gap for exactly this slot; until now nothing filled
 * it.
 *
 * Which mark to draw is derived from the href rather than stored in the
 * content layer. The scheme and host are what actually identify the channel,
 * they are already in the data, and deriving keeps types.ts rule 1 intact —
 * no presentation in the data. An editor adding a TikTok link in Payload gets
 * the neutral fallback instead of a broken reference.
 *
 * Geometry matches the theme toggle's icons (24-unit box, 1.7 stroke, round
 * caps and joins) so the two sets read as one family. Two of the marks —
 * the handset and the Facebook f — are glyph shapes rather than line
 * drawings, and stroking their outline renders them noticeably lighter than
 * the envelope and the Instagram frame beside them, so those two are filled
 * instead. data-channel stays on the element as a debugging handle; the
 * choice itself is made here.
 *
 * `large` is for the one link set in the display face, where 1.1em would
 * tower over the others. It is held to the body scale so the four marks line
 * up as a set.
 */

type Channel = "phone" | "mail" | "instagram" | "facebook" | "link";

/** Reads the channel out of the href. Unknown destinations get "link". */
function channelOf(href: string): Channel {
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "mail";

  let host = "";
  try {
    host = new URL(href).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    // Relative or malformed: not a social destination, so the fallback is right.
    return "link";
  }

  if (host === "instagram.com" || host.endsWith(".instagram.com")) {
    return "instagram";
  }
  if (
    host === "facebook.com" ||
    host.endsWith(".facebook.com") ||
    host === "fb.com"
  ) {
    return "facebook";
  }
  return "link";
}

const PATHS: Record<Channel, React.ReactNode> = {
  phone: (
    <path d="M6.3 3.4h3l1.5 3.8-1.9 1.4a11.4 11.4 0 0 0 5.1 5.1l1.4-1.9 3.8 1.5v3a1.7 1.7 0 0 1-1.9 1.7A14.9 14.9 0 0 1 4.6 5.3 1.7 1.7 0 0 1 6.3 3.4z" />
  ),
  mail: (
    <>
      <rect x="2.9" y="5.2" width="18.2" height="13.6" rx="2.2" />
      <path d="m3.6 6.6 8.4 6 8.4-6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.6 21.3v-8h2.7l.5-3.2h-3.2V8a1.6 1.6 0 0 1 1.8-1.7h1.5V3.5a17.9 17.9 0 0 0-2.5-.2c-2.6 0-4.3 1.6-4.3 4.4v2.4H8.2v3.2h2.9v8z" />
  ),
  link: (
    <>
      <path d="M10.1 13.9a3.6 3.6 0 0 0 5.1 0l2.9-2.9a3.6 3.6 0 0 0-5.1-5.1l-1.1 1.1" />
      <path d="M13.9 10.1a3.6 3.6 0 0 0-5.1 0l-2.9 2.9a3.6 3.6 0 0 0 5.1 5.1l1.1-1.1" />
    </>
  ),
};

/* The theme toggle's spin, unchanged — these are icons at the same size, so
   the angle carries over as-is. The link's own nudge is on the <a>; this
   rides on the mark inside it. Colour and rotation take different curves,
   so the transition is written out rather than assembled from a pair. */
const ICON = [
  "flex-none text-accent-text",
  "[transition:color_var(--dur-hover)_var(--ease-swing),rotate_var(--dur-ui)_var(--ease-weight)]",
  "group-hover:text-current group-hover:-rotate-[18deg]",
  "group-focus-visible:text-current group-focus-visible:-rotate-[18deg]",
].join(" ");

export function ContactIcon({
  href,
  large = false,
}: {
  href: string;
  large?: boolean;
}) {
  const channel = channelOf(href);
  const isGlyph = channel === "phone" || channel === "facebook";

  return (
    <svg
      className={`${ICON} ${large ? "size-[1.4rem]" : "size-[1.1em]"} ${
        isGlyph ? "fill-current stroke-none" : "fill-none stroke-current"
      }`}
      data-channel={channel}
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {PATHS[channel]}
    </svg>
  );
}
