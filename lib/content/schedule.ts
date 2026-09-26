import type {
  ScheduleDayGroup,
  ScheduleEntry,
  ScheduleGrid,
  ScheduleLabel,
  Weekday,
} from "./types";
import { getLocations } from "./locations";
import data from "./data/schedule.json";

/**
 * The filter chips, in order.
 *
 * A collection rather than an enum, because §12 makes labels a relation on the
 * class entity in Payload and §11.3 flags the current four-label taxonomy as
 * unconfirmed with the client.
 */
export async function getScheduleLabels(): Promise<ScheduleLabel[]> {
  return (data.labels as ScheduleLabel[])
    .slice()
    .sort((a, b) => a.order - b.order);
}

/** All seven weekdays, Monday first. Days with no classes are still returned. */
export async function getWeekdays(): Promise<Weekday[]> {
  return (data.weekdays as Weekday[]).slice().sort((a, b) => a.order - b.order);
}

/**
 * Every class, flat — one record per occurrence.
 *
 * This is the Payload-native shape and the one Phase 2.2 must reproduce.
 * Sorted by start time so any grouping built on top inherits the order.
 */
export async function getScheduleEntries(): Promise<ScheduleEntry[]> {
  return (data.entries as ScheduleEntry[])
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start));
}

/**
 * The same classes grouped into the day columns the design renders.
 *
 * Derived, never stored. Days with no classes at a location are omitted
 * entirely rather than rendered empty — an empty Friday column would read as
 * a loading failure, and the design's `.is-empty` state is for a day emptied
 * by the filter, not one that never had classes.
 */
export async function getScheduleGrid(): Promise<ScheduleGrid[]> {
  const [locations, weekdays, entries] = await Promise.all([
    getLocations(),
    getWeekdays(),
    getScheduleEntries(),
  ]);

  return locations.map((location) => {
    const days: ScheduleDayGroup[] = weekdays
      .map((day) => ({
        day,
        entries: entries.filter(
          (entry) => entry.location === location.slug && entry.day === day.slug,
        ),
      }))
      .filter((group) => group.entries.length > 0);

    return { location, days };
  });
}
