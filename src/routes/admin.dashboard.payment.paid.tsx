import { createFileRoute } from "@tanstack/react-router";
import { Banknote } from "lucide-react";
import { dashboardHead } from "@/components/dashboard/head";
import { PayoutsView } from "@/components/admin/PayoutsView";
import { PAID_PAYOUTS, PAYMENT_TOTALS } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/payment/paid")({
  component: () => (
    <PayoutsView
      rows={PAID_PAYOUTS}
      title="Paid"
      description="Settled payouts with bank references, ready for reconciliation and publisher queries."
      tableTitle="Settled Payouts"
      primaryLabel="Paid Amount"
      primaryValue={PAYMENT_TOTALS.paidAmount}
      primaryIcon={Banknote}
    />
  ),
  head: () =>
    dashboardHead(
      "Paid Payouts — CrosX Admin",
      "Settled CrosX publisher payouts with amounts, methods and bank references.",
    ),
});
