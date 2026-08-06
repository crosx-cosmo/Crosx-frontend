import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/campaigns/all")({
  component: Page,
  head: () =>
    dashboardHead(
      "All Campaign — CrosX Publisher",
      "Browse every CrosX campaign available to your publisher account with payouts and tracking links.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="All Campaign"
      description="Browse every CrosX campaign available to your publisher account with payouts and tracking links."
    />
  );
}
