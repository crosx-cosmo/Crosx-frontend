import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/payment/invoice")({
  component: Page,
  head: () =>
    dashboardHead(
      "Invoice — CrosX Publisher",
      "Download GST-ready invoices for every settled payout.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="Invoice"
      description="Download GST-ready invoices for every settled payout."
    />
  );
}
