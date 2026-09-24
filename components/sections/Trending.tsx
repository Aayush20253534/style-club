"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { MaskLines, Reveal } from "@/components/ui/Reveal";
import { trending } from "@/lib/data";

export default function Trending() {
  const railRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const reduce = useReducedMotion();

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = rail.scrollWidth - rail.clientWidth;
      const p = max > 0 ? rail.scrollLeft / max : 0;
      const visible = max > 0 ? rail.clientWidth / rail.scrollWidth : 1;
      if (barRef.current) {
        barRef.current.style.width = `${visible * 100}%`;
        barRef.current.style.transform = `translateX(${(p * (1 - visible)) / visible * 100}%)`;
      }
      setEdges({ start: rail.scrollLeft < 8, end: rail.scrollLeft > max - 8 });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("li");
    const w = card ? card.getBoundingClientRect().width + 20 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * w * 2, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="trending" aria-labelledby="trending-title" className="overflow-hidden bg-bone py-24 md:py-32">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="eyebrow text-mute">03 — Most loved this month</p>
            </Reveal>
            <h2 id="trending-title" className="display mt-5 text-[14vw] md:text-[clamp(4.5rem,7.6vw,8rem)]">
              <MaskLines lines={["Trending", "collection"]} />
            </h2>
          </div>
          <div className="hidden gap-2 md:flex">
            <RailButton label="Previous" disabled={edges.start} onClick={() => step(-1)}>
              <ArrowLeft className="size-4" />
            </RailButton>
            <RailButton label="Next" disabled={edges.end} onClick={() => step(1)}>
              <ArrowRight className="size-4" />
            </RailButton>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: reduce ? 0.2 : 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <ul
          ref={railRef}
          aria-label="Trending products"
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain rail-pad pb-2 md:mt-16 md:gap-5"
        >
          {trending.map((p, i) => (
            <li key={p.id} className="w-[68vw] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] lg:w-[22.5vw] 2xl:w-[330px]">
              <p className="eyebrow mb-3 flex items-center gap-3 text-[10px] text-mute">
                <span className="text-char">{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px w-8 bg-line" aria-hidden />
                <span>{p.category === "kids" ? "Kids" : p.category === "women" ? "Women" : "Men"}</span>
              </p>
              <ProductCard product={p} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 42vw, 68vw" />
            </li>
          ))}
        </ul>
      </motion.div>

      <div className="container-x mt-10">
        <div className="relative h-px w-full overflow-hidden bg-line" aria-hidden>
          <div ref={barRef} className="absolute inset-y-0 left-0 bg-char transition-[width] duration-200" />
        </div>
      </div>
    </section>
  );
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-controls="trending"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-12 items-center justify-center border border-char text-char transition-colors duration-200 hover:bg-char hover:text-paper disabled:pointer-events-none disabled:opacity-25"
    >
      {children}
    </button>
  );
}
