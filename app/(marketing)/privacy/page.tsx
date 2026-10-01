import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { AuroraDashcamPrivacyContent } from "@/components/marketing/AuroraDashcamPrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for the Aurora Dashcam mobile app and Aurora-branded dash cameras — Aurora Vehicles Inc.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <ScrollReveal>
        <AuroraDashcamPrivacyContent />
      </ScrollReveal>
    </div>
  );
}
