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
/* The chip row is where filter state is stated, which is why the grid itself
   does not have to shout it and there is no result-count line (§6.2). The
   selected chip is FILLED, not merely tinted.

   Border and fill take §7.1's symmetric curve while the lift takes the
   overshooting one, so the transition is written out rather than assembled
   from a duration/ease pair. */
const CHIP = [
  /* `chip` / `chip-reset` carry no style; scripts/check-interactions.mts
     addresses them. */
  "chip inline-flex min-h-(--tap-target) items-center justify-center gap-(--sp-2)",
  "rounded-full border border-border-strong px-(--sp-4) py-(--sp-2)",
  "text-(length:--s-2) tracking-[0.1em] font-(--weight-strong) uppercase whitespace-nowrap",
  "[transition:border-color_var(--dur-hover)_var(--ease-swing),background-color_var(--dur-hover)_var(--ease-swing),translate_var(--dur-hover)_var(--ease-weight)]",
  "hover:-translate-y-px focus-visible:-translate-y-px",
].join(" ");

/* A label chip carries its label's colour in --chip-color: a dot before the
   word, the border it takes on hover, and the fill it takes when checked. */
const CHIP_LABEL = [
  'before:size-2 before:flex-none before:rounded-[50%] before:content-[""]',
  "before:bg-[var(--chip-color,var(--color-border-strong))]",
  "hover:border-[var(--chip-color,var(--color-text))]",
  "focus-visible:border-[var(--chip-color,var(--color-text))]",
  "aria-checked:bg-[var(--chip-color,var(--color-text))]",
  "aria-checked:border-[var(--chip-color,var(--color-text))]",
  "aria-checked:text-(--on-label) aria-checked:before:bg-current",
].join(" ");

/* "Wszystkie" has no colour and no dot, and reverses to the page ground
   rather than to a label's ink. */
const CHIP_RESET = [
  "chip-reset hover:border-text focus-visible:border-text",
  "aria-checked:bg-text aria-checked:border-text aria-checked:text-bg",
].join(" ");

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
    <div className="mb-(--sp-6) flex flex-wrap items-center gap-x-(--sp-4) gap-y-(--sp-2)">
      <span
        className="text-(length:--s-2) tracking-[0.16em] text-text-muted uppercase"
        id="filter-label"
      >
        {legend}
      </span>
      <div
        className="flex flex-wrap gap-(--sp-2)"
        role="radiogroup"
        aria-labelledby="filter-label"
      >
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
              className={`${CHIP} ${value ? CHIP_LABEL : CHIP_RESET}`}
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
