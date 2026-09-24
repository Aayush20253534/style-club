"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { unsplashSrc } from "@/lib/unsplash";

/**
 * Coded stand-in for the Higgsfield film, used only if the frame sequence
 * can't load. Same story, same scroll control: threads align into cloth,
 * chalk marks the pattern, pieces separate, assemble, get stitched, and a
 * campaign photograph takes over.
 */

export type FallbackHandle = { render: (p: number) => void };

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const THREADS = Array.from({ length: 16 }, (_, i) => {
  // Deterministic scatter so server and client agree.
  const r = (n: number) => {
    const x = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    y: 318 + i * 17,
    color: i % 2 ? "#d9ccb1" : "#3656a8",
    rot: (r(1) - 0.5) * 110,
    tx: (r(2) - 0.5) * 520,
    ty: (r(3) - 0.5) * 360,
  };
});

type Piece = {
  id: string;
  d: string;
  /** flat on the cloth → exploded → assembled (identity) */
  flat: [number, number, number];
  exploded: [number, number, number];
  seam?: string;
};

// Jacket pieces drawn in assembled coordinates (centre ≈ 800,460).
const PIECES: Piece[] = [
  { id: "back", d: "M690 338 L910 338 L914 612 L686 612 Z", flat: [0, 30, 0], exploded: [0, -8, 0] },
  {
    id: "sleeveL",
    d: "M690 344 L646 360 L596 598 L650 606 L694 420 Z",
    flat: [-160, 20, -14],
    exploded: [-46, 6, -4],
    seam: "M690 344 L694 420",
  },
  {
    id: "sleeveR",
    d: "M910 344 L954 360 L1004 598 L950 606 L906 420 Z",
    flat: [160, 20, 14],
    exploded: [46, 6, 4],
    seam: "M910 344 L906 420",
  },
  {
    id: "frontL",
    d: "M690 338 L770 338 Q782 372 796 380 L796 612 L686 612 Z",
    flat: [-96, 30, 0],
    exploded: [-18, 24, 0],
    seam: "M796 380 L796 612",
  },
  {
    id: "frontR",
    d: "M910 338 L830 338 Q818 372 804 380 L804 612 L914 612 Z",
    flat: [96, 30, 0],
    exploded: [18, 24, 0],
    seam: "M804 380 L804 612",
  },
  {
    id: "collar",
    d: "M742 316 L858 316 L878 348 L832 344 Q800 360 768 344 L722 348 Z",
    flat: [0, -52, 0],
    exploded: [0, -34, 0],
    seam: "M742 316 L858 316",
  },
  { id: "band", d: "M686 612 L914 612 L914 640 L686 640 Z", flat: [0, 70, 0], exploded: [0, 30, 0], seam: "M686 626 L914 626" },
];

