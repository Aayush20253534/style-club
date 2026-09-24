"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Category } from "@/lib/data";

type BagLine = { id: string; name: string; price: number; image: string; qty: number };

type ShopState = {
  bag: BagLine[];
  bagCount: number;
  wishlist: string[];
  addToBag: (item: Omit<BagLine, "qty">) => void;
  addManyToBag: (items: Omit<BagLine, "qty">[], label: string) => void;
  removeFromBag: (id: string) => void;
  toggleWish: (id: string) => void;
  isWished: (id: string) => boolean;
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  /** Lets header links pre-select a New Arrivals filter. */
  filter: Category | "all";
  setFilter: (c: Category | "all") => void;
};

const ShopContext = createContext<ShopState | null>(null);

const STORAGE_KEY = "styleclub:v1";

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}

export default function ShopProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = useState<BagLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [toast, setToast] = useState<{ key: number; text: string } | null>(null);
  const hydrated = useRef(false);
  const toastTimer = useRef<number | undefined>(undefined);

  // Restore after mount so server and client markup match.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { bag?: BagLine[]; wishlist?: string[] };
        if (Array.isArray(saved.bag)) setBag(saved.bag);
        if (Array.isArray(saved.wishlist)) setWishlist(saved.wishlist);
      }
    } catch {
      /* storage unavailable — keep in-memory state */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ bag, wishlist }));
    } catch {
      /* ignore quota / privacy mode */
    }
  }, [bag, wishlist]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const notify = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current);
    setToast({ key: Date.now(), text });
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const addToBag = useCallback(
    (item: Omit<BagLine, "qty">) => {
      setBag((prev) => {
        const existing = prev.find((l) => l.id === item.id);
        if (existing) return prev.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l));
        return [...prev, { ...item, qty: 1 }];
      });
      notify(`${item.name} added to your bag`);
    },
    [notify],
  );

  const addManyToBag = useCallback(
    (items: Omit<BagLine, "qty">[], label: string) => {
      setBag((prev) => {
        let next = prev;
        for (const item of items) {
          next = next.some((l) => l.id === item.id)
            ? next.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l))
            : [...next, { ...item, qty: 1 }];
        }
        return next;
      });
      notify(label);
    },
    [notify],
  );

  const removeFromBag = useCallback((id: string) => {
    setBag((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const toggleWish = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
  }, []);

  const value = useMemo<ShopState>(
    () => ({
      bag,
      bagCount: bag.reduce((n, l) => n + l.qty, 0),
      wishlist,
      addToBag,
      addManyToBag,
      removeFromBag,
      toggleWish,
      isWished: (id) => wishlist.includes(id),
      bagOpen,
      setBagOpen,
      searchOpen,
      setSearchOpen,
      filter,
      setFilter,
    }),
    [bag, wishlist, addToBag, addManyToBag, removeFromBag, toggleWish, bagOpen, searchOpen, filter],
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 bg-char px-5 py-3.5 text-[13px] text-paper shadow-[0_12px_32px_-12px_rgb(0_0_0/0.45)]"
            >
              <Check className="size-4 text-[#8fa6ff]" aria-hidden />
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ShopContext.Provider>
  );
}
