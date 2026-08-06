import { motion } from "motion/react";
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
import { Counter } from "@/components/ui-kit/Counter";
import { EASE_LUX } from "@/lib/motion-presets";

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

/** Sparkline built from a static series — pure SVG, no chart runtime cost. */
const SERIES = [18, 26, 22, 34, 30, 41, 37, 48, 44, 52, 49, 61, 57, 66, 63, 74, 70, 82, 78, 92];

function Sparkline() {
  const max = Math.max(...SERIES);
  const points = SERIES.map((v, i) => {
    const x = (i / (SERIES.length - 1)) * 100;
    const y = 100 - (v / max) * 88 - 6;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-24 w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="crosx-spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polyline
        points={points}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE_LUX }}
      />
      <motion.polygon
        points={`0,100 ${points} 100,100`}
        fill="url(#crosx-spark-fill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: EASE_LUX }}
      />
    </svg>
  );
}

const STATS = [
  { label: "Clicks", value: 32456, prefix: "", delta: "+12.5%" },
  { label: "Conversions", value: 1245, prefix: "", delta: "+8.7%" },
  { label: "Payout", value: 45780, prefix: "₹", delta: "+15.2%" },
] as const;

export function PublisherShowcase() {
  return (
    <div className="relative flex flex-col gap-10">
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

      {/* Analytics showcase */}
      <Reveal delay={0.1}>
        <div className="glass relative overflow-hidden rounded-3xl p-5 shadow-lux sm:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-brand/20 blur-[90px]"
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Total Earnings
              </p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                ₹<Counter value={78540} />
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              <span className="relative flex size-1.5">
                <span className="pulse-ring absolute inline-flex size-full rounded-full bg-brand" />
                <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
              </span>
              +18.35%
            </span>
          </div>

          <div className="relative mt-4">
            <Sparkline />
          </div>

          <div className="relative mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="plate rounded-2xl px-3 py-3 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 truncate text-base font-bold tabular-nums sm:text-lg">
                  {s.prefix}
                  <Counter value={s.value} />
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-brand">{s.delta}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

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
