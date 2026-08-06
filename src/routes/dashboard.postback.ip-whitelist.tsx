import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/postback/ip-whitelist")({
  component: Page,
  head: () =>
    dashboardHead(
      "IP Whitelist — CrosX Publisher",
      "Whitelist trusted server IPs allowed to send and receive postbacks.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="IP Whitelist"
      description="Whitelist trusted server IPs allowed to send and receive postbacks."
    />
  );
}
