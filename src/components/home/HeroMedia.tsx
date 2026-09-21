"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoRef } from "@/lib/content/types";

/**
 * The arch-masked hero frame: lazy video plus scroll parallax.
 *
 * 'use client' for three reasons, all of them §12/§7.3 requirements:
 *
 *  1. The video must never block first paint. It carries no src until an
 *     IntersectionObserver with a 200px margin says it is near, and even then
 *     the load is deferred to requestIdleCallback.
 *  2. Parallax is scroll-linked: progress is computed from the frame's own
 *     rect, clamped to [-1, 1], multiplied by 40px, written inside
 *     requestAnimationFrame behind a ticking guard, on a passive listener.
 *  3. Reduced motion is re-checked live, not just on mount — the spec asks
 *     for the change event, so a visitor who flips the OS setting mid-visit
 *     gets a paused video and no parallax without reloading.
 *
 * It also sets `is-ready` on <html> on the first frame, which is what starts
 * the hero headline's masked line reveal. Doing it here rather than in the
 * server markup means the lines animate in rather than appearing already up.
 *
 * The <video> element is rendered only once there is a source for it. A
 * source-less <video> makes Chrome draw its broken-media controls inside the
 * arch frame, which is what a visitor without JavaScript would otherwise see.
 * The observer therefore watches the frame rather than the video, so the
 * element does not need to exist in order to be lazily loaded.
 */
export function HeroMedia({
  video,
  badge,
}: {
  video: VideoRef;
  badge: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | undefined>(undefined);

  // Start the headline reveal on the first frame after hydration.
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      document.documentElement.classList.add("is-ready"),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  // Lazy-load the video, well after first paint.
  useEffect(() => {
    const element = frameRef.current;
    if (!element || src) return;

    const idle =
      window.requestIdleCallback ??
      ((fn: () => void) => window.setTimeout(fn, 1200));

    if (!("IntersectionObserver" in window)) {
      idle(() => setSrc(video.src));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        idle(() => setSrc(video.src));
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [src, video.src]);

  // Play/pause follows the reduced-motion preference, live.
  useEffect(() => {
    const element = videoRef.current;
    if (!element || !src) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    function sync() {
      if (!element) return;
      if (reduce.matches) {
        element.pause();
      } else {
        void element.play().catch(() => {
          // Autoplay can be refused even when muted; the poster stands in.
        });
      }
    }

    sync();
    reduce.addEventListener("change", sync);
    return () => reduce.removeEventListener("change", sync);
  }, [src]);

  // Scroll parallax.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const maxShift = 40;
    let ticking = false;

    function onScroll() {
      if (reduce.matches || ticking || !frame) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = frame.getBoundingClientRect();
        const progress = 1 - (rect.top + rect.height / 2) / window.innerHeight;
        const shift = Math.max(-1, Math.min(1, progress)) * maxShift;
        frame.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="media r" style={{ "--i": 5 } as React.CSSProperties}>
      <div className="frame" ref={frameRef}>
        {src ? (
          <video
            ref={videoRef}
            src={src}
            poster={video.poster?.src}
            width={video.width}
            height={video.height}
            aria-label={video.ariaLabel}
            muted
            loop
            playsInline
            preload="none"
          />
        ) : null}
        <p className="badge">{badge}</p>
      </div>
    </div>
  );
}
