import { createFileRoute } from "@tanstack/react-router";
import { PauseCircle } from "lucide-react";
import { dashboardHead } from "@/components/dashboard/head";
import { PayoutsView } from "@/components/admin/PayoutsView";
import { PAYMENT_TOTALS, PENDING_PAYOUTS } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/payment/pending")({
  component: () => (
    <PayoutsView
      rows={PENDING_PAYOUTS}
      title="Pending Payout"
      description="Withdrawal requests queued for the next settlement cycle, awaiting review or release."
      tableTitle="Pending Requests"
      primaryLabel="Pending Amount"
      primaryValue={PAYMENT_TOTALS.pendingAmount}
      primaryIcon={PauseCircle}
      extra={{ label: "Next Cycle", value: 15, support: "Releases 15 Sep 2026" }}
    />
  ),
  head: () =>
    dashboardHead(
      "Pending Payout — CrosX Admin",
      "Publisher withdrawal requests queued for the next CrosX settlement cycle.",
    ),
});
