"use client";

import { Heart, Plus } from "lucide-react";
import RemoteImage from "./RemoteImage";
import { useShop } from "@/components/layout/ShopProvider";
import { discount, inr, type Product } from "@/lib/data";

export default function ProductCard({
  product,
  label,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw",
  className = "",
}: {
  product: Product;
  label?: string;
  sizes?: string;
  className?: string;
}) {
  const { addToBag, toggleWish, isWished } = useShop();
  const wished = isWished(product.id);
  const add = () => addToBag({ id: product.id, name: product.name, price: product.price, image: product.image });

  return (
    <article className={`group relative ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-bone">
        <RemoteImage
          photo={product.image}
          alt={product.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[900ms] ease-[var(--ease-editorial)] group-hover:scale-[1.045]"
          style={{ objectPosition: product.pos ?? "50% 50%" }}
        />

        {label && (
          <span className="eyebrow absolute left-3 top-3 bg-paper px-2 py-1 text-[9.5px] tracking-[0.22em] text-char">
            {label}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWish(product.id)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          className="absolute right-2 top-2 inline-flex size-10 items-center justify-center text-char transition-transform duration-200 active:scale-90"
        >
          <span className="absolute inset-1.5 bg-paper/95" aria-hidden />
          <Heart
            className={`relative size-[17px] transition-colors duration-200 ${wished ? "fill-royal text-royal" : ""}`}
            strokeWidth={1.7}
          />
        </button>

        {/* Pointer devices: quick-add slides up on hover. Touch: a persistent add button. */}
        <button
          type="button"
          onClick={add}
          className="absolute inset-x-0 bottom-0 hidden h-12 translate-y-full items-center justify-center gap-2 bg-char text-[11px] font-semibold uppercase tracking-[0.2em] text-paper transition-transform duration-300 ease-[var(--ease-editorial)] focus-visible:translate-y-0 group-hover:translate-y-0 [@media(hover:hover)]:flex"
        >
          <Plus className="size-4" aria-hidden /> Add to bag
        </button>
        <button
          type="button"
          onClick={add}
          aria-label={`Add ${product.name} to bag`}
          className="absolute bottom-2 right-2 inline-flex size-10 items-center justify-center bg-paper text-char active:scale-95 [@media(hover:hover)]:hidden"
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <h3 className="text-[13.5px] font-medium leading-snug text-char md:text-[14.5px]">{product.name}</h3>
        <div className="mt-1 hidden shrink-0 gap-1.5 sm:flex" aria-label={`${product.colors.length} colours`}>
          {product.colors.map((c) => (
            <span key={c} className="size-2.5 rounded-full ring-1 ring-black/10" style={{ background: c }} />
          ))}
        </div>
      </div>
      <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-[13px]">
        <span className="font-semibold text-char">{inr(product.price)}</span>
        <span className="text-mute line-through decoration-mute/60">
          <span className="sr-only">MRP </span>
          {inr(product.mrp)}
        </span>
        <span className="font-medium text-royal">{discount(product)}% off</span>
      </p>
    </article>
  );
}
