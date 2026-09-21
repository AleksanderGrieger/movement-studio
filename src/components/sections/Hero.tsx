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
 * frame after hydration.
 *
 * Each masked line repeats --display-overshoot, because the mask is exactly
 * the overflow:hidden container that would otherwise clip Meringue's accented
 * capitals (§5.4).
 */
export async function Hero() {
  const hero = await getHeroCopy();

  return (
    <section className="hero section" aria-labelledby="hero-title">
      <div className="wrap grid">
        <div className="copy">
          <p className="eyebrow r" style={{ "--i": 0 } as React.CSSProperties}>
            {hero.eyebrow}
          </p>

          <h1 className="display" id="hero-title">
            {hero.headline.map((line, lineIndex) => (
              <span
                key={lineIndex}
                className="line"
                style={{ "--i": lineIndex + 1 } as React.CSSProperties}
              >
                <span>
                  {line.map((run, runIndex) =>
                    run.emphasis ? (
                      <em key={runIndex}>{run.text}</em>
                    ) : (
                      <span key={runIndex}>{run.text}</span>
                    ),
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p className="lead r" style={{ "--i": 4 } as React.CSSProperties}>
            {hero.lead}
          </p>

          <div
            className="actions r"
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

          <p className="meta r" style={{ "--i": 6 } as React.CSSProperties}>
            {hero.meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </p>
        </div>

        <HeroMedia video={hero.video} badge={hero.badge} />
      </div>
    </section>
  );
}
