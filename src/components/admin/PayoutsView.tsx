import { Banknote, Download, Wallet, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { ActionButton, KpiCard, StatusBadge } from "@/components/dashboard/kit";
import { AdminTable, type Column } from "./AdminTable";
import { toneFor } from "./tones";
import { inr, type PayoutRow } from "@/lib/admin-data";

const columns: Column<PayoutRow>[] = [
  { key: "id", label: "Payout ID", className: "font-mono text-[12.5px] whitespace-nowrap", render: (r) => r.id },
  { key: "publisher", label: "Publisher", className: "whitespace-nowrap font-semibold", render: (r) => r.publisher },
  { key: "publisherId", label: "Publisher ID", className: "font-mono text-[12.5px] whitespace-nowrap text-muted-foreground", render: (r) => r.publisherId },
  { key: "amount", label: "Amount", align: "right", className: "tabular-nums whitespace-nowrap font-semibold text-brand", render: (r) => inr(r.amount) },
  { key: "method", label: "Method", className: "whitespace-nowrap", render: (r) => r.method },
  { key: "period", label: "Period", className: "whitespace-nowrap text-muted-foreground", render: (r) => r.period },
  { key: "requestedAt", label: "Requested", className: "whitespace-nowrap tabular-nums text-muted-foreground", render: (r) => r.requestedAt },
  { key: "paidAt", label: "Paid", className: "whitespace-nowrap tabular-nums text-muted-foreground", render: (r) => r.paidAt ?? "—" },
  { key: "reference", label: "Reference", className: "font-mono text-[12.5px] whitespace-nowrap", render: (r) => r.reference },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <StatusBadge tone={toneFor(r.status)} dot>
        {r.status}
      </StatusBadge>
    ),
  },
];

/** Shared payout table used by Pending / Paid / History pages. */
export function PayoutsView({
  rows,
  title,
  description,
  tableTitle,
  primaryLabel,
  primaryValue,
  primaryIcon = Wallet,
  extra,
}: {
  rows: PayoutRow[];
  title: string;
  description: string;
  tableTitle: string;
  primaryLabel: string;
  primaryValue: number;
  primaryIcon?: typeof Wallet;
  extra?: { label: string; value: number; support: string };
}) {
  const total = rows.reduce((s, p) => s + p.amount, 0);
  const failed = rows.filter((p) => p.status === "Failed").length;

  return (
    <>
      <PageHeader
        eyebrow="Payment"
        title={title}
        description={description}
        action={
          <ActionButton icon={Download} onClick={() => toast.success("Payout export started (demo)")}>
            Export CSV
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label={primaryLabel} value={primaryValue} prefix="₹" icon={primaryIcon} trendTone="neutral" support="This view" delay={0} />
          <KpiCard label="Requests" value={rows.length} icon={Banknote} trendTone="neutral" support="Payout records" delay={0.05} />
          <KpiCard label="Average Ticket" value={rows.length ? Math.round(total / rows.length) : 0} prefix="₹" icon={Banknote} trendTone="neutral" support="Per request" delay={0.1} />
          {extra ? (
            <KpiCard label={extra.label} value={extra.value} icon={Wallet} trendTone="neutral" support={extra.support} delay={0.15} />
          ) : (
            <KpiCard label="Failed" value={failed} icon={XCircle} trendTone="neutral" support="Need re-processing" delay={0.15} />
          )}
        </div>

        <AdminTable
          title={tableTitle}
          description="Search by publisher, payout ID or bank reference; filter by method and status."
          rows={rows}
          columns={columns}
          rowKey={(r) => r.id}
          minWidth="92rem"
          label="payouts"
          emptyIcon={Wallet}
          searchPlaceholder="Publisher, payout ID, reference..."
          search={(r, t) =>
            r.publisher.toLowerCase().includes(t) ||
            r.id.toLowerCase().includes(t) ||
            r.reference.toLowerCase().includes(t) ||
            r.publisherId.toLowerCase().includes(t)
          }
          filters={[
            {
              key: "status",
              options: ["All Status", "Pending", "In Review", "Approved", "Paid", "Failed"],
              match: (r, v) => r.status === v,
            },
            {
              key: "method",
              options: ["All Methods", "Bank Transfer", "UPI", "USDT (TRC-20)", "PayPal"],
              match: (r, v) => r.method === v,
            },
          ]}
        />
      </div>
    </>
  );
}
