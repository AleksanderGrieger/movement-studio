"use client";

import type { Location } from "@/lib/content/types";
import { useHomeState } from "./HomeState";

/**
 * The location switch. Three of these render — one each in #schedule,
 * #pricelist and #contact — and all three read and write the same state, so
 * pressing one moves the other two (§6.4).
 *
 * 'use client': real <button>s with aria-pressed driving shared state.
 */
export function LocationToggle({
  locations,
  ariaLabel,
}: {
  locations: Location[];
  ariaLabel: string;
}) {
  const { location, setLocation } = useHomeState();

  return (
    <div
      className="toggle mb-(--sp-6) inline-flex gap-[3px] rounded-(--radius) border border-border-strong p-[3px]"
      role="group"
      aria-label={ariaLabel}
    >
      {locations.map((candidate) => (
        <button
          key={candidate.slug}
          type="button"
          className="min-h-(--tap-target) rounded-[calc(var(--radius)-1px)] px-(--sp-4) py-(--sp-2) text-(length:--s-1) font-(--weight-strong) tracking-[0.08em] uppercase transition-[background-color,color] duration-(--dur-ui) ease-(--ease-swing) aria-pressed:bg-accent aria-pressed:text-on-accent"
          aria-pressed={candidate.slug === location}
          onClick={() => setLocation(candidate.slug)}
        >
          {candidate.name}
        </button>
      ))}
    </div>
  );
}
