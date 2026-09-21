"use client";

import { useRef } from "react";
import type { ScheduleLabel } from "@/lib/content/types";
import { useHomeState } from "./HomeState";

/**
 * The filter chips (§6.2).
 *
 * 'use client': a radiogroup with roving tabindex and arrow-key navigation,
 * driving shared state.
 *
 * Single-select is deliberate, not a simplification. The four labels are not
 * one facet — dorośli/dzieci is audience, nabór/gr. sportowa is level — so
 * multi-select with OR would answer "adults OR beginners" when adding a
 * second chip plainly means AND, and would light up almost the whole grid.
 *
 * "Wszystkie" is checked exactly when no filter is active, so there is no
 * "nothing selected" state to define.
 *
 * Keyboard behaviour matches the native radio-group pattern: both arrow axes,
 * Home and End move and select, and only the checked chip is tabbable.
 */
export function ScheduleFilter({
  labels,
  legend,
  allLabel,
}: {
  labels: ScheduleLabel[];
  legend: string;
  allLabel: string;
}) {
  const { filter, setFilter } = useHomeState();
  const chipsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // null (= "Wszystkie") first, then one per label.
  const values: (string | null)[] = [null, ...labels.map((l) => l.slug)];

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const { key } = event;
    let next: number | null = null;

    if (key === "ArrowRight" || key === "ArrowDown") {
      next = (index + 1) % values.length;
    } else if (key === "ArrowLeft" || key === "ArrowUp") {
      next = (index - 1 + values.length) % values.length;
    } else if (key === "Home") {
      next = 0;
    } else if (key === "End") {
      next = values.length - 1;
    }

    if (next === null) return;
    event.preventDefault();
    setFilter(values[next]);
    chipsRef.current[next]?.focus();
  }

  return (
    <div className="filter">
      <span className="flabel" id="filter-label">
        {legend}
      </span>
      <div className="chips" role="radiogroup" aria-labelledby="filter-label">
        {values.map((value, index) => {
          const label = value
            ? labels.find((candidate) => candidate.slug === value)
            : null;
          const checked = filter === value;

          return (
            <button
              key={value ?? "all"}
              ref={(node) => {
                chipsRef.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              className={`chip${value ? "" : " chip-reset"}`}
              style={
                label
                  ? ({
                      "--chip-color": `var(${label.colorToken})`,
                    } as React.CSSProperties)
                  : undefined
              }
              onClick={() => setFilter(value)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {label ? label.name : allLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
