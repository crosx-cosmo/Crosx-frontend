import { createFileRoute } from "@tanstack/react-router";
import { Activity, Globe, Plus, Timer, Zap } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, StatusBadge } from "@/components/dashboard/kit";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { toneFor } from "@/components/admin/tones";
import { WEBHOOK_ENDPOINTS, WEBHOOK_TOTALS, type WebhookEndpoint } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/webhook/endpoints")({
  component: Page,
  head: () =>
    dashboardHead(
      "Webhook Endpoints — CrosX Admin",
      "Manage the destinations that receive CrosX platform events in real time.",
    ),
});

const columns: Column<WebhookEndpoint>[] = [
  { key: "id", label: "ID", className: "font-mono text-[12.5px] whitespace-nowrap", render: (r) => r.id },
  { key: "label", label: "Endpoint", className: "whitespace-nowrap font-semibold", render: (r) => r.label },
  { key: "url", label: "URL", className: "font-mono text-[12.5px] whitespace-nowrap text-muted-foreground", render: (r) => r.url },
  { key: "events", label: "Events", align: "right", className: "tabular-nums", render: (r) => r.events },
  {
    key: "successRate",
    label: "Success Rate",
    align: "right",
    className: "tabular-nums whitespace-nowrap",
    render: (r) => (
      <span className={r.successRate >= 95 ? "font-semibold text-brand" : "text-muted-foreground"}>
        {r.successRate}%
      </span>
    ),
  },
  { key: "lastDelivery", label: "Last Delivery", className: "whitespace-nowrap tabular-nums text-muted-foreground", render: (r) => r.lastDelivery },
  { key: "createdAt", label: "Created", className: "whitespace-nowrap tabular-nums text-muted-foreground", render: (r) => r.createdAt },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <StatusBadge tone={toneFor(r.status)} dot>
        {r.status}
      </StatusBadge>
    ),
  },
];

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Webhook"
        title="Endpoints"
        description="Every destination subscribed to CrosX events, with health and delivery success at a glance."
        action={
          <ActionButton variant="solid" icon={Plus} onClick={() => toast.success("Endpoint form opens here (demo)")}>
            Add Endpoint
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Endpoints" value={WEBHOOK_TOTALS.endpoints} icon={Globe} trendTone="neutral" support="4 live, 1 paused" delay={0} />
          <KpiCard label="Delivered (24h)" value={WEBHOOK_TOTALS.delivered24h} icon={Zap} trend={`${WEBHOOK_TOTALS.successRate}%`} support="Success rate" delay={0.05} />
          <KpiCard label="Failed (24h)" value={WEBHOOK_TOTALS.failed24h} icon={Activity} trendTone="neutral" support="Retried 4×" delay={0.1} />
          <KpiCard label="Avg Latency" value={WEBHOOK_TOTALS.avgLatency} suffix="ms" icon={Timer} trendTone="neutral" support="Edge dispatched" delay={0.15} />
        </div>

        <AdminTable
          title="Registered Endpoints"
          description="Filter by health status to find endpoints that need attention."
          rows={WEBHOOK_ENDPOINTS}
          columns={columns}
          rowKey={(r) => r.id}
          minWidth="82rem"
          label="endpoints"
          emptyIcon={Globe}
          searchPlaceholder="Endpoint name, URL, ID..."
          search={(r, t) =>
            r.label.toLowerCase().includes(t) || r.url.toLowerCase().includes(t) || r.id.toLowerCase().includes(t)
          }
          filters={[
            { key: "status", options: ["All Status", "Live", "Paused", "Failing"], match: (r, v) => r.status === v },
          ]}
        />
      </div>
    </>
  );
}
