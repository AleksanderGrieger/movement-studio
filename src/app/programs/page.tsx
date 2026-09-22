import type { Metadata } from "next";
import Image from "next/image";
import { getPrograms, getProgramsPageCopy } from "@/lib/content/programs";

export const metadata: Metadata = {
  title: "Programy | Movement Studio",
  description:
    "Nieodpłatne warsztaty taneczno-sportowe Movement Studio realizowane ze środków programów NOWEFIO i Społecznik na 5!",
};

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
        <div className="wrap">
          <div className="section-head section-head--solo r">
            <p className="eyebrow">{copy.eyebrow}</p>
            <div className="row">
              <h1 className="display" id="programs-page-title">
                {copy.title}
              </h1>
              <span className="rule" aria-hidden />
            </div>
            <p className="prose">{copy.intro}</p>
          </div>
        </div>
      </section>

      {programs.map((program) => (
        <section
          className="section program"
          key={program.slug}
          aria-labelledby={`program-${program.slug}`}
        >
          <div className="wrap">
            <div className="program-head r">
              <p className="eyebrow">{program.programme}</p>
              <h2 className="display" id={`program-${program.slug}`}>
                {program.title}
              </h2>
              <p className="lead">{program.summary}</p>
            </div>

            <div className="program-body">
              <div className="program-copy r">
                {program.body.map((paragraph) => (
                  <p className="prose" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
                <h3 className="program-subhead">{copy.venueHeading}</h3>
                <p className="prose">{program.venue}</p>
              </div>

              <div
                className="posters r"
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
                  />
                ))}
              </div>
            </div>

            <h3 className="program-subhead">{copy.sessionsHeading}</h3>
            <ul className="days sessions">
              {program.sessions.map((session, index) => (
                <li
                  className="day r"
                  key={session.slug}
                  style={{ "--i": index } as React.CSSProperties}
                >
                  <h4>{session.dates}</h4>
                  <ul>
                    {session.rows.map((row) => (
                      <li key={`${row.start}-${row.name}`}>
                        <time dateTime={row.start}>
                          {row.end ? `${row.start} – ${row.end}` : row.start}
                        </time>
                        <span className="what">{row.name}</span>
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
        <div className="wrap">
          <a className="btn btn-ghost" href={copy.backLink.href}>
            {copy.backLink.label}
          </a>
        </div>
      </section>
    </>
  );
}
