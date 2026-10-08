import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FilePlus2, Target } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, StatusBadge } from "@/components/dashboard/kit";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { toneFor } from "@/components/admin/tones";
import { CAMPAIGNS, ADMIN_TOTALS, inr, num, type AdminCampaign } from "@/lib/admin-data";
import { CircleDollarSign, ListChecks, Users, Zap } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard/campaigns/all")({
  component: Page,
  head: () =>
    dashboardHead(
      "All Campaigns — CrosX Admin",
      "Manage every CrosX campaign: advertisers, payouts, caps, publishers and live performance.",
    ),
});

const columns: Column<AdminCampaign>[] = [
  {
    key: "id",
    label: "Campaign ID",
    className: "font-mono text-[12.5px] whitespace-nowrap",
    render: (r) => r.id,
  },
  {
    key: "name",
    label: "Campaign",
    className: "whitespace-nowrap font-semibold",
    render: (r) => r.name,
  },
  {
    key: "advertiser",
    label: "Advertiser",
    className: "whitespace-nowrap text-muted-foreground",
    render: (r) => r.advertiser,
  },
  { key: "category", label: "Category", render: (r) => r.category },
  { key: "model", label: "Model", render: (r) => <StatusBadge tone="neutral">{r.model}</StatusBadge> },
  {
    key: "revenue-per",
    label: "Revenue / Conv",
    align: "right",
    className: "tabular-nums whitespace-nowrap",
    render: (r) => inr(r.revenuePerConv),
  },
  {
    key: "payout",
    label: "Publisher Payout",
    align: "right",
    className: "tabular-nums whitespace-nowrap",
    render: (r) => inr(r.publisherPayout),
  },
  { key: "geo", label: "Geo", className: "whitespace-nowrap", render: (r) => r.geo },
  {
    key: "cap",
    label: "Daily Cap",
    align: "right",
    className: "tabular-nums",
    render: (r) => num(r.dailyCap),
  },
  {
    key: "publishers",
    label: "Publishers",
    align: "right",
    className: "tabular-nums",
    render: (r) => num(r.publishers),
  },
  {
    key: "clicks",
    label: "Clicks",
    align: "right",
    className: "tabular-nums",
    render: (r) => num(r.clicks),
  },
  {
    key: "conversions",
    label: "Conversions",
    align: "right",
    className: "tabular-nums",
    render: (r) => num(r.conversions),
  },
  {
    key: "revenue",
    label: "Revenue",
    align: "right",
    className: "tabular-nums whitespace-nowrap font-semibold text-brand",
    render: (r) => inr(r.revenue),
  },
  {
    key: "status",
    label: "Status",
    render: (r) => <StatusBadge tone={toneFor(r.status)}>{r.status}</StatusBadge>,
  },
];

function Page() {
  const active = CAMPAIGNS.filter((c) => c.status === "Active").length;
  const revenue = CAMPAIGNS.reduce((s, c) => s + c.revenue, 0);
  const publishers = CAMPAIGNS.reduce((s, c) => s + c.publishers, 0);

  return (
    <>
      <PageHeader
        eyebrow="Campaign"
        title="All Campaigns"
        description="Every campaign on the CrosX network with advertiser payouts, caps and live delivery."
        action={
          <>
            <ActionButton
              icon={Download}
              onClick={() => toast.success("Campaign export started (demo)")}
            >
              Export CSV
            </ActionButton>
            <ActionButton variant="solid" icon={FilePlus2}>
              <Link to="/admin/dashboard/campaigns/create">Create Campaign</Link>
            </ActionButton>
          </>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard
            label="Total Campaigns"
            value={ADMIN_TOTALS.campaigns}
            icon={ListChecks}
            trend="↑ 9.1%"
            support={`${CAMPAIGNS.length} shown in this view`}
            delay={0}
          />
          <KpiCard
            label="Active Campaigns"
            value={active}
            icon={Zap}
            trend="↑ 4.8%"
            support="Delivering right now"
            delay={0.05}
          />
          <KpiCard
            label="Attached Publishers"
            value={publishers}
            icon={Users}
            trendTone="neutral"
            support="Across all campaigns"
            delay={0.1}
          />
          <KpiCard
            label="Campaign Revenue"
            value={revenue}
            prefix="₹"
            icon={CircleDollarSign}
            trend="↑ 18.6%"
            support="Current period"
            delay={0.15}
          />
        </div>

        <AdminTable
          title="Campaign Directory"
          description="Search by campaign or advertiser, then filter by status and category."
          rows={CAMPAIGNS}
          columns={columns}
          rowKey={(r) => r.id}
          minWidth="110rem"
          label="campaigns"
          emptyIcon={Target}
          searchPlaceholder="Campaign, advertiser, ID..."
          search={(r, t) =>
            r.name.toLowerCase().includes(t) ||
            r.advertiser.toLowerCase().includes(t) ||
            r.id.toLowerCase().includes(t)
          }
          filters={[
            {
              key: "status",
              options: ["All Status", "Active", "Paused", "Pending", "Ended"],
              match: (r, v) => r.status === v,
            },
            {
              key: "category",
              options: ["All Categories", "Trading", "Investment", "Finance", "Insurance", "Crypto"],
              match: (r, v) => r.category === v,
            },
            {
              key: "model",
              options: ["All Models", "CPL", "CPA", "CPI", "CPS"],
              match: (r, v) => r.model === v,
            },
          ]}
        />
      </div>
    </>
  );
}
