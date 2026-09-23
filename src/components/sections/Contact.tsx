import { getLocations } from "@/lib/content/locations";
import { getContactCopy, getSectionIntro, getUiCopy } from "@/lib/content/site";
import { LocationPanel } from "../home/LocationPanel";
import { LocationToggle } from "../home/LocationToggle";
import { ContactIcon } from "./ContactIcon";
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
/* Colour and the nudge take different curves (§7.1), so the transition is
   written out rather than assembled from a duration/ease pair. */
const LINK = [
  "group inline-flex items-center gap-(--sp-3) [word-break:break-word] no-underline",
  "[transition:color_var(--dur-hover)_var(--ease-swing),translate_var(--dur-hover)_var(--ease-momentum)]",
  "hover:text-accent-text hover:translate-x-[4px]",
  "focus-visible:text-accent-text focus-visible:translate-x-[4px]",
].join(" ");

export async function Contact() {
  const [section, ui, contact, locations] = await Promise.all([
    getSectionIntro("contact"),
    getUiCopy(),
    getContactCopy(),
    getLocations(),
  ]);

  return (
    <section className="section" aria-labelledby="contact-title">
      <div className="mx-auto w-(--wrap)">
        <SectionHead section={section} />

        <LocationToggle
          locations={locations}
          ariaLabel={ui.locationToggle.contactAriaLabel}
        />

        {locations.map((location) => (
          <LocationPanel key={location.slug} location={location.slug}>
            <div className="grid gap-(--sp-6) md:grid-cols-[repeat(2,1fr)] md:gap-(--sp-7) lg:grid-cols-[1fr_1.5fr]">
              <div className="r border border-border bg-surface p-(--sp-5)">
                <h3 className="display mb-(--sp-3) [--display-step:var(--s2)]">
                  {location.name}
                </h3>
                <address className="grid not-italic text-text-muted">
                  {location.address.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
                <dl className="mt-(--sp-4) grid gap-(--sp-2) text-(length:--s-1)">
                  {location.hours.map((pair) => (
                    <div
                      key={pair.term}
                      className="grid grid-cols-[auto_1fr] gap-(--sp-4)"
                    >
                      <dt className="text-text-muted">{pair.term}</dt>
                      <dd className="tabular-nums">{pair.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {location.map ? (
                <div
                  className="r h-full min-h-[16rem] overflow-hidden border border-border"
                  style={{ "--i": 1 } as React.CSSProperties}
                >
                  <iframe
                    className="block h-full min-h-[16rem] w-full border-0"
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

        <div className="mt-(--sp-7) grid gap-(--sp-3) md:max-w-[64rem] md:grid-cols-[repeat(2,minmax(0,1fr))] md:gap-x-(--sp-6) md:gap-y-(--sp-4)">
          {contact.links.map((link, index) => (
            <a
              key={link.href}
              className={`${LINK} ${
                index === 0
                  ? "display [--display-step:var(--s2)]"
                  : "font-body text-(length:--s1) font-(--weight-strong) tracking-(--tracking-body)"
              }`}
              href={link.href}
              {...(link.external
                ? { rel: "noopener", target: "_blank" }
                : null)}
            >
              <ContactIcon href={link.href} large={index === 0} />
              <span>{link.label}</span>
              {link.context ? (
                <span className="sr-only">{link.context}</span>
              ) : null}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
