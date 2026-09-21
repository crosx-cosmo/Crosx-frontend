import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Bell, Globe, Zap } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { KpiCard, Panel, StatusBadge } from "@/components/dashboard/kit";
import { WEBHOOK_EVENTS, WEBHOOK_TOTALS, num } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/dashboard/webhook/events")({
  component: Page,
  head: () =>
    dashboardHead(
      "Webhook Events — CrosX Admin",
      "Enable or disable the platform events CrosX broadcasts to your endpoints.",
    ),
});

function Page() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(WEBHOOK_EVENTS.map((e) => [e.key, e.enabled])),
  );
  const on = Object.values(enabled).filter(Boolean).length;
  const volume = WEBHOOK_EVENTS.reduce((s, e) => s + (enabled[e.key] ? e.volume24h : 0), 0);

  return (
    <>
      <PageHeader
        eyebrow="Webhook"
        title="Events"
        description="Choose exactly which platform events are broadcast to your subscribed endpoints."
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Event Types" value={WEBHOOK_EVENTS.length} icon={Zap} trendTone="neutral" support="Across the platform" delay={0} />
          <KpiCard label="Enabled" value={on} icon={Bell} trendTone="neutral" support="Currently broadcasting" delay={0.05} />
          <KpiCard label="Volume (24h)" value={volume} icon={Activity} trend="↑ 6.4%" support="Enabled events only" delay={0.1} />
          <KpiCard label="Subscribed Endpoints" value={WEBHOOK_TOTALS.endpoints} icon={Globe} trendTone="neutral" support="Receiving events" delay={0.15} />
        </div>

        <Panel title="Event Catalogue" description="Toggle an event to stop or resume broadcasting it.">
          <ul className="grid gap-3 lg:grid-cols-2">
            {WEBHOOK_EVENTS.map((e) => {
              const isOn = Boolean(enabled[e.key]);
              return (
                <li
                  key={e.key}
                  className="rounded-2xl border border-hairline bg-surface-2/35 p-4 transition-[border-color] duration-300 hover:border-brand/45"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-[15px] font-bold">{e.label}</p>
                      <p className="mt-0.5 truncate font-mono text-[12px] text-brand">{e.key}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isOn}
                      aria-label={`Toggle ${e.label}`}
                      onClick={() => {
                        setEnabled((p) => ({ ...p, [e.key]: !p[e.key] }));
                        toast.success(`${e.label} ${isOn ? "disabled" : "enabled"} (demo)`);
                      }}
                      className={cn(
                        "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300",
                        isOn ? "border-brand/60 bg-brand/70" : "border-hairline bg-surface-2",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute top-0.5 size-4.5 rounded-full bg-background transition-[left] duration-300",
                          isOn ? "left-[1.55rem]" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{e.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge tone={isOn ? "success" : "neutral"} dot>
                      {isOn ? "Broadcasting" : "Disabled"}
                    </StatusBadge>
                    <StatusBadge tone="neutral">{e.subscribers} subscribers</StatusBadge>
                    <StatusBadge tone="neutral">{num(e.volume24h)} / 24h</StatusBadge>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </>
  );
}
