"use client";

import { useEffect, useState } from "react";
import type { ThemeToggleCopy } from "@/lib/content/types";
import {
  THEME_ATTRIBUTE,
  THEME_DARK,
  THEME_LIGHT,
  THEME_STORAGE_KEY,
} from "./theme";

/**
 * Dark/light toggle. A production control, not prototype chrome (§6.1).
 *
 * 'use client': owns click handling and localStorage. Nothing else in the
 * header needs to be client for this.
 *
 * How the label stays correct without JS: both variants are rendered and the
 * `theme-a` variant picks one off [data-theme]. The inactive variant is
 * display:none, so it leaves the accessibility tree entirely and the button's
 * accessible name is always the right one — before hydration included.
 *
 * The control shows the icon and word of the mode it will switch TO.
 *
 * aria-pressed is the one thing JS has to set. The server cannot know the
 * stored theme, and the pre-paint script in <head> runs before this button
 * exists, so it is synced on mount and the attribute is marked
 * suppressHydrationWarning. The mismatch lasts less than a frame and only for
 * a returning visitor who chose light.
 */
/* Border and fill take §7.1's symmetric curve, the lift takes the
   overshooting one — different curves per property, which a duration/ease
   pair cannot express, so the transition is written out. */
const TRANSITION =
  "[transition:border-color_var(--dur-hover)_var(--ease-swing),background-color_var(--dur-hover)_var(--ease-swing),translate_var(--dur-hover)_var(--ease-weight),scale_var(--dur-hover)_var(--ease-weight)]";

/* No gap below 768px. The word is hidden there, but its wrapper stays in the
   flex row so the sr-only name never leaves the accessibility tree. That
   wrapper is zero width — sr-only is absolutely positioned — so a gap would
   still be laid out beside it and push the icon off centre in the round
   icon-only button. The gap returns with the word at 768px. */
const BUTTON = [
  "group theme-toggle inline-flex min-h-(--tap-target) items-center justify-center",
  "gap-0 md:gap-(--sp-2) rounded-full border border-border-strong",
  "px-(--sp-3) py-(--sp-2) whitespace-nowrap uppercase",
  "text-(length:--s-2) tracking-[0.12em] font-(--weight-strong)",
  "hover:border-text hover:bg-accent-soft hover:-translate-y-px",
  "focus-visible:border-text focus-visible:bg-accent-soft focus-visible:-translate-y-px",
  "active:translate-y-0 active:scale-[0.97]",
].join(" ");

/* The tilt the header logo and the contact marks both echo. Keyboard gets it
   too: the button's own border and lift already answer to :focus-visible, and
   leaving the icon out of that made the focused state a partial version of
   the hovered one. */
const ICON = [
  "size-[1.05rem] flex-none stroke-current",
  "transition-[rotate] duration-(--dur-ui) ease-(--ease-weight)",
  "group-hover:-rotate-[18deg] group-focus-visible:-rotate-[18deg]",
].join(" ");

export function ThemeToggle({ copy }: { copy: ThemeToggleCopy }) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsLight(root.getAttribute(THEME_ATTRIBUTE) === THEME_LIGHT);
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next =
      root.getAttribute(THEME_ATTRIBUTE) === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
    root.setAttribute(THEME_ATTRIBUTE, next);
    setIsLight(next === THEME_LIGHT);
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
      className={`${BUTTON} ${TRANSITION}`}
      onClick={toggle}
      aria-pressed={isLight}
      suppressHydrationWarning
    >
      <svg
        className={`${ICON} hidden theme-a:inline-flex`}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        focusable="false"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M5.6 5.6 7.2 7.2M16.8 16.8l1.6 1.6M18.4 5.6 16.8 7.2M7.2 16.8l-1.6 1.6" />
      </svg>
      <svg
        className={`${ICON} theme-a:hidden`}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        focusable="false"
      >
        <path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7z" />
      </svg>
      <span className="hidden theme-a:inline-flex">
        {/* Icon-only below 768px; the accessible name is carried by the
            sr-only text, which stays in the tree at every width (§6.1). */}
        <span className="hidden md:inline" aria-hidden>
          {copy.toLight.label}
        </span>
        <span className="sr-only">{copy.toLight.ariaLabel}</span>
      </span>
      <span className="theme-a:hidden">
        <span className="hidden md:inline" aria-hidden>
          {copy.toDark.label}
        </span>
        <span className="sr-only">{copy.toDark.ariaLabel}</span>
      </span>
    </button>
  );
}
