import { Mail, Linkedin, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading, Reveal } from "@/components/ui-kit/Section";
import { LuxLink } from "@/components/ui-kit/LuxButton";
import { BRAND, FAQS } from "@/lib/content";

const TEAM = [
  {
    name: BRAND.founder,
    role: "Founder",
    initials: "AP",
    bio: "Leads growth strategy and enterprise partnerships, with a decade running performance programmes across regulated categories.",
  },
  {
    name: BRAND.coFounder,
    role: "Co-Founder",
    initials: "SP",
    bio: "Owns measurement, media operations and delivery — the systems that keep every engagement auditable end to end.",
  },
];

export function Team() {
  return (
    <Section ariaLabel="Leadership team">
      <SectionHeading
        eyebrow="Leadership"
        title="Senior people on your account. Always."
        description="No handover to juniors after the pitch — the founders stay accountable for outcomes."
      />
      <ul className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
        {TEAM.map((member, i) => (
          <Reveal as="li" key={member.name} delay={i * 0.06}>
            <article className="glass group relative h-full overflow-hidden rounded-3xl p-7 transition-transform duration-500 will-change-transform hover:-translate-y-1">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand/10 blur-[80px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative flex items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-brand/40 bg-surface-2 font-display text-lg font-extrabold text-brand">
                  {member.initials}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-foreground">{member.name}</h3>
                  <p className="truncate text-xs uppercase tracking-[0.18em] text-brand">
                    {member.role}
                  </p>
                </div>
              </div>
              <p className="relative mt-5 text-sm leading-relaxed text-muted-foreground">
                {member.bio}
              </p>
              <a
                href={`mailto:${BRAND.email}`}
                className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline-sweep"
              >
                <Mail className="size-4 text-brand" aria-hidden="true" />
                {BRAND.email}
              </a>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

export function Faq() {
  return (
    <Section ariaLabel="Frequently asked questions" className="pt-0">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title="Questions enterprise teams ask us first."
          description="Still unsure? Talk to a strategist — the first call is a working session, not a sales pitch."
        />
        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.q} value={`item-${i}`} className="border-hairline">
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-brand hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}

export function CallToAction() {
  return (
    <Section id="contact" ariaLabel="Contact CrosX">
      <Reveal>
        <div className="grain relative overflow-hidden rounded-[2rem] border border-hairline bg-surface/50 px-6 py-16 text-center sm:px-12 lg:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid-lines opacity-40"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[130px]"
          />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
            <h2 className="text-balance text-3xl font-extrabold leading-[1.08] text-ink sm:text-5xl">
              Ready to Scale Your Business?
              <span className="mt-2 block text-brand-gradient">
                Let&apos;s Build Something Extraordinary.
              </span>
            </h2>
            <p className="max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
              Share your goals and current numbers. We&apos;ll come back with a growth model, a
              channel plan and a realistic forecast — before any contract.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LuxLink
                href={`mailto:${BRAND.email}?subject=Schedule%20a%20meeting%20with%20CrosX`}
                variant="brand"
                size="lg"
              >
                Schedule Meeting
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </LuxLink>
              <LuxLink href="/roles" variant="ghostGlass" size="lg">
                Get Proposal
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </LuxLink>
            </div>
            <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Linkedin className="size-3.5" aria-hidden="true" /> Typical response time: under 4
              business hours
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
