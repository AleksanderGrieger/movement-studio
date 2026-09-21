import type { SectionIntro } from "@/lib/content/types";

/**
 * The numbered heading block that opens each anchored section.
 *
 * The <h2> carries the id that its <section> points at with aria-labelledby,
 * so every section has an accessible name (§10) and scroll-spy has something
 * to observe.
 */
export function SectionHead({ section }: { section: SectionIntro }) {
  return (
    <div className="section-head r">
      <p className="eyebrow num">
        {section.number} — {section.eyebrow}
      </p>
      <div className="row">
        <h2 className="display" id={`${section.id}-title`}>
          {section.title}
        </h2>
        <span className="rule" aria-hidden />
      </div>
      {section.intro ? <p className="prose">{section.intro}</p> : null}
    </div>
  );
}
