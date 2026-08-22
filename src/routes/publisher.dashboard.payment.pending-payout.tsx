import { createFileRoute } from "@tanstack/react-router";
import { Clock, Info, Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { KpiCard, Panel, StatusBadge, TableWrap, Td, Th, Tr } from "@/components/dashboard/kit";
import { ACCOUNT_TOTALS, PENDING_BREAKDOWN, inr } from "@/lib/publisher-data";

export const Route = createFileRoute("/publisher/dashboard/payment/pending-payout")({
  component: Page,
  head: () =>
    dashboardHead(
      "Pending Payout — CrosX Publisher",
      "Track earnings awaiting settlement, payout schedule and per-campaign pending balances.",
    ),
});

const TIMELINE = [
  { label: "Conversions locked", detail: "Aug 1 – Aug 15 cycle", done: true },
  { label: "Advertiser verification", detail: "Approval checks in progress", done: true },
  { label: "Invoice generated", detail: "Auto-generated on Aug 15", done: false },
  { label: "Payout released", detail: "NEFT within 2 working days", done: false },
];

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Payments"
        title="Pending Payout"
        description="Earnings awaiting settlement, your payout schedule and per-campaign pending balances."
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <KpiCard
            label="Pending Amount"
            value={ACCOUNT_TOTALS.pendingPayout}
            prefix="₹"
            icon={Wallet}
            trend="Processing"
            trendTone="neutral"
            support="Across 3 campaigns"
            delay={0}
          />
          <KpiCard
            label="Next Payout"
            value={15}
            icon={Clock}
            trendTone="neutral"
            trend="Aug 2026"
            support={ACCOUNT_TOTALS.nextPayoutDate}
            caption="Auto-settled every 15 days"
            delay={0.05}
          />
          <KpiCard
            label="Minimum Threshold"
            value={5000}
            prefix="₹"
            icon={Info}
            trend="Met"
            support="You are eligible for payout"
            delay={0.1}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Panel
            title="Pending by Campaign"
            description="Where your unsettled earnings are coming from."
          >
            <TableWrap>
              <thead>
                <tr>
                  <Th>Campaign</Th>
                  <Th align="right">Pending Amount</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {PENDING_BREAKDOWN.map((p) => (
                  <Tr key={p.campaign}>
                    <Td className="font-semibold">{p.campaign}</Td>
                    <Td className="text-right font-semibold tabular-nums">{inr(p.amount)}</Td>
                    <Td>
                      <StatusBadge tone="warn" dot>
                        Awaiting settlement
                      </StatusBadge>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          </Panel>

          <Panel title="Payout Timeline" description="Where this cycle currently stands.">
            <ol className="relative grid gap-4 pl-6">
              <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-hairline" />
              {TIMELINE.map((t) => (
                <li key={t.label} className="relative">
                  <span
                    aria-hidden="true"
                    className={
                      t.done
                        ? "absolute -left-6 top-1 size-[15px] rounded-full border-2 border-brand bg-brand"
                        : "absolute -left-6 top-1 size-[15px] rounded-full border-2 border-hairline bg-surface-2"
                    }
                  />
                  <p className="text-[13px] font-semibold">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.detail}</p>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </>
  );
}
