import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";
import { dashboardHead } from "@/components/dashboard/head";

export const Route = createFileRoute("/dashboard/profile")({
  component: Page,
  head: () =>
    dashboardHead(
      "Profile — CrosX Publisher",
      "Manage your publisher profile, company details and traffic sources.",
    ),
});

function Page() {
  return (
    <PlaceholderPage
      title="Profile"
      description="Manage your publisher profile, company details and traffic sources."
    />
  );
}
