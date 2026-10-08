import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCheck, FilePlus2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { ActionButton } from "@/components/dashboard/kit";
import { dashboardHead } from "@/components/dashboard/head";
import { AdminKpiGrid } from "@/components/admin/AdminKpiGrid";
import { AdminAnalyticsPanel } from "@/components/admin/AdminAnalyticsPanel";
import { TopEntitiesPanel } from "@/components/admin/TopEntitiesPanel";
import { AdminActivityPanel } from "@/components/admin/AdminActivityPanel";
import type { RangeKey } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/")({
  component: AdminHome,
  head: () =>
    dashboardHead(
      "Admin Dashboard — CrosX",
      "Platform-wide overview of CrosX revenue, publishers, campaigns and payout health.",
    ),
});

function AdminHome() {
  const [range, setRange] = useState<RangeKey>("7d");

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Admin Dashboard"
        description="Live platform health — revenue, publisher growth, campaign performance and payout queue."
        action={
          <>
            <ActionButton icon={CheckCheck}>
              <Link to="/admin/dashboard/campaigns/approvals">Approval Requests</Link>
            </ActionButton>
            <ActionButton variant="solid" icon={FilePlus2}>
              <Link to="/admin/dashboard/campaigns/create">Create Campaign</Link>
            </ActionButton>
          </>
        }
      />

      <div className="grid gap-5">
        <AdminKpiGrid />
        <AdminAnalyticsPanel range={range} onRange={setRange} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <TopEntitiesPanel />
          <AdminActivityPanel />
        </div>
      </div>
    </>
  );
}
