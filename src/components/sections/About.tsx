import Image from "next/image";
import { getFoundersIntro, getInstructors } from "@/lib/content/instructors";
import { getSectionIntro } from "@/lib/content/site";
import { SectionHead } from "./SectionHead";

/**
 * #about-us — founders' statement plus the crew.
 *
 * Credibility sits after logistics: for a local studio the decision order is
 * what -> when -> how much -> who, and bios convert a "probably" rather than
 * creating one (§2).
 *
 * The crew grid holds any number of cards. The approved design showed four;
 * the studio currently has five and that changes — see the note on the grid's
 * bottom padding for how the stagger is kept safe at any count.
 */
export async function About() {
  const [section, founders, instructors] = await Promise.all([
    getSectionIntro("about-us"),
    getFoundersIntro(),
    getInstructors(),
  ]);

  return (
    <section className="section" aria-labelledby="about-us-title">
      <div className="mx-auto w-(--wrap)">
        <SectionHead section={section} />

        <div className="r mb-(--sp-8) grid gap-(--sp-5) lg:grid-cols-[1fr_1fr] lg:gap-(--sp-7)">
          {/* A paragraph of display type, not a two-line headline: denser, and
              carrying a diacritic on nearly every line, so it wants more air
              than the token gives. The bump is additive rather than a
              multiplier — a multiplier compounds every time the base moves,
              and when --leading-display went to 1.34 it landed this block at
              1.61. */}
          <p className="display [--display-step:var(--s3)] leading-[calc(var(--leading-display)+0.12)] text-text">
            {founders.statement}
          </p>
          <p className="max-w-(--measure) text-text-muted">{founders.body}</p>
        </div>

        {/* The stagger translates even cards down by --sp-7. Without matching
            padding the lowest card overhangs the section boundary, which shows
            up as soon as the crew is not an exact multiple of four. Reserving
            the space here keeps the grid correct at any count from 1 to 10. */}
        <ul className="grid gap-(--sp-6) md:grid-cols-[repeat(2,1fr)] md:gap-(--sp-7) lg:grid-cols-[repeat(4,1fr)] lg:gap-(--sp-5) lg:pb-(--sp-7)">
          {instructors.map((instructor, index) => (
            <li
              key={instructor.slug}
              className="group r"
              style={{ "--i": index % 4 } as React.CSSProperties}
            >
              <figure
                className={`m-0 ${index % 2 === 1 ? "lg:translate-y-(--sp-7)" : ""}`}
              >
                <div className="aspect-square overflow-hidden border border-border bg-[#1e1e1c]">
                  <Image
                    src={instructor.photo.src}
                    width={instructor.photo.width}
                    height={instructor.photo.height}
                    alt={instructor.photo.alt}
                    sizes="(min-width: 1280px) 22vw, (min-width: 768px) 46vw, 92vw"
                    loading="lazy"
                    className="h-full w-full object-cover transition-[scale] duration-(--dur-ui) ease-(--ease-momentum) group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
                  />
                </div>
                <figcaption>
                  <h3 className="display mt-(--sp-4) [--display-step:var(--s2)]">
                    {instructor.name}
                  </h3>
                  <p className="mt-(--sp-2) text-(length:--s-2) tracking-[0.14em] text-accent-text uppercase">
                    {instructor.role}
                  </p>
                  <p className="mt-(--sp-3) text-(length:--s-1) text-text-muted">
                    {instructor.bio}
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
