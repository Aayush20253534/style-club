"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Clock, Phone } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { MaskLines, Reveal } from "@/components/ui/Reveal";
import { contact, stores } from "@/lib/data";
import { useParallax } from "@/components/ui/useParallax";
import storefront from "@/public/brand/storefront.jpg";
import interior from "@/public/brand/interior.jpg";

export default function Stores() {
  const reduce = useReducedMotion();
  const photoRef = useRef<HTMLDivElement>(null);
  const insetRef = useRef<HTMLDivElement>(null);
  useParallax(insetRef, photoRef, 14, -14);

  return (
    <section id="stores" aria-labelledby="stores-title" className="py-24 md:py-36">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 self-start lg:col-span-7">
            <div ref={photoRef} className="relative">
            <motion.div
              initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: reduce ? 0.2 : 1.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[16/10] overflow-hidden bg-bone"
            >
              <Image
                src={storefront}
                alt="Style Club storefront at Netram Chauraha, Katra, lit up at dusk"
                fill
                sizes="(min-width: 1024px) 56vw, 100vw"
                placeholder="blur"
                className="object-cover"
              />
            </motion.div>
            <div
              ref={insetRef}
              className="absolute -bottom-10 right-4 hidden w-[36%] border-[6px] border-paper bg-bone shadow-[0_24px_60px_-30px_rgb(0_0_0/0.5)] sm:block lg:-right-10"
            >
              <div className="relative aspect-[4/3.4]">
                <Image
                  src={interior}
                  alt="Inside Style Club Katra in Prayagraj — racks of shirts, denim and kidswear"
                  fill
                  sizes="(min-width: 1024px) 20vw, 36vw"
                  className="object-cover"
                />
              </div>
            </div>
            </div>
            <p className="eyebrow mt-4 text-[10px] text-mute">Katra flagship · Netram Chauraha</p>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-mute">06 — Visit us</p>
            </Reveal>
            <h2 id="stores-title" className="display mt-5 text-[14vw] md:text-[clamp(4.5rem,6.6vw,7rem)]">
              <MaskLines lines={["Come", "try it on."]} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mute">
                Visit Style Club in Katra, Naini or Phaphamau in Prayagraj, or Bharwari in Kaushambi.
                Our Civil Lines store is coming soon.
              </p>
            </Reveal>

            <ul className="mt-10 border-t border-line">
              {stores.map((s, i) => (
                <li key={s.id}>
                  <Reveal delay={0.04 * i} y={14}>
                    {s.comingSoon ? (
                      <div className="relative grid grid-cols-[1fr_auto] items-start gap-4 overflow-hidden border-b border-line bg-royal/[0.045] py-5 pl-5 pr-3">
                        <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-royal" />
                        <div>
                          <h3 className="flex flex-wrap items-center gap-3">
                            <span className="display text-[28px] leading-none">{s.name}</span>
                            <span className="eyebrow rounded-full border border-royal/20 bg-royal/10 px-2.5 py-1 text-[9px] tracking-[0.22em] text-royal">
                              New location
                            </span>
                          </h3>
                          <address className="mt-2 text-[14px] not-italic text-mute">{s.address}</address>
                          <p className="mt-1.5 text-[13px] font-medium text-char">
                            A new Style Club experience is on the way.
                          </p>
                        </div>
                        <span className="eyebrow rounded-full border border-royal/25 bg-paper px-3 py-2 text-[9px] tracking-[0.2em] text-royal">
                          Coming soon
                        </span>
                      </div>
                    ) : (
                      <a
                        href={s.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group grid grid-cols-[1fr_auto] items-start gap-4 border-b border-line py-5"
                      >
                        <div>
                          <h3 className="flex items-center gap-3">
                            <span className="display text-[28px] leading-none">{s.name}</span>
                            {s.flagship && (
                              <span className="eyebrow bg-royal px-2 py-1 text-[9px] tracking-[0.22em] text-white">Flagship</span>
                            )}
                          </h3>
                          <address className="mt-2 text-[14px] not-italic text-mute">{s.address}</address>
                          {s.hours && (
                            <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-char">
                              <Clock className="size-3.5" aria-hidden /> {s.hours}
                            </p>
                          )}
                        </div>
                        <span className="eyebrow mt-1 flex items-center gap-1 text-[10px] text-char transition-colors group-hover:text-royal">
                          Directions
                          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                          <span className="sr-only">to Style Club {s.name} (opens Google Maps)</span>
                        </span>
                      </a>
                    )}
                  </Reveal>
                </li>
              ))}
            </ul>

            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={contact.phones[0].href} className="btn btn-royal">
                  <Phone className="size-4" aria-hidden /> {contact.phones[0].display}
                </a>
                <a href={contact.instagram.url} target="_blank" rel="noreferrer" className="btn btn-outline">
                  <InstagramIcon /> Instagram
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
