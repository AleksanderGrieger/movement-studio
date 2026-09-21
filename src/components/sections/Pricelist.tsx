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
    <section
      className="section"
      id="pricelist"
      aria-labelledby="pricelist-title"
    >
      <div className="wrap">
        <SectionHead section={section} />

        <LocationToggle
          locations={locations}
          ariaLabel={ui.locationToggle.pricelistAriaLabel}
        />

        {blocksByLocation.map(({ location, blocks }) => (
          <LocationPanel key={location.slug} location={location.slug}>
            {blocks.map((block) => (
              <div className="price-block r" key={block.slug}>
                <h4>{block.title}</h4>
                {block.rows.map((row) => (
                  <div className="price-row" key={row.slug}>
                    <span className="name">
                      {row.name}
                      {row.cadence ? <small>{row.cadence}</small> : null}
                    </span>
                    <span className="dots" aria-hidden />
                    <span className="amt num">{money.format(row.price)}</span>
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
