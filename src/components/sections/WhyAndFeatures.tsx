import { Check, Minus } from "lucide-react";
import { Section, SectionHeading, Reveal } from "@/components/ui-kit/Section";
import { COMPARISON, FEATURES } from "@/lib/content";
import { cn } from "@/lib/utils";

export function WhyCrosX() {
  return (
    <Section id="solutions" ariaLabel="Why CrosX">
      <SectionHeading
        eyebrow="Why CrosX"
        title="The difference between a vendor and an operating partner."
        description="Same budget. Entirely different governance, cadence and accountability."
      />

      <Reveal className="mt-14 overflow-hidden rounded-3xl border border-hairline">
        <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-px bg-hairline text-left sm:grid-cols-3">
          <div className="bg-surface/60 px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:px-6">
            Capability
          </div>
          <div className="bg-surface/60 px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:px-6">
            Traditional Agency
          </div>
          <div className="bg-brand/10 px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-soft sm:px-6">
            CrosX
          </div>

          {COMPARISON.rows.map((row, i) => (
            <div key={row} className="contents">
              <div className="bg-background px-4 py-5 text-sm font-medium text-foreground sm:px-6">
                {row}
              </div>
              <div className="flex items-start gap-2 bg-background px-4 py-5 text-sm text-muted-foreground sm:px-6">
                <Minus
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>{COMPARISON.traditional[i]}</span>
              </div>
              <div className="flex items-start gap-2 bg-background px-4 py-5 text-sm text-foreground transition-colors duration-300 hover:bg-surface sm:px-6">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                <span>{COMPARISON.crosx[i]}</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

export function Features() {
  return (
    <Section id="about" ariaLabel="How we work" className="pt-0">
      <SectionHeading
        eyebrow="Capabilities"
        title="Built as one connected growth system."
        description="Strategy, acquisition, retention and measurement operated together — never handed between disconnected teams."
      />

      <div className="mt-16 flex flex-col gap-16 lg:gap-24">
        {FEATURES.map((feature, i) => {
          const flipped = i % 2 === 1;
          return (
            <Reveal
              key={feature.title}
              className={cn("grid items-center gap-8 lg:grid-cols-2 lg:gap-16")}
            >
              <div className={cn("flex flex-col gap-5", flipped && "lg:order-2")}>
                <span className="font-display text-sm font-bold text-brand">0{i + 1}</span>
                <h3 className="text-balance text-2xl font-extrabold text-ink sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {feature.description}
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {feature.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={cn("relative", flipped && "lg:order-1")}>
                <div className="glass shadow-lux relative overflow-hidden rounded-3xl p-6">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand/15 blur-[80px]"
                  />
                  <div className="relative grid gap-3">
                    {feature.points.map((point, pi) => (
                      <div
                        key={point}
                        className="plate flex items-center justify-between gap-4 rounded-2xl px-4 py-3"
                      >
                        <span className="truncate text-xs text-muted-foreground">{point}</span>
                        <span className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-surface-2">
                          <span
                            className="block h-full rounded-full bg-brand"
                            style={{ width: `${64 + pi * 9}%` }}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
