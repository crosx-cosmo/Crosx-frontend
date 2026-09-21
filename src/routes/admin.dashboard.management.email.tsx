import { createFileRoute } from "@tanstack/react-router";
import { Mail, MailCheck, MailX, MousePointerClick, Pencil, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, Panel, StatusBadge } from "@/components/dashboard/kit";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { toneFor } from "@/components/admin/tones";
import { EMAIL_LOGS, EMAIL_TEMPLATES, EMAIL_TOTALS, num, type EmailRow } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/management/email")({
  component: Page,
  head: () =>
    dashboardHead(
      "Email — CrosX Admin",
      "Transactional email templates and delivery log for the CrosX platform.",
    ),
});

const columns: Column<EmailRow>[] = [
  { key: "id", label: "Email ID", className: "font-mono text-[12.5px] whitespace-nowrap", render: (r) => r.id },
  { key: "template", label: "Template", className: "whitespace-nowrap font-semibold", render: (r) => r.template },
  { key: "subject", label: "Subject", className: "whitespace-nowrap", render: (r) => r.subject },
  { key: "recipient", label: "Recipient", className: "whitespace-nowrap text-muted-foreground", render: (r) => r.recipient },
  { key: "audience", label: "Audience", render: (r) => <StatusBadge tone="neutral">{r.audience}</StatusBadge> },
  { key: "opens", label: "Opens", align: "right", className: "tabular-nums", render: (r) => r.opens },
  { key: "clicks", label: "Clicks", align: "right", className: "tabular-nums", render: (r) => r.clicks },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <StatusBadge tone={toneFor(r.status)} dot>
        {r.status}
      </StatusBadge>
    ),
  },
  { key: "sentAt", label: "Sent At", className: "whitespace-nowrap tabular-nums text-muted-foreground", render: (r) => r.sentAt },
];

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Management"
        title="Email"
        description="Every transactional template CrosX sends, plus a searchable delivery log with open and click data."
        action={
          <ActionButton variant="solid" icon={Send} onClick={() => toast.success("Test email queued (demo)")}>
            Send Test Email
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Sent (30d)" value={EMAIL_TOTALS.sent30d} icon={Mail} trend="↑ 8.2%" support="All templates" delay={0} />
          <KpiCard label="Delivered" value={EMAIL_TOTALS.delivered} icon={MailCheck} trend="97.3%" support="Delivery rate" delay={0.05} />
          <KpiCard label="Open Rate" value={EMAIL_TOTALS.openRate} suffix="%" decimals={1} icon={MousePointerClick} trend="↑ 3.1 pts" support="Unique opens" delay={0.1} />
          <KpiCard label="Bounce Rate" value={EMAIL_TOTALS.bounceRate} suffix="%" decimals={1} icon={MailX} trendTone="neutral" support="Hard + soft bounces" delay={0.15} />
        </div>

        <Panel title="Templates" description="Live transactional templates and their 30-day performance.">
          <ul className="grid gap-3 lg:grid-cols-2">
            {EMAIL_TEMPLATES.map((t) => (
              <li
                key={t.key}
                className="rounded-2xl border border-hairline bg-surface-2/35 p-4 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/45"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-[15px] font-bold">{t.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.audience} · updated {t.updated}
                    </p>
                  </div>
                  <ActionButton
                    variant="subtle"
                    icon={Pencil}
                    onClick={() => toast.success(`${t.name} editor opens here (demo)`)}
                  >
                    Edit
                  </ActionButton>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge tone="neutral">{num(t.sent30d)} sent / 30d</StatusBadge>
                  <StatusBadge tone="success">{t.openRate}% opens</StatusBadge>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <AdminTable
          title="Delivery Log"
          description="Filter by audience or status to investigate a specific send."
          rows={EMAIL_LOGS}
          columns={columns}
          rowKey={(r) => r.id}
          minWidth="96rem"
          label="emails"
          emptyIcon={Mail}
          searchPlaceholder="Email ID, template, recipient..."
          search={(r, t) =>
            r.id.toLowerCase().includes(t) ||
            r.template.toLowerCase().includes(t) ||
            r.recipient.toLowerCase().includes(t) ||
            r.subject.toLowerCase().includes(t)
          }
          filters={[
            {
              key: "status",
              options: ["All Status", "Delivered", "Opened", "Queued", "Bounced"],
              match: (r, v) => r.status === v,
            },
            {
              key: "audience",
              options: ["All Audiences", "Publishers", "Advertisers", "Internal", "Leads"],
              match: (r, v) => r.audience === v,
            },
          ]}
        />
      </div>
    </>
  );
}
