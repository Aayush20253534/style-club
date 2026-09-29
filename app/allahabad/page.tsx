import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { contact, departments, stores } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";
import { serializeJsonLd } from "@/lib/structured-data";

const title = "Clothing Stores in Allahabad (Prayagraj) | Style Club";
const description =
  "Looking for Style Club in Allahabad? Visit our clothing stores in Katra, Naini and Phaphamau, Prayagraj. Browse men's, women's and kids' fashion and get directions.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${getSiteUrl()}/allahabad` },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Style Club",
    url: `${getSiteUrl()}/allahabad`,
    title,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Style Club fashion" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
};

export default function AllahabadPage() {
  const base = getSiteUrl();
  const url = `${base}/allahabad`;
  const cityStores = stores.filter((store) => ["katra", "naini", "phaphamau"].includes(store.id));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": `${base}/#organization` },
    mainEntity: cityStores.map((store) => ({ "@id": `${base}/#store-${store.id}` })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <main id="main" tabIndex={-1}>
        <section className="on-dark bg-night pb-20 pt-36 text-paper md:pb-28 md:pt-44">
          <div className="container-x">
            <nav aria-label="Breadcrumb" className="eyebrow flex gap-3 text-[10px] text-paper/60">
              <Link href="/" className="link-draw hover:text-white">Style Club</Link><span aria-hidden> / </span>
              <span aria-current="page" className="text-white">Allahabad</span>
            </nav>
            <p className="eyebrow mt-16 text-copper">Style Club · Uttar Pradesh</p>
            <h1 className="display mt-5 max-w-5xl text-[clamp(4rem,11vw,10rem)] leading-[0.95]">Clothing stores<br />in Allahabad.</h1>
            <p className="mt-9 max-w-3xl font-serif text-[clamp(1.6rem,3vw,2.6rem)] italic leading-tight text-paper/85">
              Allahabad is also known as Prayagraj. Find our Katra, Naini and Phaphamau stores under either name.
            </p>
          </div>
        </section>

        <section className="container-x py-20 md:py-32">
          <p className="eyebrow text-mute">Visit a store</p>
          <h2 className="display mt-5 text-[clamp(3.25rem,7vw,7rem)]">Find your nearest.</h2>
          <p className="mt-6 max-w-2xl text-mute">Explore clothing for men, women and kids, then visit the branch for current sizes and availability.</p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {cityStores.map((store) => (
              <article key={store.id} className="flex flex-col border-t border-line py-7">
                <p className="eyebrow text-mute">Prayagraj / Allahabad</p>
                <h3 className="display mt-4 text-[clamp(2.75rem,4vw,4rem)]">{store.name}</h3>
                <address className="mt-5 text-sm leading-relaxed text-mute not-italic">{store.address}</address>
                <div className="mt-auto flex flex-wrap gap-x-6 gap-y-3 pt-8 text-sm font-semibold">
                  <Link href={`/stores/${store.id}`} className="link-draw">Store details ↗</Link>
                  {store.mapUrl && <a href={store.mapUrl} target="_blank" rel="noopener noreferrer" className="link-draw">Directions ↗</a>}
                </div>
              </article>
            ))}
          </div>
          <p className="mt-12 text-sm text-mute">Civil Lines is coming soon. For store information, call <a href={contact.phones[0].href} className="link-draw font-semibold">{contact.phones[0].display}</a>.</p>
        </section>

        <section className="bg-bone py-20 md:py-28">
          <div className="container-x">
            <p className="eyebrow text-mute">Explore the collections</p>
            <h2 className="display mt-5 text-[clamp(3.25rem,7vw,7rem)]">Style for everyone.</h2>
            <p className="mt-6 max-w-2xl text-mute">Browse the Style Club edits for Allahabad and Prayagraj before visiting a branch.</p>
            <div className="mt-12 grid gap-3 md:grid-cols-3">
              {departments.map((department) => (
                <Link key={department.id} href={`/collections/${department.id}`} className="group flex min-h-40 flex-col justify-between bg-paper p-6 transition-colors hover:bg-white">
                  <span className="eyebrow text-mute">{department.kicker}</span>
                  <span className="display flex items-end justify-between text-[clamp(2.5rem,4vw,4rem)]">{department.title}<span className="text-xl transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="container-x py-16 md:py-24">
          <h2 className="display text-[clamp(3rem,6vw,6rem)]">Beyond the city.</h2>
          <p className="mt-6 max-w-2xl text-mute">Style Club also has a store in Bharwari, Kaushambi, outside Prayagraj (Allahabad).</p>
          <Link href="/stores/bharwari" className="link-draw mt-8 inline-block text-sm font-semibold">Explore Bharwari ↗</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
