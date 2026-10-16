import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminGate } from "@/components/admin/AdminGate";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminGate>
      <Outlet />
    </AdminGate>
  );
}
