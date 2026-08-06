import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/api")({
  component: Page,
  head: () =>
    dashboardHead(
      "API — CrosX Publisher",
      "Generate API keys and integrate CrosX reporting into your own stack.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="API"
      description="Generate API keys and integrate CrosX reporting into your own stack."
    />
  );
}
