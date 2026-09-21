import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Copy, Download, Users, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, StatusBadge } from "@/components/dashboard/kit";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { toneFor } from "@/components/admin/tones";
import { LEAD_ROWS, ADMIN_TOTALS, type LeadRow } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/reports/leads")({
  component: Page,
  head: () =>
    dashboardHead(
      "Leads Report — CrosX Admin",
      "Every lead submitted across CrosX campaigns with quality score and validation status.",
    ),
});

const columns: Column<LeadRow>[] = [
  { key: "id", label: "Lead ID", className: "font-mono text-[12.5px] whitespace-nowrap", render: (r) => r.id },
  { key: "name", label: "Lead Name", className: "whitespace-nowrap font-semibold", render: (r) => r.name },
  { key: "phone", label: "Phone", className: "font-mono text-[12.5px] whitespace-nowrap", render: (r) => r.phone },
  { key: "publisher", label: "Publisher", className: "whitespace-nowrap", render: (r) => r.publisher },
  { key: "campaign", label: "Campaign", className: "whitespace-nowrap text-muted-foreground", render: (r) => r.campaign },
  { key: "geo", label: "Geo", className: "whitespace-nowrap", render: (r) => r.geo },
  {
    key: "score",
    label: "Quality Score",
    align: "right",
    className: "tabular-nums",
    render: (r) => (
      <span className={r.score >= 70 ? "font-semibold text-brand" : "text-muted-foreground"}>{r.score}</span>
    ),
  },
  { key: "status", label: "Status", render: (r) => <StatusBadge tone={toneFor(r.status)} dot>{r.status}</StatusBadge> },
  { key: "timestamp", label: "Received", className: "whitespace-nowrap tabular-nums text-muted-foreground", render: (r) => r.timestamp },
];

function Page() {
  const qualified = LEAD_ROWS.filter((r) => r.status === "Qualified").length;
  const rejected = LEAD_ROWS.filter((r) => r.status === "Rejected").length;
  const duplicate = LEAD_ROWS.filter((r) => r.status === "Duplicate").length;

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Leads Report"
        description="Lead-level detail across every CPL campaign, with quality scoring and duplicate detection."
        action={
          <ActionButton icon={Download} onClick={() => toast.success("Leads export started (demo)")}>
            Export CSV
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Total Leads" value={ADMIN_TOTALS.leads} icon={Users} trend="↑ 13.6%" support="This month" delay={0} />
          <KpiCard label="Qualified" value={qualified} icon={CheckCircle2} trend="78.4%" support="Qualification rate" delay={0.05} />
          <KpiCard label="Rejected" value={rejected} icon={XCircle} trendTone="neutral" support="Failed validation" delay={0.1} />
          <KpiCard label="Duplicates" value={duplicate} icon={Copy} trendTone="neutral" support="Blocked automatically" delay={0.15} />
        </div>

        <AdminTable
          title="Lead Log"
          description="Filter by validation status or campaign to audit lead quality per publisher."
          rows={LEAD_ROWS}
          columns={columns}
          rowKey={(r) => r.id}
          minWidth="88rem"
          label="leads"
          emptyIcon={Users}
          searchPlaceholder="Lead ID, name, publisher..."
          search={(r, t) =>
            r.id.toLowerCase().includes(t) ||
            r.name.toLowerCase().includes(t) ||
            r.publisher.toLowerCase().includes(t) ||
            r.campaign.toLowerCase().includes(t)
          }
          filters={[
            { key: "status", options: ["All Status", "Qualified", "Pending", "Rejected", "Duplicate"], match: (r, v) => r.status === v },
            {
              key: "geo",
              options: ["All Geos", "India", "UAE", "Singapore", "United Kingdom", "Indonesia", "Malaysia"],
              match: (r, v) => r.geo === v,
            },
          ]}
        />
      </div>
    </>
  );
}
