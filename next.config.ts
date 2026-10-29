import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@base-ui/react",
      "cmdk",
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  headers: async () => {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];

    // Development: never let a browser or service worker keep a Turbopack
    // chunk. Dev chunk filenames are reused after edits, so an immutable
    // cache would keep serving yesterday's module ("x is not a function").
    if (process.env.NODE_ENV !== "production") {
      return [
        {
          source: "/(.*)",
          headers: [
            ...securityHeaders,
            { key: "Cache-Control", value: "no-store, must-revalidate" },
          ],
        },
        {
          // One-time-per-navigation purge of anything a previous dev build
          // cached as immutable. IndexedDB (the user's artwork) is untouched.
          source: "/:path*",
          has: [{ type: "header", key: "accept", value: ".*text/html.*" }],
          headers: [{ key: "Clear-Site-Data", value: '"cache"' }],
        },
      ];
    }

    // Production: Next.js fingerprints every build asset, so immutable
    // caching is safe there.
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)\\.(js|css|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  generateEtags: true,
};

export default nextConfig;
