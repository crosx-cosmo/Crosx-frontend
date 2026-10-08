import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, Download, Gauge, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, StatusBadge } from "@/components/dashboard/kit";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { toneFor } from "@/components/admin/tones";
import { CONVERSION_ROWS, ADMIN_TOTALS, inr, type ConversionRow } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/reports/conversions")({
  component: Page,
  head: () =>
    dashboardHead(
      "Conversions Report — CrosX Admin",
      "Network conversions with revenue, publisher payout and approval status.",
    ),
});

const columns: Column<ConversionRow>[] = [
  { key: "id", label: "CNVS ID", className: "font-mono text-[12.5px] whitespace-nowrap", render: (r) => r.id },
  { key: "clickId", label: "Click ID", className: "font-mono text-[12.5px] whitespace-nowrap text-muted-foreground", render: (r) => r.clickId },
  { key: "publisher", label: "Publisher", className: "whitespace-nowrap font-semibold", render: (r) => r.publisher },
  { key: "campaign", label: "Campaign", className: "whitespace-nowrap", render: (r) => r.campaign },
  { key: "advertiser", label: "Advertiser", className: "whitespace-nowrap text-muted-foreground", render: (r) => r.advertiser },
  { key: "geo", label: "Geo", className: "whitespace-nowrap", render: (r) => r.geo },
  { key: "revenue", label: "Revenue", align: "right", className: "tabular-nums whitespace-nowrap font-semibold text-brand", render: (r) => inr(r.revenue) },
  { key: "payout", label: "Publisher Payout", align: "right", className: "tabular-nums whitespace-nowrap", render: (r) => inr(r.payout) },
  { key: "margin", label: "Margin", align: "right", className: "tabular-nums", render: (r) => `${Math.round(((r.revenue - r.payout) / r.revenue) * 100)}%` },
  { key: "status", label: "Status", render: (r) => <StatusBadge tone={toneFor(r.status)} dot>{r.status}</StatusBadge> },
  { key: "timestamp", label: "Timestamp", className: "whitespace-nowrap tabular-nums text-muted-foreground", render: (r) => r.timestamp },
];

function Page() {
  const approved = CONVERSION_ROWS.filter((r) => r.status === "Approved").length;
  const pending = CONVERSION_ROWS.filter((r) => r.status === "Pending").length;
  const rejected = CONVERSION_ROWS.filter((r) => r.status === "Rejected").length;

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Conversions Report"
        description="Every conversion with advertiser revenue, publisher payout, margin and approval state."
        action={
          <ActionButton icon={Download} onClick={() => toast.success("Conversions export started (demo)")}>
            Export CSV
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Total Conversions" value={ADMIN_TOTALS.conversions} icon={Gauge} trend="↑ 10.8%" support="This month" delay={0} />
          <KpiCard label="Approved" value={approved} icon={CheckCircle2} trend={`${ADMIN_TOTALS.approvalRate}%`} support="Approval rate" delay={0.05} />
          <KpiCard label="Pending Review" value={pending} icon={Clock} trendTone="neutral" support="Awaiting advertiser" delay={0.1} />
          <KpiCard label="Rejected" value={rejected} icon={XCircle} trendTone="neutral" support="Validation failures" delay={0.15} />
        </div>

        <AdminTable
          title="Conversion Log"
          description="Filter by status or advertiser to reconcile revenue and payouts."
          rows={CONVERSION_ROWS}
          columns={columns}
          rowKey={(r) => r.id}
          minWidth="105rem"
          label="conversions"
          emptyIcon={Gauge}
          searchPlaceholder="CNVS ID, publisher, campaign..."
          search={(r, t) =>
            r.id.toLowerCase().includes(t) ||
            r.publisher.toLowerCase().includes(t) ||
            r.campaign.toLowerCase().includes(t) ||
            r.clickId.toLowerCase().includes(t)
          }
          filters={[
            { key: "status", options: ["All Status", "Approved", "Pending", "Rejected"], match: (r, v) => r.status === v },
            {
              key: "advertiser",
              options: ["All Advertisers", ...Array.from(new Set(CONVERSION_ROWS.map((r) => r.advertiser)))],
              match: (r, v) => r.advertiser === v,
            },
          ]}
        />
      </div>
    </>
  );
}
