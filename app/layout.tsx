import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Inter } from "next/font/google";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ShopProvider from "@/components/layout/ShopProvider";
import MotionProvider from "@/components/layout/MotionProvider";
import Header from "@/components/layout/Header";
import { BagDrawer, SearchOverlay } from "@/components/layout/Overlays";
import { contact, stores } from "@/lib/data";
import "./globals.css";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://styleclubindia.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Style Club — Fashion for Men, Women & Kids in Prayagraj",
    template: "%s · Style Club",
  },
  description:
    "Style Club is Prayagraj’s fashion destination for men, women and kids — new arrivals every week, fair prices and five stores across Katra, Civil Lines, Naini, Phaphamau and Bharwari.",
  keywords: [
    "Style Club",
    "clothing store Prayagraj",
    "fashion Prayagraj",
    "Katra clothing store",
    "kurta sets",
    "denim",
    "kidswear",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Style Club",
    title: "Style Club — Style that moves with you",
    description: "New arrivals every week for men, women and kids. Five stores across Prayagraj.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "A model wearing the Style Club indigo denim jacket" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Style Club — Style that moves with you",
    description: "New arrivals every week for men, women and kids. Five stores across Prayagraj.",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#02050f",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Style Club",
  url: SITE_URL,
  image: `${SITE_URL}/brand/storefront.jpg`,
  telephone: contact.phones[0].href.replace("tel:", ""),
  sameAs: [contact.instagram.url],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Netram Chauraha, Old Katra",
    addressLocality: "Prayagraj",
    addressRegion: "Uttar Pradesh",
    postalCode: "211002",
    addressCountry: "IN",
  },
  department: stores
    .filter((s) => !s.flagship)
    .map((s) => ({
      "@type": "ClothingStore",
      name: `Style Club ${s.name}`,
      address: { "@type": "PostalAddress", streetAddress: s.address, addressCountry: "IN" },
    })),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${anton.variable} ${instrument.variable} ${inter.variable}`}>
      <head>
        {/* First frame of the scroll film — the hero's initial paint. */}
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/sequence/desktop/f_001.webp"
          media="(orientation: landscape), (min-width: 820px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/sequence/mobile/f_001.webp"
          media="(orientation: portrait) and (max-width: 819px)"
          fetchPriority="high"
        />
      </head>
      <body className="grain">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <MotionProvider>
        <ShopProvider>
          <SmoothScroll />
          <Header />
          {children}
          <BagDrawer />
          <SearchOverlay />
        </ShopProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
