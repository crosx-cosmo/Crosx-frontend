import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardGate } from "@/components/dashboard/DashboardGate";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <DashboardGate>
      <Outlet />
    </DashboardGate>
  );
}
