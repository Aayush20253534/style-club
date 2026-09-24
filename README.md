# Style Club — Thread to Style

Marketing site for **Style Club**, Prayagraj — men’s, women’s and kidswear across five stores
(Katra, Civil Lines, Naini, Phaphamau, Bharwari).

The hero is one continuous, scroll-scrubbed film:
**THREAD → WEAVE → FABRIC → CUT → ASSEMBLE → STITCH → GARMENT → MODEL**, followed by
New Arrivals → Men / Women / Kids → Trending → Shop the Look → Why Style Club → Stores → footer.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
```

Set `NEXT_PUBLIC_SITE_URL` in production (used for canonical URLs, Open Graph, sitemap and JSON-LD).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · next/image · Metadata API · Lucide ·
Framer Motion · GSAP + ScrollTrigger · Lenis

| Concern | Tool |
| --- | --- |
| Hover states, buttons, underlines, marquee, scroll cue | CSS |
| Section reveals, filter pills, drawers, menu, toasts | Framer Motion (`MotionConfig reducedMotion="user"`) |
| Hero film scrub, pinned copy timeline, curtain hand-off, desktop parallax | GSAP + ScrollTrigger |
| Wheel smoothing (mouse/trackpad only) | Lenis — never on touch or with reduced motion |

No Three.js — nothing on the page needs real-time 3D.

## The hero film

`components/hero/ThreadSequence.tsx`

- Five Higgsfield clips generated from six chained keyframes — each clip’s last frame is the next
  clip’s first frame, so every seam is continuous and the garment is identical throughout.
  Masters live in `media/` (clips + keyframes); `scripts/build-sequence.sh` exports them to
  `public/sequence/`.
- Desktop: 301 WebP frames (1280×720, ~9.9 MB). Portrait phones: 151 centre-cropped frames
  (640×576, ~3.4 MB) framed so the whole garment stays visible, with the edges feathered into the
  studio backdrop.
- Frames stream coarse-to-fine (keyframes first), are fetched as blobs and decoded off the main
  thread with `createImageBitmap`. Only a window around the playhead plus sparse anchors stay
  decoded, which keeps memory bounded. The first frame is preloaded and painted as a poster before JS runs.
- A scrubbed GSAP timeline maps scroll to frame index and overlay copy, so forward and reverse scrolling
  are symmetrical and carry a little inertia (`scrub: 0.9` desktop, `0.45` touch). The section is
  shorter on mobile (520svh vs 700svh).
- The page then slides over the held final frame (the “curtain”).
- **Fallbacks:** if frames can’t load, `SequenceFallback.tsx` tells the same story in SVG under
  the same scroll control and ends on a campaign photograph. With `prefers-reduced-motion`, the film
  is replaced by a static hero (final frame + copy + CTAs) and Lenis/parallax are off.

## Content & assets

- Business facts (branches, phones, hours, Instagram) come from `details/` and live in `lib/data.ts`.
- Fashion photography is served remotely from Unsplash (`lib/unsplash.ts` loader → imgix resizing /
  AVIF/WebP), not copied into the repo.
- Local images are brand assets only: the Katra storefront and interior photos (`public/brand/`),
  the generated hero sequence and the OG image. The favicon/app icon are generated in `app/icon.tsx`.
- The bag and saved items persist in `localStorage`. There is no online checkout; the bag offers
  “Call to reserve” / “Find a store”.
