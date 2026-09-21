"use client";

import type { ScheduleGrid as Grid, ScheduleLabel } from "@/lib/content/types";
import { useHomeState } from "./HomeState";
import { usePanelVisibility } from "./usePanelVisibility";

/**
 * The day columns for one location.
 *
 * 'use client': the filter dims rows live, and the data is plain JSON handed
 * down from the server, so it serialises without ceremony.
 *
 * The filter works by SUBTRACTION (§6.2). Matching rows are not styled at
 * all — they stay in their resting state. Everything else gets .is-dim:
 * opacity .16, grayscale, and scale(.92) from the left edge. Because
 * transform does not affect layout, rows shrink while the grid holds its
 * geometry, so nothing reflows and the eye reads the untouched rows as the
 * answer.
 *
 * A day whose every row is dimmed gets .is-empty, so an emptied Tuesday reads
 * as empty rather than unfiltered.
 *
 * Colour is never the only signal: every row prints its labels as words, and
 * the filter state is reported by the filled chip above the grid.
 */
export function ScheduleGrid({
  grid,
  labels,
}: {
  grid: Grid;
  labels: ScheduleLabel[];
}) {
  const { filter } = useHomeState();
  const { hidden, className } = usePanelVisibility(grid.location.slug);
  const bySlug = new Map(labels.map((label) => [label.slug, label]));

  return (
    <div className={className} hidden={hidden}>
      <ul className={`days${filter ? " is-filtering" : ""}`}>
        {grid.days.map((group, index) => {
          const dimmed = group.entries.filter(
            (entry) => filter !== null && !entry.labels.includes(filter),
          ).length;
          const isEmpty = filter !== null && dimmed === group.entries.length;

          return (
            <li
              key={group.day.slug}
              className={`day r${isEmpty ? " is-empty" : ""}`}
              style={{ "--i": index } as React.CSSProperties}
            >
              <h4>{group.day.name}</h4>
              <ul>
                {group.entries.map((entry) => {
                  const isDim =
                    filter !== null && !entry.labels.includes(filter);

                  return (
                    <li key={entry.slug} className={isDim ? "is-dim" : ""}>
                      <time dateTime={entry.start}>{entry.start}</time>
                      <span className="what">
                        {entry.name}
                        <span className="tags">
                          {entry.labels.map((slug) => {
                            const label = bySlug.get(slug);
                            if (!label) return null;
                            return (
                              <span
                                key={slug}
                                className="tag"
                                style={
                                  {
                                    "--tag-color": `var(${label.colorToken})`,
                                  } as React.CSSProperties
                                }
                              >
                                {label.tag}
                              </span>
                            );
                          })}
                          {entry.note ? (
                            <span className="tag tag-plain">{entry.note}</span>
                          ) : null}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
