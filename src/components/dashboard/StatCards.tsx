import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, MousePointerClick, Target, TrendingUp, Zap } from "lucide-react";
import { Counter } from "@/components/ui-kit/Counter";
import { EASE_LUX } from "@/lib/motion-presets";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  delta: string;
  icon: LucideIcon;
};

const STATS: Stat[] = [
  { label: "Total Campaign", value: 48, delta: "+6 this month", icon: Target },
  { label: "Active Campaign", value: 21, delta: "+3 this week", icon: Zap },
  { label: "Monthly Clicks", value: 184920, delta: "+12.4%", icon: MousePointerClick },
  { label: "Monthly Conversion", value: 7412, delta: "+8.1%", icon: TrendingUp },
];

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((stat, i) => (
        <motion.article
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.07, ease: EASE_LUX }}
          className="glass group relative overflow-hidden rounded-2xl p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand/45 hover:shadow-lux"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-brand/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-brand/12 text-brand">
              <stat.icon className="size-4.5" aria-hidden="true" />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface-2/60 px-2.5 py-1 text-[11px] font-semibold text-brand">
              <ArrowUpRight className="size-3" aria-hidden="true" />
              {stat.delta}
            </span>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-1 font-display text-3xl font-black tracking-tight">
            <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
          </p>
        </motion.article>
      ))}
    </div>
  );
}
