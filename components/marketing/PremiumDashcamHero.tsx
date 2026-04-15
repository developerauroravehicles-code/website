import { PremiumScrollHero } from "@/components/marketing/PremiumScrollHero";
import { HomeStats } from "@/components/marketing/HomeStats";
import { prisma } from "@/lib/db";
import { getHomeHeroProductId } from "@/lib/home-hero";
import { productImageUrls } from "@/lib/product-utils";

const DEFAULT_FRONT_SRC = "/products/lynx-eye/1.png";

const SPECS = [
  { label: "UHD", sub: "4K pipeline" },
  { label: "f/1.8", sub: "Low-light glass" },
  { label: "140°", sub: "Wide FOV" },
];

export async function PremiumDashcamHero() {
  let frontImageSrc = DEFAULT_FRONT_SRC;
  let frontAlt = "Dashcam product";

  try {
    const homeHeroProductId = await getHomeHeroProductId();
    if (!homeHeroProductId) {
      return (
        <PremiumScrollHero
          title="Precision in Every Frame"
          subtitle="Engineered optics, concealed installs, and a catalog you can explore before you book."
          frontImageSrc={frontImageSrc}
          frontAlt={frontAlt}
          specs={SPECS}
          primaryCta={{ href: "/products", label: "Browse products" }}
          secondaryCta={{ href: "/contact", label: "Book installation" }}
          footer={<HomeStats />}
        />
      );
    }

    const hero = await prisma.product.findUnique({
      where: { id: homeHeroProductId },
      select: { name: true, images: true },
    });
    if (hero) {
      const firstImage = productImageUrls(hero)[0];
      if (firstImage) {
        frontImageSrc = firstImage;
        frontAlt = hero.name;
      }
    }
  } catch {
    // Fallback keeps homepage stable before DB schema update is applied.
  }

  return (
    <PremiumScrollHero
      title="Precision in Every Frame"
      subtitle="Engineered optics, concealed installs, and a catalog you can explore before you book."
      frontImageSrc={frontImageSrc}
      frontAlt={frontAlt}
      specs={SPECS}
      primaryCta={{ href: "/products", label: "Browse products" }}
      secondaryCta={{ href: "/contact", label: "Book installation" }}
      footer={<HomeStats />}
    />
  );
}
