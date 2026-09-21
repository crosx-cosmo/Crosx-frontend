import { motion } from "motion/react";
import { Activity, BarChart3, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { EASE_LUX, fadeUp, stagger } from "@/lib/motion-presets";

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Enterprise-grade security",
    copy: "Encrypted sessions, bot protection and verified email access.",
  },
  {
    icon: BarChart3,
    title: "Unified performance view",
    copy: "Campaigns, spend and conversions in one command centre.",
  },
  {
    icon: Zap,
    title: "Instant access",
    copy: "One account across advertiser, publisher and influencer tools.",
  },
] as const;

const BARS = [38, 56, 44, 72, 61, 88, 76, 96];

/** Left-hand brand panel for the authentication experience. */
export function AuthShowcase() {
  return (
    <motion.aside
      variants={stagger(0.05, 0.09)}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.div variants={fadeUp}>
        <Logo />
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-4">
        <span className="glass inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Sparkles className="size-3.5 text-brand" aria-hidden="true" />
          Secure account access
        </span>
        <h1 className="text-balance text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl lg:text-[2.9rem]">
          <span className="text-ink">Your growth engine,</span>{" "}
          <span className="text-brand-gradient">one login away.</span>
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Sign in to track campaigns in real time, unlock premium inventory and manage payouts from
          a single enterprise dashboard.
        </p>
      </motion.div>

      {/* Analytics vignette */}
      <motion.div
        variants={fadeUp}
        className="glass grain relative overflow-hidden rounded-3xl p-5 shadow-lux"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-brand/20 blur-[70px]"
        />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span className="relative grid size-2 place-items-center">
              <span className="absolute size-2 rounded-full bg-brand pulse-ring" />
              <span className="size-2 rounded-full bg-brand" />
            </span>
            Live performance
          </div>
          <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand">
            +34.8%
          </span>
        </div>

        <div className="relative mt-6 flex h-32 items-end gap-2">
          {BARS.map((h, i) => (
            <motion.span
              key={i}
              initial={{ scaleY: 0.12, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.25 + i * 0.06, ease: EASE_LUX }}
              style={{ height: `${h}%` }}
              className="w-full origin-bottom rounded-t-md bg-gradient-to-t from-brand/25 to-brand will-change-transform"
            />
          ))}
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-3 border-t border-hairline pt-4">
          {[
            { label: "Clicks", value: "1.24M", icon: Activity },
            { label: "Conversions", value: "86.2K", icon: BarChart3 },
            { label: "Payouts", value: "₹4.8Cr", icon: Lock },
          ].map((m) => (
            <div key={m.label} className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <m.icon className="size-3 text-brand" aria-hidden="true" />
                {m.label}
              </span>
              <span className="font-display text-lg font-bold tracking-tight">{m.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.ul variants={stagger(0.1, 0.08)} className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        {HIGHLIGHTS.map((h) => (
          <motion.li
            key={h.title}
            variants={fadeUp}
            className="glass group flex items-start gap-3 rounded-2xl p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lux"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand transition-transform duration-300 group-hover:scale-105">
              <h.icon className="size-4" aria-hidden="true" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">{h.title}</span>
              <span className="text-xs leading-relaxed text-muted-foreground">{h.copy}</span>
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.aside>
  );
}
