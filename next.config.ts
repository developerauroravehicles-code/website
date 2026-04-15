import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
