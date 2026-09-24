import type { ImageLoader } from "next/image";

/**
 * Remote editorial photography is served straight from Unsplash's imgix CDN,
 * which already negotiates AVIF/WebP and resizes on the edge.
 */
export const unsplashLoader: ImageLoader = ({ src, width, quality }) =>
  `${src}?w=${width}&q=${quality ?? 70}&auto=format&fit=max`;

export const unsplashSrc = (photo: string) => `https://images.unsplash.com/${photo}`;
