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
    <section className="programs" aria-labelledby="programs-title">
      <div className="wrap inner">
        <div className="r">
          <p className="eyebrow">{teaser.eyebrow}</p>
          <h2 className="display" id="programs-title">
            {teaser.title}
          </h2>
          <p className="prose">{teaser.body}</p>
          <p className="programs-cta">
            <a className="btn btn-ghost" href={teaser.cta.href}>
              {teaser.cta.label}
            </a>
          </p>
        </div>
        <div className="posters r" style={{ "--i": 1 } as React.CSSProperties}>
          {teaser.posters.map((poster) => (
            <a
              key={poster.image.src}
              href={poster.href}
              aria-label={poster.ariaLabel}
            >
              <Image
                src={poster.image.src}
                width={poster.image.width}
                height={poster.image.height}
                alt={poster.image.alt}
                sizes="(min-width: 1280px) 10.5rem, 20vw"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
