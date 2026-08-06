import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/reports/clicks")({
  component: Page,
  head: () =>
    dashboardHead(
      "Clicks Report — CrosX Publisher",
      "Click-level reporting by campaign, source, device and geography.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="Clicks Report"
      description="Click-level reporting by campaign, source, device and geography."
    />
  );
}
