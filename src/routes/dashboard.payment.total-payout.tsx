import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/payment/total-payout")({
  component: Page,
  head: () =>
    dashboardHead(
      "Total Payout — CrosX Publisher",
      "Lifetime earnings, settled payouts and payment history.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="Total Payout"
      description="Lifetime earnings, settled payouts and payment history."
    />
  );
}
