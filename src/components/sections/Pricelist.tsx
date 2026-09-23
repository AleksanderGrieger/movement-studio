import { getLocations } from "@/lib/content/locations";
import { getPriceBlocksByLocation } from "@/lib/content/pricing";
import { getSectionIntro, getUiCopy } from "@/lib/content/site";
import { LocationPanel } from "../home/LocationPanel";
import { LocationToggle } from "../home/LocationToggle";
import { SectionHead } from "./SectionHead";

/**
 * #pricelist. Prices are stored as numbers and formatted here with Intl, so
 * the data stays sortable and locale formatting is not baked into content.
 */
export async function Pricelist() {
  const [section, ui, locations] = await Promise.all([
    getSectionIntro("pricelist"),
    getUiCopy(),
    getLocations(),
  ]);

  const blocksByLocation = await Promise.all(
    locations.map(async (location) => ({
      location,
      blocks: await getPriceBlocksByLocation(location.slug),
    })),
  );

  const money = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  });

  return (
    <section className="section" aria-labelledby="pricelist-title">
      <div className="mx-auto w-(--wrap)">
        <SectionHead section={section} />

        <LocationToggle
          locations={locations}
          ariaLabel={ui.locationToggle.pricelistAriaLabel}
        />

        {blocksByLocation.map(({ location, blocks }) => (
          <LocationPanel key={location.slug} location={location.slug}>
            {blocks.map((block, blockIndex) => (
              <div
                className={`r ${blockIndex > 0 ? "mt-(--sp-7)" : ""}`}
                key={block.slug}
              >
                <h3 className="mb-(--sp-3) text-(length:--s-1) tracking-[0.16em] text-text-muted uppercase">
                  {block.title}
                </h3>
                {block.rows.map((row) => (
                  <div
                    className="flex items-baseline gap-(--sp-3) border-b border-b-border py-(--sp-3)"
                    key={row.slug}
                  >
                    <span className="flex-[0_1_auto]">
                      {row.name}
                      {row.cadence ? (
                        <small className="block text-(length:--s-2) text-text-muted">
                          {row.cadence}
                        </small>
                      ) : null}
                    </span>
                    {/* The leader rides up a quarter em so it sits on the
                        baseline rather than under it. */}
                    <span
                      className="min-w-(--sp-5) flex-[1_1_auto] -translate-y-[0.25em] border-b border-dotted border-b-border-strong"
                      aria-hidden
                    />
                    {/* The display face, but without display-flat's leading: this span is a
                        baseline-aligned flex item and the tighter line-height
                        would change the row's height. */}
                    <span className="font-display font-(--weight-display) [font-variation-settings:var(--display-variation)] text-[calc(var(--s1)*var(--size-adjust-display))] text-secondary-text whitespace-nowrap tabular-nums">
                      {money.format(row.price)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </LocationPanel>
        ))}
      </div>
    </section>
  );
}
