import { Section, SectionHeading, Reveal } from "@/components/ui-kit/Section";
import { Counter } from "@/components/ui-kit/Counter";
import { CLIENT_LOGOS, METRICS } from "@/lib/content";

const LOGO_TOKEN = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY as string | undefined;

function ClientMark({ name, domain }: { name: string; domain: string }) {
  if (!LOGO_TOKEN) {
    return (
      <span className="font-display text-base font-bold tracking-tight text-muted-foreground/70 transition-colors duration-500 group-hover/mark:text-foreground sm:text-lg">
        {name}
      </span>
    );
  }
  const base = `https://img.logo.dev/${domain}?token=${LOGO_TOKEN}&size=160&format=png&retina=true`;
  return (
    <span className="relative block h-8 w-auto">
      <img
        src={`${base}&greyscale=true`}
        alt=""
        loading="lazy"
        decoding="async"
        width={160}
        height={32}
        className="h-8 w-auto opacity-60 transition-opacity duration-500 group-hover/mark:opacity-0"
      />
      <img
        src={base}
        alt={`${name} logo`}
        loading="lazy"
        decoding="async"
        width={160}
        height={32}
        className="absolute inset-0 h-8 w-auto opacity-0 transition-opacity duration-500 group-hover/mark:opacity-100"
      />
    </span>
  );
}

export function TrustStrip() {
  const marquee = [...CLIENT_LOGOS, ...CLIENT_LOGOS];
  return (
    <Section id="clients" ariaLabel="Trusted by modern businesses" className="py-14 lg:py-16">
      <Reveal className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Trusted by Modern Businesses
        </p>
      </Reveal>

      <div className="relative mt-9 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <ul className="marquee-track flex w-max items-center gap-12 sm:gap-20">
          {marquee.map((client, i) => (
            <li
              key={`${client.name}-${i}`}
              className="group/mark shrink-0 grayscale-0"
              aria-hidden={i >= CLIENT_LOGOS.length ? "true" : undefined}
            >
              <ClientMark name={client.name} domain={client.domain} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function LiveMetrics() {
  return (
    <Section ariaLabel="Live performance metrics" className="pt-0">
      <SectionHeading
        eyebrow="Live Metrics"
        title="Numbers our clients can audit."
        description="Every figure below is reconciled with platform and finance data — not marketing rounding."
      />
      <ul className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline shadow-lux sm:grid-cols-3 lg:grid-cols-4">
        {METRICS.map((m, i) => (
          <Reveal
            as="li"
            key={m.label}
            delay={i * 0.04}
            className="group relative bg-background p-6 transition-colors duration-500 hover:bg-surface sm:p-7"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(110% 90% at 50% 100%, color-mix(in oklab, var(--brand) 12%, transparent), transparent 70%)",
              }}
            />
            <p className="relative font-display text-3xl font-extrabold text-ink sm:text-4xl">
              <Counter value={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals} />
            </p>
            <p className="relative mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {m.label}
            </p>
            <span
              aria-hidden="true"
              className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100"
            />
          </Reveal>
        ))}
        <li className="hidden bg-background p-6 lg:block" aria-hidden="true" />
      </ul>
    </Section>
  );
}
