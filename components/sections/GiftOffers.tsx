"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MaskLines, Reveal } from "@/components/ui/Reveal";
import { GIFT_MODEL_PATHS } from "@/lib/giftModels";
import gift2500 from "@/public/gift-renders/mystery-box-2500.webp";
import gift5000 from "@/public/gift-renders/mystery-box-5000.webp";
import gift7500 from "@/public/gift-renders/mystery-box-7500.webp";
import gift10000 from "@/public/gift-renders/mystery-box-10000.webp";

const TIERS = [
  { amount: "₹2,500+", gift: "Assured gift", color: "blue", image: gift2500 },
  { amount: "₹5,000+", gift: "Big gift", color: "copper", image: gift5000 },
  { amount: "₹7,500+", gift: "Bigger gift", color: "plum", image: gift7500 },
  { amount: "₹10,000+", gift: "Grand gift", color: "champagne", image: gift10000 },
] as const;

const GiftScene = dynamic(() => import("./GiftScene"), { ssr: false });
type Layout = { width: number; height: number; centers: { x: number; y: number }[] };

function GiftCard({ tier, index, open, onToggle, onHover }: {
  tier: (typeof TIERS)[number]; index: number; open: boolean;
  onToggle: () => void; onHover: (index: number | null) => void;
}) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLLIElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const tiltRef = useRef<HTMLSpanElement>(null);
  const visible = useInView(cardRef, { margin: "0px 0px 0px 0px" });

  const resetTilt = () => {
    tiltRef.current?.style.setProperty("--gift-turn-x", "0deg");
    tiltRef.current?.style.setProperty("--gift-turn-y", "0deg");
  };

  const handlePointerMove = (event: ReactMouseEvent<HTMLSpanElement>) => {
    if (reduce || !stageRef.current || !tiltRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    tiltRef.current.style.setProperty("--gift-turn-x", `${-y * 6}deg`);
    tiltRef.current.style.setProperty("--gift-turn-y", `${x * 8}deg`);
  };

  return (
    <motion.li
      ref={cardRef}
      initial={reduce ? false : { opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="min-w-0"
      data-paused={!visible || reduce ? "" : undefined}
    >
      <button
        type="button"
        aria-label={`${tier.amount} shopping: ${tier.gift} mystery box. ${open ? "Reset" : "Animate"} mystery box`}
        aria-pressed={open}
        onClick={onToggle}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => { resetTilt(); onHover(null); }}
        onFocus={() => onHover(index)}
        onBlur={() => { resetTilt(); onHover(null); }}
        data-open={open ? "" : undefined}
        className={`gift-card gift-card--${tier.color} group relative flex h-full w-full flex-col overflow-hidden border border-white/20 px-5 pb-6 pt-5 text-left text-white transition-colors duration-300 hover:border-white/55 focus-visible:border-white sm:px-6`}
      >
        <span className="eyebrow relative z-10 text-[12px] font-bold tracking-[0.18em] text-white/80">Mystery box {String(index + 1).padStart(2, "0")}</span>
        <span ref={stageRef} data-gift-stage onMouseMove={handlePointerMove} className="gift-stage relative flex min-h-60 w-full items-center justify-center sm:min-h-64" aria-hidden="true">
          <span className="gift-halo" />
          <span ref={tiltRef} className="gift-depth">
            <span className="gift-float">
              <Image className="gift-illustration" src={tier.image} alt="" unoptimized />
            </span>
          </span>
          <span className="gift-light-sweep" />
          <span className="gift-spark gift-spark--one" />
          <span className="gift-spark gift-spark--two" />
          <span className="gift-spark gift-spark--three" />
        </span>
        <span className="relative z-10 mt-auto block border-t border-white/20 pt-5">
          <span className="eyebrow block text-[clamp(13px,1.05vw,16px)] font-bold tracking-[0.14em] text-white/85">Shop {tier.amount}</span>
          <span className="mt-2 flex items-end justify-between gap-2">
            <span className="font-serif text-[clamp(2rem,2.8vw,2.8rem)] font-semibold italic leading-none">{tier.gift}</span>
            <ArrowUpRight className="size-5 shrink-0 text-white/60 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </span>
      </button>
    </motion.li>
  );
}

export default function GiftOffers() {
  const gridRef = useRef<HTMLDivElement>(null);
  const near = useInView(gridRef, { margin: "300px 0px 300px 0px" });
  const [modelAvailable, setModelAvailable] = useState(false);
  const [sceneMounted, setSceneMounted] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [opened, setOpened] = useState<boolean[]>(() => TIERS.map(() => false));
  const [hovered, setHovered] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const onReady = useCallback(() => setSceneReady(true), []);

  useEffect(() => {
    if (near && show3D) setSceneMounted(true);
  }, [near, show3D]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(GIFT_MODEL_PATHS.map((path) => fetch(path, { method: "HEAD" })))
      .then((responses) => { if (!cancelled) setModelAvailable(responses.every((response) => response.ok)); })
      .catch(() => { if (!cancelled) setModelAvailable(false); });
    return () => { cancelled = true; };
  }, []);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const stages = Array.from(grid.querySelectorAll<HTMLElement>("[data-gift-stage]"));
    const measure = () => {
      const rect = grid.getBoundingClientRect();
      setLayout({
        width: rect.width,
        height: rect.height,
        centers: stages.map((stage) => {
          const box = stage.getBoundingClientRect();
          return { x: box.left - rect.left + box.width / 2, y: box.top - rect.top + box.height / 2 };
        }),
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    stages.forEach((stage) => observer.observe(stage));
    measure();
    return () => observer.disconnect();
  }, []);

  return (
    <section id="gifts" aria-labelledby="gifts-title" className="on-dark overflow-hidden bg-night py-24 text-white md:py-32">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal><p className="eyebrow text-[14px] font-bold tracking-[0.16em] text-white/75">01 — Mystery gifts</p></Reveal>
            <h2 id="gifts-title" className="display mt-5 text-[11vw] md:text-[clamp(4.5rem,7.6vw,8rem)]">
              <MaskLines lines={["Shop more.", "Keep guessing."]} />
            </h2>
          </div>
          <Reveal className="md:col-span-4">
            <p className="max-w-sm text-[15px] leading-relaxed text-white/70">
              Four shopping milestones. Four mystery gift boxes. What’s inside stays a surprise.
            </p>
          </Reveal>
        </div>

        <div ref={gridRef} data-3d-ready={show3D && sceneReady ? "" : undefined} className="relative mt-12 lg:mt-16">
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {TIERS.map((tier, index) => (
              <GiftCard key={tier.amount} tier={tier} index={index} open={opened[index]}
                onToggle={() => setOpened((states) => states.map((state, i) => i === index ? !state : state))}
                onHover={setHovered} />
            ))}
          </ol>
          {show3D && sceneMounted && modelAvailable && layout && layout.centers.length === TIERS.length && (
            <GiftScene centers={layout.centers} size={layout} opened={opened} hovered={hovered}
              visible={sceneReady} playing={near} reduceMotion={Boolean(reduce)} onReady={onReady} />
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-white/20 pt-6">
          <p className="max-w-xl text-[12px] leading-relaxed text-white/55">
            Ask your nearest Style Club store about offer eligibility and availability.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {modelAvailable && (
              <button type="button" aria-pressed={show3D}
                onClick={() => { setShow3D((current) => !current); setSceneReady(false); }}
                className="eyebrow border-b border-white/40 pb-1 text-[10px] text-white transition-colors hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                {show3D ? "Show artwork" : "Explore in 3D"}
              </button>
            )}
            <a href="#stores" className="eyebrow inline-flex items-center gap-2 text-[10px] text-white hover:text-white/70">
              Find a store <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
