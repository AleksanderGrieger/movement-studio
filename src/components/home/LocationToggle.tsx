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
    <div className="toggle" role="group" aria-label={ariaLabel}>
      {locations.map((candidate) => (
        <button
          key={candidate.slug}
          type="button"
          aria-pressed={candidate.slug === location}
          onClick={() => setLocation(candidate.slug)}
        >
          {candidate.name}
        </button>
      ))}
    </div>
  );
}
