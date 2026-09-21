"use client";

import { useEffect, useState } from "react";
import type { NavItem } from "@/lib/content/types";

/**
 * Desktop navigation with scroll-spy.
 *
 * 'use client': scroll-spy is an IntersectionObserver over the sections, and
 * the resulting aria-current cannot be known on the server.
 *
 * Observer geometry is §7.3's: rootMargin '-45% 0px -50% 0px', threshold 0 —
 * a section counts as current once it crosses the middle band of the
 * viewport. Only anchor items take part; /programs is a separate route and is
 * excluded (§2).
 */
export function SiteNav({
  items,
  ariaLabel,
}: {
  items: NavItem[];
  ariaLabel: string;
}) {
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    /* hrefs are route-absolute ("/#offer") so they resolve from /programs
       too, so take the fragment rather than stripping the hash. On a route
       with no such sections this simply finds nothing and no spy runs. */
    const ids = items
      .filter((item) => item.scrollSpy)
      .map((item) => item.href.split("#")[1])
      .filter(Boolean);

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrentId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="nav" aria-label={ariaLabel}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={item.scrollSpy ? undefined : "ext"}
          aria-current={
            item.scrollSpy && item.href.split("#")[1] === currentId
              ? "true"
              : undefined
          }
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
