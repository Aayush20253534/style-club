"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import RemoteImage from "@/components/ui/RemoteImage";
import { MaskLines, Reveal } from "@/components/ui/Reveal";
import { useShop } from "@/components/layout/ShopProvider";
import { scrollToTarget } from "@/components/layout/SmoothScroll";
import { departments } from "@/lib/data";
import { useParallax } from "@/components/ui/useParallax";

export default function Departments() {
  return (
    <section id="departments" aria-labelledby="departments-title" className="bg-night pb-24 pt-24 text-paper md:pb-32 md:pt-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow text-paper/55">02 — Men’s · Women’s · Kidswear</p>
            </Reveal>
            <h2 id="departments-title" className="display mt-5 text-[14vw] md:text-[clamp(4.5rem,7.6vw,8rem)]">
              <MaskLines lines={["One store,", "the whole family."]} />
            </h2>
          </div>
          <Reveal delay={0.1} className="max-w-sm md:pb-3">
            <p className="text-[15px] leading-relaxed text-paper/65">
              Everything under one roof — from festive kurta sets to school-run basics. Pick a department to see what’s
              new in it.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3 md:gap-5">
          {departments.map((d, i) => (
            <Panel key={d.id} dept={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Panel({ dept, index }: { dept: (typeof departments)[number]; index: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { setFilter } = useShop();
  useParallax(imageRef, ref, -6, 6);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => {
        setFilter(dept.id);
        scrollToTarget("#new-arrivals", -72);
      }}
      aria-label={`Shop ${dept.title} — see new arrivals`}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduce ? 0.2 : 1.1, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : index * 0.12 }}
      className="group relative block aspect-[4/5] w-full overflow-hidden bg-ink text-left md:aspect-[3/4.3]"
    >
      <div ref={imageRef} className="absolute inset-[-8%_0]">
        <RemoteImage
          photo={dept.image}
          alt={dept.alt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
          style={{ objectPosition: dept.pos }}
        />
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-7">
        <div>
          <p className="eyebrow text-[10px] text-white/70">{dept.kicker}</p>
          <p className="display mt-3 text-[18vw] leading-[0.85] text-white md:text-[clamp(3.5rem,5.4vw,6rem)]">{dept.title}</p>
        </div>
        <span className="mb-2 inline-flex size-12 shrink-0 items-center justify-center border border-white/40 text-white transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-char">
          <ArrowUpRight className="size-5" aria-hidden />
        </span>
      </div>
    </motion.button>
  );
}
