"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { MenuButtonCopy, NavItem } from "@/lib/content/types";

/**
 * Burger button and the panel it controls.
 *
 * 'use client': open/closed state, Escape handling and focus return. Button
 * and panel are one component because they share that state and the
 * aria-controls relationship.
 *
 * Accessibility per §7.5 and §10: aria-expanded + aria-controls on the
 * button, Escape closes and returns focus to the button, and following a link
 * closes the panel.
 *
 * The panel is a <nav>, not a <div>: aria-label is ignored on a generic
 * container, so the authored panelAriaLabel would never reach assistive tech.
 * It also gives the site three distinct labelled landmarks (desktop nav,
 * this one, footer). Closed, it is visibility:hidden, so its links stay out
 * of the tab order without needing inert.
 *
 * The three burger bars answer to `isOpen` directly rather than to a
 * [aria-expanded="true"] selector: the state is already here, and the open
 * shape reads better as two classes on the span than as a rule keyed off an
 * attribute somewhere else.
 */

/* visibility is delayed to the full duration on close so the panel stays in
   the accessibility tree until it has finished sliding away (§7.3). The two
   properties therefore want different durations and delays, which a pair of
   duration/delay utilities cannot express — hence the one arbitrary
   transition. */
const PANEL_TRANSITION =
  "[transition:translate_var(--dur-ui)_var(--ease-momentum),visibility_0s_linear_var(--dur-ui)]";

const BAR = "absolute inset-x-0 h-[2px] bg-current";
const BAR_MOVE =
  "transition-[translate,rotate] duration-(--dur-ui) ease-(--ease-swing)";

export function MobileNav({
  items,
  copy,
}: {
  items: NavItem[];
  copy: MenuButtonCopy;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      buttonRef.current?.focus();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex min-h-(--tap-target) items-center justify-center gap-(--sp-2) rounded-(--radius) border border-border-strong px-(--sp-3) py-(--sp-2) text-(length:--s-1) font-(--weight-strong) tracking-[0.12em] uppercase lg:hidden"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? copy.closeAriaLabel : copy.openAriaLabel}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="relative h-[0.7rem] w-[1.1rem]" aria-hidden>
          <span
            className={`${BAR} ${BAR_MOVE} top-0 ${
              isOpen ? "translate-y-[0.29rem] rotate-45" : ""
            }`}
          />
          <span
            className={`${BAR} top-1/2 transition-[opacity] duration-(--dur-tap) ease-linear ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`${BAR} ${BAR_MOVE} bottom-0 ${
              isOpen ? "-translate-y-[0.29rem] -rotate-45" : ""
            }`}
          />
        </span>
        {copy.label}
      </button>

      <nav
        id={panelId}
        className={`fixed inset-x-0 top-(--header-h) bottom-auto z-[55] border-b border-b-border bg-surface-2 pt-(--sp-5) pb-(--sp-7) lg:hidden ${PANEL_TRANSITION} ${
          isOpen
            ? "visible translate-y-0 delay-0"
            : "invisible -translate-y-[102%]"
        }`}
        aria-label={copy.panelAriaLabel}
      >
        <ul className="mx-auto grid w-(--wrap) gap-(--sp-1)">
          {items.map((item) => (
            <li key={item.href}>
              <a
                className="display block py-(--sp-2) no-underline [--display-step:var(--s2)]"
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
