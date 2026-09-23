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
      <div className="wrap">
        <SectionHead section={section} />

        {groups.map((group) => {
          const body = (
            <>
              <ul className="offer-list">
                {group.items.map((item) => {
                  counter += 1;
                  return (
                    <li key={item.slug}>
                      <div className="offer-item">
                        <span className="idx num">
                          {String(counter).padStart(2, "0")}
                        </span>
                        <h4>{item.title}</h4>
                        <p>{item.body}</p>
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
            <div className="offer-group r" key={group.slug}>
              <h3 className="display">{group.title}</h3>
              {/* The CTA has to sit inside the right-hand column, so groups
                  that have one wrap their list and CTA together. */}
              {group.scheduleFilter ? (
                <div className="offer-body">{body}</div>
              ) : (
                body
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
