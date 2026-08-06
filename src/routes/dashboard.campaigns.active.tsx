import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/campaigns/active")({
  component: Page,
  head: () =>
    dashboardHead(
      "Active Campaign — CrosX Publisher",
      "Campaigns you are currently promoting, with live caps, payouts and status.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="Active Campaign"
      description="Campaigns you are currently promoting, with live caps, payouts and status."
    />
  );
}
