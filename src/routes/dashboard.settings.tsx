import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/settings")({
  component: Page,
  head: () =>
    dashboardHead(
      "Settings — CrosX Publisher",
      "Account preferences, notifications and security for your publisher account.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Account preferences, notifications and security for your publisher account."
    />
  );
}
