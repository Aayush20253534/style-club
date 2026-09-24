"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import { MaskLines, Reveal } from "@/components/ui/Reveal";
import { useShop } from "@/components/layout/ShopProvider";
import { CATEGORY_LABEL, newArrivals, type Category } from "@/lib/data";

const FILTERS: (Category | "all")[] = ["all", "women", "men", "kids", "accessories"];

export default function NewArrivals() {
  const { filter, setFilter } = useShop();
  const reduce = useReducedMotion();
  const items = filter === "all" ? newArrivals.slice(0, 8) : newArrivals.filter((p) => p.category === filter);

  return (
    <section id="new-arrivals" aria-labelledby="new-arrivals-title" className="pb-24 pt-24 md:pb-36 md:pt-36">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
          <div className="min-w-0 md:col-span-7">
            <Reveal>
              <p className="eyebrow text-mute">01 — Just landed</p>
            </Reveal>
            <h2 id="new-arrivals-title" className="display mt-5 text-[17vw] md:text-[clamp(5rem,9vw,9.5rem)]">
              <MaskLines lines={["New", "Arrivals"]} />
            </h2>
          </div>
          <div className="min-w-0 md:col-span-5">
            <Reveal delay={0.1}>
              <p className="max-w-md text-[15px] leading-relaxed text-mute">
                Fresh drops every week across our five Prayagraj stores — co-ords and kurta sets, easy denim, and the
                pieces kids actually want to wear.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <LayoutGroup id="arrivals-filter">
                <div role="tablist" aria-label="Filter new arrivals" className="no-scrollbar -mx-1 mt-8 flex gap-1 overflow-x-auto">
                  {FILTERS.map((f) => {
                    const active = f === filter;
                    return (
                      <button
                        key={f}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setFilter(f)}
                        className={`relative shrink-0 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] sm:px-3.5 sm:text-[11.5px] sm:tracking-[0.18em] transition-colors duration-200 ${
                          active ? "text-paper" : "text-char hover:text-royal"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="arrivals-pill"
                            className="absolute inset-0 bg-char"
                            transition={{ type: "spring", stiffness: 420, damping: 38 }}
                          />
                        )}
                        <span className="relative">{f === "all" ? "All" : CATEGORY_LABEL[f]}</span>
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>
            </Reveal>
          </div>
        </div>

        <Reveal y={40}>
        <motion.ul layout={!reduce} className="mt-14 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:mt-20 lg:grid-cols-4 lg:gap-y-14">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((p, i) => (
              <motion.li
                key={p.id}
                layout={!reduce}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : Math.min(i, 7) * 0.035 }}
              >
                <ProductCard product={p} label="New" />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        </Reveal>
      </div>
    </section>
  );
}
