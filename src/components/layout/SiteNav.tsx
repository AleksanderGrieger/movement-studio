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

    /* The id sits on the section-head, not the <section> itself (§9's
       scroll-anchor fix), so watch the section — the tall element is what
       needs to cross the mid-viewport band for the whole time the visitor is
       in it, not just the moment the head scrolls past — while keeping the
       id (now unset on the section) in this map to report back. */
    const idBySection = new Map<HTMLElement, string>();
    for (const id of ids) {
      const section = document.getElementById(id)?.closest("section");
      if (section) idBySection.set(section, id);
    }

    if (idBySection.size === 0) return;

    /* isIntersecting only ever set currentId, never cleared it, so scrolling
       back up above every section (into the hero) left whichever section was
       last current highlighted forever. Clear it when the section that
       leaves the band was the current one — the functional update reads the
       latest state, so an entry/exit pair delivered in the same batch (e.g.
       crossing from one section straight into the next) resolves in order
       instead of the exit racing the entry. */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = idBySection.get(entry.target as HTMLElement);
          if (!id) continue;
          if (entry.isIntersecting) {
            setCurrentId(id);
          } else {
            setCurrentId((current) => (current === id ? null : current));
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    idBySection.forEach((_id, section) => observer.observe(section));
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
