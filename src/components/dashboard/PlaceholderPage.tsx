import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_LUX } from "@/lib/motion-presets";
import { PageHeader } from "./DashboardShell";

export function PlaceholderPage({
  title,
  description,
  rows = ["Overview", "Records", "Exports"],
  children,
}: {
  title: string;
  description: string;
  rows?: string[];
  children?: ReactNode;
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_LUX }}
        className="grid gap-4"
      >
        {children}
        <div className="grid gap-4 sm:grid-cols-3">
          {rows.map((row) => (
            <div key={row} className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {row}
              </p>
              <div className="mt-4 space-y-2.5">
                {[92, 68, 44].map((w) => (
                  <div
                    key={w}
                    className="h-2.5 rounded-full bg-surface-2"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-base font-bold">{title} table</p>
            <span className="rounded-full border border-hairline bg-surface-2/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Coming soon
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-hairline bg-surface-2/35 px-4 py-3"
              >
                <div className="min-w-0 space-y-2">
                  <div className="h-2.5 w-1/3 rounded-full bg-surface-2" />
                  <div className="h-2 w-1/2 rounded-full bg-surface-2/70" />
                </div>
                <div className="h-6 w-16 shrink-0 rounded-full bg-surface-2" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
