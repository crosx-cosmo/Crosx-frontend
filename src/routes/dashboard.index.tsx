import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { StatCards } from "@/components/dashboard/StatCards";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { CampaignPerformance } from "@/components/dashboard/CampaignPerformance";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
  head: () =>
    dashboardHead(
      "Publisher Dashboard — CrosX",
      "Live overview of your CrosX publisher account: campaigns, clicks, conversions and lead performance.",
    ),
});

function DashboardHome() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your live publisher performance at a glance — campaigns, traffic quality and lead share."
      />
      <div className="grid gap-5">
        <StatCards />
        <AnalyticsChart />
        <CampaignPerformance />
      </div>
    </>
  );
}
