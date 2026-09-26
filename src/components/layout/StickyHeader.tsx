"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The sticky header element, plus the hairline rule it grows once the page
 * has scrolled past the top.
 *
 * 'use client': the is-stuck state comes from an IntersectionObserver on a
 * sentinel at the top of the document. Children are passed through untouched,
 * so everything inside stays a Server Component.
 *
 * The scrim is --header-bg rather than a bg-bg/88 opacity utility: see the
 * note on that token in globals.css for why the 88% is written out per theme.
 */
export function StickyHeader({ children }: { children: ReactNode }) {
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { rootMargin: "0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <span ref={sentinelRef} aria-hidden />
      <header
        className={`sticky top-0 z-[60] border-b border-b-transparent bg-(--header-bg) backdrop-blur-[10px] backdrop-saturate-[1.2] transition-[border-color,background-color] duration-(--dur-ui) ease-(--ease-swing) stuck:border-b-border ${
          isStuck ? "is-stuck" : ""
        }`}
      >
        {children}
      </header>
    </>
  );
}
