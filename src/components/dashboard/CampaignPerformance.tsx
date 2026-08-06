import { motion } from "motion/react";
import { useState } from "react";
import { EASE_LUX } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

type Campaign = { name: string; leads: number; percent: number };

const CAMPAIGNS: Campaign[] = [
  { name: "Indiabulls", leads: 3116, percent: 42 },
  { name: "Zerodha", leads: 1929, percent: 26 },
  { name: "Groww", leads: 1334, percent: 18 },
  { name: "Alice Blue", leads: 1038, percent: 14 },
];

export function CampaignPerformance() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1, ease: EASE_LUX }}
      className="glass rounded-2xl p-4 sm:p-6"
      aria-label="Campaign performance"
    >
      <div className="grid gap-1">
        <h2 className="font-display text-lg font-bold tracking-tight">Campaign Performance</h2>
        <p className="text-sm text-muted-foreground">
          Lead share across every running campaign this month.
        </p>
      </div>

      <ul className="mt-6 grid gap-4">
        {CAMPAIGNS.map((c, i) => {
          const isActive = active === c.name;
          return (
            <li
              key={c.name}
              onMouseEnter={() => setActive(c.name)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(c.name)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              className="group relative rounded-xl outline-none"
            >
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-semibold">{c.name}</span>
                <span className="shrink-0 font-display text-sm font-bold text-brand tabular-nums">
                  {c.percent}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.percent}%` }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: EASE_LUX }}
                  className={cn(
                    "h-full rounded-full bg-brand transition-[filter] duration-300",
                    isActive && "brightness-110",
                  )}
                  style={{ boxShadow: isActive ? "var(--shadow-glow)" : undefined }}
                />
              </div>

              <div
                role="tooltip"
                aria-hidden={!isActive}
                className={cn(
                  "pointer-events-none absolute -top-2 left-0 z-20 -translate-y-full rounded-xl border border-hairline bg-popover px-3 py-2 text-xs shadow-lux transition-[opacity,transform] duration-200",
                  isActive ? "opacity-100" : "translate-y-[-90%] opacity-0",
                )}
              >
                <p className="font-display text-sm font-bold">{c.name}</p>
                <p className="mt-0.5 text-muted-foreground">
                  Leads:{" "}
                  <span className="font-semibold text-foreground">
                    {c.leads.toLocaleString("en-US")}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Percentage: <span className="font-semibold text-brand">{c.percent}%</span>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}
