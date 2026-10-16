import { createFileRoute } from "@tanstack/react-router";
import { Check, Download, ScrollText, Timer, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, StatusBadge } from "@/components/dashboard/kit";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { POSTBACK_LOG_ROWS, POSTBACK_TOTALS, type PostbackLogRow } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/postback/logs")({
  component: Page,
  head: () =>
    dashboardHead(
      "Postback Logs — CrosX Admin",
      "Delivery log for every conversion postback fired by CrosX, with latency and retry detail.",
    ),
});

const columns: Column<PostbackLogRow>[] = [
  { key: "id", label: "Log ID", className: "font-mono text-[12.5px] whitespace-nowrap", render: (r) => r.id },
  { key: "publisher", label: "Publisher", className: "whitespace-nowrap font-semibold", render: (r) => r.publisher },
  { key: "campaign", label: "Campaign", className: "whitespace-nowrap", render: (r) => r.campaign },
  { key: "event", label: "Event", render: (r) => <StatusBadge tone="neutral">{r.event}</StatusBadge> },
  {
    key: "status",
    label: "HTTP",
    align: "right",
    render: (r) => <StatusBadge tone={r.ok ? "success" : "danger"}>{r.status}</StatusBadge>,
  },
  {
    key: "latencyMs",
    label: "Latency",
    align: "right",
    className: "tabular-nums whitespace-nowrap",
    render: (r) => `${r.latencyMs} ms`,
  },
  { key: "attempt", label: "Attempts", align: "right", className: "tabular-nums", render: (r) => r.attempt },
  { key: "response", label: "Response", className: "whitespace-nowrap text-muted-foreground", render: (r) => r.response },
  { key: "timestamp", label: "Fired At", className: "whitespace-nowrap tabular-nums text-muted-foreground", render: (r) => r.timestamp },
];

function Page() {
  const failed = POSTBACK_LOG_ROWS.filter((r) => !r.ok).length;

  return (
    <>
      <PageHeader
        eyebrow="Postback"
        title="Postback Logs"
        description="Every outbound postback with HTTP status, latency and retry count — the fastest way to debug tracking gaps."
        action={
          <ActionButton icon={Download} onClick={() => toast.success("Log export started (demo)")}>
            Export Logs
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Logged Events" value={POSTBACK_LOG_ROWS.length} icon={ScrollText} trendTone="neutral" support="Most recent window" delay={0} />
          <KpiCard label="Delivered" value={POSTBACK_LOG_ROWS.length - failed} icon={Check} trend={`${POSTBACK_TOTALS.successRate}%`} support="2xx responses" delay={0.05} />
          <KpiCard label="Failures" value={failed} icon={X} trendTone="neutral" support="Retried automatically" delay={0.1} />
          <KpiCard label="Avg Latency" value={POSTBACK_TOTALS.avgLatency} suffix="ms" icon={Timer} trendTone="neutral" support="Edge relayed" delay={0.15} />
        </div>

        <AdminTable
          title="Delivery Log"
          description="Filter by event or outcome to isolate failing endpoints."
          rows={POSTBACK_LOG_ROWS}
          columns={columns}
          rowKey={(r) => r.id}
          minWidth="85rem"
          label="log entries"
          emptyIcon={ScrollText}
          searchPlaceholder="Log ID, publisher, campaign..."
          search={(r, t) =>
            r.id.toLowerCase().includes(t) ||
            r.publisher.toLowerCase().includes(t) ||
            r.campaign.toLowerCase().includes(t)
          }
          filters={[
            {
              key: "outcome",
              options: ["All Outcomes", "Delivered", "Failed"],
              match: (r, v) => (v === "Delivered" ? r.ok : !r.ok),
            },
            {
              key: "event",
              options: ["All Events", "Conversion", "Approved", "Rejected", "Reversal"],
              match: (r, v) => r.event === v,
            },
          ]}
        />
      </div>
    </>
  );
}
