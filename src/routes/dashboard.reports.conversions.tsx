import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/reports/conversions")({
  component: Page,
  head: () =>
    dashboardHead(
      "Conversion Report — CrosX Publisher",
      "Approved, pending and rejected conversions across your campaigns.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="Conversion Report"
      description="Approved, pending and rejected conversions across your campaigns."
    />
  );
}
