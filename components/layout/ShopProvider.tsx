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
import { allProducts, look, type Category } from "@/lib/data";

type BagLine = { id: string; name: string; image: string; qty: number };
type TrustedBagItem = Omit<BagLine, "qty">;

type ShopState = {
  bag: BagLine[];
  bagCount: number;
  wishlist: string[];
  addToBag: (item: TrustedBagItem) => void;
  addManyToBag: (items: TrustedBagItem[], label: string) => void;
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

const STORAGE_KEY = "styleclub:v2";
const LEGACY_STORAGE_KEY = "styleclub:v1";
const MAX_BAG_LINES = 50;
const MAX_ITEM_QTY = 20;
const MAX_WISHLIST = 100;

const trustedCatalog = new Map<string, TrustedBagItem>();

for (const item of [...allProducts, ...look.items]) {
  if (!trustedCatalog.has(item.id)) {
    trustedCatalog.set(item.id, {
      id: item.id,
      name: item.name,
      image: item.image,
    });
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function trustedItem(id: unknown) {
  return typeof id === "string" ? trustedCatalog.get(id) : undefined;
}

function safeQty(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return 1;
  return Math.min(MAX_ITEM_QTY, Math.max(1, Math.trunc(value)));
}

function restoreBag(value: unknown): BagLine[] {
  if (!Array.isArray(value)) return [];

  const restored = new Map<string, BagLine>();

  for (const entry of value.slice(0, MAX_BAG_LINES)) {
    if (!isRecord(entry)) continue;
    const item = trustedItem(entry.id);
    if (!item) continue;

    const qty = safeQty(entry.qty);
    const existing = restored.get(item.id);
    restored.set(item.id, {
      ...item,
      qty: Math.min(MAX_ITEM_QTY, (existing?.qty ?? 0) + qty),
    });
  }

  return [...restored.values()].slice(0, MAX_BAG_LINES);
}

function restoreWishlist(value: unknown) {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  for (const id of value) {
    if (typeof id !== "string" || !trustedCatalog.has(id)) continue;
    seen.add(id);
    if (seen.size >= MAX_WISHLIST) break;
  }
  return [...seen];
}

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
  const [storageReady, setStorageReady] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);

  // Restore after mount so server and client markup match. Only IDs and
  // quantities survive storage; names and images come from our catalog.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        const saved: unknown = JSON.parse(raw);
        if (isRecord(saved)) {
          setBag(restoreBag(saved.bag));
          setWishlist(restoreWishlist(saved.wishlist));
        }
      }
    } catch {
      /* storage unavailable or malformed — keep in-memory state */
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 2,
          bag: bag.map(({ id, qty }) => ({ id, qty })),
          wishlist,
        }),
      );
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      /* ignore quota / privacy mode */
    }
  }, [bag, wishlist, storageReady]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const notify = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current);
    setToast({ key: Date.now(), text });
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const addToBag = useCallback(
    (candidate: TrustedBagItem) => {
      const item = trustedItem(candidate.id);
      if (!item) return;

      setBag((prev) => {
        const existing = prev.find((line) => line.id === item.id);
        if (existing) {
          return prev.map((line) =>
            line.id === item.id
              ? { ...line, qty: Math.min(MAX_ITEM_QTY, line.qty + 1) }
              : line,
          );
        }
        if (prev.length >= MAX_BAG_LINES) return prev;
        return [...prev, { ...item, qty: 1 }];
      });
      notify(`${item.name} added to your bag`);
    },
    [notify],
  );

  const addManyToBag = useCallback(
    (candidates: TrustedBagItem[], label: string) => {
      const items = candidates
        .map((candidate) => trustedItem(candidate.id))
        .filter((item): item is TrustedBagItem => Boolean(item));

      if (!items.length) return;

      setBag((prev) => {
        let next = prev;
        for (const item of items) {
          const existing = next.find((line) => line.id === item.id);
          if (existing) {
            next = next.map((line) =>
              line.id === item.id
                ? { ...line, qty: Math.min(MAX_ITEM_QTY, line.qty + 1) }
                : line,
            );
          } else if (next.length < MAX_BAG_LINES) {
            next = [...next, { ...item, qty: 1 }];
          }
        }
        return next;
      });
      notify(label);
    },
    [notify],
  );

  const removeFromBag = useCallback((id: string) => {
    setBag((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const toggleWish = useCallback((id: string) => {
    if (!trustedCatalog.has(id)) return;
    setWishlist((prev) => {
      if (prev.includes(id)) return prev.filter((wishId) => wishId !== id);
      if (prev.length >= MAX_WISHLIST) return prev;
      return [...prev, id];
    });
  }, []);

  const value = useMemo<ShopState>(
    () => ({
      bag,
      bagCount: bag.reduce((n, line) => n + line.qty, 0),
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
