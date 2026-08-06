import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/payment/pending-payout")({
  component: Page,
  head: () =>
    dashboardHead(
      "Pending Payout — CrosX Publisher",
      "Approved earnings awaiting the next CrosX settlement cycle.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="Pending Payout"
      description="Approved earnings awaiting the next CrosX settlement cycle."
    />
  );
}
