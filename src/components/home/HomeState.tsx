"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Slug } from "@/lib/content/types";

/**
 * Shared state for the home page's three linked sections.
 *
 * 'use client': holds the two pieces of UI state that cross section
 * boundaries. It renders no markup of its own — children pass straight
 * through, so every section inside stays a Server Component.
 *
 * Location (§6.4): #schedule, #pricelist and #contact each carry a location
 * toggle and all three are driven by one value. Pressing Kołobrzeg anywhere
 * switches all three. That is why this is context rather than per-section
 * state.
 *
 * Filter (§6.2): single-select, one label at a time. It lives here rather
 * than inside the schedule because the offer section's CTAs deep-link into a
 * pre-filtered schedule (§6.3), so a component in a different section has to
 * be able to set it.
 */

interface HomeState {
  location: Slug;
  setLocation: (location: Slug) => void;
  /** null means "Wszystkie" — there is no separate "nothing selected" state. */
  filter: Slug | null;
  setFilter: (filter: Slug | null) => void;
}

const HomeStateContext = createContext<HomeState | null>(null);

export function HomeStateProvider({
  defaultLocation,
  children,
}: {
  defaultLocation: Slug;
  children: ReactNode;
}) {
  const [location, setLocation] = useState<Slug>(defaultLocation);
  const [filter, setFilter] = useState<Slug | null>(null);

  const value = useMemo(
    () => ({ location, setLocation, filter, setFilter }),
    [location, filter],
  );

  return (
    <HomeStateContext.Provider value={value}>
      {children}
    </HomeStateContext.Provider>
  );
}

export function useHomeState(): HomeState {
  const state = useContext(HomeStateContext);
  if (!state) {
    throw new Error("useHomeState must be used inside <HomeStateProvider>");
  }
  return state;
}

/**
 * Convenience for the offer CTAs: set the filter and let the browser handle
 * the scroll via the anchor's own href.
 */
export function useSetFilter(): (filter: Slug) => void {
  const { setFilter } = useHomeState();
  return useCallback((filter: Slug) => setFilter(filter), [setFilter]);
}
