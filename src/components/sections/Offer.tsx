import { getOfferGroups } from "@/lib/content/classes";
import { getSectionIntro } from "@/lib/content/site";
import { OfferFilterLink } from "../home/OfferFilterLink";
import { SectionHead } from "./SectionHead";

/**
 * #offer — the four audience groups.
 *
 * Offer comes before the schedule because a first-time visitor needs the
 * vocabulary ("nabór", "gr. sportowa") before a grid of times means anything
 * (§2).
 *
 * Item numbers run 01–20 continuously across groups. They are derived from
 * the flattened index rather than stored, so reordering a group or an item
 * stays a pure content edit.
 */
export async function Offer() {
  const [section, groups] = await Promise.all([
    getSectionIntro("offer"),
    getOfferGroups(),
  ]);

  let counter = 0;

  return (
    <section className="section" aria-labelledby="offer-title">
      <div className="mx-auto w-(--wrap)">
        <SectionHead section={section} />

        {groups.map((group, groupIndex) => {
          const body = (
            <>
              <ul>
                {group.items.map((item) => {
                  counter += 1;
                  return (
                    <li
                      key={item.slug}
                      className="border-t border-t-border last:border-b last:border-b-border"
                    >
                      <div className="relative grid w-full grid-cols-[auto_1fr] gap-x-(--sp-4) gap-y-(--sp-2) px-(--sp-3) py-(--sp-4) text-left transition-[background-color,padding-left] duration-(--dur-hover) ease-(--ease-swing) hover:bg-accent-soft hover:pl-(--sp-5) focus-within:bg-accent-soft focus-within:pl-(--sp-5)">
                        <span className="pt-[0.35em] text-(length:--s-1) text-accent-text tabular-nums">
                          {String(counter).padStart(2, "0")}
                        </span>
                        <h4 className="display-flat">{item.title}</h4>
                        <p className="col-start-2 max-w-(--measure) text-(length:--s-1) text-text-muted">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {group.scheduleFilter && group.scheduleFilterLabel ? (
                <OfferFilterLink
                  filter={group.scheduleFilter}
                  label={group.scheduleFilterLabel}
                  href="#schedule"
                />
              ) : null}
            </>
          );

          return (
            <div
              className={`r grid gap-(--sp-4) lg:grid-cols-[18rem_1fr] lg:items-start lg:gap-(--sp-7) ${
                groupIndex > 0 ? "mt-(--sp-8)" : ""
              }`}
              key={group.slug}
            >
              {/* Sticky only at >=1280, where the heading owns a column of its
                  own. Below that the heading and the list share one column, so
                  a sticky heading parks on top of the item text — two
                  unreadable layers (§9). */}
              <h3 className="display [--display-step:var(--s3)] lg:sticky lg:top-[calc(var(--header-h)+var(--sp-4))]">
                {group.title}
              </h3>
              {/* The CTA has to sit inside the right-hand column, so groups
                  that have one wrap their list and CTA together. */}
              {group.scheduleFilter ? <div>{body}</div> : body}
            </div>
          );
        })}
      </div>
    </section>
  );
}
