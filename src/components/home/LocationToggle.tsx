"use client";

import type { Location } from "@/lib/content/types";
import { useHomeState } from "./HomeState";
import { SegmentedToggle } from "./SegmentedToggle";

/**
 * The location switch. Four of these render — one each in #schedule,
 * #pricelist, #contact and #signup — and all four read and write the same
 * state, so pressing one moves the other three (§6.4). Choosing a town for
 * the schedule therefore also chooses which sign-up form is waiting at the
 * bottom of the page.
 *
 * 'use client': it binds shared state to the switch. The switch itself is
 * SegmentedToggle, which #signup's audience control also uses — the two sit
 * next to each other there and have to be one control (see that file).
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
    <SegmentedToggle
      variant="toggle-location"
      ariaLabel={ariaLabel}
      options={locations.map((candidate) => ({
        value: candidate.slug,
        label: candidate.name,
      }))}
      value={location}
      onChange={setLocation}
    />
  );
}
