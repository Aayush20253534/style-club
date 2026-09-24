"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import RemoteImage from "@/components/ui/RemoteImage";
import { MaskLines, Reveal } from "@/components/ui/Reveal";
import { useShop } from "@/components/layout/ShopProvider";
import { inr, look } from "@/lib/data";

export default function ShopTheLook() {
  const [active, setActive] = useState<number | null>(null);
  const { addToBag, addManyToBag } = useShop();
  const reduce = useReducedMotion();
  const total = look.items.reduce((n, i) => n + i.price, 0);

  const addLook = () =>
    addManyToBag(
      look.items.map((i) => ({ id: i.id, name: i.name, price: i.price, image: i.image })),
      `The complete look (${look.items.length} pieces) added to your bag`,
    );

  return (
    <section id="the-look" aria-labelledby="look-title" className="py-24 md:py-36">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-6 xl:col-span-5">
          <motion.div
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: reduce ? 0.2 : 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[2/3] overflow-hidden bg-bone"
          >
            <RemoteImage photo={look.image} alt={look.alt} fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />

            {look.items.map((item, i) => (
              <div key={item.id} className="absolute" style={{ left: `${item.spot.x}%`, top: `${item.spot.y}%` }}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive((a) => (a === i ? null : i))}
                  aria-label={`${item.name}, ${inr(item.price)}`}
                  aria-describedby={`look-item-${i}`}
                  className={`relative -ml-4 -mt-4 inline-flex size-8 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-200 ${
                    active === i ? "bg-royal text-white" : "bg-white text-char"
                  }`}
                >
                  <span aria-hidden className="absolute inset-[-5px] rounded-full border border-white/70" />
                  {i + 1}
                </button>
                <AnimatePresence>
                  {active === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className={`pointer-events-none absolute top-6 z-10 w-max max-w-[190px] bg-paper px-3 py-2 text-[12px] leading-snug text-char ${
                        item.spot.x > 55 ? "right-0" : "left-0"
                      }`}
                    >
                      <span className="block font-medium">{item.name}</span>
                      <span className="text-mute">{inr(item.price)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex min-w-0 flex-col justify-center lg:col-span-6 xl:col-span-6 xl:col-start-7">
          <Reveal>
            <p className="eyebrow text-mute">04 — Shop the look</p>
          </Reveal>
          <h2 id="look-title" className="display mt-5 text-[14vw] md:text-[clamp(4.5rem,7vw,7.5rem)]">
            <MaskLines lines={["Denim,", "done easy."]} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mute">
              The jacket from the film, styled the way Prayagraj wears it — a heavyweight tee, stretch denim and clean white
              sneakers. Hover the photo to see each piece.
            </p>
          </Reveal>

          <ol className="mt-10 border-t border-line">
            {look.items.map((item, i) => (
              <li key={item.id} id={`look-item-${i}`}>
                <Reveal delay={0.05 * i} y={16}>
                  <div
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    className={`flex items-center gap-4 border-b border-line py-4 transition-colors duration-200 ${
                      active === i ? "bg-bone/70" : ""
                    }`}
                  >
                    <span
                      className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-200 ${
                        active === i ? "bg-royal text-white" : "bg-char text-paper"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="relative size-14 shrink-0 overflow-hidden bg-bone">
                      <RemoteImage photo={item.image} alt="" fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14.5px] font-medium">{item.name}</p>
                      <p className="text-[13px] text-mute">{inr(item.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToBag({ id: item.id, name: item.name, price: item.price, image: item.image })}
                      aria-label={`Add ${item.name} to bag`}
                      className="inline-flex size-10 shrink-0 items-center justify-center border border-line transition-colors duration-200 hover:border-char hover:bg-char hover:text-paper"
                    >
                      <Plus className="size-4" aria-hidden />
                    </button>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
              <p className="text-[14px] text-mute">
                Complete look <span className="ml-2 text-[20px] font-semibold text-char">{inr(total)}</span>
              </p>
              <button type="button" onClick={addLook} className="btn btn-royal">
                Add the look <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
