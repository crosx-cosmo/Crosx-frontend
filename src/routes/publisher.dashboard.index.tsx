import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LinkIcon, Target } from "lucide-react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";
import { TopCampaigns } from "@/components/dashboard/TopCampaigns";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TrackingLinkModal } from "@/components/dashboard/TrackingLinkModal";
import { ActionButton } from "@/components/dashboard/kit";
import { dashboardHead } from "@/components/dashboard/head";
import type { RangeKey } from "@/lib/publisher-data";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/publisher/dashboard/")({
  component: DashboardHome,
  head: () =>
    dashboardHead(
      "Publisher Dashboard — CrosX",
      "Live overview of your CrosX publisher account: campaigns, clicks, conversions and earnings performance.",
    ),
});

function DashboardHome() {
  const [range, setRange] = useState<RangeKey>("7d");
  const [linkOpen, setLinkOpen] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Your live publisher performance at a glance — traffic quality, conversions, earnings and lead share."
        action={
          <>
            <ActionButton icon={Target}>
              <Link to="/publisher/dashboard/campaigns/all">Browse Campaigns</Link>
            </ActionButton>
            <ActionButton variant="solid" icon={LinkIcon} onClick={() => setLinkOpen(true)}>
              Get Tracking Link
            </ActionButton>
          </>
        }
      />

      <div className="grid gap-5">
        <KpiGrid />
        <AnalyticsPanel range={range} onRange={setRange} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <TopCampaigns />
          <RecentActivity />
        </div>
      </div>

      <TrackingLinkModal open={linkOpen} onClose={() => setLinkOpen(false)} />
    </>
  );
}
