import Image from "next/image";
import { getProgramsTeaser } from "@/lib/content/programs";

/**
 * The band linking to /programs.
 *
 * Sits between about and contact: a separate route that proves the system
 * extends and catches grant traffic without competing with the paid offer
 * (§2). It carries no anchor and takes no part in scroll-spy.
 */
export async function ProgramsTeaser() {
  const teaser = await getProgramsTeaser();

  return (
    <section
      className="border-y border-y-border bg-surface-2"
      aria-labelledby="programs-title"
    >
      <div className="mx-auto grid w-(--wrap) gap-(--sp-6) py-(--section-y) lg:grid-cols-[1fr_auto] lg:items-center lg:gap-(--sp-8)">
        <div className="r">
          <p className="eyebrow">{teaser.eyebrow}</p>
          <h2
            className="display mt-[calc(var(--sp-3)-var(--display-overshoot))] mb-(--sp-4) [--display-step:var(--s4)]"
            id="programs-title"
          >
            {teaser.title}
          </h2>
          <p className="max-w-(--measure) text-text-muted">{teaser.body}</p>
          <p className="mt-(--sp-5)">
            <a className="btn btn-ghost" href={teaser.cta.href}>
              {teaser.cta.label}
            </a>
          </p>
        </div>
        <div
          className="flex gap-(--sp-3) r"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {teaser.posters.map((poster) => (
            <a
              key={poster.image.src}
              href={poster.href}
              aria-label={poster.ariaLabel}
              className="group"
            >
              <Image
                src={poster.image.src}
                width={poster.image.width}
                height={poster.image.height}
                alt={poster.image.alt}
                sizes="(min-width: 1280px) 10.5rem, 20vw"
                loading="lazy"
                className="h-auto w-[clamp(5.5rem,20vw,10.5rem)] border border-border transition-[translate,rotate] duration-(--dur-ui) ease-(--ease-weight) group-hover:-translate-y-[6px] group-hover:-rotate-1 group-focus-visible:-translate-y-[6px] group-focus-visible:-rotate-1"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
