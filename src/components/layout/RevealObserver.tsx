"use client";

import { useEffect } from "react";

/**
 * Drives the staggered section reveals (§7.3).
 *
 * 'use client': an IntersectionObserver that adds .is-in to every .r element.
 * Renders nothing — it exists so the reveal stays a global motion primitive
 * rather than something every section has to wire up.
 *
 * Geometry is §7.3's: rootMargin '0px 0px -12% 0px', threshold 0.08, and each
 * element is unobserved once it fires so reveals never replay.
 *
 * Two fallbacks, both of which must reveal rather than hide: when reduced
 * motion is requested, and when IntersectionObserver is unavailable. A .r
 * element starts at opacity 0, so failing to run this would leave the page
 * blank — that is the failure mode worth being careful about.
 */
export function RevealObserver() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".r"));
    if (elements.length === 0) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (!("IntersectionObserver" in window) || prefersReduced.matches) {
      elements.forEach((element) => element.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
