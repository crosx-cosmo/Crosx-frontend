import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  BadgeIndianRupee,
  CheckCircle2,
  Gauge,
  LinkIcon,
  MousePointerClick,
  Plus,
  ShieldCheck,
  Smartphone,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { CampaignPostbackPanel } from "@/components/dashboard/CampaignPostbackPanel";
import { CampaignTermsPanel } from "@/components/dashboard/CampaignTermsPanel";
import { ConversionEventsPanel } from "@/components/dashboard/ConversionEventsPanel";
import { PageHeader } from "@/components/dashboard/DashboardShell";

import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, Panel, StatusBadge } from "@/components/dashboard/kit";
import { usePublisherMock } from "@/components/dashboard/mock-store";
import { TrackingLinkModal } from "@/components/dashboard/TrackingLinkModal";
import { NotFoundExperience } from "@/components/notfound/NotFoundExperience";
import { CampaignPostbackProvider } from "@/lib/campaign-postback-store";
import { CAMPAIGNS, inr } from "@/lib/publisher-data";

export const Route = createFileRoute("/publisher/dashboard/campaigns/$slug")({
  loader: ({ params }) => {
    const campaign = CAMPAIGNS.find((c) => c.slug === params.slug);
    if (!campaign) throw notFound();
    return { name: campaign.name, tagline: campaign.tagline };
  },
  head: ({ loaderData }) =>
    loaderData
      ? dashboardHead(
          `${loaderData.name} — CrosX Publisher`,
          `${loaderData.tagline} campaign details, payout terms and traffic rules on CrosX.`,
        )
      : dashboardHead("Campaign — CrosX Publisher", "Campaign details for CrosX publishers."),
  notFoundComponent: CampaignNotFound,
  component: Page,
});

function CampaignNotFound() {
  return <NotFoundExperience />;
}

function Page() {
  const { slug } = Route.useParams();
  const { campaigns, joinCampaign } = usePublisherMock();
  const [linkOpen, setLinkOpen] = useState(false);
  const campaign = campaigns.find((c) => c.slug === slug);

  if (!campaign) return <NotFoundExperience />;

  return (
    <>
      <Link
        to="/publisher/dashboard/campaigns/all"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors duration-300 hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to all campaigns
      </Link>

      <PageHeader
        eyebrow={`${campaign.category} • ${campaign.id}`}
        title={campaign.name}
        description={campaign.description}
        action={
          campaign.joined ? (
            <>
              <StatusBadge tone="success" className="h-10 px-4">
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                Joined
              </StatusBadge>
              <ActionButton variant="solid" icon={LinkIcon} onClick={() => setLinkOpen(true)}>
                Get Tracking Link
              </ActionButton>
            </>
          ) : (
            <ActionButton
              variant="solid"
              icon={Plus}
              onClick={() => {
                joinCampaign(campaign.slug);
                toast.success(`Joined ${campaign.name}`, {
                  description: "Your tracking link is ready to generate.",
                });
              }}
            >
              Join Campaign
            </ActionButton>
          )
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard
            label="Payout"
            value={campaign.payout}
            prefix="₹"
            icon={BadgeIndianRupee}
            support="Per confirmed conversion"
            delay={0}
          />
          <KpiCard
            label="EPC"
            value={campaign.epc}
            prefix="₹"
            decimals={2}
            icon={Gauge}
            support="Earnings per click"
            delay={0.05}
          />
          <KpiCard
            label="Conversion Rate"
            value={campaign.cr}
            suffix="%"
            decimals={2}
            icon={MousePointerClick}
            support="Network average"
            delay={0.1}
          />
          <KpiCard
            label="Approval Rate"
            value={campaign.approvalRate}
            suffix="%"
            decimals={1}
            icon={ShieldCheck}
            support={`Avg ${campaign.avgConversionDays} days to confirm`}
            delay={0.15}
          />
        </div>

        <div className="grid gap-5">
          <CampaignTermsPanel campaign={campaign} />

          <Panel
            title="Your Performance"
            description={
              campaign.joined
                ? "Lifetime results you have generated on this campaign."
                : "Join this campaign to start generating traffic and earnings."
            }
          >
            <dl className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Clicks", value: campaign.clicks.toLocaleString("en-US") },
                { label: "Conversions", value: campaign.conversions.toLocaleString("en-US") },
                { label: "Revenue", value: inr(campaign.revenue) },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-hairline bg-surface-2/40 p-4"
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-black tracking-tight tabular-nums">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-surface-2/40 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Landing Pages
                </p>
                <ul className="mt-2 grid gap-1.5">
                  {campaign.landingPages.map((lp) => (
                    <li key={lp} className="text-sm font-semibold">
                      {lp}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-hairline bg-surface-2/40 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Targeting
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                  <Smartphone className="size-4 text-brand" aria-hidden="true" />
                  {campaign.devices}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Geo: {campaign.geo}</p>
                <p className="mt-1 text-sm text-muted-foreground">Status: {campaign.status}</p>
              </div>
            </div>
          </Panel>

          <CampaignPostbackProvider campaign={campaign}>
            <ConversionEventsPanel campaign={campaign} />

            <CampaignPostbackPanel campaign={campaign} />
          </CampaignPostbackProvider>





          <Panel
            title="Traffic Rules"
            description="Stay compliant to keep your conversions approved."
          >
            <div className="grid gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-500">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  Allowed
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {campaign.allowed.map((a) => (
                    <li key={a}>
                      <StatusBadge tone="success">{a}</StatusBadge>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-red-500">
                  <XCircle className="size-3.5" aria-hidden="true" />
                  Not Allowed
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {campaign.disallowed.map((d) => (
                    <li key={d}>
                      <StatusBadge tone="danger">{d}</StatusBadge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <TrackingLinkModal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        campaignSlug={campaign.slug}
      />
    </>
  );
}
