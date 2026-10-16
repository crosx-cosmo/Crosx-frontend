import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, CalendarClock, Download, RotateCcw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, StatusBadge } from "@/components/dashboard/kit";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { toneFor } from "@/components/admin/tones";
import { type MeetingRow } from "@/lib/admin-data";
import { useMeetingRows } from "@/lib/admin-status-store";
import { MeetingActions } from "@/components/admin/MeetingActions";

export const Route = createFileRoute("/admin/dashboard/management/meetings")({
  component: Page,
  head: () =>
    dashboardHead(
      "Meetings — CrosX Admin",
      "Every meeting booked through CrosX, with attendee, topic, timezone and status.",
    ),
});

const columns: Column<MeetingRow>[] = [
  { key: "id", label: "Meeting ID", className: "font-mono text-[12.5px] whitespace-nowrap", render: (r) => r.id },
  { key: "name", label: "Attendee", className: "whitespace-nowrap font-semibold", render: (r) => r.name },
  { key: "email", label: "Email", className: "whitespace-nowrap text-muted-foreground", render: (r) => r.email },
  { key: "company", label: "Company", className: "whitespace-nowrap", render: (r) => r.company },
  { key: "topic", label: "Topic", className: "whitespace-nowrap", render: (r) => r.topic },
  { key: "date", label: "Date", className: "whitespace-nowrap tabular-nums", render: (r) => r.date },
  { key: "time", label: "Time", className: "whitespace-nowrap tabular-nums", render: (r) => r.time },
  { key: "timezone", label: "Timezone", className: "whitespace-nowrap text-muted-foreground", render: (r) => r.timezone },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <StatusBadge tone={toneFor(r.status)} dot>
        {r.status}
      </StatusBadge>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    align: "right",
    className: "whitespace-nowrap",
    render: (r) => <MeetingActions row={r} />,
  },
];

function Page() {
  const meetings = useMeetingRows();
  const confirmed = meetings.filter((m) => m.status === "Confirmed").length;
  const completed = meetings.filter((m) => m.status === "Completed").length;
  const cancelled = meetings.filter((m) => m.status === "Cancelled").length;
  const rescheduled = meetings.filter((m) => m.status === "Rescheduled").length;

  return (
    <>
      <PageHeader
        eyebrow="Management"
        title="Meetings"
        description="All bookings from the CrosX site, with attendee detail, topic and confirmation status."
        action={
          <ActionButton icon={Download} onClick={() => toast.success("Meeting export started (demo)")}>
            Export CSV
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Upcoming" value={confirmed} icon={CalendarClock} trendTone="neutral" support="Confirmed bookings" delay={0} />
          <KpiCard label="Completed" value={completed} icon={CalendarCheck} trendTone="neutral" support="Calls held" delay={0.05} />
          <KpiCard label="Rescheduled" value={rescheduled} icon={RotateCcw} trendTone="neutral" support="Moved by attendee" delay={0.1} />
          <KpiCard label="Cancelled" value={cancelled} icon={XCircle} trendTone="neutral" support="Dropped bookings" delay={0.15} />
        </div>

        <AdminTable
          title="Booking Log"
          description="Filter by status or topic to prepare for the day ahead."
          rows={meetings}
          columns={columns}
          rowKey={(r) => r.id}
          minWidth="112rem"
          label="meetings"
          emptyIcon={CalendarClock}
          searchPlaceholder="Meeting ID, attendee, company..."
          search={(r, t) =>
            r.id.toLowerCase().includes(t) ||
            r.name.toLowerCase().includes(t) ||
            r.company.toLowerCase().includes(t) ||
            r.email.toLowerCase().includes(t)
          }
          filters={[
            {
              key: "status",
              options: ["All Status", "Confirmed", "Completed", "Rescheduled", "Cancelled"],
              match: (r, v) => r.status === v,
            },
            {
              key: "topic",
              options: [
                "All Topics",
                "Publisher onboarding",
                "Advertiser demo",
                "Payout escalation",
                "Campaign scaling",
                "Compliance review",
              ],
              match: (r, v) => r.topic === v,
            },
          ]}
        />
      </div>
    </>
  );
}
