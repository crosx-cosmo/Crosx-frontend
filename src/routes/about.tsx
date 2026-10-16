import { createFileRoute } from "@tanstack/react-router";
import { Compass, GraduationCap, Flame, Scale, LineChart, ShieldCheck, Rocket } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Section, SectionHeading, Reveal } from "@/components/ui-kit/Section";
import { LuxLink } from "@/components/ui-kit/LuxButton";
import { BRAND } from "@/lib/content";

const TITLE = "About CrosX — Founder-led Performance Marketing Agency";
const DESCRIPTION =
  "The CrosX story: founded on 1 July by Santanu Patra and Amal Pradhan after nearly a year of running an agency together — built on ownership, accountability and measurable performance.";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://crosx.in/about" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://crosx.in/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: TITLE,
          description: DESCRIPTION,
          mainEntity: {
            "@type": "Organization",
            name: "CrosX",
            email: "contact@crosx.in",
            foundingDate: "07-01",
            founder: [
              { "@type": "Person", name: "Santanu Patra", jobTitle: "Founder" },
              { "@type": "Person", name: "Amal Pradhan", jobTitle: "Co-Founder" },
            ],
          },
        }),
      },
    ],
  }),
});

const CHAPTERS = [
  {
    icon: Compass,
    eyebrow: "Our Story",
    title: "It started before CrosX existed",
    body: [
      "Before CrosX, three students came together and built an advertising and marketing agency from nothing but curiosity and long nights. It ran for almost a year and, in that time, collaborated with multiple major brands — real campaigns, real budgets, real accountability.",
      "Then one member left unexpectedly, without notice. Work still had to ship. Clients still had to be served. Santanu Patra and Amal Pradhan carried it through, and in the process learned exactly what they wanted their next company to be.",
      "CrosX was founded on 1 July by Santanu and Amal — with complete ownership, shared accountability and a long-term commitment to the brands they take on.",
    ],
  },
  {
    icon: GraduationCap,
    eyebrow: "What We Learned",
    title: "Performance is a discipline, not a pitch",
    body: [
      "Running an agency young teaches you the unglamorous parts first: tracking that has to be right, spend that has to be justified, and reporting a client can take to their own leadership without editing it.",
      "We learned that campaigns rarely fail because of creative taste. They fail because measurement is unclear, ownership is unclear, or nobody senior is watching the account daily.",
      "So we built CrosX around those failure points instead of around a service list.",
    ],
  },
  {
    icon: Flame,
    eyebrow: "Why CrosX Exists",
    title: "Ownership you can name",
    body: [
      "Most brands have been handed to a junior team after a senior pitch. We have seen it from the inside, and we refuse to run that model.",
      "At CrosX the founders stay on the account. When a number moves — up or down — there is a person attached to it, not a department.",
      "That is the whole reason this company exists: growth work where responsibility is not diluted.",
    ],
  },
  {
    icon: Scale,
    eyebrow: "Our Philosophy",
    title: "Clear numbers, honest calls",
    body: [
      "We would rather tell a client a channel is not working in week three than protect a retainer until quarter end. Transparency is cheaper than recovery.",
      "You keep ownership of your ad accounts and your data. Our dashboards reconcile with your finance team, and every optimisation decision has a reason we can show you.",
      "Nothing we claim needs a footnote. If we cannot measure it, we do not present it as a result.",
    ],
  },
  {
    icon: LineChart,
    eyebrow: "Performance Approach",
    title: "A commercial model before a media plan",
    body: [
      "Every engagement starts with the economics: what a customer is worth, what acquisition can cost, and where the funnel actually leaks. Only then do we decide channels.",
      "From there it is a system — server-side tracking and clean attribution, structured campaign launches, daily bid, budget and creative iteration, and scaling only into pockets that have proven themselves.",
      "Acquisition, lead quality, retention and reporting are treated as one connected pipeline, because that is how revenue behaves.",
    ],
  },
  {
    icon: ShieldCheck,
    eyebrow: "Founder-led Accountability",
    title: "Two names on every engagement",
    body: [
      `${BRAND.founder} leads growth strategy, media direction and client partnerships. ${BRAND.coFounder} owns measurement, campaign operations and delivery — the systems that keep an account auditable end to end.`,
      "You meet the people doing the work before anything is signed, and you keep them for the length of the engagement.",
      "Fewer clients, deeper involvement. That trade-off is deliberate.",
    ],
  },
  {
    icon: Rocket,
    eyebrow: "Where We Are Going",
    title: "Building the platform layer",
    body: [
      "CrosX is growing beyond managed services into a partner ecosystem: advertisers running measurable acquisition, publishers monetising quality traffic, and influencers plugged into the same tracking and payout infrastructure.",
      "The publisher panel, campaign tracking, postback infrastructure and reporting suite already live inside this platform are the first steps of that direction.",
      "The goal is not to be the biggest agency. It is to be the one enterprise brands trust with the numbers.",
    ],
  },
];

