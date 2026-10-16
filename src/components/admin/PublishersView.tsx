import { Download, ShieldAlert, UserCheck, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { ActionButton, KpiCard, StatusBadge } from "@/components/dashboard/kit";
import { AdminTable, type Column } from "./AdminTable";
import { PublisherActions } from "./PublisherActions";
import { toneFor } from "./tones";
import { inr, num, type AdminPublisher, type PublisherStatus } from "@/lib/admin-data";
import { usePublisherRows } from "@/lib/admin-status-store";

const columns: Column<AdminPublisher>[] = [
  { key: "id", label: "Publisher ID", className: "font-mono text-[12.5px] whitespace-nowrap", render: (r) => r.id },
  { key: "name", label: "Publisher", className: "whitespace-nowrap font-semibold", render: (r) => r.name },
  { key: "company", label: "Company", className: "whitespace-nowrap text-muted-foreground", render: (r) => r.company },
  { key: "email", label: "Email", className: "whitespace-nowrap text-muted-foreground", render: (r) => r.email },
  { key: "tier", label: "Tier", render: (r) => <StatusBadge tone="neutral">{r.tier}</StatusBadge> },
  { key: "traffic", label: "Traffic", className: "whitespace-nowrap", render: (r) => r.traffic },
  { key: "geo", label: "Geo", className: "whitespace-nowrap", render: (r) => r.geo },
  { key: "campaigns", label: "Campaigns", align: "right", className: "tabular-nums", render: (r) => num(r.campaigns) },
  { key: "clicks", label: "Clicks", align: "right", className: "tabular-nums", render: (r) => num(r.clicks) },
  { key: "conversions", label: "Conversions", align: "right", className: "tabular-nums", render: (r) => num(r.conversions) },
  {
    key: "revenue",
    label: "Revenue",
    align: "right",
    className: "tabular-nums whitespace-nowrap font-semibold text-brand",
    render: (r) => inr(r.revenue),
  },
  {
    key: "payoutDue",
    label: "Payout Due",
    align: "right",
    className: "tabular-nums whitespace-nowrap",
    render: (r) => inr(r.payoutDue),
  },
  { key: "kyc", label: "KYC", render: (r) => <StatusBadge tone={toneFor(r.kyc)}>{r.kyc}</StatusBadge> },
  { key: "joined", label: "Joined", className: "whitespace-nowrap tabular-nums text-muted-foreground", render: (r) => r.joined },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <StatusBadge tone={toneFor(r.status)} dot>
        {r.status}
      </StatusBadge>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    align: "right",
    className: "whitespace-nowrap",
    render: (r) => <PublisherActions row={r} />,
  },
];

/** Shared publisher directory used by All / Active / Pending / Suspended pages. */
export function PublishersView({
  status,
  title,
  description,
  tableTitle,
}: {
  status?: PublisherStatus;
  title: string;
  description: string;
  tableTitle: string;
}) {
  const all = usePublisherRows();
  const rows = status ? all.filter((p) => p.status === status) : all;
  const revenue = rows.reduce((s, p) => s + p.revenue, 0);
  const due = rows.reduce((s, p) => s + p.payoutDue, 0);
  const active = rows.filter((p) => p.status === "Active").length;

  return (
    <>
      <PageHeader
        eyebrow="Publisher"
        title={title}
        description={description}
        action={
          <ActionButton
            icon={Download}
            onClick={() => toast.success("Publisher export started (demo)")}
          >
            Export CSV
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Publishers" value={rows.length} icon={Users} trendTone="neutral" support="In this view" delay={0} />
          <KpiCard
            label={status === "Suspended" ? "Suspended" : "Active"}
            value={status === "Suspended" ? rows.length : active}
            icon={status === "Suspended" ? ShieldAlert : UserCheck}
            trendTone="neutral"
            support="Account state"
            delay={0.05}
          />
          <KpiCard
            label="Revenue Generated"
            value={revenue}
            prefix="₹"
            icon={Users}
            trendTone="neutral"
            support="Lifetime, this view"
            delay={0.1}
          />
          <KpiCard
            label="Payout Due"
            value={due}
            prefix="₹"
            icon={Wallet}
            trendTone="neutral"
            support="Next cycle: 15 Sep 2026"
            delay={0.15}
          />
        </div>

        <AdminTable
          title={tableTitle}
          description="Search by name, ID, company or email; filter by tier, traffic source and KYC."
          rows={rows}
          columns={columns}
          rowKey={(r) => r.id}
          minWidth="135rem"
          label="publishers"
          emptyIcon={Users}
          searchPlaceholder="Name, ID, company, email..."
          search={(r, t) =>
            r.name.toLowerCase().includes(t) ||
            r.id.toLowerCase().includes(t) ||
            r.company.toLowerCase().includes(t) ||
            r.email.toLowerCase().includes(t)
          }
          filters={[
            ...(status
              ? []
              : [
                  {
                    key: "status",
                    options: ["All Status", "Active", "Pending", "Suspended", "Terminated"],
                    match: (r: AdminPublisher, v: string) => r.status === v,
                  },
                ]),
            {
              key: "tier",
              options: ["All Tiers", "Elite Partner", "Growth Partner", "Starter"],
              match: (r, v) => r.tier === v,
            },
            {
              key: "traffic",
              options: ["All Traffic", "Meta Ads", "Google Ads", "SEO", "Email", "Push", "Native"],
              match: (r, v) => r.traffic === v,
            },
          ]}
        />
      </div>
    </>
  );
}
