import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import { contact, stores } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";
import { openStoreIds, storeCopy, type OpenStoreId } from "@/lib/seo-pages";
import { buildSiteJsonLd, serializeJsonLd } from "@/lib/structured-data";
import storefront from "@/public/brand/storefront.jpg";
import interior from "@/public/brand/interior.jpg";

type Props = { params: Promise<{ slug: string }> };

function getStore(slug: string) {
  if (!openStoreIds.includes(slug as OpenStoreId)) return null;
  return stores.find((store) => store.id === slug && !store.comingSoon) ?? null;
}

export function generateStaticParams() {
  return openStoreIds.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) return {};
  const copy = storeCopy[slug as OpenStoreId];
  const url = `${getSiteUrl()}/stores/${slug}`;
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

export default async function StorePage({ params }: Props) {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) notFound();
  const copy = storeCopy[slug as OpenStoreId];
  const base = getSiteUrl();
  const url = `${base}/stores/${slug}`;
  const graph = buildSiteJsonLd(base)["@graph"];
  const storeNode = graph.find((node) => node["@id"] === `${base}/#store-${slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: copy.title,
        description: copy.description,
        isPartOf: { "@id": `${base}/#website` },
        mainEntity: { "@id": `${base}/#store-${slug}` },
      },
      storeNode,
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="main" tabIndex={-1}>
        <section className="on-dark bg-night pb-20 pt-36 text-paper md:pb-28 md:pt-44">
          <div className="container-x">
            <nav aria-label="Breadcrumb" className="eyebrow flex flex-wrap gap-3 text-[10px] text-paper/60">
              <Link href="/" className="link-draw hover:text-white">Style Club</Link><span aria-hidden> / </span>
              <Link href="/#stores" className="link-draw hover:text-white">Stores</Link><span aria-hidden> / </span>
              <span aria-current="page" className="text-white">{store.name}</span>
            </nav>
            <p className="eyebrow mt-16 text-copper">{copy.area}</p>
            <h1 className="display mt-5 max-w-5xl text-[clamp(4.5rem,13vw,12rem)]">Style Club<br />{store.name}</h1>
            <p className="mt-9 max-w-2xl font-serif text-[clamp(1.65rem,3vw,2.8rem)] italic leading-tight text-paper/85">{copy.lead}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              {store.mapUrl && <a className="btn btn-light" href={store.mapUrl} target="_blank" rel="noopener noreferrer">Get directions ↗</a>}
              <a className="btn btn-ghost-light" href={contact.phones[0].href}>Call {contact.phones[0].display}</a>
            </div>
          </div>
        </section>

        <section className="container-x grid gap-14 py-20 md:grid-cols-12 md:gap-16 md:py-32">
          <div className="md:col-span-6">
            <p className="eyebrow text-mute">Plan your visit</p>
            <h2 className="display mt-5 text-[clamp(3.25rem,6vw,6rem)]">Come try<br />it on.</h2>
            <p className="mt-8 max-w-xl text-[16px] leading-relaxed text-mute">{copy.localDetail}</p>
          </div>
          <div className="border-t border-line pt-7 md:col-span-5 md:col-start-8">
            <h2 className="eyebrow text-mute">Style Club {store.name}</h2>
            <address className="mt-5 font-serif text-[clamp(1.8rem,3vw,2.6rem)] not-italic leading-tight">{store.address}</address>
            {store.hours && <p className="mt-6 text-sm text-mute">{store.hours}</p>}
            <a className="link-draw mt-8 inline-block text-sm font-semibold" href={contact.phones[0].href}>Call for store information ↗</a>
          </div>
        </section>

        {store.flagship && (
          <section className="container-x grid gap-4 pb-24 md:grid-cols-2 md:pb-32">
            <figure>
              <Image src={storefront} alt="Style Club Katra storefront at Netram Chauraha" className="aspect-[4/3] w-full object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
              <figcaption className="eyebrow mt-3 text-[10px] text-mute">Katra flagship · exterior</figcaption>
            </figure>
            <figure>
              <Image src={interior} alt="Clothing racks inside Style Club Katra" className="aspect-[4/3] w-full object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
              <figcaption className="eyebrow mt-3 text-[10px] text-mute">Katra flagship · interior</figcaption>
            </figure>
          </section>
        )}

        <section className="bg-bone py-20 md:py-28">
          <div className="container-x">
            <p className="eyebrow text-mute">Explore the edit</p>
            <h2 className="display mt-5 text-[clamp(3.25rem,7vw,7rem)]">For the whole family.</h2>
            <p className="mt-6 max-w-2xl text-mute">Browse men’s, women’s and kids’ clothing, then visit the branch to find what is available in store.</p>
            <div className="mt-12 grid gap-3 md:grid-cols-3">
              {(["women", "men", "kids"] as const).map((department) => (
                <Link key={department} href={`/collections/${department}`} className="group flex min-h-40 flex-col justify-between bg-paper p-6 transition-colors hover:bg-white">
                  <span className="eyebrow text-mute">Style Club / {store.name}</span>
                  <span className="display flex items-end justify-between text-[clamp(2.5rem,4vw,4rem)] capitalize">{department}<span className="text-xl transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="container-x py-20 md:py-28">
          <h2 className="display text-[clamp(3rem,6vw,6rem)]">Find another store.</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {stores.filter((other) => !other.comingSoon && other.id !== store.id).map((other) => (
              <Link key={other.id} href={`/stores/${other.id}`} className="border-t border-line py-5 text-lg font-semibold hover:text-royal">Style Club {other.name} ↗</Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
