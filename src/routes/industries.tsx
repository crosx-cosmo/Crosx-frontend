import { createFileRoute } from "@tanstack/react-router";
import {
  Landmark,
  Banknote,
  ShoppingBag,
  Sparkles,
  Users,
  Target,
  HeartPulse,
  Building2,
  Plane,
  GraduationCap,
  Gamepad2,
  Server,
  type LucideIcon,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Section, SectionHeading, Reveal } from "@/components/ui-kit/Section";
import { LuxLink } from "@/components/ui-kit/LuxButton";
import { BRAND } from "@/lib/content";

const TITLE = "Industries We Serve — CrosX Performance Marketing";
const DESCRIPTION =
  "How CrosX approaches acquisition, tracking, attribution, media buying and analytics across BFSI, fintech, financial services, D2C commerce, consumer brands and lead generation.";

export const Route = createFileRoute("/industries")({
  component: IndustriesPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://crosx.in/industries" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://crosx.in/industries" }],
  }),
});

interface IndustryCard {
  icon: LucideIcon;
  name: string;
  tag: string;
  summary: string;
  approach: string[];
  wide?: boolean;
}

const INDUSTRY_CARDS: IndustryCard[] = [
  {
    icon: Landmark,
    name: "BFSI & Fintech",
    tag: "Regulated",
    summary:
      "Banking, broking, lending, insurance and neobanking — categories where compliance, lead quality and cost per funded account matter more than raw volume.",
    approach: [
      "Server-side event pipelines for funnel steps that platforms cannot see",
      "Lead validation before records reach your CRM",
      "Cohort-level CAC and cost-per-funded-account control",
      "Creative systems built to survive platform and regulatory review",
    ],
    wide: true,
  },
  {
    icon: Banknote,
    name: "Financial Services",
    tag: "Long funnel",
    summary:
      "Wealth, advisory and distribution businesses with multi-step onboarding and long consideration windows.",
    approach: [
      "Multi-touch attribution across long decision cycles",
      "Intent-led media buying with audited spend",
      "Finance-reconciled reporting for leadership review",
    ],
  },
  {
    icon: ShoppingBag,
    name: "E-commerce & D2C",
    tag: "Margin-led",
    summary:
      "Contribution margin, not just ROAS. We plan around reorder behaviour and unit economics.",
    approach: [
      "Catalogue and feed-driven paid acquisition",
      "Creative velocity programmes with structured testing",
      "Retention journeys tied to reorder windows",
    ],
  },
  {
    icon: Sparkles,
    name: "Consumer Brands",
    tag: "Brand + performance",
    summary:
      "Brands that need share of voice and a measurable pipeline from the same budget, without one cannibalising the other.",
    approach: [
      "Always-on brand demand modelling alongside performance",
      "Incrementality testing to separate brand lift from harvesting",
      "Influencer collaborations with contracted, measured deliverables",
    ],
  },
  {
    icon: Users,
    name: "Lead Generation",
    tag: "Quality-gated",
    summary:
      "Pipeline at a predictable cost, with quality checked at the point of capture rather than at the end of the month.",
    approach: [
      "Real-time validation and duplicate/fraud filtering",
      "Sub-ID level tracking down to the traffic source",
      "Postback-driven feedback so bidding learns from qualified leads",
      "Transparent lead logs with device, geo and click attribution",
    ],
    wide: true,
  },
  {
    icon: Target,
    name: "Performance Marketing",
    tag: "Core practice",
    summary:
      "Full-funnel paid acquisition across search, social, programmatic and affiliate — engineered around CAC and incremental revenue.",
    approach: [
      "Daily bid, budget and creative optimisation cycles",
      "Enterprise media buying with fully transparent margin",
      "Scaling only into pockets that have proven out",
    ],
  },
  {
    icon: Server,
    name: "SaaS & B2B",
    tag: "Pipeline",
    summary: "Demand generation measured on qualified pipeline and closed revenue, not form fills.",
    approach: [
      "CRM-connected attribution to opportunity stage",
      "Account-level targeting and content-led capture",
      "Lifecycle automation for nurture and reactivation",
    ],
  },
  {
    icon: Gamepad2,
    name: "Apps & Gaming",
    tag: "Install-to-retention",
    summary:
      "Growth measured past the install — retention, repeat sessions and monetisation events.",
    approach: [
      "MMP-grade attribution and SKAdNetwork-aware setup",
      "Event postbacks mapped to in-app value",
      "Creative iteration against retention, not installs",
    ],
  },
  {
    icon: HeartPulse,
    name: "Healthcare",
    tag: "Sensitive data",
    summary:
      "Patient and service acquisition handled with conservative data practices and careful creative claims.",
    approach: [
      "Privacy-cautious tracking and minimal data capture",
      "Location and service-line level campaign structure",
      "Enquiry quality reporting for operations teams",
    ],
  },
  {
    icon: Building2,
    name: "Real Estate",
    tag: "High ticket",
    summary:
      "High-value enquiries where a small number of qualified conversations decides the quarter.",
    approach: [
      "Project-level funnels with site-visit tracking",
      "Enquiry scoring before sales team handoff",
      "Geo and micro-market budget allocation",
    ],
  },
  {
    icon: Plane,
    name: "Travel & Mobility",
    tag: "Demand-sensitive",
    summary: "Seasonal, price-sensitive demand that needs fast budget reallocation.",
    approach: [
      "Rapid budget shifts against live demand signals",
      "Route, city and season-level campaign structure",
      "Booking-value optimisation over click volume",
    ],
  },
  {
    icon: GraduationCap,
    name: "Education",
    tag: "Enrolment",
    summary: "Counsellor-led funnels where lead quality decides enrolment cost.",
    approach: [
      "Enrolment-stage attribution, not lead-stage",
      "Counsellor feedback looped back into targeting",
      "Batch and intake-aligned media planning",
    ],
  },
];

