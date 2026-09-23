import { getMarqueeItems } from "@/lib/content/site";

/**
 * Ambient style-name ticker.
 *
 * aria-hidden: it is a decorative duplicate of the offer list and carries no
 * information a screen reader needs (§10).
 *
 * The track is rendered twice and animates to -50%, which is what makes the
 * loop seamless — the second copy is exactly the first, so the reset is
 * invisible.
 */
export async function Marquee() {
  const items = await getMarqueeItems();

  const run = (
    <span className="display [--display-step:var(--s3)] whitespace-nowrap text-text-muted">
      {items.map((item) => (
        <span key={item}>
          {item} <b className="text-accent-text [font-weight:inherit]">·</b>{" "}
        </span>
      ))}
    </span>
  );

  return (
    <div
      className="marquee overflow-hidden border-y border-y-border bg-surface-2 py-(--sp-4)"
      aria-hidden
    >
      <div className="track flex w-max gap-(--sp-6) animate-[slide_38s_linear_infinite] motion-reduce:animate-none">
        {run}
        {run}
      </div>
    </div>
  );
}
