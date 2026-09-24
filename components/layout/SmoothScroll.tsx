"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;

export const getLenis = () => lenis;

/** Scroll to an element or selector, through Lenis when it is running. */
export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.6 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

/**
 * Refined wheel smoothing for mouse/trackpad users only. Touch devices keep
 * pure native scrolling (Lenis would add scroll-time work for no benefit there)
 * and reduced-motion users get no smoothing at all.
 */
export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let tick: ((time: number) => void) | null = null;

    const start = () => {
      if (lenis || media.matches || !finePointer.matches) return;
      lenis = new Lenis({
        lerp: 0.11,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
        anchors: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };

    const stop = () => {
      if (tick) gsap.ticker.remove(tick);
      tick = null;
      lenis?.destroy();
      lenis = null;
    };

    const onChange = () => (media.matches ? stop() : start());

    start();
    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return null;
}
