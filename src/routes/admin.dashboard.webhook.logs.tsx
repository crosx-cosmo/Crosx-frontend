import { createFileRoute } from "@tanstack/react-router";
import { Check, Download, ScrollText, Timer, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, StatusBadge } from "@/components/dashboard/kit";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { DELIVERY_LOGS, WEBHOOK_ENDPOINTS, WEBHOOK_TOTALS, type DeliveryLogRow } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/webhook/logs")({
  component: Page,
  head: () =>
    dashboardHead(
      "Webhook Delivery Logs — CrosX Admin",
      "Inspect every webhook delivery attempt with status code, latency and retry count.",
    ),
});

const columns: Column<DeliveryLogRow>[] = [
  { key: "id", label: "Delivery ID", className: "font-mono text-[12.5px] whitespace-nowrap", render: (r) => r.id },
  { key: "endpoint", label: "Endpoint", className: "whitespace-nowrap font-semibold", render: (r) => r.endpoint },
  { key: "event", label: "Event", className: "whitespace-nowrap font-mono text-[12.5px] text-brand", render: (r) => r.event },
  {
    key: "status",
    label: "HTTP",
    align: "right",
    render: (r) => <StatusBadge tone={r.ok ? "success" : "danger"}>{r.status}</StatusBadge>,
  },
  { key: "latencyMs", label: "Latency", align: "right", className: "tabular-nums whitespace-nowrap", render: (r) => `${r.latencyMs} ms` },
  { key: "attempt", label: "Attempts", align: "right", className: "tabular-nums", render: (r) => r.attempt },
  { key: "timestamp", label: "Delivered At", className: "whitespace-nowrap tabular-nums text-muted-foreground", render: (r) => r.timestamp },
];

function Page() {
  const failed = DELIVERY_LOGS.filter((r) => !r.ok).length;

  return (
    <>
      <PageHeader
        eyebrow="Webhook"
        title="Delivery Logs"
        description="Attempt-level history for every event dispatched to your endpoints."
        action={
          <ActionButton icon={Download} onClick={() => toast.success("Delivery log export started (demo)")}>
            Export Logs
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Attempts Logged" value={DELIVERY_LOGS.length} icon={ScrollText} trendTone="neutral" support="Recent window" delay={0} />
          <KpiCard label="Delivered" value={DELIVERY_LOGS.length - failed} icon={Check} trend={`${WEBHOOK_TOTALS.successRate}%`} support="2xx responses" delay={0.05} />
          <KpiCard label="Failed" value={failed} icon={X} trendTone="neutral" support="Auto-retried" delay={0.1} />
          <KpiCard label="Avg Latency" value={WEBHOOK_TOTALS.avgLatency} suffix="ms" icon={Timer} trendTone="neutral" support="Across endpoints" delay={0.15} />
        </div>

        <AdminTable
          title="Delivery Attempts"
          description="Filter by endpoint or outcome to trace a failing integration."
          rows={DELIVERY_LOGS}
          columns={columns}
          rowKey={(r) => r.id}
          minWidth="76rem"
          label="deliveries"
          emptyIcon={ScrollText}
          searchPlaceholder="Delivery ID, endpoint, event..."
          search={(r, t) =>
            r.id.toLowerCase().includes(t) ||
            r.endpoint.toLowerCase().includes(t) ||
            r.event.toLowerCase().includes(t)
          }
          filters={[
            {
              key: "outcome",
              options: ["All Outcomes", "Delivered", "Failed"],
              match: (r, v) => (v === "Delivered" ? r.ok : !r.ok),
            },
            {
              key: "endpoint",
              options: ["All Endpoints", ...WEBHOOK_ENDPOINTS.map((e) => e.label)],
              match: (r, v) => r.endpoint === v,
            },
          ]}
        />
      </div>
    </>
  );
}
