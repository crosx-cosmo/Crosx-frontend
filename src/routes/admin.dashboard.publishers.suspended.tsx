import { createFileRoute } from "@tanstack/react-router";
import { dashboardHead } from "@/components/dashboard/head";
import { PublishersView } from "@/components/admin/PublishersView";

export const Route = createFileRoute("/admin/dashboard/publishers/suspended")({
  component: () => (
    <PublishersView
      status="Suspended"
      title="Suspended Publishers"
      description="Accounts blocked for traffic-quality or compliance violations, with payouts on hold."
      tableTitle="Suspended Accounts"
    />
  ),
  head: () =>
    dashboardHead(
      "Suspended Publishers — CrosX Admin",
      "CrosX publisher accounts suspended for compliance or traffic-quality violations.",
    ),
});
