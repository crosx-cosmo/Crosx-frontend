import { createFileRoute } from "@tanstack/react-router";
import { dashboardHead } from "@/components/dashboard/head";
import { PublishersView } from "@/components/admin/PublishersView";

export const Route = createFileRoute("/admin/dashboard/publishers/pending")({
  component: () => (
    <PublishersView
      status="Pending"
      title="Pending Publishers"
      description="New signups awaiting KYC verification and admin approval before they can join campaigns."
      tableTitle="Pending Approval"
    />
  ),
  head: () =>
    dashboardHead(
      "Pending Publishers — CrosX Admin",
      "New CrosX publisher signups awaiting KYC verification and admin approval.",
    ),
});
