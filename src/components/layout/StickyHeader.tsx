"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The sticky header element, plus the hairline rule it grows once the page
 * has scrolled past the top.
 *
 * 'use client': the .is-stuck state comes from an IntersectionObserver on a
 * sentinel at the top of the document. Children are passed through untouched,
 * so everything inside stays a Server Component.
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
      <header className={`header${isStuck ? " is-stuck" : ""}`}>
        {children}
      </header>
    </>
  );
}
