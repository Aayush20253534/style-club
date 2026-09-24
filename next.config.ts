import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 80],
  },
  async headers() {
    return [
      {
        // Scroll-sequence frames are content-addressed by filename and never change in place.
        source: "/sequence/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
