"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MapPin } from "lucide-react";
import { scrollToTarget } from "@/components/layout/SmoothScroll";
import SequenceFallback, { type FallbackHandle } from "./SequenceFallback";

/**
 * THREAD → WEAVE → FABRIC → CUT → ASSEMBLE → STITCH → GARMENT → MODEL
 *
 * Five Higgsfield clips (first/last-frame chained, so every seam is continuous)
 * were concatenated and exported as WebP frame sequences. Scroll position drives
 * the frame index through a scrubbed GSAP timeline, which gives forward/reverse
 * control with a little cinematic inertia. Frames are drawn to a canvas.
 */

type Source = {
  dir: string;
  count: number;
  width: number;
  height: number;
  /** Horizontal focus crop used when the viewport is portrait. */
  crop: { sx: number; sw: number };
};

const DESKTOP: Source = { dir: "/sequence/desktop/f_", count: 301, width: 1280, height: 720, crop: { sx: 240, sw: 800 } };
const MOBILE: Source = { dir: "/sequence/mobile/f_", count: 151, width: 640, height: 576, crop: { sx: 0, sw: 640 } };

const frameUrl = (s: Source, i: number) => `${s.dir}${String(i + 1).padStart(3, "0")}.webp`;

const BG = "2, 5, 15";

const STAGES = ["Thread", "Weave", "Fabric", "Cut", "Assemble", "Stitch", "Garment", "Model"] as const;
/** Where each stage begins, as a fraction of the film (clip seams sit at .2/.4/.6/.8). */
const STAGE_AT = [0, 0.1, 0.2, 0.4, 0.6, 0.7, 0.8, 0.9];

/** Share of the pinned scroll spent playing the film; the rest holds on the model. */
const FILM_END = 0.9;

/** Coarse-to-fine order so a lightweight first pass makes the whole film playable. */
function loadOrder(count: number) {
  const seen = new Uint8Array(count);
  const order: number[] = [];
  const push = (i: number) => {
    if (i >= 0 && i < count && !seen[i]) {
      seen[i] = 1;
      order.push(i);
    }
  };
  push(0);
  push(count - 1);
  for (const step of [Math.round((count - 1) / 5), 16, 8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) push(i);
  }
  return order;
}

type NetworkConnection = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkConnection;
};

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

function frameLoadProfile(src: Source) {
  const connection = (navigator as NavigatorWithConnection).connection;
  const constrained =
    connection?.saveData === true ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "3g";

  return {
    initialCount: src === MOBILE ? 16 : 24,
    concurrency: constrained ? 2 : src === MOBILE ? 3 : 4,
    idleTimeout: constrained ? 1400 : 650,
  };
}

function scheduleIdle(callback: () => void, timeout: number) {
  const idleWindow = window as IdleWindow;
  if (idleWindow.requestIdleCallback) {
    const handle = idleWindow.requestIdleCallback(callback, { timeout });
    return () => idleWindow.cancelIdleCallback?.(handle);
  }

  const handle = window.setTimeout(callback, timeout);
  return () => window.clearTimeout(handle);
}

