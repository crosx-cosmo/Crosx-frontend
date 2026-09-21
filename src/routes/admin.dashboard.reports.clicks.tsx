import { createFileRoute } from "@tanstack/react-router";
import { Download, Monitor, MousePointerClick, Smartphone, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, StatusBadge } from "@/components/dashboard/kit";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { ADMIN_TOTALS, CLICK_ROWS, type ClickRow } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/reports/clicks")({
  component: Page,
  head: () =>
    dashboardHead(
      "Clicks Report — CrosX Admin",
      "Network-wide click stream by publisher, campaign, device and geo.",
    ),
});

const columns: Column<ClickRow>[] = [
  { key: "id", label: "Click ID", className: "font-mono text-[12.5px] whitespace-nowrap", render: (r) => r.id },
  { key: "publisher", label: "Publisher", className: "whitespace-nowrap font-semibold", render: (r) => r.publisher },
  { key: "campaign", label: "Campaign", className: "whitespace-nowrap", render: (r) => r.campaign },
  { key: "advertiser", label: "Advertiser", className: "whitespace-nowrap text-muted-foreground", render: (r) => r.advertiser },
  { key: "device", label: "Device", render: (r) => <StatusBadge tone={r.device === "Mobile" ? "brand" : "neutral"}>{r.device}</StatusBadge> },
  { key: "os", label: "OS", className: "whitespace-nowrap text-muted-foreground", render: (r) => r.os },
  { key: "geo", label: "Geo", className: "whitespace-nowrap", render: (r) => r.geo },
  { key: "ip", label: "IP", className: "font-mono text-[12.5px] whitespace-nowrap", render: (r) => r.ip },
  { key: "sub1", label: "Sub ID", className: "text-muted-foreground", render: (r) => r.sub1 },
  { key: "converted", label: "Converted", render: (r) => <StatusBadge tone={r.converted ? "success" : "neutral"}>{r.converted ? "Yes" : "No"}</StatusBadge> },
  { key: "timestamp", label: "Timestamp", className: "whitespace-nowrap tabular-nums text-muted-foreground", render: (r) => r.timestamp },
];

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Clicks Report"
        description="Every click across the CrosX network, broken down by publisher, campaign, device and geo."
        action={
          <ActionButton icon={Download} onClick={() => toast.success("Clicks export started (demo)")}>
            Export CSV
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Total Clicks" value={ADMIN_TOTALS.monthlyClicks} icon={MousePointerClick} trend="↑ 14.2%" support="This month" delay={0} />
          <KpiCard label="Unique Clicks" value={ADMIN_TOTALS.uniqueClicks} icon={Users} trend="↑ 11.4%" support="77.4% unique rate" delay={0.05} />
          <KpiCard label="Mobile Traffic" value={ADMIN_TOTALS.mobileShare} suffix="%" icon={Smartphone} trendTone="neutral" support="Best converting device" delay={0.1} />
          <KpiCard label="Desktop Traffic" value={ADMIN_TOTALS.desktopShare} suffix="%" icon={Monitor} trendTone="neutral" support="Steady share" delay={0.15} />
        </div>

        <AdminTable
          title="Click Log"
          description="Live click stream across every publisher and campaign."
          rows={CLICK_ROWS}
          columns={columns}
          rowKey={(r) => r.id}
          minWidth="100rem"
          label="clicks"
          emptyIcon={MousePointerClick}
          searchPlaceholder="Click ID, publisher, campaign..."
          search={(r, t) =>
            r.id.toLowerCase().includes(t) ||
            r.publisher.toLowerCase().includes(t) ||
            r.campaign.toLowerCase().includes(t) ||
            r.sub1.toLowerCase().includes(t)
          }
          filters={[
            { key: "device", options: ["All Devices", "Mobile", "Desktop", "Tablet"], match: (r, v) => r.device === v },
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