const CAPABILITIES = [
  {
    title: "Acquisition",
    copy: "Channel mix decided from unit economics — search, social, programmatic, affiliate and influencer, sized against what a customer is worth.",
  },
  {
    title: "Tracking & attribution",
    copy: "Server-side event pipelines, sub-ID level click tracking and event postbacks so every conversion has a verifiable path back to source.",
  },
  {
    title: "Media buying",
    copy: "Enterprise buying power with audited spend, transparent margin and account ownership that stays with you.",
  },
  {
    title: "Analytics & reporting",
    copy: "Warehouse-native dashboards, clicks/leads/conversion logs and board-ready exports reconciled with your finance data.",
  },
];

function IndustriesPage() {
  return (
    <PageShell
      eyebrow="Industries"
      title="Built for categories where"
      highlight="the numbers are audited."
      intro="CrosX works with regulated and high-performance categories — the ones where attribution has to hold up, lead quality is scrutinised, and marketing spend is reviewed by finance as closely as by marketing."
    >
      <Section ariaLabel="How we work across industries" className="pt-4">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c, i) => (
            <Reveal as="li" key={c.title} delay={i * 0.05}>
              <div className="glass h-full rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-sm font-extrabold text-ink">{c.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section ariaLabel="Industry coverage" className="pt-0">
        <SectionHeading
          eyebrow="Coverage"
          title="Sector-specific playbooks, one measurement standard"
          description="Each category has its own funnel, compliance reality and definition of a good lead. The infrastructure underneath stays the same."
        />
        <ul className="mt-14 grid gap-4 lg:grid-cols-2">
          {INDUSTRY_CARDS.map((ind, i) => (
            <Reveal
              as="li"
              key={ind.name}
              delay={Math.min(i * 0.03, 0.2)}
              className={ind.wide ? "lg:col-span-2" : undefined}
            >
              <article className="glass grain group relative h-full overflow-hidden rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="flex items-start justify-between gap-4">
                  <span className="glass grid size-11 place-items-center rounded-2xl">
                    <ind.icon className="size-5 text-brand" aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-border/70 bg-surface/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {ind.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-ink sm:text-xl">{ind.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ind.summary}</p>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {ind.approach.map((a) => (
                    <li
                      key={a}
                      className="flex gap-2.5 rounded-2xl border border-hairline bg-surface/60 px-4 py-3 text-[13px] leading-relaxed text-muted-foreground"
                    >
                      <i
                        aria-hidden="true"
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                      />
                      {a}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section ariaLabel="Industry enquiry" className="pt-0">
        <Reveal>
          <div className="glass grain relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[130px]"
            />
            <h2 className="relative text-balance text-2xl font-extrabold text-ink sm:text-4xl">
              Not sure your category fits?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Tell us the funnel and the economics. If performance marketing is not the right lever
              yet, we will say so before you spend anything.
            </p>
            <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LuxLink href="/book-meeting" variant="brand" size="lg">
                Book a strategy call
              </LuxLink>
              <LuxLink href={`mailto:${BRAND.email}`} variant="ghostGlass" size="lg">
                Contact us
              </LuxLink>
            </div>
          </div>
        </Reveal>
      </Section>
    </PageShell>
  );
}
