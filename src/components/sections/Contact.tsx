import { getLocations } from "@/lib/content/locations";
import { getContactCopy, getSectionIntro, getUiCopy } from "@/lib/content/site";
import { LocationPanel } from "../home/LocationPanel";
import { LocationToggle } from "../home/LocationToggle";
import { SectionHead } from "./SectionHead";

/**
 * #contact — the terminal action (§2).
 *
 * Each location card carries its own address and hours. Where a location has
 * no approved map embed the card renders without one rather than showing a
 * placeholder: §11.4's placeholder was prototype scaffolding, and shipping a
 * dashed "map goes here" box to production would be worse than the absence.
 *
 * Contact links each carry their own visible text, so nothing depends on an
 * icon alone (§10).
 */
export async function Contact() {
  const [section, ui, contact, locations] = await Promise.all([
    getSectionIntro("contact"),
    getUiCopy(),
    getContactCopy(),
    getLocations(),
  ]);

  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead section={section} />

        <LocationToggle
          locations={locations}
          ariaLabel={ui.locationToggle.contactAriaLabel}
        />

        {locations.map((location) => (
          <LocationPanel key={location.slug} location={location.slug}>
            <div className="contact-grid">
              <div className="card r">
                <h3 className="display">{location.name}</h3>
                <address>
                  {location.address.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
                <dl>
                  {location.hours.map((pair) => (
                    <div key={pair.term} className="hours-row">
                      <dt>{pair.term}</dt>
                      <dd className="num">{pair.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {location.map ? (
                <div
                  className="map r"
                  style={{ "--i": 1 } as React.CSSProperties}
                >
                  <iframe
                    src={location.map.src}
                    title={location.map.title}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : null}
            </div>
          </LocationPanel>
        ))}

        <div className="contact-links">
          {contact.links.map((link, index) => (
            <a
              key={link.href}
              className={index === 0 ? "display" : "plain"}
              href={link.href}
              aria-label={link.ariaLabel}
              {...(link.external
                ? { rel: "noopener", target: "_blank" }
                : null)}
            >
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
