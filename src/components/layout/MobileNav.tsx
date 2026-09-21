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
 */
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
        className="burger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? copy.closeAriaLabel : copy.openAriaLabel}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="bars" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        {copy.label}
      </button>

      <div
        id={panelId}
        className={`mobile-nav${isOpen ? " is-open" : ""}`}
        aria-label={copy.panelAriaLabel}
      >
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <a
                className="display"
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
