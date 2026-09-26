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
/* The underline is a ::after that scales from its left edge on hover, on
   focus and for the section the spy reports as current — one rule, three
   states, which is why the three share a declaration here rather than each
   carrying its own. Colour is the only thing an external link changes, so it
   is passed in at the call site instead of being a fourth state. */
const LINK = [
  "relative py-(--sp-2) whitespace-nowrap no-underline uppercase",
  "text-(length:--s-1) tracking-[0.1em] font-(--weight-strong)",
  "transition-[color] duration-(--dur-hover) ease-(--ease-swing)",
  "hover:text-text focus-visible:text-text aria-[current=true]:text-text",
  'after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:content-[""]',
  "after:bg-accent after:origin-left after:scale-x-0",
  "after:transition-[scale] after:duration-(--dur-ui) after:ease-(--ease-momentum)",
  "hover:after:scale-x-100 focus-visible:after:scale-x-100",
  "aria-[current=true]:after:scale-x-100",
].join(" ");

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
    <nav
      className="nav hidden lg:flex lg:items-center lg:gap-(--sp-4) xl:gap-(--sp-5)"
      aria-label={ariaLabel}
    >
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`${LINK} ${
            item.scrollSpy ? "text-text-muted" : "text-accent-text"
          }`}
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
