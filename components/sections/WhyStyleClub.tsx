"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MaskLines, Reveal } from "@/components/ui/Reveal";

const REASONS = [
  {
    title: "Five stores, close to home",
    body: "Visit Katra, Civil Lines, Naini or Phaphamau in Prayagraj, or Style Club Bharwari in Kaushambi.",
  },
  {
    title: "The whole family",
    body: "Men’s, women’s and kidswear under one roof, so one trip sorts everyone’s wardrobe.",
  },
  {
    title: "Everyday variety",
    body: "Explore ethnic wear, denim, everyday fashion, occasion styles, footwear and accessories across departments.",
  },
  {
    title: "Fresh seasonal edits",
    body: "Discover new-season looks across ethnic wear, denim, workwear, kidswear and accessories.",
  },
];

const WORDS = ["Men", "Women", "Kids", "Denim", "Ethnic", "Footwear", "Accessories", "Festive"];

export default function WhyStyleClub() {
  const reduce = useReducedMotion();
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeVisible = useInView(marqueeRef);
  return (
    <section id="why" aria-labelledby="why-title" className="on-dark relative overflow-hidden bg-royal pt-24 text-white md:pt-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-white/65">05 — Why Style Club</p>
        </Reveal>
        <h2 id="why-title" className="mt-6 max-w-[15ch] font-serif text-[11vw] leading-[0.98] md:text-[clamp(3.5rem,6.4vw,7rem)]">
          <MaskLines
            lines={[
              <>Good fashion</>,
              <>
                shouldn’t need a <em className="italic">big</em>
              </>,
              <>city — or a big bill.</>,
            ]}
          />
        </h2>

        <ol className="mt-16 grid border-t border-white/25 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          {REASONS.map((r, i) => (
            <motion.li
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: reduce ? 0.2 : 0.8, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : i * 0.09 }}
              className="border-b border-white/25 py-8 sm:odd:pr-8 lg:border-b-0 lg:py-10 lg:pr-8 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-8"
            >
              <p className="display text-[64px] leading-none text-white/25">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-6 text-[17px] font-semibold">{r.title}</h3>
              <p className="mt-3 max-w-[34ch] text-[14.5px] leading-relaxed text-white/75">{r.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>

      <div
        ref={marqueeRef}
        aria-hidden
        data-paused={marqueeVisible ? undefined : ""}
        className="mt-16 overflow-hidden border-t border-white/25 py-6 md:mt-20 md:py-8"
      >
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {WORDS.map((w) => (
                <span key={w} className="display flex items-center text-[13vw] leading-none md:text-[7.5vw]">
                  <span className="px-[0.35em]">{w}</span>
                  <span className="font-serif text-[0.5em] italic text-white/50">&amp;</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
