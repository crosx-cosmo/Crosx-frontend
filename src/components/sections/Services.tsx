import { Section, SectionHeading, Reveal } from "@/components/ui-kit/Section";
import { SERVICES, INDUSTRIES } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Services() {
  return (
    <Section id="services" ariaLabel="Services" className="grain">
      <SectionHeading
        eyebrow="Services"
        title="A full growth stack, operated by senior specialists."
        description="Twelve disciplines, one accountable team. Every service plugs into the same measurement layer so performance compounds instead of competing."
      />

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, i) => {
          const Icon = service.icon;
          return (
            <Reveal
              as="li"
              key={service.title}
              delay={(i % 3) * 0.05}
              className={cn(service.span === "wide" && "sm:col-span-2")}
            >
              <article className="group relative h-full overflow-hidden rounded-3xl border border-hairline bg-surface/50 p-6 transition-[transform,border-color,box-shadow] duration-500 will-change-transform hover:-translate-y-1.5 hover:border-brand/25 hover:shadow-lux sm:p-7">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, var(--brand) 16%, transparent), transparent 70%)",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="relative grid size-12 place-items-center rounded-2xl border border-hairline bg-background text-brand transition-[transform,border-color,box-shadow] duration-500 group-hover:-translate-y-0.5 group-hover:border-brand/50 group-hover:shadow-[0_10px_28px_-14px_var(--brand)]">
                  <Icon
                    className="size-5 transition-transform duration-500 group-hover:scale-110"
                    aria-hidden="true"
                  />
                </span>
                <h3 className="relative mt-5 text-lg font-bold tracking-tight text-foreground">
                  {service.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </article>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}

export function Industries() {
  return (
    <Section id="industries" ariaLabel="Industries we serve" className="pt-0">
      <div className="plate relative overflow-hidden rounded-3xl px-6 py-12 sm:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand/10 blur-[100px]"
        />
        <SectionHeading
          align="left"
          eyebrow="Industries"
          title="Regulated, competitive, high-consideration categories."
          description="We specialise where acquisition is expensive, compliance matters and measurement has to survive scrutiny."
        />
        <ul className="relative mt-10 flex flex-wrap gap-3">
          {INDUSTRIES.map((industry, i) => (
            <Reveal as="li" key={industry} delay={i * 0.03}>
              <span className="inline-flex items-center rounded-full border border-hairline bg-background px-4 py-2 text-sm text-muted-foreground transition-colors duration-300 hover:border-brand/50 hover:text-foreground">
                {industry}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
