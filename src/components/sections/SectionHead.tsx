import type { SectionIntro } from "@/lib/content/types";

/**
 * The numbered heading block that opens each anchored section.
 *
 * The <h2> carries the id that its <section> points at with aria-labelledby,
 * so every section has an accessible name (§10) and scroll-spy has something
 * to observe.
 *
 * The nav-anchor id lives here rather than on the outer <section>: a nav jump
 * lands at this element's top edge, and landing here — instead of on the
 * section's own top edge, above its --section-y padding — puts the title
 * right under the header instead of a padding's-worth of empty space below
 * it. SiteNav's scroll-spy still watches the full <section> for its
 * mid-viewport band, walking up from this same id (see SiteNav.tsx).
 */
export function SectionHead({ section }: { section: SectionIntro }) {
  return (
    <div className="section-head r" id={section.id}>
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
