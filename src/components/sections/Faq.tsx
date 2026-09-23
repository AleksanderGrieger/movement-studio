import { getFaqItems } from "@/lib/content/faq";
import { getSectionIntro } from "@/lib/content/site";
import { SectionHead } from "./SectionHead";

/**
 * #faq — the last doubts, answered before the ask (§2).
 *
 * Sits directly above #contact on purpose: every answer that ends in "call
 * us" is one scroll from the number.
 *
 * No 'use client', and that is the whole point of the markup. An accordion is
 * the textbook reason to reach for state, but <details>/<summary> is already
 * one natively — open, close, keyboard, and the accessible name and expanded
 * state all come free, and it works with JavaScript off, which the rest of
 * the page also does.
 *
 * `name` makes the group mutually exclusive without a line of script. Where a
 * browser does not support it the panels simply open independently, which is
 * a fine way to read a FAQ — so it degrades to a worse-but-correct behaviour
 * rather than a broken one.
 *
 * The first question is open on load so the section never reads as a stack of
 * closed bars, and because its answer is the one most people came for. That
 * is a presentation decision, so it is derived from order here rather than
 * stored as a flag in the content.
 *
 * Answers carry their link after the prose instead of inside it: no HTML in
 * the data (types.ts rule 1), and a destination someone scanning can see.
 */
export async function Faq() {
  const [section, items] = await Promise.all([
    getSectionIntro("faq"),
    getFaqItems(),
  ]);

  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="wrap">
        <SectionHead section={section} />

        <div className="faq">
          {items.map((item, index) => (
            <details
              key={item.slug}
              className="faq-item r"
              name="faq"
              open={index === 0}
              style={{ "--i": index } as React.CSSProperties}
            >
              <summary>
                <span className="faq-q">{item.question}</span>
                <span className="faq-mark" aria-hidden />
              </summary>
              <div className="faq-a">
                {item.answer.map((paragraph) => (
                  <p className="prose" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
                {item.link ? (
                  <p className="faq-link">
                    <a href={item.link.href}>
                      {item.link.label}
                      {item.link.context ? (
                        <span className="sr-only">{item.link.context}</span>
                      ) : null}
                    </a>
                  </p>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
