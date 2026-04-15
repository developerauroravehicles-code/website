import { AnimatedSiteFooter } from "@/components/marketing/AnimatedSiteFooter";
import { AnimatedSiteHeader } from "@/components/marketing/AnimatedSiteHeader";
import { MarketingLayoutGroup } from "@/components/providers/MarketingLayoutGroup";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MarketingLayoutGroup>
      <div className="flex min-h-[100dvh] flex-col">
        <AnimatedSiteHeader />
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        <AnimatedSiteFooter />
      </div>
    </MarketingLayoutGroup>
  );
}