export default function ThreadSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const featherRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const line3Ref = useRef<HTMLParagraphElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const stageListRef = useRef<HTMLOListElement>(null);
  const stageLabelRef = useRef<HTMLSpanElement>(null);
  const stageNumRef = useRef<HTMLSpanElement>(null);
  const fallbackRef = useRef<FallbackHandle>(null);
  const failedRef = useRef(false);
  const filmProgressRef = useRef(0);
  const [failed, setFailed] = useState(false);

  // Sync the coded fallback to wherever the scroll already is when it mounts.
  useEffect(() => {
    if (failed) fallbackRef.current?.render(filmProgressRef.current);
  }, [failed]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      failedRef.current = true;
      setFailed(true);
      return;
    }

    const isPortraitViewport = () => window.innerWidth <= window.innerHeight;
    const src = isPortraitViewport() && window.innerWidth < 820 ? MOBILE : DESKTOP;
    let destroyed = false;
    let failures = 0;
    let target = 0;
    let drawn = -1;
    let posterHidden = false;
    let cw = 0;
    let ch = 0;
    let stageIndex = -1;

    const fail = () => {
      if (failedRef.current) return;
      failedRef.current = true;
      setFailed(true);
    };

    // ---- Frame store --------------------------------------------------------
    // Frames arrive as encoded blobs and are decoded off the main thread with
    // createImageBitmap, so a draw never stalls on a synchronous decode. Only a
    // window around the playhead plus sparse anchor frames stay decoded, which
    // keeps memory bounded however long the film is.
    const canBitmap = typeof createImageBitmap === "function";
    const profile = frameLoadProfile(src);
    const requestController = new AbortController();
    const blobs: (Blob | null)[] = new Array(src.count).fill(null);
    const frames = new Map<number, ImageBitmap | HTMLImageElement>();
    const decoding = new Set<number>();
    const pendingImages = new Set<HTMLImageElement>();
    const ANCHOR = src === MOBILE ? 15 : 20;
    const WINDOW = src === MOBILE ? 12 : 10;
    const MAX_DECODES = src === MOBILE ? 2 : 3;
    const isAnchor = (i: number) => i % ANCHOR === 0 || i === src.count - 1;
    let direction = 1;
    let scheduledAt = -1;

    const release = (f: ImageBitmap | HTMLImageElement) => {
      if ("close" in f) f.close();
    };

    const nearestReady = (t: number) => {
      const c = Math.max(0, Math.min(src.count - 1, Math.round(t)));
      if (frames.has(c)) return c;
      for (let d = 1; d < src.count; d++) {
        if (frames.has(c - d)) return c - d;
        if (frames.has(c + d)) return c + d;
      }
      return -1;
    };

    const schedule = () => {
      if (!canBitmap || destroyed) return;
      const c = Math.max(0, Math.min(src.count - 1, Math.round(target)));
      for (const [i, f] of frames) {
        if (!isAnchor(i) && Math.abs(i - c) > WINDOW * 1.5) {
          release(f);
          frames.delete(i);
        }
      }
      const wanted = (i: number) => i >= 0 && i < src.count && !!blobs[i] && !frames.has(i) && !decoding.has(i);
      const queue: number[] = [];
      // Nearest first, leaning in the direction of travel; then the anchors.
      for (let d = 0; d <= WINDOW; d++) {
        const ahead = c + d * direction;
        const behind = c - d * direction;
        if (wanted(ahead)) queue.push(ahead);
        if (d && wanted(behind)) queue.push(behind);
      }
      for (let i = 0; i < src.count; i += ANCHOR) if (wanted(i)) queue.push(i);
      if (wanted(src.count - 1)) queue.push(src.count - 1);

      for (const i of queue) {
        if (decoding.size >= MAX_DECODES) break;
        decoding.add(i);
        createImageBitmap(blobs[i]!).then(
          (bmp) => {
            decoding.delete(i);
            if (destroyed) return bmp.close();
            if (!isAnchor(i) && Math.abs(i - Math.round(target)) > WINDOW * 1.5) {
              bmp.close();
            } else {
              frames.set(i, bmp);
              if (drawn < 0 || Math.abs(i - target) < Math.abs(drawn - target)) {
                drawn = -1;
                render();
              }
            }
            schedule();
          },
          () => {
            decoding.delete(i);
            schedule();
          },
        );
      }
    };

    // Destination rect, recomputed on resize. Each frame is then a single drawImage.
    let rect = { sx: 0, sw: src.width, dx: 0, dy: 0, dw: 0, dh: 0 };

    const layout = () => {
      const iw = src.width;
      const ih = src.height;
      const feather = featherRef.current;
      if (cw > ch) {
        // Landscape: cover, subject stays centred.
        const s = Math.max(cw / iw, ch / ih);
        rect = { sx: 0, sw: iw, dx: (cw - iw * s) / 2, dy: (ch - ih * s) / 2, dw: iw * s, dh: ih * s };
        if (feather) feather.style.display = "none";
        return;
      }
      // Portrait: fit the focus crop to the width so the whole garment stays in frame.
      const { sx, sw } = src.crop;
      let s = (cw * 1.04) / sw;
      if (ih * s > ch * 0.86) s = (ch * 0.86) / ih;
      const dw = sw * s;
      const dh = ih * s;
      rect = { sx, sw, dx: (cw - dw) / 2, dy: Math.max(ch * 0.45 - dh / 2, ch * 0.08), dw, dh };
      // The backdrop is painted once; a static CSS layer feathers the frame edges into it.
      ctx.fillStyle = `rgb(${BG})`;
      ctx.fillRect(0, 0, cw, ch);
      if (feather) {
        const k = canvas.clientWidth / cw;
        Object.assign(feather.style, {
          display: "block",
          left: `${rect.dx * k - 1}px`,
          top: `${rect.dy * k - 1}px`,
          width: `${rect.dw * k + 2}px`,
          height: `${rect.dh * k + 2}px`,
        });
      }
    };

    const drawFrame = (img: CanvasImageSource) => {
      ctx.drawImage(img, rect.sx, 0, rect.sw, src.height, rect.dx, rect.dy, rect.dw, rect.dh);
    };

    function render() {
      if (failedRef.current || !cw) return;
      const c = Math.round(target);
      if (c !== scheduledAt) {
        scheduledAt = c;
        schedule();
      }
      const idx = nearestReady(target);
      if (idx < 0 || idx === drawn) return;
      drawFrame(frames.get(idx)!);
      drawn = idx;
      if (!posterHidden && posterRef.current) {
        posterRef.current.style.opacity = "0";
        posterHidden = true;
      }
    };

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      if (!box.width || !box.height) return;
      // Never allocate a backing store far beyond what the source frames can fill.
      const portrait = box.width <= box.height;
      const scale = Math.min(window.devicePixelRatio || 1, portrait ? 1.5 : 2, (portrait ? 1100 : 1920) / box.width);
      cw = Math.round(box.width * scale);
      ch = Math.round(box.height * scale);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      layout();
      drawn = -1;
      render();
    };

    // Load a sparse playable pass first. The remaining frames fill in only
    // after the browser becomes idle (or as soon as the user starts the film),
    // so the sequence does not compete with initial page resources.
    const order = loadOrder(src.count);
    const queue = order.slice(0, profile.initialCount);
    const background = order.slice(profile.initialCount);
    const retries = new Uint8Array(src.count);
    let active = 0;
    let backgroundStarted = false;

    const pump = () => {
      while (!destroyed && active < profile.concurrency && queue.length) {
        const i = queue.shift()!;
        const url = frameUrl(src, i);
        active++;

        const done = () => {
          active--;
          pump();
        };

        const onError = (error?: unknown) => {
          if (
            destroyed ||
            requestController.signal.aborted ||
            (error instanceof DOMException && error.name === "AbortError")
          ) {
            done();
            return;
          }

          if (retries[i] === 0) {
            retries[i] = 1;
            queue.push(i);
            done();
            return;
          }

          failures++;
          if (i === 0 || failures > src.count * 0.2) fail();
          done();
        };

        if (canBitmap) {
          fetch(url, {
            cache: "force-cache",
            credentials: "same-origin",
            signal: requestController.signal,
          })
            .then((r) => {
              if (!r.ok) throw new Error(`${r.status}`);
              return r.blob();
            })
            .then((blob) => {
              if (!destroyed) {
                blobs[i] = blob;
                schedule();
              }
              done();
            })
            .catch(onError);
        } else {
          // Older engines: plain images (decoded on first draw).
          const img = new Image();
          pendingImages.add(img);
          img.decoding = "async";
          img.onload = () => {
            pendingImages.delete(img);
            if (!destroyed) {
              frames.set(i, img);
              if (drawn < 0 || Math.abs(i - target) < Math.abs(drawn - target)) {
                drawn = -1;
                render();
              }
            }
            done();
          };
          img.onerror = (error) => {
            pendingImages.delete(img);
            onError(error);
          };
          img.src = url;
        }
      }
    };

    const startBackground = () => {
      if (backgroundStarted || destroyed) return;
      backgroundStarted = true;
      queue.push(...background);
      pump();
    };

    const cancelBackgroundStart = scheduleIdle(startBackground, profile.idleTimeout);
    pump();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const stageItems = stageListRef.current ? Array.from(stageListRef.current.children) : [];
    const setStage = (filmProgress: number) => {
      let next = 0;
      for (let i = 0; i < STAGE_AT.length; i++) if (filmProgress >= STAGE_AT[i] - 0.0001) next = i;
      if (next === stageIndex) return;
      stageIndex = next;
      stageItems.forEach((el, i) => el.setAttribute("data-state", i < next ? "done" : i === next ? "active" : "idle"));
      if (stageLabelRef.current) stageLabelRef.current.textContent = STAGES[next];
      if (stageNumRef.current) stageNumRef.current.textContent = String(next + 1).padStart(2, "0");
    };
    setStage(0);

    const touch = window.matchMedia("(pointer: coarse)").matches;
    const proxy = { f: 0 };

    const gctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(section.offsetHeight - window.innerHeight * 2, window.innerHeight)}`,
          scrub: touch ? 0.45 : 0.9,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        proxy,
        {
          f: src.count - 1,
          duration: FILM_END,
          onUpdate: () => {
            if (proxy.f !== target) direction = proxy.f > target ? 1 : -1;
            target = proxy.f;
            const p = proxy.f / (src.count - 1);
            filmProgressRef.current = p;
            if (p > 0.015) startBackground();
            if (failedRef.current) fallbackRef.current?.render(p);
            else render();
            setStage(p);
            const cue = cueRef.current;
            if (cue && p > 0.03 !== cue.hasAttribute("data-paused")) cue.toggleAttribute("data-paused", p > 0.03);
          },
        },
        0,
      );
      tl.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, duration: FILM_END }, 0);
      tl.to(cueRef.current, { autoAlpha: 0, duration: 0.03 }, 0.005);

      const inOut = (el: Element | null, tIn: number | null, tOut: number | null, dy = 22) => {
        if (!el) return;
        if (tIn !== null)
          tl.fromTo(el, { autoAlpha: 0, y: dy }, { autoAlpha: 1, y: 0, duration: 0.04, ease: "power1.out" }, tIn);
        if (tOut !== null) tl.to(el, { autoAlpha: 0, y: -dy, duration: 0.04, ease: "power1.in" }, tOut);
      };

      inOut(line1Ref.current, null, 0.09);
      inOut(line2Ref.current, 0.17, 0.33);
      inOut(line3Ref.current, 0.52, 0.66);
      tl.fromTo(
        brandRef.current,
        { autoAlpha: 0, scale: 1.08 },
        { autoAlpha: 1, scale: 1, duration: 0.05, ease: "power2.out" },
        0.735,
      ).to(brandRef.current, { autoAlpha: 0, scale: 0.97, duration: 0.03, ease: "power1.in" }, 0.835);
      inOut(finalRef.current, 0.885, null, 30);
      tl.set({}, {}, 1);

      // Curtain: the site slides over the held final frame.
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: section, start: "bottom 200%", end: "bottom 100%", scrub: true },
        })
        .to(stageRef.current, { scale: 0.94, yPercent: -3 }, 0)
        .to(dimRef.current, { opacity: 0.6 }, 0);
    }, section);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      destroyed = true;
      cancelBackgroundStart();
      requestController.abort();
      window.removeEventListener("load", onLoad);
      ro.disconnect();
      gctx.revert();
      pendingImages.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.src = "";
      });
      pendingImages.clear();
      frames.forEach(release);
      frames.clear();
      blobs.fill(null);
    };
  }, []);

  const skip = () => scrollToTarget("#after-film");

  return (
    <section
      id="film"
      ref={sectionRef}
      aria-labelledby="film-title"
      className="relative h-[520svh] bg-ink text-white md:h-[700svh] motion-reduce:h-svh"
    >
      <h1 id="film-title" className="sr-only">
        Style Club Prayagraj — clothing and fashion for men, women and kids.
      </h1>

      <div className="sticky top-0 h-svh overflow-hidden">
        <div ref={stageRef} className="on-dark absolute inset-0 origin-[50%_40%] will-change-transform">
          {/* First frame paints immediately (and is the reduced-motion still). */}
          <div ref={posterRef} aria-hidden className="absolute inset-0 transition-opacity duration-300">
            <picture>
              <source media="(prefers-reduced-motion: reduce) and (orientation: portrait)" srcSet="/sequence/final-mobile.webp" />
              <source media="(prefers-reduced-motion: reduce)" srcSet="/sequence/final-desktop.webp" />
              <source media="(orientation: portrait) and (max-width: 819px)" srcSet="/sequence/mobile/f_001.webp" />
              <img
                src="/sequence/desktop/f_001.webp"
                alt=""
                width={1280}
                height={720}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 size-full object-cover portrait:left-1/2 portrait:top-[45%] portrait:h-auto portrait:w-[104%] portrait:-translate-x-1/2 portrait:-translate-y-1/2"
              />
            </picture>
          </div>

          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full motion-reduce:hidden" />
          <div
            ref={featherRef}
            aria-hidden
            className="pointer-events-none absolute hidden bg-[linear-gradient(to_bottom,rgb(2_5_15)_0%,rgb(2_5_15/0)_14%,rgb(2_5_15/0)_80%,rgb(2_5_15)_100%),linear-gradient(to_right,rgb(2_5_15)_0%,rgb(2_5_15/0)_7%,rgb(2_5_15/0)_93%,rgb(2_5_15)_100%)] motion-reduce:hidden"
          />
          {failed && <SequenceFallback ref={fallbackRef} />}

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_52%,rgb(2_5_15/0.6)_100%)]"
          />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />

          {/* Top rail */}
          <div className="container-x absolute inset-x-0 top-[84px] flex items-start justify-between gap-6 md:top-[104px]">
            <p className="eyebrow text-white/70">
              <span className="hidden sm:inline">The making of a Style Club jacket</span>
              <span className="sm:hidden motion-reduce:hidden">
                <span ref={stageNumRef}>01</span> / 08 — <span ref={stageLabelRef}>Thread</span>
              </span>
            </p>
            <button
              type="button"
              onClick={skip}
              className="eyebrow link-draw pb-1 text-white/70 transition-colors hover:text-white motion-reduce:hidden"
            >
              Skip the film
            </button>
          </div>

          {/* Copy */}
          <p
            ref={line1Ref}
            className="container-x absolute inset-x-0 bottom-[17svh] text-center font-serif will-change-[transform,opacity] text-[2.6rem] italic leading-[1.02] sm:text-left md:bottom-[20svh] md:text-[clamp(3.25rem,6.2vw,7rem)] motion-reduce:hidden"
          >
            It starts with
            <br className="sm:hidden" /> a thread.
          </p>
          <p
            ref={line2Ref}
            className="container-x invisible absolute inset-x-0 bottom-[17svh] text-center font-serif will-change-[transform,opacity] text-[2.6rem] italic leading-[1.02] opacity-0 sm:text-right md:bottom-[20svh] md:text-[clamp(3.25rem,6.2vw,7rem)] motion-reduce:hidden"
          >
            Woven with
            <br className="sm:hidden" /> intention.
          </p>
          <p
            ref={line3Ref}
            className="container-x invisible absolute inset-x-0 bottom-[17svh] text-center font-serif will-change-[transform,opacity] text-[2.6rem] italic leading-[1.02] opacity-0 sm:text-left md:bottom-[20svh] md:text-[clamp(3.25rem,6.2vw,7rem)] motion-reduce:hidden"
          >
            Made for you.
          </p>

          <div
            ref={brandRef}
            aria-hidden
            className="invisible absolute inset-0 flex items-center justify-center opacity-0 will-change-[transform,opacity] motion-reduce:hidden"
          >
            <span className="display select-none text-[21vw] leading-none tracking-[0.01em] text-white md:text-[17vw]">
              Style Club
            </span>
          </div>

          <div
            ref={finalRef}
            className="container-x invisible absolute inset-x-0 bottom-[max(8svh,72px)] opacity-0 will-change-[transform,opacity] lg:bottom-[112px] motion-reduce:visible motion-reduce:opacity-100"
          >
            <div className="flex flex-col items-center gap-7 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
              <div>
                <p className="eyebrow mb-4 text-white/70">New season — Men · Women · Kids</p>
                <p className="display text-[min(13.5vw,6.5rem)] leading-[0.9] lg:text-[clamp(3rem,5.6vw,6.75rem)]">
                  Style that
                  <br /> moves with you.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <button type="button" onClick={() => scrollToTarget("#new-arrivals", -72)} className="btn btn-light justify-center">
                  Shop new arrivals <ArrowRight className="size-4" aria-hidden />
                </button>
                <button type="button" onClick={() => scrollToTarget("#stores")} className="btn btn-ghost-light justify-center">
                  <MapPin className="size-4" aria-hidden /> Find a store
                </button>
              </div>
            </div>
          </div>

          {/* Stage rail */}
          <div className="container-x absolute inset-x-0 bottom-6 motion-reduce:hidden">
            <div className="relative h-px w-full bg-white/15">
              <div ref={progressRef} className="absolute inset-0 origin-left scale-x-0 bg-white will-change-transform" />
            </div>
            <ol ref={stageListRef} className="mt-3 hidden justify-between md:flex" aria-hidden>
              {STAGES.map((s) => (
                <li
                  key={s}
                  data-state="idle"
                  className="eyebrow text-[10px] text-white/35 transition-colors duration-300 data-[state=active]:text-white data-[state=done]:text-white/60"
                >
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div
            ref={cueRef}
            aria-hidden
            className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-3 text-white/60 md:bottom-20 motion-reduce:hidden"
          >
            <span className="eyebrow text-[10px]">Scroll</span>
            <span className="cue-line block h-10 w-px origin-top animate-[cue_2.2s_var(--ease-editorial)_infinite] bg-white/60" />
          </div>

          <div ref={dimRef} aria-hidden className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
        </div>
      </div>
    </section>
  );
}
