import { CalendarClock, Radio, Target, UserRound, Wallet } from "lucide-react";
import { Panel } from "@/components/dashboard/kit";
import { RECENT_ACTIVITY, type AdminActivity } from "@/lib/admin-data";

const ICONS: Record<AdminActivity["kind"], typeof Target> = {
  publisher: UserRound,
  campaign: Target,
  payout: Wallet,
  postback: Radio,
  meeting: CalendarClock,
};

export function AdminActivityPanel() {
  return (
    <Panel title="Recent Activity" description="Latest platform events across every module.">
      <ol className="grid gap-2.5">
        {RECENT_ACTIVITY.map((a) => {
          const Icon = ICONS[a.kind];
          return (
            <li
              key={a.id}
              className="flex items-start gap-3 rounded-xl border border-hairline bg-surface-2/35 p-3 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/45"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold">{a.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{a.meta}</span>
              </span>
              <span className="shrink-0 text-[11px] text-muted-foreground">{a.time}</span>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
