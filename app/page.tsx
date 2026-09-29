import ThreadSequence from "@/components/hero/ThreadSequence";
import NewArrivals from "@/components/sections/NewArrivals";
import Departments from "@/components/sections/Departments";
import Trending from "@/components/sections/Trending";
import GiftOffers from "@/components/sections/GiftOffers";
import ShopTheLook from "@/components/sections/ShopTheLook";
import CatalogEdit from "@/components/sections/CatalogEdit";
import WhyStyleClub from "@/components/sections/WhyStyleClub";
import Stores from "@/components/sections/Stores";
import Footer from "@/components/layout/Footer";
import { getSiteUrl } from "@/lib/site";
import { buildSiteJsonLd, serializeJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <link rel="preload" as="image" type="image/webp" href="/sequence/desktop/f_001.webp" media="(orientation: landscape), (min-width: 820px)" fetchPriority="high" />
      <link rel="preload" as="image" type="image/webp" href="/sequence/mobile/f_001.webp" media="(orientation: portrait) and (max-width: 819px)" fetchPriority="high" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildSiteJsonLd(getSiteUrl())) }} />
      <main id="main" tabIndex={-1}>
        <div id="top" aria-hidden />
        <ThreadSequence />
        {/* Slides over the held final frame of the film (see the curtain in ThreadSequence). */}
        <div id="after-film" className="relative z-10 -mt-[100svh] bg-paper motion-reduce:mt-0">
          <GiftOffers />
          <NewArrivals />
          <Departments />
          <Trending />
          <ShopTheLook />
          <CatalogEdit />
          <WhyStyleClub />
          <Stores />
        </div>
      </main>
      <Footer />
    </>
  );
}
