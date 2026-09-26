"use client";

/**
 * The two-up segmented switch, as a shape.
 *
 * Extracted when #signup gained a second one next to the location switch:
 * both pick one of two mutually exclusive views of the same section, and they
 * sit side by side, so they have to be the same control down to the pixel.
 * Holding that in one place is the only way that stays true.
 *
 * Presentational and state-free on purpose — the location switch reads shared
 * context (§6.4) while the audience switch owns local state, and folding
 * either of those in here would force the other to fake it.
 *
 * `aria-pressed` buttons rather than a radiogroup: these switch which panel is
 * shown rather than collecting an answer, which is also what the schedule's
 * location switch has always been. `variant` is the hook the interaction
 * checks address a specific switch by.
 */
export function SegmentedToggle<T extends string>({
  variant,
  ariaLabel,
  options,
  value,
  onChange,
}: {
  /** A `toggle-*` class naming this switch, e.g. "toggle-location". */
  variant: string;
  ariaLabel: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div
      /* The bottom margin rides along rather than being a prop: it is the
         gap to whatever the switch controls, it is the same at all four call
         sites, and where two of these sit side by side in a row they need
         the same one anyway. */
      className={`toggle ${variant} mb-(--sp-6) inline-flex gap-[3px] rounded-(--radius) border border-border-strong p-[3px]`}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="min-h-(--tap-target) rounded-[calc(var(--radius)-1px)] px-(--sp-4) py-(--sp-2) text-(length:--s-1) font-(--weight-strong) tracking-[0.08em] uppercase transition-[background-color,color] duration-(--dur-ui) ease-(--ease-swing) aria-pressed:bg-accent aria-pressed:text-on-accent"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
