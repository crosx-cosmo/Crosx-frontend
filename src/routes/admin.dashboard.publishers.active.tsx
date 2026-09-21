import { createFileRoute } from "@tanstack/react-router";
import { dashboardHead } from "@/components/dashboard/head";
import { PublishersView } from "@/components/admin/PublishersView";

export const Route = createFileRoute("/admin/dashboard/publishers/active")({
  component: () => (
    <PublishersView
      status="Active"
      title="Active Publishers"
      description="Approved publishers currently sending traffic and earning on CrosX campaigns."
      tableTitle="Active Publishers"
    />
  ),
  head: () =>
    dashboardHead(
      "Active Publishers — CrosX Admin",
      "Approved CrosX publishers currently delivering traffic, with live performance and payout due.",
    ),
});
