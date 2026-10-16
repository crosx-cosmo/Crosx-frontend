import { createFileRoute } from "@tanstack/react-router";
import { FileClock } from "lucide-react";
import { dashboardHead } from "@/components/dashboard/head";
import { PayoutsView } from "@/components/admin/PayoutsView";
import { PAYMENT_HISTORY } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/payment/history")({
  component: () => (
    <PayoutsView
      rows={PAYMENT_HISTORY}
      title="Payment History"
      description="The complete payout ledger across every cycle, including failed and re-issued transfers."
      tableTitle="Full Ledger"
      primaryLabel="Ledger Value"
      primaryValue={PAYMENT_HISTORY.reduce((s, p) => s + p.amount, 0)}
      primaryIcon={FileClock}
    />
  ),
  head: () =>
    dashboardHead(
      "Payment History — CrosX Admin",
      "Complete CrosX payout ledger across every settlement cycle, including failed transfers.",
    ),
});
