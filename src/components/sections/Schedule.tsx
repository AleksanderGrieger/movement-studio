import { getLocations } from "@/lib/content/locations";
import { getScheduleGrid, getScheduleLabels } from "@/lib/content/schedule";
import { getSectionIntro, getUiCopy } from "@/lib/content/site";
import { LocationToggle } from "../home/LocationToggle";
import { ScheduleFilter } from "../home/ScheduleFilter";
import { ScheduleGrid } from "../home/ScheduleGrid";
import { SectionHead } from "./SectionHead";

/**
 * #schedule. Server Component shell; the toggle, chips and grids are client
 * islands because all three are interactive.
 *
 * The filter applies to both location panels at once, so switching town keeps
 * the selection (§6.2) — that falls out of both grids reading the same shared
 * filter rather than owning their own.
 */
export async function Schedule() {
  const [section, ui, locations, labels, grids] = await Promise.all([
    getSectionIntro("schedule"),
    getUiCopy(),
    getLocations(),
    getScheduleLabels(),
    getScheduleGrid(),
  ]);

  return (
    <section className="section" aria-labelledby="schedule-title">
      <div className="wrap">
        <SectionHead section={section} />

        <LocationToggle
          locations={locations}
          ariaLabel={ui.locationToggle.scheduleAriaLabel}
        />

        <ScheduleFilter
          labels={labels}
          legend={ui.scheduleFilter.legend}
          allLabel={ui.scheduleFilter.allLabel}
        />

        {grids.map((grid) => (
          <ScheduleGrid key={grid.location.slug} grid={grid} labels={labels} />
        ))}

        <p className="note">
          {ui.scheduleNote.map((run, index) =>
            run.emphasis ? (
              <strong key={index}>{run.text}</strong>
            ) : (
              <span key={index}>{run.text}</span>
            ),
          )}
        </p>
      </div>
    </section>
  );
}
