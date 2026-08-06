import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/postback/logs")({
  component: Page,
  head: () =>
    dashboardHead(
      "Postback Logs — CrosX Publisher",
      "Delivery history, response codes and retries for every postback fired.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="Postback Logs"
      description="Delivery history, response codes and retries for every postback fired."
    />
  );
}
