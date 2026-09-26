import { getFacts } from "@/lib/content/site";

/**
 * The three-fact strip under the marquee: how much, where, who.
 *
 * It answers the practical questions above the first section, which is what
 * lets the hero's primary CTA be "Sprawdź grafik" rather than a phone number
 * (§2).
 */
export async function Facts() {
  const facts = await getFacts();

  return (
    <div className="mx-auto w-(--wrap)">
      <dl className="grid gap-(--sp-5) py-(--sp-7) md:grid-cols-[repeat(3,1fr)] md:gap-(--sp-6)">
        {facts.map((fact, index) => (
          <div
            key={fact.term}
            className="r"
            style={{ "--i": index } as React.CSSProperties}
          >
            <dt className="mb-(--sp-2) text-(length:--s-1) tracking-[0.14em] text-text-muted uppercase">
              {fact.term}
            </dt>
            <dd className="display m-0 tabular-nums [--display-step:var(--s2)]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
