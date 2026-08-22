import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip, LiveMetrics } from "@/components/sections/TrustAndMetrics";
import { Services, Industries } from "@/components/sections/Services";
import { WhyCrosX, Features } from "@/components/sections/WhyAndFeatures";
import { Process, CaseStudies } from "@/components/sections/ProcessAndCases";
import { Testimonials, Awards } from "@/components/sections/TestimonialsAndAwards";
import { Team, Faq, CallToAction } from "@/components/sections/TeamFaqCta";
import {
  ScrollProgress,
  BackToTop,
  CursorSpotlight,
  LoadingScreen,
} from "@/components/ui-kit/Chrome";

const TITLE = "CrosX — Performance Advertising & Marketing Agency";
const DESCRIPTION =
  "CrosX helps enterprise brands acquire users, generate revenue and scale campaigns with measurable ROI across performance marketing, media buying and analytics.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://crosx.in/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://crosx.in/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "CrosX",
          description: DESCRIPTION,
          email: "contact@crosx.in",
          slogan: "Advertising & Marketing Agency",
          areaServed: "Worldwide",
          founder: [
            { "@type": "Person", name: "Amal Pradhan", jobTitle: "Founder" },
            { "@type": "Person", name: "Santanu Patra", jobTitle: "Co-Founder" },
          ],
          serviceType: [
            "Performance Marketing",
            "Media Buying",
            "Lead Generation",
            "Marketing Analytics",
          ],
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-dvh bg-background">
      <LoadingScreen />
      <ScrollProgress />
      <CursorSpotlight />
      <SiteHeader />
      <main className="relative z-10">
        <Hero />
        <TrustStrip />
        <LiveMetrics />
        <Services />
        <Industries />
        <WhyCrosX />
        <Features />
        <Process />
        <CaseStudies />
        <Testimonials />
        <Awards />
        <Team />
        <Faq />
        <CallToAction />
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
