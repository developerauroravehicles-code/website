import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const placeholderImg = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`;

/**
 * Product copy aligned with https://www.auroravehicles.com/our-products
 * (showcase only on this site; images are placeholders).
 */
async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const hash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash: hash, role: "admin" },
    update: { passwordHash: hash },
  });

  const products = [
    {
      slug: "hawk-vision",
      name: "Hawk Vision",
      shortDescription:
        "Next-gen 4K Ultra HD dash camera with Wi‑Fi, GPS, rear camera, and 24/7 parking protection.",
      longDescription: `Meet the next generation **4K Ultra HD** dash camera that captures every moment of your journey with precision — even when your car is parked. With advanced technology, powerful performance, and intelligent features, it keeps your vehicle protected 24/7.

**Highlights:** 4K lens · Built-in Wi‑Fi · Smartphone app · GPS

**What's included:** Power supply cable · Hawk Vision 4K dash cam · 1080p Full HD in-car rear camera · Rear camera cable · 32/64 GB memory card · Electrostatic sticker · User manual · Quick guide`,
      images: [placeholderImg("1549317661-bd32c8ce0db2"), placeholderImg("1492144534655-ae79c964c9d7")],
      featured: true,
      published: true,
      sortOrder: 10,
    },
    {
      slug: "falcon-vision",
      name: "Falcon Vision",
      shortDescription:
        "4K front, Full HD rear, and 1080p cabin — AI shooting, 3.69\" touchscreen, and 5GHz Wi‑Fi.",
      longDescription: `Capture every detail from every angle — **4K front**, **Full HD rear**, and **1080p cabin** view. Powered by AI shooting and a sleek 3.69" touchscreen, it delivers intelligent recording, effortless control, and crystal-clear footage day or night. With ultra-fast **5GHz Wi‑Fi** and advanced parking surveillance, your car stays protected 24/7 — on the road and beyond.

**Highlights:** 4K lens · Built-in Wi‑Fi · Smartphone app · GPS

**What's included:** Power supply cable · Falcon Vision 4K dash cam · 1080p Full HD in-car rear camera · Rear camera cable · 32/64 GB memory card · Electrostatic sticker · User manual · Quick guide`,
      images: [placeholderImg("1449965408869-eaa3f617e31f"), placeholderImg("1503376763036-066120622c74")],
      featured: true,
      published: true,
      sortOrder: 20,
    },
    {
      slug: "lynx-eye",
      name: "Lynx Eye",
      shortDescription:
        "4K Ultra HD (UHD), fast f/1.8 optics, touchscreen workflow — dual 4K + 2K recording, Wi‑Fi, and strong night vision.",
      longDescription: `Discover the **Lynx Eye 4K Ultra HD** dash cam — engineered for crisp **UHD** footage with a bright **f/1.8** aperture for low light. The large touchscreen makes **Dash Cam**, **Smart Driving**, file browsing, and settings easy to access on the device. With **dual 4K + 2K** recording, smart Wi‑Fi control, and advanced night vision, it delivers reliable protection and effortless connectivity. Stay confident on every journey, day or night.

**Highlights:** UHD recording · f/1.8 lens · Touchscreen UI · 4K lens · Built-in Wi‑Fi · Smartphone app · GPS

**What's included:** Power supply cable with car charger · Lynx Eye 4K dash cam · 1440p 2K in-car rear camera · Rear camera cable · 64 GB memory card · Electrostatic sticker · User manual · Quick guide`,
      images: [
        "/products/lynx-eye/1.png",
        "/products/lynx-eye/2.png",
        "/products/lynx-eye/3.png",
        "/products/lynx-eye/4.png",
      ],
      featured: true,
      published: true,
      sortOrder: 30,
    },
    {
      slug: "panther-view",
      name: "Panther View",
      shortDescription:
        "2160p 4K front, Full HD rear, 3\" IPS display, metal body, Wi‑Fi, and G-sensor loop recording.",
      longDescription: `Capture every moment with stunning precision — featuring a **2160p 4K** front camera and a **Full HD** rear view for complete coverage of your journey. With a vibrant **3\" IPS display** and durable metal body, it combines style with strength. Enjoy seamless connectivity through built-in Wi‑Fi, while smart functions like automatic power on/off, **G-sensor** collision detection, and loop recording ensure reliable performance every time you drive.

**Highlights:** 4K lens · Built-in Wi‑Fi · Smartphone app · GPS

**What's included:** Power cable with car charger · 2160p 4K ultra HD front camera · Full HD rear camera · Rear extension cable · 64 GB memory card · Electrostatic mounting sticker · User manual · Quick start guide`,
      images: [placeholderImg("1519641471656-aa760d0d8d8b")],
      featured: false,
      published: true,
      sortOrder: 40,
    },
    {
      slug: "final-sale",
      name: "Final Sale",
      shortDescription:
        "Limited-time savings on select dash cam kits and accessories — ask what’s in stock today.",
      longDescription: `**Final sale** and clearance items from our showroom lineup. Models and bundles change often — perfect if you want strong value on a complete kit.

Contact us for **current SKUs**, warranty notes, and install availability. This category is for **showcase and inquiry only** on this website; we’ll confirm details before any work is booked.

**Tip:** Mention “Final Sale” when you call or email so we can match you with in-stock options.`,
      images: [placeholderImg("1558618666-fcd25c85cd64")],
      featured: false,
      published: true,
      sortOrder: 50,
    },
    {
      slug: "eagle-eye",
      name: "Eagle Eye",
      shortDescription:
        "4K front, rear, and cabin coverage — AI shooting, 3.69\" touchscreen, 5GHz Wi‑Fi, and Super Night Vision.",
      longDescription: `Meet the next-generation **4K Ultra HD** dash camera that captures every detail from every angle — **front, rear, and cabin** — ensuring complete coverage of your journey. Equipped with **AI shooting**, a **3.69-inch touchscreen**, ultra-fast **5GHz Wi‑Fi**, and **Super Night Vision**, it delivers intelligent recording and seamless control. With advanced **G-Sensor** protection and continuous parking surveillance, your vehicle stays secure 24/7 — on the road and beyond.

**Highlights:** 4K lens · Smartphone app · GPS

**What's included:** Power supply cable · 2160p 4K front dash camera · 1080p Full HD rear camera · 1080p cabin camera · Rear extension cable · 32/64 GB high-speed memory card · Electrostatic mounting sticker · User manual · Quick start guide`,
      images: [placeholderImg("1462397681524-4a8a7a214e77"), placeholderImg("1549317661-bd32c8ce0db2")],
      featured: true,
      published: true,
      sortOrder: 60,
    },
  ];

  const slugs = products.map((p) => p.slug);
  await prisma.product.deleteMany({
    where: { slug: { notIn: slugs } },
  });

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        name: p.name,
        shortDescription: p.shortDescription,
        longDescription: p.longDescription,
        images: JSON.stringify(p.images),
        featured: p.featured,
        published: p.published,
        sortOrder: p.sortOrder,
      },
      update: {
        name: p.name,
        shortDescription: p.shortDescription,
        longDescription: p.longDescription,
        images: JSON.stringify(p.images),
        featured: p.featured,
        published: p.published,
        sortOrder: p.sortOrder,
      },
    });
  }

  console.log("Seed OK. Admin:", email, "| Products:", slugs.join(", "));
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
