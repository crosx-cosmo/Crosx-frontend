import {
  Activity,
  BadgeCheck,
  Headphones,
  LineChart,
  ShieldCheck,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/ui-kit/Section";

const FEATURES = [
  {
    icon: Activity,
    title: "Real-Time Tracking",
    description: "Monitor clicks, leads and earnings live with enterprise-grade analytics.",
  },
  {
    icon: Wallet,
    title: "High Paying Campaigns",
    description: "Exclusive advertiser demand with industry-leading payouts on every conversion.",
  },
  {
    icon: LineChart,
    title: "Instant Reports",
    description: "Granular performance reporting to optimise traffic quality and revenue.",
  },
  {
    icon: Zap,
    title: "Fast Payments",
    description: "On-time settlements through multiple secure withdrawal options.",
  },
] as const;

const TRUST = [
  { icon: ShieldCheck, label: "Secure" },
  { icon: BadgeCheck, label: "Reliable" },
  { icon: Users, label: "Transparent" },
  { icon: Headphones, label: "24/7 Support" },
] as const;

export function PublisherShowcase() {
  return (
    <div className="relative flex flex-col gap-7">
      <div>
        <Reveal>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            <span className="text-ink">Join CrosX as a</span>
            <br />
            <span className="text-brand-gradient">Publisher</span>
          </h1>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Promote premium enterprise campaigns, track every conversion in real time and earn high
            payouts on traffic you already own.
          </p>
        </Reveal>
      </div>

      {/* Feature cards */}
      <ul className="grid gap-3 sm:grid-cols-2">
        {FEATURES.map((f, i) => (
          <Reveal as="li" key={f.title} delay={0.12 + i * 0.05}>
            <div className="glass group relative h-full overflow-hidden rounded-2xl p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-lux">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(320px circle at 20% 0%, color-mix(in oklab, var(--brand) 18%, transparent), transparent 70%)",
                }}
              />
              <div className="relative flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand transition-transform duration-300 group-hover:scale-105">
                  <f.icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold tracking-tight">{f.title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>

      {/* Trust band */}
      <Reveal delay={0.2}>
        <div className="glass flex items-center gap-4 rounded-2xl p-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
            <Users className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold">Trusted by 10,000+ Publishers</p>
            <p className="text-xs text-muted-foreground">
              Start your earning journey with CrosX today.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.24}>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {TRUST.map((t) => (
            <li
              key={t.label}
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <t.icon className="size-4 text-brand" aria-hidden="true" />
              {t.label}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
