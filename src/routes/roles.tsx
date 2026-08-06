import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  LayoutDashboard,
  MessageSquare,
  Target,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Section, SectionHeading, Reveal } from "@/components/ui-kit/Section";
import { LuxLink } from "@/components/ui-kit/LuxButton";
import { BRAND } from "@/lib/content";
import { EASE_LUX } from "@/lib/motion-presets";

const TITLE = "Choose Your Role — CrosX";
const DESCRIPTION =
  "Tell us how you want to work with CrosX — as an advertiser, a publisher or an influencer — and get a tailored growth proposal.";

export const Route = createFileRoute("/roles")({
  component: RolesPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
});

const ROLES = [
  {
    id: "advertiser",
    icon: Target,
    title: "Advertiser",
    description:
      "Scale acquisition with performance media, creative testing and revenue-grade measurement across every channel.",
    chips: ["Campaigns", "Analytics", "ROI"],
  },
  {
    id: "publisher",
    icon: LayoutDashboard,
    title: "Publisher",
    description:
      "Monetise your inventory with premium enterprise demand, transparent payouts and clean brand-safe placements.",
    chips: ["Traffic", "Payouts", "Reports"],
  },
  {
    id: "influencer",
    icon: MessageSquare,
    title: "Influencer",
    description:
      "Partner on long-term brand campaigns with fair economics, creative freedom and performance-backed reporting.",
    chips: ["Brands", "Earnings", "Insights"],
  },
] as const;

function RolesPage() {
  return (
    <div className="relative min-h-dvh bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-lines opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 size-[34rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand/15 blur-[140px]"
      />

      <header className="relative z-10 mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link to="/" aria-label="CrosX home">
          <Logo />
        </Link>
        <Link
          to="/"
          className="glass inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-brand/50"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Link>
      </header>

      <main className="relative z-10">
        <Section ariaLabel="Choose your role" className="pt-6 pb-16 lg:pt-10 lg:pb-24">
          <SectionHeading
            eyebrow="Get Proposal"
            title="Choose your role."
            description="We tailor the proposal to how you grow. Pick the track that matches your business."
          />

          <ul className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3 lg:mt-14">
            {ROLES.map((role, i) => {
              const isPublisher = role.id === "publisher";
              return (
                <Reveal as="li" key={role.id} delay={i * 0.07} className="h-full">
                  <Link
                    to={isPublisher ? "/register/publisher" : "/coming-soon"}
                    search={isPublisher ? undefined : { role: role.title }}
                    aria-label={
                      isPublisher ? `${role.title} — register` : `${role.title} — coming soon`
                    }
                    className="glass group relative flex h-full cursor-pointer select-none flex-col overflow-hidden rounded-3xl p-7 text-left shadow-lux transition-[transform,box-shadow,border-color] duration-500 will-change-transform hover:-translate-y-2 hover:border-brand/45 hover:shadow-[0_28px_70px_-30px_var(--brand)] active:translate-y-0 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-8"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-brand/20 blur-[80px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-100"
                    />

                    <div className="relative flex items-start justify-between gap-4">
                      <span className="grid size-14 place-items-center rounded-2xl border border-brand/40 bg-surface-2 text-brand shadow-[0_0_0_0_var(--brand)] transition-[transform,box-shadow,background-color] duration-500 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_36px_-18px_var(--brand)]">
                        <role.icon className="size-6" aria-hidden="true" />
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/80 shadow-[0_0_20px_-8px_var(--brand)] transition-colors duration-500 group-hover:border-brand/45">
                        <i aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                        Coming Soon
                      </span>
                    </div>

                    <h2 className="relative mt-7 text-xl font-bold text-foreground sm:text-2xl">
                      {role.title}
                    </h2>
                    <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                      {role.description}
                    </p>

                    <ul className="relative mt-5 flex flex-wrap gap-2">
                      {role.chips.map((chip) => (
                        <li
                          key={chip}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors duration-300 group-hover:border-brand/30 group-hover:text-foreground"
                        >
                          <BadgeCheck className="size-3 text-brand" aria-hidden="true" />
                          {chip}
                        </li>
                      ))}
                    </ul>

                    <span className="relative mt-auto pt-7 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      Continue
                      <span
                        aria-hidden="true"
                        className="relative grid size-5 place-items-center overflow-hidden"
                      >
                        <ArrowRight className="size-4 text-brand transition-transform duration-300 ease-out group-hover:translate-x-5" />
                        <ArrowRight className="absolute size-4 -translate-x-5 text-brand transition-transform duration-300 ease-out group-hover:translate-x-0" />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_LUX, delay: 0.3 }}
            className="glass relative mx-auto mt-10 flex max-w-4xl flex-col items-center gap-5 overflow-hidden rounded-3xl px-6 py-7 text-center shadow-lux sm:flex-row sm:justify-between sm:gap-8 sm:px-9 sm:text-left lg:mt-14"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 -top-24 size-56 rounded-full bg-brand/10 blur-[90px]"
            />
            <div className="relative">
              <p className="text-base font-bold text-foreground sm:text-lg">Need help choosing?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Our team can help you select the right account type.
              </p>
            </div>
            <LuxLink
              href={`mailto:${BRAND.email}?subject=Help%20choosing%20a%20CrosX%20account%20type`}
              variant="brand"
              size="md"
              className="relative shrink-0"
            >
              Contact Sales
              <ArrowRight className="size-4" aria-hidden="true" />
            </LuxLink>
          </motion.div>
        </Section>
      </main>
    </div>
  );
}
