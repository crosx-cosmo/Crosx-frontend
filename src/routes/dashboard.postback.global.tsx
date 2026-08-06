import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/postback/global")({
  component: Page,
  head: () =>
    dashboardHead(
      "Global Postback — CrosX Publisher",
      "Configure a single global postback URL for all conversion events.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="Global Postback"
      description="Configure a single global postback URL for all conversion events."
    />
  );
}
