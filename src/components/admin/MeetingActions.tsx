import { useState } from "react";
import { CalendarCheck, Eye, RotateCcw, XCircle } from "lucide-react";
import { toast } from "sonner";

import { ActionButton, Modal, Select, StatusBadge, TextField } from "@/components/dashboard/kit";
import type { MeetingRow } from "@/lib/admin-data";
import { patchMeeting } from "@/lib/admin-status-store";
import { TIMEZONES } from "@/lib/meeting-booking";
import {
  adminRescheduleMeeting,
  adminSetMeetingStatus,
} from "@/lib/admin-management.functions";
import { toneFor } from "./tones";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface-2/40 p-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

/** Complete / Reschedule / Cancel / View controls for one meeting row. */
export function MeetingActions({ row }: { row: MeetingRow }) {
  const [view, setView] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [reschedule, setReschedule] = useState(false);
  const [busy, setBusy] = useState(false);
  const [date, setDate] = useState(row.date);
  const [time, setTime] = useState(row.time);
  const [timezone, setTimezone] = useState(row.timezone);

  const closed = row.status === "Cancelled";

  async function setStatus(status: "completed" | "cancelled") {
    setBusy(true);
    patchMeeting(row.id, { status: status === "completed" ? "Completed" : "Cancelled" });
    try {
      const result = await adminSetMeetingStatus({
        data: { ref: row.id, email: row.email, status },
      });
      if (result.persisted) toast.success(`${row.id} marked ${status}.`);
      else toast.warning(result.message ?? `${row.id} marked ${status} in the console.`);
    } catch {
      toast.error("We could not reach the meeting service. Please retry.");
    } finally {
      setBusy(false);
      setConfirmCancel(false);
    }
  }

  async function submitReschedule() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
      toast.error("Pick a valid new date and time.");
      return;
    }
    setBusy(true);
    patchMeeting(row.id, { status: "Rescheduled", date, time, timezone });
    try {
      const result = await adminRescheduleMeeting({
        data: { ref: row.id, email: row.email, date, time, timezone },
      });
      if (result.persisted) toast.success(result.message ?? `${row.id} moved to ${date} at ${time}.`);
      else toast.warning(result.message ?? `${row.id} rescheduled in the console.`);
    } catch {
      toast.error("We could not reach the meeting service. Please retry.");
    } finally {
      setBusy(false);
      setReschedule(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <ActionButton variant="subtle" icon={Eye} className="h-9 px-2.5" onClick={() => setView(true)}>
          View
        </ActionButton>
        {row.status !== "Completed" && !closed && (
          <ActionButton
            variant="ghost"
            icon={CalendarCheck}
            className="h-9 px-2.5"
            disabled={busy}
            onClick={() => setStatus("completed")}
          >
            Complete
          </ActionButton>
        )}
        {!closed && (
          <ActionButton
            variant="ghost"
            icon={RotateCcw}
            className="h-9 px-2.5"
            disabled={busy}
            onClick={() => setReschedule(true)}
          >
            Reschedule
          </ActionButton>
        )}
        {!closed && (
          <ActionButton
            variant="ghost"
            icon={XCircle}
            className="h-9 px-2.5 hover:border-brand"
            disabled={busy}
            onClick={() => setConfirmCancel(true)}
          >
            Cancel
          </ActionButton>
        )}
      </div>

      <Modal
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Cancel this meeting?"
        description="The slot is released and the booking is closed for the attendee."
        footer={
          <>
            <ActionButton variant="ghost" onClick={() => setConfirmCancel(false)}>
              Keep meeting
            </ActionButton>
            <ActionButton variant="solid" disabled={busy} onClick={() => setStatus("cancelled")}>
              Cancel Meeting
            </ActionButton>
          </>
        }
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label="Meeting ID" value={row.id} />
          <Field label="Attendee" value={row.name} />
          <Field label="Date" value={row.date} />
          <Field label="Time" value={`${row.time} (${row.timezone})`} />
        </div>
      </Modal>

      <Modal
        open={reschedule}
        onClose={() => setReschedule(false)}
        title="Reschedule meeting"
        description={`Set a new slot for ${row.name} — ${row.id}.`}
        footer={
          <>
            <ActionButton variant="ghost" onClick={() => setReschedule(false)}>
              Discard
            </ActionButton>
            <ActionButton variant="solid" disabled={busy} onClick={submitReschedule}>
              Save New Slot
            </ActionButton>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="New date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <TextField
            label="New time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Timezone
            </p>
            <Select
              aria-label="Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.id} value={tz.id}>
                  {tz.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>

      <Modal
        open={view}
        onClose={() => setView(false)}
        title={row.name}
        description={`${row.company} — ${row.email}`}
        footer={
          <ActionButton variant="ghost" onClick={() => setView(false)}>
            Close
          </ActionButton>
        }
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label="Meeting ID" value={row.id} />
          <Field
            label="Status"
            value={
              <StatusBadge tone={toneFor(row.status)} dot>
                {row.status}
              </StatusBadge>
            }
          />
          <Field label="Topic" value={row.topic} />
          <Field label="Timezone" value={row.timezone} />
          <Field label="Date" value={row.date} />
          <Field label="Time" value={row.time} />
        </div>
      </Modal>
    </>
  );
}
