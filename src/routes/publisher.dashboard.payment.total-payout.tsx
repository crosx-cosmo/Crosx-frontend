import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BadgeIndianRupee, Download, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  KpiCard,
  Panel,
  StatusBadge,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/dashboard/kit";
import { ACCOUNT_TOTALS, INVOICES, MONTHLY_EARNINGS, inr } from "@/lib/publisher-data";

export const Route = createFileRoute("/publisher/dashboard/payment/total-payout")({
  component: Page,
  head: () =>
    dashboardHead(
      "Total Payout — CrosX Publisher",
      "Lifetime earnings, settled payouts and month-by-month payment history on CrosX.",
    ),
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Payments"
        title="Total Payout"
        description="Lifetime earnings, settled payouts and a full month-by-month payment history."
        action={
          <ActionButton
            icon={Download}
            onClick={() => toast.success("Payout statement export started (demo)")}
          >
            Export Statement
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard
            label="Lifetime Earnings"
            value={ACCOUNT_TOTALS.paidPayout + ACCOUNT_TOTALS.pendingPayout}
            prefix="₹"
            icon={BadgeIndianRupee}
            trend="↑ 15.2%"
            support="All-time revenue"
            delay={0}
          />
          <KpiCard
            label="Paid Out"
            value={ACCOUNT_TOTALS.paidPayout}
            prefix="₹"
            icon={Wallet}
            trend="Settled"
            support="Across 2 invoices"
            delay={0.05}
          />
          <KpiCard
            label="This Month"
            value={ACCOUNT_TOTALS.earnings}
            prefix="₹"
            icon={TrendingUp}
            trend="↑ 15.2%"
            support={`vs ${inr(ACCOUNT_TOTALS.lastMonthEarnings)} last month`}
            delay={0.1}
          />
          <KpiCard
            label="Pending"
            value={ACCOUNT_TOTALS.pendingPayout}
            prefix="₹"
            icon={Wallet}
            trend="Processing"
            trendTone="neutral"
            support={`Next payout ${ACCOUNT_TOTALS.nextPayoutDate}`}
            delay={0.15}
          />
        </div>

        <Panel title="Earnings Trend" description="Monthly earnings over the last six months.">
          <div className="h-[16rem] w-full sm:h-[19rem]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_EARNINGS} margin={{ top: 8, right: 6, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="var(--grid-line)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  width={54}
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  formatter={(v: number) => [inr(v), "Earnings"]}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--hairline)",
                    borderRadius: "0.875rem",
                    color: "var(--popover-foreground)",
                    fontSize: 12,
                  }}
                  cursor={{ fill: "var(--brand)", fillOpacity: 0.08 }}
                />
                <Bar
                  dataKey="earnings"
                  fill="var(--brand)"
                  radius={[8, 8, 4, 4]}
                  animationDuration={700}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Payment History" description="Every payout cycle settled to your account.">
          <TableWrap>
            <thead>
              <tr>
                <Th>Invoice</Th>
                <Th>Period</Th>
                <Th align="right">Amount</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((i) => (
                <Tr key={i.id}>
                  <Td className="font-mono text-[12.5px]">{i.id}</Td>
                  <Td className="font-semibold">{i.period}</Td>
                  <Td className="text-right font-semibold tabular-nums">{inr(i.amount)}</Td>
                  <Td>
                    <StatusBadge tone={i.status === "Paid" ? "success" : "warn"} dot>
                      {i.status}
                    </StatusBadge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>
      </div>
    </>
  );
}
