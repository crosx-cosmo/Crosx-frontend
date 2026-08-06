import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/reports/leads")({
  component: Page,
  head: () =>
    dashboardHead(
      "Leads Report — CrosX Publisher",
      "Lead volume, quality score and approval rate for every campaign.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="Leads Report"
      description="Lead volume, quality score and approval rate for every campaign."
    />
  );
}
