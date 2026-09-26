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
/* Built from the schedule row's vocabulary rather than a new one: hairline
   rules, a left edge that takes the accent, and the same hover response. A
   reader who has already used the grid recognises the shape. */
const ITEM = [
  "border-b border-b-border border-l-[3px] border-l-transparent",
  "transition-[background-color,border-left-color] duration-(--dur-hover) ease-(--ease-swing)",
  "hover:border-l-accent focus-within:border-l-accent",
  "open:border-l-accent open:bg-accent-soft",
].join(" ");

/* min-height rather than padding alone, so the row clears §10's 44px even
   when a question fits on one line. Safari draws its own disclosure triangle
   through a pseudo-element that `list-style: none` alone does not remove. */
const SUMMARY = [
  "flex min-h-(--tap-target) cursor-pointer list-none items-baseline",
  "justify-between gap-(--sp-4) p-(--sp-3) md:px-(--sp-4)",
  "[&::-webkit-details-marker]:hidden",
].join(" ");

/* The mark is drawn, not typed: a glyph would inherit the body face's metrics
   and sit off the question's baseline at every step. Two rules that cross,
   with the vertical one folding away when the panel opens. */
const MARK = [
  "relative size-[0.85em] flex-none self-center text-accent-text",
  'before:absolute before:inset-x-0 before:top-1/2 before:h-[2px] before:content-[""]',
  "before:-translate-y-1/2 before:rounded-[2px] before:bg-current",
  'after:absolute after:inset-x-0 after:top-1/2 after:h-[2px] after:content-[""]',
  "after:-translate-y-1/2 after:rotate-90 after:rounded-[2px] after:bg-current",
  "after:transition-[rotate] after:duration-(--dur-ui) after:ease-(--ease-swing)",
  "group-open:after:rotate-0",
].join(" ");

export async function Faq() {
  const [section, items] = await Promise.all([
    getSectionIntro("faq"),
    getFaqItems(),
  ]);

  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="mx-auto w-(--wrap)">
        <SectionHead section={section} />

        <div className="max-w-[58rem] border-t border-t-border">
          {items.map((item, index) => (
            <details
              key={item.slug}
              className={`faq-item group r ${ITEM}`}
              name="faq"
              open={index === 0}
              style={{ "--i": index } as React.CSSProperties}
            >
              <summary className={SUMMARY}>
                <span className="text-(length:--s1) font-(--weight-strong)">
                  {item.question}
                </span>
                <span className={MARK} aria-hidden />
              </summary>
              {/* Align the answer under the question rather than under the row
                  edge, from 768 up. */}
              <div className="faq-a grid gap-(--sp-3) px-(--sp-3) pt-0 pb-(--sp-4) md:px-(--sp-4) md:pb-(--sp-5)">
                {item.answer.map((paragraph) => (
                  <p className="max-w-(--measure) text-text-muted" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
                {item.link ? (
                  <p>
                    <a
                      className="text-(length:--s-1) font-(--weight-strong) tracking-[0.12em] text-accent-text uppercase [text-underline-offset:0.35em]"
                      href={item.link.href}
                    >
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
