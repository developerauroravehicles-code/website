import { PremiumScrollHero } from "@/components/marketing/PremiumScrollHero";
import { HomeStats } from "@/components/marketing/HomeStats";
import { prisma } from "@/lib/db";
import { getHomeHeroProductId } from "@/lib/home-hero";
import { productImageUrls } from "@/lib/product-utils";
import { getHomeHeroSpecs } from "@/lib/site-settings";

const DEFAULT_FRONT_SRC = "/products/lynx-eye/1.png";

export async function PremiumDashcamHero() {
  let frontImageSrc = DEFAULT_FRONT_SRC;
  let frontAlt = "Dashcam product";
  const specs = await getHomeHeroSpecs();

  try {
    const homeHeroProductId = await getHomeHeroProductId();
    if (!homeHeroProductId) {
      return (
        <PremiumScrollHero
          title="Precision in Every Frame"
          subtitle="Engineered optics, concealed installs, and a catalog you can explore before you book."
          frontImageSrc={frontImageSrc}
          frontAlt={frontAlt}
          specs={specs}
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
      specs={specs}
      primaryCta={{ href: "/products", label: "Browse products" }}
      secondaryCta={{ href: "/contact", label: "Book installation" }}
      footer={<HomeStats />}
    />
  );
}
