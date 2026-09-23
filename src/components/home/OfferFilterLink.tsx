"use client";

import type { Slug } from "@/lib/content/types";
import { useSetFilter } from "./HomeState";

/**
 * The offer group's "see the times for this group" CTA (§6.3).
 *
 * 'use client': clicking it sets the schedule filter before the browser
 * scrolls. It stays an ordinary anchor with a real href, so with JS off the
 * link still works — it just lands on an unfiltered schedule. That graceful
 * degradation is the reason this is not a button.
 */
export function OfferFilterLink({
  filter,
  label,
  href,
}: {
  filter: Slug;
  label: string;
  href: string;
}) {
  const setFilter = useSetFilter();

  return (
    <p className="mt-(--sp-4) flex">
      <a
        className="btn btn-ghost group px-(--sp-4) py-(--sp-2) text-(length:--s-1)"
        href={href}
        onClick={() => setFilter(filter)}
      >
        {label}{" "}
        <span
          className="transition-[translate] duration-(--dur-hover) ease-(--ease-momentum) group-hover:translate-x-[4px] group-focus-visible:translate-x-[4px]"
          aria-hidden
        >
          →
        </span>
      </a>
    </p>
  );
}
