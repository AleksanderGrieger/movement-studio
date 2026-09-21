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
 * the studio currently has five and that changes. See .crew in globals.css
 * for how the stagger is kept safe at any count.
 */
export async function About() {
  const [section, founders, instructors] = await Promise.all([
    getSectionIntro("about-us"),
    getFoundersIntro(),
    getInstructors(),
  ]);

  return (
    <section className="section" id="about-us" aria-labelledby="about-us-title">
      <div className="wrap">
        <SectionHead section={section} />

        <div className="founders r">
          <p className="display big">{founders.statement}</p>
          <p className="prose">{founders.body}</p>
        </div>

        <ul className="crew">
          {instructors.map((instructor, index) => (
            <li
              key={instructor.slug}
              className="r"
              style={{ "--i": index % 4 } as React.CSSProperties}
            >
              <figure>
                <div className="shot">
                  <Image
                    src={instructor.photo.src}
                    width={instructor.photo.width}
                    height={instructor.photo.height}
                    alt={instructor.photo.alt}
                    sizes="(min-width: 1280px) 22vw, (min-width: 768px) 46vw, 92vw"
                    loading="lazy"
                  />
                </div>
                <figcaption>
                  <h3 className="display">{instructor.name}</h3>
                  <p className="role">{instructor.role}</p>
                  <p>{instructor.bio}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
