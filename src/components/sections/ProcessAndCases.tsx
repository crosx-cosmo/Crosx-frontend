import { Section, SectionHeading, Reveal } from "@/components/ui-kit/Section";
import { PROCESS, CASE_STUDIES } from "@/lib/content";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export function Process() {
  return (
    <Section ariaLabel="Our process" className="grain">
      <SectionHeading
        eyebrow="Process"
        title="Six stages. One accountable timeline."
        description="Every engagement follows the same disciplined path — so you always know what happens next and who owns it."
      />

      <ol className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent lg:block"
        />
        {PROCESS.map((item, i) => (
          <Reveal as="li" key={item.step} delay={i * 0.06}>
            <article className="group relative h-full rounded-3xl border border-hairline bg-surface/40 p-6 transition-[transform,border-color,box-shadow] duration-500 will-change-transform hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-lux">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full border border-brand/40 bg-background font-display text-sm font-extrabold text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-primary-foreground">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
            </article>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

export function CaseStudies() {
  return (
    <Section id="case-studies" ariaLabel="Case studies" className="pt-0">
      <SectionHeading
        eyebrow="Case Studies"
        title="Outcomes we can defend line by line."
        description="Anonymised engagements across financial services, fintech and commerce."
      />

      <ul className="mt-14 grid gap-5 lg:grid-cols-3">
        {CASE_STUDIES.map((study, i) => (
          <Reveal as="li" key={study.client} delay={i * 0.06}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-hairline bg-surface/50 p-6 transition-[transform,border-color,box-shadow] duration-500 will-change-transform hover:-translate-y-1.5 hover:border-brand/25 hover:shadow-lux">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-brand/10 opacity-0 blur-[80px] transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-brand">{study.industry}</p>
                  <h3 className="mt-2 text-xl font-extrabold text-ink">{study.client}</h3>
                </div>
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </div>

              <dl className="relative mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Objective
                  </dt>
                  <dd className="mt-1 text-foreground">{study.objective}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Strategy
                  </dt>
                  <dd className="mt-1 leading-relaxed text-muted-foreground">{study.strategy}</dd>
                </div>
              </dl>

              <div className="relative mt-auto grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline pt-px">
                {[study.revenue, study.growth, study.conversion].map((v) => (
                  <p
                    key={v}
                    className="bg-background px-2 py-3 text-center text-[11px] font-semibold text-foreground"
                  >
                    {v}
                  </p>
                ))}
              </div>
              <p className="relative mt-3 inline-flex items-center gap-1.5 text-xs text-brand-soft">
                <TrendingUp className="size-3.5" aria-hidden="true" /> Verified against platform +
                finance data
              </p>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
