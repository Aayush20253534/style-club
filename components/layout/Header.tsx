"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Search, ShoppingBag, X } from "lucide-react";
import Logo from "./Logo";
import { useShop } from "./ShopProvider";
import { getLenis, scrollToTarget } from "./SmoothScroll";
import type { Category } from "@/lib/data";
import { contact, stores } from "@/lib/data";

type NavItem = { label: string; target: string; filter?: Category | "all" };

const NAV: NavItem[] = [
  { label: "New In", target: "#new-arrivals", filter: "all" },
  { label: "Women", target: "#new-arrivals", filter: "women" },
  { label: "Men", target: "#new-arrivals", filter: "men" },
  { label: "Kids", target: "#new-arrivals", filter: "kids" },
  { label: "Trending", target: "#trending" },
  { label: "Stores", target: "#stores" },
];

export default function Header() {
  const { bagCount, wishlist, setBagOpen, setSearchOpen, setFilter } = useShop();
  const [onDark, setOnDark] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();
  const lastY = useRef(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const after = document.getElementById("after-film");
      setOnDark(after ? after.getBoundingClientRect().top > 64 : false);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 160);
        lastY.current = y;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (menuOpen) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const go = (item: NavItem) => {
    if (item.filter) setFilter(item.filter);
    setMenuOpen(false);
    // Let the drawer release the scroll lock before travelling.
    requestAnimationFrame(() => scrollToTarget(item.target, -72));
  };

  const dark = onDark && !menuOpen;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[80] bg-royal px-4 py-3 text-sm text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <motion.header
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={{ duration: reduce ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          dark ? "on-dark text-white" : "border-b border-line/70 bg-paper text-char"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-6 md:h-[72px]">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#top");
            }}
            aria-label="Style Club — back to top"
            className="shrink-0"
          >
            <Logo />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => go(item)}
                    className="link-draw pb-1 text-[12px] font-semibold uppercase tracking-[0.2em]"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <IconButton label="Search products" onClick={() => setSearchOpen(true)}>
              <Search className="size-[19px]" strokeWidth={1.6} />
            </IconButton>
            <IconButton label={`Saved items (${wishlist.length})`} onClick={() => setBagOpen(true)} className="hidden sm:inline-flex">
              <Heart className="size-[19px]" strokeWidth={1.6} />
              <Count n={wishlist.length} dark={dark} />
            </IconButton>
            <IconButton label={`Bag (${bagCount} items)`} onClick={() => setBagOpen(true)}>
              <ShoppingBag className="size-[19px]" strokeWidth={1.6} />
              <Count n={bagCount} dark={dark} />
            </IconButton>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="relative -mr-2 inline-flex size-11 items-center justify-center lg:hidden"
            >
              {menuOpen ? (
                <X className="size-5" strokeWidth={1.6} />
              ) : (
                <span aria-hidden className="flex w-5 flex-col gap-[5px]">
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-3/4 bg-current" />
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-paper pt-16 text-char lg:hidden"
          >
            <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto pb-10 pt-8">
              <ul className="border-t border-line">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.05 + i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-line"
                  >
                    <button
                      type="button"
                      onClick={() => go(item)}
                      className="display flex w-full items-baseline justify-between py-4 text-left text-[44px]"
                    >
                      {item.label}
                      <span className="font-sans text-xs font-semibold tracking-[0.2em] text-mute">0{i + 1}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduce ? 0 : 0.35 }}
                className="mt-10 grid gap-6 text-sm"
              >
                <div>
                  <p className="eyebrow text-mute">Stores</p>
                  <p className="mt-2">{stores.map((s) => s.name).join(" · ")}</p>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <a href={contact.phones[0].href} className="link-draw">
                    Call {contact.phones[0].display}
                  </a>
                  <a href={contact.instagram.url} target="_blank" rel="noreferrer" className="link-draw">
                    Instagram {contact.instagram.handle}
                  </a>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconButton({
  label,
  onClick,
  children,
  className = "",
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`relative inline-flex size-11 items-center justify-center transition-opacity hover:opacity-70 ${className}`}
    >
      {children}
    </button>
  );
}

function Count({ n, dark }: { n: number; dark: boolean }) {
  if (!n) return null;
  return (
    <span
      aria-hidden
      className={`absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
        dark ? "bg-white text-char" : "bg-royal text-white"
      }`}
    >
      {n}
    </span>
  );
}
