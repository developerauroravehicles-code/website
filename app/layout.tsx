import type { Metadata, Viewport } from "next";
import { DM_Sans, Inter, Syne } from "next/font/google";
import { WhatsAppFloatingButton } from "@/components/providers/WhatsAppFloatingButton";
import { getSiteCursorCssValue } from "@/lib/site-cursor";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /** Allow pinch-zoom for accessibility (WCAG) */
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aurora Vehicles | In-Car Cameras & Professional Installation",
    template: "%s | Aurora Vehicles",
  },
  description:
    "Premium dashcam solutions and expert installation. Safer drives, crisp footage, clean cable routing.",
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Aurora Vehicles",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteCursor = getSiteCursorCssValue();

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${syne.variable} ${inter.variable} h-full min-h-[100dvh] antialiased`}
      style={{ cursor: siteCursor }}
    >
      <body className="flex min-h-[100dvh] flex-col overflow-x-clip bg-background text-foreground" style={{ cursor: "inherit" }}>
        <WhatsAppFloatingButton />
        {children}
      </body>
    </html>
  );
}