const SequenceFallback = forwardRef<FallbackHandle>(function SequenceFallback(_, ref) {
  const threadRefs = useRef<(SVGPathElement | null)[]>([]);
  const clothRef = useRef<SVGRectElement>(null);
  const chalkRef = useRef<SVGGElement>(null);
  const pieceRefs = useRef<(SVGGElement | null)[]>([]);
  const seamRefs = useRef<(SVGPathElement | null)[]>([]);
  const garmentRef = useRef<SVGGElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    render(p: number) {
      // 0 → .2  threads align and weave
      const weave = ease(seg(p, 0.02, 0.2));
      threadRefs.current.forEach((el, i) => {
        if (!el) return;
        const t = THREADS[i];
        const k = 1 - weave;
        el.setAttribute("transform", `translate(${t.tx * k} ${t.ty * k}) rotate(${t.rot * k} 800 ${t.y})`);
        el.style.opacity = String(1 - seg(p, 0.2, 0.28));
      });
      // .16 → .3 cloth forms
      if (clothRef.current) clothRef.current.style.opacity = String(seg(p, 0.16, 0.26) * (1 - seg(p, 0.44, 0.5)));
      // .3 → .4 chalk pattern draws
      if (chalkRef.current) {
        chalkRef.current.style.strokeDashoffset = String(1 - seg(p, 0.28, 0.4));
        chalkRef.current.style.opacity = String(seg(p, 0.26, 0.3) * (1 - seg(p, 0.42, 0.48)));
      }
      // .4 → .6 pieces lift and separate; .6 → .72 assemble
      const lift = ease(seg(p, 0.4, 0.56));
      const join = ease(seg(p, 0.6, 0.72));
      pieceRefs.current.forEach((el, i) => {
        if (!el) return;
        const pc = PIECES[i];
        const x = lerp(lerp(pc.flat[0], pc.exploded[0], lift), 0, join);
        const y = lerp(lerp(pc.flat[1], pc.exploded[1], lift), 0, join);
        const r = lerp(lerp(pc.flat[2], pc.exploded[2], lift), 0, join);
        el.setAttribute("transform", `translate(${x} ${y}) rotate(${r} 800 460)`);
        el.style.opacity = String(seg(p, 0.38, 0.44));
      });
      // .68 → .8 stitching travels along the seams
      const stitch = seg(p, 0.66, 0.8);
      seamRefs.current.forEach((el) => {
        if (el) el.style.strokeDashoffset = String(1 - stitch);
      });
      // .8 → .9 garment pushes toward camera, photograph takes over
      const push = ease(seg(p, 0.8, 0.92));
      if (garmentRef.current) {
        garmentRef.current.setAttribute("transform", `translate(800 470) scale(${1 + push * 2.4}) translate(-800 -470)`);
        garmentRef.current.style.opacity = String(1 - seg(p, 0.86, 0.93));
      }
      if (photoRef.current) photoRef.current.style.opacity = String(seg(p, 0.85, 0.95));
    },
  }));

  return (
    <div aria-hidden className="absolute inset-0 bg-ink">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full">
        <defs>
          <pattern id="twill" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
            <rect width="10" height="10" fill="#243f82" />
            <rect width="4" height="10" fill="#2f4f9b" />
            <rect x="7" width="1.4" height="10" fill="#c9bea7" opacity="0.35" />
          </pattern>
          <radialGradient id="glow" cx="50%" cy="38%" r="55%">
            <stop offset="0%" stopColor="#1a2750" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#02050f" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#glow)" />

        <g strokeLinecap="round" fill="none" strokeWidth="5">
          {THREADS.map((t, i) => (
            <path
              key={i}
              ref={(el) => {
                threadRefs.current[i] = el;
              }}
              d={`M470 ${t.y} C 620 ${t.y - 10}, 700 ${t.y + 10}, 800 ${t.y} S 1010 ${t.y - 10}, 1130 ${t.y}`}
              stroke={t.color}
            />
          ))}
        </g>

        <rect ref={clothRef} x="440" y="286" width="720" height="380" fill="url(#twill)" opacity="0" />

        <g
          ref={chalkRef}
          fill="none"
          stroke="#f4efe4"
          strokeWidth="2"
          strokeDasharray="1"
          opacity="0"
          style={{ strokeDashoffset: 1 }}
        >
          {PIECES.map((pc) => (
            <path
              key={pc.id}
              d={pc.d}
              pathLength={1}
              strokeDasharray="1"
              transform={`translate(${pc.flat[0]} ${pc.flat[1]}) rotate(${pc.flat[2]} 800 460)`}
            />
          ))}
        </g>

        <g ref={garmentRef}>
          {PIECES.map((pc, i) => (
            <g
              key={pc.id}
              ref={(el) => {
                pieceRefs.current[i] = el;
              }}
              opacity="0"
            >
              <path d={pc.d} fill="url(#twill)" stroke="#8ea3d8" strokeOpacity="0.35" strokeWidth="1.5" />
              {pc.seam && (
                <path
                  ref={(el) => {
                    seamRefs.current[i] = el;
                  }}
                  d={pc.seam}
                  pathLength={1}
                  fill="none"
                  stroke="#c07a45"
                  strokeWidth="2.5"
                  strokeDasharray="1"
                  style={{ strokeDashoffset: 1 }}
                />
              )}
            </g>
          ))}
        </g>
      </svg>

      <div ref={photoRef} className="absolute inset-0 opacity-0">
        <img
          src={`${unsplashSrc("photo-1577660002965-04865592fc60")}?w=1600&q=70&auto=format&fit=max`}
          alt=""
          className="size-full object-cover object-[50%_30%]"
          loading="lazy"
        />
      </div>
    </div>
  );
});

export default SequenceFallback;
