import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Avoid bundling a stale Prisma client into server chunks (fixes schema drift / validation errors after `prisma generate`). */
  serverExternalPackages: ["@prisma/client", "prisma"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/hizmetler", destination: "/services", permanent: true },
      { source: "/urunler", destination: "/products", permanent: true },
      { source: "/urunler/:slug", destination: "/products/:slug", permanent: true },
      { source: "/hakkimizda", destination: "/about", permanent: true },
      { source: "/iletisim", destination: "/contact", permanent: true },
      { source: "/admin/urunler", destination: "/admin/products", permanent: true },
      { source: "/admin/urunler/yeni", destination: "/admin/products/new", permanent: true },
      { source: "/admin/urunler/:id/duzenle", destination: "/admin/products/:id/edit", permanent: true },
    ];
  },
};

export default nextConfig;
