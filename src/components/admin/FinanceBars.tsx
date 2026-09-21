import { motion } from "motion/react";
import { EASE_LUX } from "@/lib/motion-presets";
import { inr, MONTHLY_FINANCE } from "@/lib/admin-data";

/** Monthly revenue vs payout bars — pure CSS/motion, no chart dependency. */
export function FinanceBars({ metric }: { metric: "revenue" | "paid" | "net" }) {
  const rows = MONTHLY_FINANCE.map((m) => ({
    month: m.month,
    value: metric === "revenue" ? m.revenue : metric === "paid" ? m.paid : m.revenue - m.paid,
  }));
  const max = Math.max(...rows.map((r) => r.value));

  return (
    <ul className="grid gap-3">
      {rows.map((r, i) => (
        <li key={r.month} className="grid grid-cols-[3rem_minmax(0,1fr)_7rem] items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {r.month}
          </span>
          <span className="h-2.5 overflow-hidden rounded-full bg-surface-2">
            <motion.i
              aria-hidden="true"
              initial={{ width: 0 }}
              animate={{ width: `${(r.value / max) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: EASE_LUX }}
              className="block h-full rounded-full bg-gradient-to-r from-brand/70 to-brand"
            />
          </span>
          <span className="text-right text-[13px] font-semibold tabular-nums">{inr(r.value)}</span>
        </li>
      ))}
    </ul>
  );
}

export function ShareList({
  items,
}: {
  items: { label: string; amount: number; share: number; caption?: string }[];
}) {
  return (
    <ul className="grid gap-3">
      {items.map((item, i) => (
        <li key={item.label} className="rounded-2xl border border-hairline bg-surface-2/35 p-3.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[13px] font-semibold">{item.label}</p>
            <p className="text-[13px] font-bold tabular-nums text-brand">{inr(item.amount)}</p>
          </div>
          {item.caption && <p className="mt-0.5 text-xs text-muted-foreground">{item.caption}</p>}
          <span className="mt-2 block h-2 overflow-hidden rounded-full bg-surface-2">
            <motion.i
              aria-hidden="true"
              initial={{ width: 0 }}
              animate={{ width: `${item.share}%` }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: EASE_LUX }}
              className="block h-full rounded-full bg-brand/75"
            />
          </span>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {item.share}% share
          </p>
        </li>
      ))}
    </ul>
  );
}
