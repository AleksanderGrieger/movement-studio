"use client";

import { useEffect, useRef, useState } from "react";
import type { Slug } from "@/lib/content/types";
import { useHomeState } from "./HomeState";

/**
 * Visibility for one location panel, plus the reveal fix that goes with it.
 *
 * The problem: reveals are driven by an IntersectionObserver, and an element
 * inside a `hidden` panel never intersects anything. So the panel the visitor
 * switches TO has content still sitting at opacity 0 — it stays blank. The
 * approved prototype hit this too and force-revealed the panel's contents
 * inside its location handler.
 *
 * The fix is declarative rather than imperative on purpose. Adding `is-in` to
 * descendants with classList would be wiped the next time React reconciles
 * those elements' className — which happens on every filter change in the
 * schedule grid. Marking the panel itself and letting CSS take it from there
 * survives any re-render.
 *
 * Only a panel that becomes visible AFTER first render is forced. The default
 * panel is visible from the start, so its contents animate on scroll like
 * everything else.
 */
export function usePanelVisibility(panelLocation: Slug) {
  const { location } = useHomeState();
  const isVisible = panelLocation === location;

  const wasVisibleAtMount = useRef(isVisible);
  const [forceRevealed, setForceRevealed] = useState(false);

  useEffect(() => {
    if (isVisible && !wasVisibleAtMount.current) setForceRevealed(true);
  }, [isVisible]);

  return {
    hidden: !isVisible,
    className: `panel${forceRevealed ? " is-revealed" : ""}`,
  };
}