const PRINCIPLES = [
  { k: "Founder-led", v: "Senior ownership on every account, start to finish." },
  { k: "Measurement first", v: "Tracking and attribution live before spend scales." },
  { k: "Full transparency", v: "Your ad accounts, your data, no hidden margin." },
  { k: "Long-term", v: "Built for multi-quarter growth, not campaign bursts." },
];

function AboutPage() {
  return (
    <PageShell
      eyebrow="About CrosX"
      title="Two founders, one standard:"
      highlight="own the outcome."
      intro="CrosX is an advertising and marketing agency built by operators who learned this business the hard way — running campaigns for major brands while still students, and deciding to do it properly the second time."
    >
      <Section ariaLabel="CrosX principles" className="pt-4">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((p, i) => (
            <Reveal as="li" key={p.k} delay={i * 0.05}>
              <div className="glass h-full rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-sm font-extrabold text-ink">{p.k}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.v}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section ariaLabel="The CrosX journey" className="pt-0">
        <SectionHeading
          eyebrow="The Journey"
          title="How CrosX came to be"
          description="No origin myth. Just what happened, what it taught us, and how it shaped the way we work."
        />

        <div className="relative mt-14">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[19px] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand/50 via-hairline to-transparent lg:block"
          />
          <ol className="flex flex-col gap-5">
            {CHAPTERS.map((c, i) => (
              <Reveal as="li" key={c.eyebrow} delay={Math.min(i * 0.04, 0.2)}>
                <div className="flex gap-5">
                  <div className="hidden shrink-0 lg:block">
                    <span className="glass grid size-10 place-items-center rounded-full">
                      <c.icon className="size-4 text-brand" aria-hidden="true" />
                    </span>
                  </div>
                  <article className="glass grain relative flex-1 overflow-hidden rounded-3xl p-6 sm:p-8">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        <c.icon className="size-3.5 text-brand lg:hidden" aria-hidden="true" />
                        {c.eyebrow}
                      </span>
                      <span className="text-xs font-bold tabular-nums text-brand">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 text-balance text-xl font-extrabold text-ink sm:text-2xl">
                      {c.title}
                    </h3>
                    <div className="mt-3 space-y-3.5">
                      {c.body.map((p) => (
                        <p key={p} className="text-sm leading-relaxed text-muted-foreground">
                          {p}
                        </p>
                      ))}
                    </div>
                  </article>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Section ariaLabel="Work with CrosX" className="pt-0">
        <Reveal>
          <div className="glass grain relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[130px]"
            />
            <h2 className="relative text-balance text-2xl font-extrabold text-ink sm:text-4xl">
              Talk to the founders directly.
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Every engagement starts with a commercial conversation — your numbers, your goals and
              an honest view of what performance marketing can do for them.
            </p>
            <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LuxLink href="/book-meeting" variant="brand" size="lg">
                Schedule a meeting
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
