import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Inter } from "next/font/google";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ShopProvider from "@/components/layout/ShopProvider";
import MotionProvider from "@/components/layout/MotionProvider";
import Header from "@/components/layout/Header";
import { BagDrawer, SearchOverlay } from "@/components/layout/Overlays";
import { getSiteUrl } from "@/lib/site";
import { buildSiteJsonLd, serializeJsonLd } from "@/lib/structured-data";
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

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Style Club Prayagraj | Clothing for Men, Women & Kids",
    template: "%s · Style Club",
  },
  description:
    "Explore men’s, women’s and kids’ fashion at Style Club, with stores in Katra, Civil Lines, Naini and Phaphamau in Prayagraj, plus Bharwari in Kaushambi.",
  keywords: [
    "Style Club Prayagraj",
    "clothing store in Prayagraj",
    "fashion store Prayagraj",
    "men’s clothing Prayagraj",
    "women’s clothing Prayagraj",
    "kidswear Prayagraj",
    "Style Club Katra",
    "Style Club Civil Lines",
    "Style Club Naini",
    "Style Club Phaphamau",
    "Style Club Bharwari",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Style Club",
    url: SITE_URL,
    title: "Style Club Prayagraj | Fashion for Men, Women & Kids",
    description: "Explore fashion for men, women and kids at Style Club in Katra, Civil Lines, Naini, Phaphamau and Bharwari.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "A model wearing the Style Club indigo denim jacket" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Style Club Prayagraj | Fashion for Men, Women & Kids",
    description: "Explore fashion for men, women and kids at Style Club in Katra, Civil Lines, Naini, Phaphamau and Bharwari.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#02050f",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = buildSiteJsonLd(SITE_URL);

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
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
