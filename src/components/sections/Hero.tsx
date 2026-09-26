import { getHeroCopy } from "@/lib/content/site";
import { HeroMedia } from "../home/HeroMedia";

/**
 * Hero. Server Component apart from the media frame, which owns the lazy
 * video and the scroll parallax.
 *
 * The headline is the LCP element and it is text, so it paints without
 * waiting on anything (§12). Its three lines each sit in an overflow-hidden
 * mask and slide up on their own stagger step; `--i` drives the delay, and
 * the `is-ready` class that starts them is set by HeroMedia on the first
 * frame after hydration. That reveal is the one piece of the hero still
 * written as CSS — it animates `transform` rather than Tailwind's `translate`
 * because scripts/check-interactions.mts asserts on the computed transform to
 * prove the reduced-motion path works, and a translate-based reveal would
 * make that assertion pass without testing anything.
 *
 * Each masked line repeats --display-overshoot, because the mask is exactly
 * the overflow:hidden container that would otherwise clip Meringue's accented
 * capitals (§5.4).
 *
 * The headline is ratio-driven but capped against the viewport, so it cannot
 * overflow its column at any width (§5.3).
 */
export async function Hero() {
  const hero = await getHeroCopy();

  return (
    <section
      className="hero section pt-(--sp-6) pb-(--section-y) overflow-clip"
      aria-labelledby="hero-title"
    >
      {/* 12-col at 1280: copy 1/7, media 8/12 — the asymmetric split from §9. */}
      <div className="mx-auto grid w-(--wrap) items-end gap-(--sp-6) lg:grid-cols-[repeat(12,1fr)] lg:items-center">
        <div className="lg:col-[1/span_7]">
          <p className="eyebrow r" style={{ "--i": 0 } as React.CSSProperties}>
            {hero.eyebrow}
          </p>

          <h1
            className="display mt-[calc(var(--sp-3)-var(--display-overshoot))] mb-(--sp-5) [--display-step:min(var(--s6),11.5vw)] md:[--display-step:min(var(--s7),8vw)] lg:[--display-step:min(var(--s7),5.6vw)]"
            id="hero-title"
          >
            {hero.headline.map((line, lineIndex) => (
              <span
                key={lineIndex}
                className="line"
                style={{ "--i": lineIndex + 1 } as React.CSSProperties}
              >
                <span>
                  {line.map((run, runIndex) =>
                    run.emphasis ? (
                      <em
                        key={runIndex}
                        className="text-accent-text not-italic"
                      >
                        {run.text}
                      </em>
                    ) : (
                      <span key={runIndex}>{run.text}</span>
                    ),
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="r max-w-(--measure) text-(length:--s1) text-text-muted"
            style={{ "--i": 4 } as React.CSSProperties}
          >
            {hero.lead}
          </p>

          <div
            className="r mt-(--sp-6) flex flex-wrap gap-(--sp-3)"
            style={{ "--i": 5 } as React.CSSProperties}
          >
            {hero.actions.map((action, index) => (
              <a
                key={action.href}
                className={`btn ${index === 0 ? "btn-primary" : "btn-ghost"}`}
                href={action.href}
              >
                {action.label}
              </a>
            ))}
          </div>

          <p
            className="r mt-(--sp-6) flex flex-wrap gap-x-(--sp-4) gap-y-(--sp-2) text-(length:--s-1) text-text-muted"
            style={{ "--i": 6 } as React.CSSProperties}
          >
            {hero.meta.map((item) => (
              <span
                key={item}
                className='inline-flex items-center gap-(--sp-2) before:size-[6px] before:rounded-[50%] before:bg-secondary before:content-[""]'
              >
                {item}
              </span>
            ))}
          </p>
        </div>

        <HeroMedia video={hero.video} badge={hero.badge} />
      </div>
    </section>
  );
}
