import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import RemoteImage from "@/components/ui/RemoteImage";
import { allProducts, catalogGroups, departments, stores } from "@/lib/data";
import { departmentCopy, departmentIds, type DepartmentId } from "@/lib/seo-pages";
import { getSiteUrl } from "@/lib/site";
import { serializeJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ category: string }> };

function getDepartment(category: string) {
  if (!departmentIds.includes(category as DepartmentId)) return null;
  return departments.find((department) => department.id === category) ?? null;
}

export function generateStaticParams() {
  return departmentIds.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const department = getDepartment(category);
  if (!department) return {};
  const copy = departmentCopy[department.id];
  const url = `${getSiteUrl()}/collections/${category}`;
  return {
    title: { absolute: copy.title },
    description: copy.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website", locale: "en_IN", siteName: "Style Club", url,
      title: copy.title, description: copy.description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Style Club fashion" }],
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images: ["/og.jpg"] },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { category } = await params;
  const department = getDepartment(category);
  if (!department) notFound();
  const copy = departmentCopy[department.id];
  const url = `${getSiteUrl()}/collections/${department.id}`;
  const products = allProducts.filter((product) => product.category === department.id && !product.groupId);
  const groups = catalogGroups.filter((group) => group.category === department.id);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name: copy.title,
    description: copy.description,
    isPartOf: { "@id": `${getSiteUrl()}/#website` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="main" tabIndex={-1}>
        <section className="on-dark bg-night pt-32 text-paper md:pt-40">
          <div className="container-x">
            <nav aria-label="Breadcrumb" className="eyebrow flex gap-3 text-[10px] text-paper/60">
              <Link href="/" className="link-draw hover:text-white">Style Club</Link><span aria-hidden> / </span>
              <span aria-current="page" className="text-white">{department.title}</span>
            </nav>
            <div className="mt-12 grid items-end gap-10 md:grid-cols-12 md:gap-14">
              <div className="pb-16 md:col-span-7 md:pb-24">
                <p className="eyebrow text-copper">Style Club · Prayagraj &amp; Bharwari</p>
                <h1 className="display mt-5 text-[clamp(5rem,15vw,14rem)]">{department.title}</h1>
                <p className="mt-8 max-w-xl font-serif text-[clamp(1.7rem,3vw,2.8rem)] italic leading-tight text-paper/85">{copy.lead}</p>
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-paper/65">{copy.detail}</p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden bg-ink md:col-span-5 md:aspect-[3/4]">
                <RemoteImage photo={department.image} alt={department.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" style={{ objectPosition: department.pos }} priority />
              </div>
            </div>
          </div>
        </section>

        <section className="container-x py-20 md:py-28" aria-labelledby="categories-title">
          <p className="eyebrow text-mute">Explore the collection</p>
          <h2 id="categories-title" className="display mt-5 text-[clamp(3.25rem,7vw,7rem)]">Find your style.</h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-mute">
            Browse the styles below, then visit a Style Club store to check current colours, sizes and availability.
          </p>
          <nav aria-label="Collection categories" className="mt-8 flex flex-wrap gap-2">
            {groups.map((group) => (
              <a key={group.id} href={`#${group.id}`} className="border border-line px-4 py-2 text-[12px] font-semibold uppercase tracking-wider transition-colors hover:border-char hover:bg-char hover:text-paper">
                {group.title}
              </a>
            ))}
          </nav>

          {groups.map((group) => {
            const fromPrice = Math.min(...group.products.map((product) => product.fromPrice ?? Infinity));
            return (
              <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="scroll-mt-28 border-b border-line py-14 last:border-0 md:py-20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="eyebrow text-mute">{group.summary}</p>
                    <h3 id={`${group.id}-title`} className="mt-3 font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-tight">{group.title}</h3>
                  </div>
                  <p className="text-sm font-medium text-mute">Styles from <span className="font-semibold text-char">₹{fromPrice.toLocaleString("en-IN")}</span></p>
                </div>
                <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
                  {group.products.map((product) => <li key={product.id}><ProductCard product={product} /></li>)}
                </ul>
              </section>
            );
          })}
          <p className="max-w-3xl text-[12px] leading-relaxed text-mute">
            Model images illustrate clothing categories and are not verified photos of specific store items. “Styles from” amounts are the lowest category prices in the supplied list; confirm current prices and stock with your nearest branch.
          </p>
        </section>

        <section className="container-x border-t border-line py-20 md:py-28">
          <p className="eyebrow text-mute">Featured styles</p>
          <h2 className="display mt-5 text-[clamp(3.25rem,7vw,7rem)]">More to explore.</h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-mute">These looks show the style of the collection. Ask your nearest Style Club branch about current sizes and availability.</p>
          <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
            {products.map((product) => <li key={product.id}><ProductCard product={product} /></li>)}
          </ul>
        </section>

        <section className="bg-bone py-20 md:py-28">
          <div className="container-x">
            <p className="eyebrow text-mute">Visit us</p>
            <h2 className="display mt-5 text-[clamp(3.25rem,7vw,7rem)]">Try it in store.</h2>
            <p className="mt-6 max-w-2xl text-mute">Find Style Club in Katra, Naini and Phaphamau in Prayagraj, or in Bharwari, Kaushambi.</p>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stores.filter((store) => !store.comingSoon).map((store) => (
                <Link key={store.id} href={`/stores/${store.id}`} className="group flex min-h-44 flex-col justify-between bg-paper p-6 transition-colors hover:bg-white">
                  <span className="eyebrow text-mute">Style Club</span>
                  <span className="display flex items-end justify-between text-[clamp(2rem,3vw,3rem)]">{store.name}<span className="text-xl transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <nav aria-label="Other departments" className="container-x flex flex-wrap gap-x-8 gap-y-3 py-12 text-sm font-semibold uppercase tracking-widest">
          <Link href="/" className="link-draw">Home</Link>
          {departments.filter((other) => other.id !== department.id).map((other) => (
            <Link key={other.id} href={`/collections/${other.id}`} className="link-draw">{other.title} ↗</Link>
          ))}
        </nav>
      </main>
      <Footer />
    </>
  );
}
