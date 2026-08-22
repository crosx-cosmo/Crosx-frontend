import { BadgeIndianRupee, CheckCircle2, MousePointerClick, Plus } from "lucide-react";
import { motion } from "motion/react";
import { Panel } from "./kit";
import { EASE_LUX } from "@/lib/motion-presets";
import { RECENT_ACTIVITY, type Activity } from "@/lib/publisher-data";

const ICONS = {
  conversion: CheckCircle2,
  click: MousePointerClick,
  payout: BadgeIndianRupee,
  join: Plus,
} as const;

export function RecentActivity({ items = RECENT_ACTIVITY }: { items?: Activity[] }) {
  return (
    <Panel
      title="Recent Activity"
      description="Live feed of conversions, clicks and payouts on your account."
    >
      <ol className="relative grid gap-4 pl-6">
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-[9px] top-2 w-px bg-hairline"
        />
        {items.map((a, i) => {
          const Icon = ICONS[a.type];
          return (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.02, ease: EASE_LUX }}
              className="relative"
            >
              <span className="absolute -left-6 top-0.5 grid size-[19px] place-items-center rounded-full border border-hairline bg-surface-2 text-brand">
                <Icon className="size-3" aria-hidden="true" />
              </span>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.campaign} • {a.meta}
                  </p>
                </div>
                <p className="shrink-0 text-[11px] text-muted-foreground">{a.time}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </Panel>
  );
}
