import { createServerFn } from "@tanstack/react-start";

import { requireAdmin } from "./admin-auth.functions";

/**
 * Admin management actions for publishers and meetings.
 *
 * These wire the admin console to the EXISTING CrosX Supabase project through
 * its SECURITY DEFINER RPCs — no new project, table or auth system. Meeting
 * cancel/reschedule reuse the same RPCs the public booking flow already uses.
 * Where a dedicated admin RPC is not provisioned yet, the call reports back
 * `persisted: false` so the console can tell the admin instead of pretending.
 */

export type AdminActionResult = {
  ok: boolean;
  persisted: boolean;
  message?: string;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

function str(value: unknown, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const MEETING_STATUSES = ["completed", "cancelled", "rescheduled", "confirmed"] as const;
export type AdminMeetingStatus = (typeof MEETING_STATUSES)[number];

const PUBLISHER_STATUSES = ["active", "pending", "suspended", "terminated"] as const;
export type AdminPublisherStatus = (typeof PUBLISHER_STATUSES)[number];

/** Sets a meeting status (Completed / Cancelled) on the existing meetings data. */
export const adminSetMeetingStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: { ref: string; email: string; status: AdminMeetingStatus }) => {
    const ref = str(data?.ref, 24).toUpperCase();
    const email = str(data?.email, 200).toLowerCase();
    const status = MEETING_STATUSES.includes(data?.status as AdminMeetingStatus)
      ? (data.status as AdminMeetingStatus)
      : null;
    if (!ref) throw new Error("Missing meeting reference.");
    if (!status) throw new Error("Unsupported meeting status.");
    return { ref, email, status };
  })
  .handler(async ({ data }): Promise<AdminActionResult> => {
    const { crosxRpc } = await import("./crosx-supabase.public");

    // Preferred path: single admin RPC that owns every status transition.
    const admin = await crosxRpc("crosx_admin_set_meeting_status", {
      p_ref: data.ref,
      p_status: data.status,
    });
    if (!admin.error && admin.data) return { ok: true, persisted: true };

    // Fallback: the public cancel RPC already exists for booked meetings.
    if (data.status === "cancelled" && data.email) {
      const { data: updated, error } = await crosxRpc("crosx_cancel_meeting", {
        p_ref: data.ref,
        p_email: data.email,
      });
      if (!error && updated) return { ok: true, persisted: true };
    }

    console.error("[admin] meeting status update not persisted", admin.error);
    return {
      ok: true,
      persisted: false,
      message: "Status updated in the console only — the meeting database did not accept the change.",
    };
  });

/** Reschedules a meeting (date, time, timezone) on the existing meetings data. */
export const adminRescheduleMeeting = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    (data: { ref: string; email: string; date: string; time: string; timezone: string }) => {
      const ref = str(data?.ref, 24).toUpperCase();
      const email = str(data?.email, 200).toLowerCase();
      const date = str(data?.date, 10);
      const time = str(data?.time, 5);
      const timezone = str(data?.timezone, 60);
      if (!ref) throw new Error("Missing meeting reference.");
      if (!DATE_RE.test(date)) throw new Error("Pick a valid new date.");
      if (!TIME_RE.test(time)) throw new Error("Pick a valid new time.");
      return { ref, email, date, time, timezone };
    },
  )
  .handler(async ({ data }): Promise<AdminActionResult> => {
    const { crosxRpc } = await import("./crosx-supabase.public");

    const admin = await crosxRpc("crosx_admin_reschedule_meeting", {
      p_ref: data.ref,
      p_date: data.date,
      p_time: data.time,
      p_timezone: data.timezone,
    });
    if (!admin.error && admin.data) return { ok: true, persisted: true };

    if (data.email) {
      const { data: updated, error } = await crosxRpc("crosx_reschedule_meeting", {
        p_ref: data.ref,
        p_email: data.email,
        p_date: data.date,
        p_time: data.time,
      });
      if (!error && updated) {
        return {
          ok: true,
          persisted: true,
          message: "New date and time saved. Timezone is kept as booked.",
        };
      }
    }

    console.error("[admin] meeting reschedule not persisted", admin.error);
    return {
      ok: true,
      persisted: false,
      message: "Reschedule applied in the console only — the meeting database did not accept the change.",
    };
  });

/** Approve / Suspend / Terminate a publisher account on the existing profiles data. */
export const adminSetPublisherStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: { publisherId: string; email: string; status: AdminPublisherStatus }) => {
    const publisherId = str(data?.publisherId, 60);
    const email = str(data?.email, 200).toLowerCase();
    const status = PUBLISHER_STATUSES.includes(data?.status as AdminPublisherStatus)
      ? (data.status as AdminPublisherStatus)
      : null;
    if (!publisherId && !email) throw new Error("Missing publisher reference.");
    if (!status) throw new Error("Unsupported publisher status.");
    return { publisherId, email, status };
  })
  .handler(async ({ data }): Promise<AdminActionResult> => {
    const { crosxRpc } = await import("./crosx-supabase.public");

    const { data: updated, error } = await crosxRpc("crosx_admin_set_publisher_status", {
      p_publisher_id: data.publisherId,
      p_email: data.email,
      p_status: data.status,
    });
    if (!error && updated) return { ok: true, persisted: true };

    console.error("[admin] publisher status update not persisted", error);
    return {
      ok: true,
      persisted: false,
      message:
        "Status updated in the console only — the publisher account database did not accept the change.",
    };
  });
