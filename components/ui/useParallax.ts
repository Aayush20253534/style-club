"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scrubbed vertical parallax for desktop pointers only. ScrollTrigger caches
 * trigger positions, so scrolling costs one transform write per element — and
 * on touch devices or with reduced motion nothing is registered at all.
 */
export function useParallax(
  target: RefObject<HTMLElement | null>,
  trigger: RefObject<HTMLElement | null>,
  fromPercent: number,
  toPercent: number,
) {
  useEffect(() => {
    const el = target.current;
    const trig = trigger.current ?? el;
    if (!el || !trig) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { yPercent: fromPercent },
        {
          yPercent: toPercent,
          ease: "none",
          scrollTrigger: { trigger: trig, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, [target, trigger, fromPercent, toPercent]);
}
