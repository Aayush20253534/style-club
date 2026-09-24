"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, Phone, Search, X } from "lucide-react";
import RemoteImage from "@/components/ui/RemoteImage";
import { useShop } from "./ShopProvider";
import { getLenis, scrollToTarget } from "./SmoothScroll";
import { allProducts, CATEGORY_LABEL, contact, inr, newArrivals } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const lenis = getLenis();
    lenis?.stop();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      lenis?.start();
      html.style.overflow = prev;
    };
  }, [locked]);
}

function useEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onClose]);
}

export function BagDrawer() {
  const { bagOpen, setBagOpen, bag, removeFromBag, wishlist, toggleWish, addToBag } = useShop();
  const [tab, setTab] = useState<"bag" | "saved">("bag");
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = () => setBagOpen(false);
  useScrollLock(bagOpen);
  useEscape(bagOpen, close);

  useEffect(() => {
    if (bagOpen) {
      setTab(bag.length === 0 && wishlist.length > 0 ? "saved" : "bag");
      requestAnimationFrame(() => closeRef.current?.focus());
    }
    // Only when the drawer opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bagOpen]);

  const saved = allProducts.filter((p) => wishlist.includes(p.id));
  const subtotal = bag.reduce((n, l) => n + l.price * l.qty, 0);

  return (
    <AnimatePresence>
      {bagOpen && (
        <div className="fixed inset-0 z-[65]" role="dialog" aria-modal="true" aria-label="Your bag">
          <motion.div
            className="absolute inset-0 bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          />
          <motion.aside
            data-lenis-prevent
            initial={{ x: reduce ? 0 : "100%", opacity: reduce ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduce ? 0 : "100%", opacity: reduce ? 0 : 1 }}
            transition={{ duration: reduce ? 0.15 : 0.5, ease: EASE }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-paper text-char"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-6 md:h-[72px]">
              <div role="tablist" aria-label="Bag and saved items" className="flex gap-6">
                {(["bag", "saved"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={`eyebrow relative py-2 text-[11px] ${tab === t ? "text-char" : "text-mute"}`}
                  >
                    {t === "bag" ? `Bag (${bag.reduce((n, l) => n + l.qty, 0)})` : `Saved (${wishlist.length})`}
                    {tab === t && <motion.span layoutId="drawer-tab" className="absolute inset-x-0 -bottom-px h-px bg-char" />}
                  </button>
                ))}
              </div>
              <button ref={closeRef} type="button" onClick={close} aria-label="Close" className="-mr-2 inline-flex size-11 items-center justify-center">
                <X className="size-5" strokeWidth={1.6} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {tab === "bag" ? (
                bag.length === 0 ? (
                  <Empty text="Your bag is empty." cta="Browse new arrivals" onClick={() => (close(), scrollToTarget("#new-arrivals", -72))} />
                ) : (
                  <ul>
                    {bag.map((l) => (
                      <li key={l.id} className="flex gap-4 border-b border-line py-5">
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-bone">
                          <RemoteImage photo={l.image} alt="" fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="text-[14px] font-medium leading-snug">{l.name}</p>
                          <p className="mt-1 text-[13px] text-mute">
                            {inr(l.price)} {l.qty > 1 && <span>× {l.qty}</span>}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeFromBag(l.id)}
                            className="link-draw mt-auto self-start text-[12px] text-mute hover:text-char"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-[14px] font-semibold">{inr(l.price * l.qty)}</p>
                      </li>
                    ))}
                  </ul>
                )
              ) : saved.length === 0 ? (
                <Empty text="Tap the heart on anything you like to save it here." cta="Browse new arrivals" onClick={() => (close(), scrollToTarget("#new-arrivals", -72))} />
              ) : (
                <ul>
                  {saved.map((p) => (
                    <li key={p.id} className="flex gap-4 border-b border-line py-5">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-bone">
                        <RemoteImage photo={p.image} alt="" fill sizes="80px" className="object-cover" style={{ objectPosition: p.pos }} />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="text-[14px] font-medium leading-snug">{p.name}</p>
                        <p className="mt-1 text-[13px] text-mute">{inr(p.price)}</p>
                        <div className="mt-auto flex gap-4">
                          <button
                            type="button"
                            onClick={() => addToBag({ id: p.id, name: p.name, price: p.price, image: p.image })}
                            className="link-draw text-[12px] font-medium text-royal"
                          >
                            Move to bag
                          </button>
                          <button type="button" onClick={() => toggleWish(p.id)} className="link-draw text-[12px] text-mute hover:text-char">
                            Remove
                          </button>
                        </div>
                      </div>
                      <Heart className="size-4 fill-royal text-royal" aria-hidden />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {tab === "bag" && bag.length > 0 && (
              <div className="border-t border-line px-6 py-6">
                <div className="flex items-baseline justify-between">
                  <p className="eyebrow text-mute">Subtotal</p>
                  <p className="text-[20px] font-semibold">{inr(subtotal)}</p>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-mute">
                  Call us to reserve these pieces for pickup at your nearest Style Club.
                </p>
                <div className="mt-5 grid gap-2">
                  <a href={contact.phones[0].href} className="btn btn-royal justify-center">
                    <Phone className="size-4" aria-hidden /> Call to reserve
                  </a>
                  <button type="button" onClick={() => (close(), scrollToTarget("#stores", -72))} className="btn btn-outline justify-center">
                    Find a store
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function Empty({ text, cta, onClick }: { text: string; cta: string; onClick: () => void }) {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-5 py-16">
      <p className="font-serif text-[28px] italic leading-tight">{text}</p>
      <button type="button" onClick={onClick} className="btn btn-outline">
        {cta} <ArrowRight className="size-4" aria-hidden />
      </button>
    </div>
  );
}

const SUGGESTIONS = ["Kurta", "Denim", "Co-ord", "Hoodie", "Kids", "Sneakers"];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, setFilter } = useShop();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();
  const close = () => setSearchOpen(false);
  useScrollLock(searchOpen);
  useEscape(searchOpen, close);

  useEffect(() => {
    if (searchOpen) {
      setQ("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [searchOpen]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return allProducts
      .filter((p) => `${p.name} ${CATEGORY_LABEL[p.category]}`.toLowerCase().includes(term))
      .slice(0, 8);
  }, [q]);

  const open = (id: string, category: (typeof allProducts)[number]["category"]) => {
    const isNew = newArrivals.some((p) => p.id === id);
    if (isNew) setFilter(category);
    close();
    requestAnimationFrame(() => scrollToTarget(isNew ? "#new-arrivals" : "#trending", -72));
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[65]" role="dialog" aria-modal="true" aria-label="Search">
          <motion.div
            className="absolute inset-0 bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            data-lenis-prevent
            initial={{ y: reduce ? 0 : "-100%", opacity: reduce ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduce ? 0 : "-100%", opacity: reduce ? 0 : 1 }}
            transition={{ duration: reduce ? 0.15 : 0.5, ease: EASE }}
            className="absolute inset-x-0 top-0 max-h-[88svh] overflow-y-auto bg-paper text-char"
          >
            <div className="container-x py-6 md:py-10">
              <div className="flex items-center gap-4 border-b border-char pb-3">
                <Search className="size-5 shrink-0" strokeWidth={1.6} aria-hidden />
                <label htmlFor="site-search" className="sr-only">
                  Search products
                </label>
                <input
                  ref={inputRef}
                  id="site-search"
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search kurtas, denim, co-ords…"
                  autoComplete="off"
                  className="display w-full bg-transparent text-[36px] placeholder:text-char/25 focus:outline-none md:text-[56px]"
                />
                <button type="button" onClick={close} aria-label="Close search" className="inline-flex size-11 shrink-0 items-center justify-center">
                  <X className="size-5" strokeWidth={1.6} />
                </button>
              </div>

              {!q.trim() ? (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="eyebrow mr-2 text-mute">Popular</span>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQ(s)}
                      className="border border-line px-3.5 py-2 text-[13px] transition-colors hover:border-char"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : results.length === 0 ? (
                <p className="mt-8 text-[15px] text-mute" role="status">
                  Nothing matches “{q}” online yet — our stores carry the full range.
                </p>
              ) : (
                <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4" aria-live="polite">
                  {results.map((p) => (
                    <li key={p.id}>
                      <button type="button" onClick={() => open(p.id, p.category)} className="group block w-full text-left">
                        <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                          <RemoteImage
                            photo={p.image}
                            alt=""
                            fill
                            sizes="(min-width: 640px) 22vw, 46vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            style={{ objectPosition: p.pos }}
                          />
                        </div>
                        <p className="mt-2.5 text-[13.5px] font-medium">{p.name}</p>
                        <p className="text-[13px] text-mute">{inr(p.price)}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
