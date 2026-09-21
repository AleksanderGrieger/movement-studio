"use client";

import { useEffect, useState } from "react";
import type { ThemeToggleCopy } from "@/lib/content/types";
import { THEME_STORAGE_KEY } from "./ThemeScript";

/**
 * Dark/light toggle. A production control, not prototype chrome (§6.1).
 *
 * 'use client': owns click handling and localStorage. Nothing else in the
 * header needs to be client for this.
 *
 * How the label stays correct without JS: both variants are rendered and CSS
 * picks one off [data-theme] (see .to-light / .to-dark in globals.css). The
 * inactive variant is display:none, so it leaves the accessibility tree
 * entirely and the button's accessible name is always the right one — before
 * hydration included.
 *
 * aria-pressed is the one thing JS has to set. The server cannot know the
 * stored theme, and the pre-paint script in <head> runs before this button
 * exists, so it is synced on mount and the attribute is marked
 * suppressHydrationWarning. The mismatch lasts less than a frame and only for
 * a returning visitor who chose light.
 */
export function ThemeToggle({ copy }: { copy: ThemeToggleCopy }) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsLight(root.getAttribute("data-theme") === "b");
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "b" ? "a" : "b";
    root.setAttribute("data-theme", next);
    setIsLight(next === "b");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the toggle still works for this
      // visit, it just will not be remembered.
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={isLight}
      suppressHydrationWarning
    >
      <svg className="i-sun" viewBox="0 0 24 24" aria-hidden focusable="false">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M5.6 5.6 7.2 7.2M16.8 16.8l1.6 1.6M18.4 5.6 16.8 7.2M7.2 16.8l-1.6 1.6" />
      </svg>
      <svg className="i-moon" viewBox="0 0 24 24" aria-hidden focusable="false">
        <path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7z" />
      </svg>
      <span className="to-light">
        <span className="tlabel" aria-hidden>
          {copy.toLight.label}
        </span>
        <span className="sr-only">{copy.toLight.ariaLabel}</span>
      </span>
      <span className="to-dark">
        <span className="tlabel" aria-hidden>
          {copy.toDark.label}
        </span>
        <span className="sr-only">{copy.toDark.ariaLabel}</span>
      </span>
    </button>
  );
}
