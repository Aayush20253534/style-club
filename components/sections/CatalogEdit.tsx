import Link from "next/link";
import RemoteImage from "@/components/ui/RemoteImage";
import { catalogGroups } from "@/lib/data";

export default function CatalogEdit() {
  return (
    <section id="catalog" aria-labelledby="catalog-title" className="scroll-mt-20 bg-paper py-24 md:scroll-mt-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-mute">06 — Explore the range</p>
            <h2 id="catalog-title" className="display mt-5 text-[clamp(3.75rem,8vw,8rem)]">Find your style.</h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-mute">
            Browse women’s, men’s and kidswear by collection. Starting prices are indicative; visit a store for current styles, sizes and prices.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:mt-16 lg:grid-cols-3 lg:gap-y-14">
          {catalogGroups.map((group) => {
            const cover = group.products[0];
            const fromPrice = Math.min(...group.products.map((product) => product.fromPrice ?? Infinity));
            return (
              <li key={group.id}>
                <Link href={`/collections/${group.category}#${group.id}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal">
                  <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                    <RemoteImage photo={cover.image} alt={cover.alt} fill sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 48vw" className="object-cover transition-transform duration-[900ms] ease-[var(--ease-editorial)] group-hover:scale-[1.045]" />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-[clamp(1.45rem,2.5vw,2.3rem)] leading-tight text-char">{group.title}</h3>
                      <p className="mt-1 text-[12px] text-mute sm:text-[13px]">Styles from ₹{fromPrice.toLocaleString("en-IN")}</p>
                    </div>
                    <span className="mt-1 text-xl text-char transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden>↗</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 max-w-2xl text-[12px] leading-relaxed text-mute">
          Images illustrate each clothing category. They do not show a verified in-store item. Starting prices come from the supplied category list and may vary by style and store.
        </p>
      </div>
    </section>
  );
}
