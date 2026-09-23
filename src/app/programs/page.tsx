import type { Metadata } from "next";
import Image from "next/image";
import { getPrograms, getProgramsPageCopy } from "@/lib/content/programs";
import {
  DAY,
  DAYS,
  DAY_HEAD,
  ROW,
  SESSION_COLUMNS,
  TIME,
  WHAT,
} from "@/src/components/dayGrid";

/* A head that is the whole section has nothing beneath it to space away
   from, so unlike SectionHead it drops the trailing margin. */
const SUBHEAD =
  "text-(length:--s-1) tracking-[0.16em] text-text-muted uppercase";

/* Search results and share cards are user-visible copy, so they come from the
   content layer like every other string — same as the root layout does for
   the home page. */
export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getProgramsPageCopy();
  return {
    title: meta.title,
    description: meta.description,
  };
}

/**
 * /programs.
 *
 * design-decisions.md §11.6 records that this route was linked from the
 * header, footer and teaser band but never designed. So unlike the home
 * sections there is no prototype to port, and the layout below is a new
 * decision — made by reusing the vocabulary the home page already
 * established rather than inventing a second one:
 *
 *   - the numbered section-head pattern, minus the number: these are two
 *     programmes, not steps in an information architecture
 *   - .posters, exactly as the home teaser uses it
 *   - the schedule's day-column grid for session times, so a reader who has
 *     already seen #schedule recognises the shape immediately. The only
 *     change is a wider time column, since these rows print a range
 *     ("09:30 – 12:00") where the weekly grid prints a start time
 *
 * Two things the section asks for that are deliberately absent:
 *
 *   - §11.6 mentions a sponsor-logo strip. No sponsor marks were supplied, so
 *     there is nothing to render; the funding attribution is carried in the
 *     body copy, which is what the grant conditions actually require.
 *   - The route takes no part in scroll-spy and carries no anchor (§2).
 *
 * Fully static — no interactivity, so no client components.
 */
export default async function Programs() {
  const [copy, programs] = await Promise.all([
    getProgramsPageCopy(),
    getPrograms(),
  ]);

  return (
    <>
      <section className="section" aria-labelledby="programs-page-title">
        <div className="mx-auto w-(--wrap)">
          <div className="r grid gap-(--sp-3)">
            <p className="eyebrow">{copy.eyebrow}</p>
            <div className="flex items-baseline gap-(--sp-3)">
              {/* No step override: unlike SectionHead's <h2> this standfirst
                  sits at .display's own default. */}
              <h1 className="display" id="programs-page-title">
                {copy.title}
              </h1>
              <span className="h-px flex-1 bg-border" aria-hidden />
            </div>
            <p className="max-w-(--measure) text-text-muted">{copy.intro}</p>
          </div>
        </div>
      </section>

      {programs.map((program) => (
        <section
          className="section"
          key={program.slug}
          aria-labelledby={`program-${program.slug}`}
        >
          <div className="mx-auto w-(--wrap)">
            {/* This head lays the pair out with a grid gap, which already
                absorbs the overshoot's negative margin — so unlike the hero it
                adds no step of its own, which would double it. */}
            <div className="r mb-(--sp-6) grid gap-(--sp-3)">
              <p className="eyebrow">{program.programme}</p>
              <h2
                className="display [--display-step:var(--s3)] md:[--display-step:var(--s4)]"
                id={`program-${program.slug}`}
              >
                {program.title}
              </h2>
              <p className="max-w-(--measure) text-(length:--s1) text-text-muted">{program.summary}</p>
            </div>

            {/* Copy against posters, echoing the home teaser's 1fr auto split. */}
            <div className="grid gap-(--sp-6) mb-(--sp-7) lg:grid-cols-[1fr_auto] lg:items-start lg:gap-(--sp-8)">
              <div className="r grid gap-(--sp-4)">
                {program.body.map((paragraph) => (
                  <p className="max-w-(--measure) text-text-muted" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
                <h3 className={`${SUBHEAD} mt-(--sp-3)`}>{copy.venueHeading}</h3>
                <p className="max-w-(--measure) text-text-muted">{program.venue}</p>
              </div>

              <div
                className="flex gap-(--sp-3) r"
                style={{ "--i": 1 } as React.CSSProperties}
              >
                {program.posters.map((poster) => (
                  <Image
                    key={poster.src}
                    src={poster.src}
                    width={poster.width}
                    height={poster.height}
                    alt={poster.alt}
                    sizes="(min-width: 768px) 19rem, 42vw"
                    loading="lazy"
                    className="h-auto w-[min(42vw,16rem)] border border-border md:w-[min(34vw,19rem)]"
                  />
                ))}
              </div>
            </div>

            <h3 className={`${SUBHEAD} mb-(--sp-3)`}>{copy.sessionsHeading}</h3>
            <ul className={`${DAYS} lg:grid-cols-[repeat(2,1fr)]`}>
              {program.sessions.map((session, index) => (
                <li
                  className={`${DAY} r`}
                  key={session.slug}
                  style={{ "--i": index } as React.CSSProperties}
                >
                  <h4 className={`${DAY_HEAD} [--display-step:var(--s1)]`}>
                    {session.dates}
                  </h4>
                  <ul>
                    {session.rows.map((row) => (
                      <li
                        className={`${ROW} ${SESSION_COLUMNS}`}
                        key={`${row.start}-${row.name}`}
                      >
                        <time
                          className={`${TIME} whitespace-nowrap`}
                          dateTime={row.start}
                        >
                          {row.end ? `${row.start} – ${row.end}` : row.start}
                        </time>
                        <span className={WHAT}>{row.name}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="mx-auto w-(--wrap)">
          <a className="btn btn-ghost" href={copy.backLink.href}>
            {copy.backLink.label}
          </a>
        </div>
      </section>
    </>
  );
}
