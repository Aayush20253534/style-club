import ThreadSequence from "@/components/hero/ThreadSequence";
import NewArrivals from "@/components/sections/NewArrivals";
import Departments from "@/components/sections/Departments";
import Trending from "@/components/sections/Trending";
import ShopTheLook from "@/components/sections/ShopTheLook";
import WhyStyleClub from "@/components/sections/WhyStyleClub";
import Stores from "@/components/sections/Stores";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <main id="main">
        <div id="top" aria-hidden />
        <ThreadSequence />
        {/* Slides over the held final frame of the film (see the curtain in ThreadSequence). */}
        <div id="after-film" className="relative z-10 -mt-[100svh] bg-paper motion-reduce:mt-0">
          <NewArrivals />
          <Departments />
          <Trending />
          <ShopTheLook />
          <WhyStyleClub />
          <Stores />
        </div>
      </main>
      <Footer />
    </>
  );
}
