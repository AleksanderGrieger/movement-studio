"use client";

import type { ReactNode } from "react";
import type { Slug } from "@/lib/content/types";
import { useHomeState } from "./HomeState";

/**
 * Shows its children only while its location is the selected one.
 *
 * 'use client': it reads the shared location. Deliberately thin — children
 * are server-rendered and passed through, so the pricelist and contact
 * content inside stays a Server Component.
 *
 * `hidden` rather than conditional rendering, matching the prototype: both
 * panels stay in the DOM so switching town is instant and does not re-run any
 * reveal animation.
 */
export function LocationPanel({
  location,
  children,
}: {
  location: Slug;
  children: ReactNode;
}) {
  const { location: selected } = useHomeState();
  return (
    <div className="panel" hidden={location !== selected}>
      {children}
    </div>
  );
}
