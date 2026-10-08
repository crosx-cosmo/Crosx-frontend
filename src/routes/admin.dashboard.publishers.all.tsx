import { createFileRoute } from "@tanstack/react-router";
import { dashboardHead } from "@/components/dashboard/head";
import { PublishersView } from "@/components/admin/PublishersView";

export const Route = createFileRoute("/admin/dashboard/publishers/all")({
  component: () => (
    <PublishersView
      title="All Publishers"
      description="Every publisher account on CrosX with traffic profile, performance and payout exposure."
      tableTitle="Publisher Directory"
    />
  ),
  head: () =>
    dashboardHead(
      "All Publishers — CrosX Admin",
      "Directory of every CrosX publisher with status, KYC, performance and payout exposure.",
    ),
});
