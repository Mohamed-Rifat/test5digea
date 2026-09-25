import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "api.iconify.design" },
    ],
  },

  // Serve Cloudinary media through our own domain. Browsers with tracking
  // protection (Edge "Tracking Prevention", Safari ITP, Firefox ETP) flag
  // res.cloudinary.com as a third party and log a warning for every
  // request - once per video byte-range. First-party URLs avoid that and
  // let the browser reuse the site's connection.
  async rewrites() {
    return [
      {
        source: "/media/cloudinary/:path*",
        destination: "https://res.cloudinary.com/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Private areas must never be indexed, even if linked from outside.
        source: "/(admin|vendor)/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, immutable" },
        ],
      },
      {
        source: "/:file(og-image.jpg|icon-192.png|icon-512.png|icon-maskable-512.png|apple-touch-icon.png|logo-256.png|Logo.png)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
