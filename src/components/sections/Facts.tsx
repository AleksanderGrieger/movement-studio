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
    <div className="wrap">
      <dl className="facts">
        {facts.map((fact, index) => (
          <div
            key={fact.term}
            className="fact r"
            style={{ "--i": index } as React.CSSProperties}
          >
            <dt>{fact.term}</dt>
            <dd className="display num">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
