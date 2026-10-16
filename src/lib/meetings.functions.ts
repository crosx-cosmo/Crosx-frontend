import { createServerFn } from "@tanstack/react-start";
import { requireCrosxAuth } from "./crosx-auth-middleware";

import { MEETING_TYPES, TIMEZONES } from "./meeting-booking";

export type MeetingStatus = "confirmed" | "rescheduled" | "cancelled" | "completed";

/** Client-safe projection of a meeting row. No internal ids or credentials. */
export type MeetingRecord = {
  ticketId: string;
  fullName: string;
  email: string;
  company: string;
  phone: string;
  purpose: string;
  meetingType: string;
  date: string;
  time: string;
  timezone: string;
  duration: number;
  status: MeetingStatus;
  createdAt: string;
};

export type MeetingLookupResult =
  | { ok: true; meeting: MeetingRecord }
  | { ok: false; error: string };

type MeetingInput = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  purpose: string;
  meetingType: string;
  date: string;
  time: string;
  timezone: string;
};

const GENERIC_LOOKUP_ERROR =
  "We could not find a meeting for that Meeting ID and email combination. Please check both and try again.";

/** Deployed Supabase Edge Function that owns confirmation email delivery. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const REF_RE = /^[A-Z0-9-]{6,24}$/;

function clean(value: unknown, max = 400) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validateInput(raw: MeetingInput): MeetingInput {
  const input: MeetingInput = {
    fullName: clean(raw.fullName, 120),
    email: clean(raw.email, 200).toLowerCase(),
    company: clean(raw.company, 160),
    phone: clean(raw.phone, 40),
    purpose: clean(raw.purpose, 2000),
    meetingType: clean(raw.meetingType, 40),
    date: clean(raw.date, 10),
    time: clean(raw.time, 5),
    timezone: clean(raw.timezone, 60),
  };

  if (input.fullName.length < 2) throw new Error("Enter your full name.");
  if (!EMAIL_RE.test(input.email)) throw new Error("Enter a valid email address.");
  if (input.company.length < 2) throw new Error("Enter your company name.");
  if (input.phone.replace(/\D/g, "").length < 8) throw new Error("Enter a valid phone number.");
  if (input.purpose.length < 12) throw new Error("Add a short line about your goals.");
  if (!MEETING_TYPES.some((t) => t.id === input.meetingType))
    throw new Error("Select a valid meeting type.");
  if (!DATE_RE.test(input.date)) throw new Error("Pick a valid date.");
  if (!TIME_RE.test(input.time)) throw new Error("Pick a valid time slot.");
  if (!TIMEZONES.some((tz) => tz.id === input.timezone))
    throw new Error("Select a valid timezone.");

  return input;
}

function meetingRef() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let core = "";
  for (let i = 0; i < 6; i += 1) {
    core += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CX-${new Date().getFullYear()}-${core}`;
}

type MeetingRow = {
  meeting_ref: string;
  full_name: string;
  email: string;
  company: string;
  phone: string;
  purpose: string;
  meeting_type: string;
  meeting_date: string;
  meeting_time: string;
  timezone: string;
  duration: number;
  status: MeetingStatus;
  created_at: string;
};

const ROW_COLUMNS =
  "meeting_ref, full_name, email, company, phone, purpose, meeting_type, meeting_date, meeting_time, timezone, duration, status, created_at";

function toRecord(row: MeetingRow): MeetingRecord {
  return {
    ticketId: row.meeting_ref,
    fullName: row.full_name,
    email: row.email,
    company: row.company,
    phone: row.phone,
    purpose: row.purpose,
    meetingType: row.meeting_type,
    date: row.meeting_date,
    time: row.meeting_time,
    timezone: row.timezone,
    duration: row.duration,
    status: row.status,
    createdAt: row.created_at,
  };
}

/** Creates the meeting, then (only on success) sends the confirmation email. */
export const createMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: MeetingInput) => validateInput(data))
  .handler(async ({ data }) => {
    const { crosxRpc, CROSX_FUNCTIONS_URL, CROSX_SUPABASE_PUBLISHABLE_KEY } = await import(
      "./crosx-supabase.public"
    );
    const duration = MEETING_TYPES.find((t) => t.id === data.meetingType)?.duration ?? 30;

    let row: MeetingRow | null = null;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < 5 && !row; attempt += 1) {
      const { data: inserted, error } = await crosxRpc("crosx_create_meeting", {
        p_ref: meetingRef(),
        p_full_name: data.fullName,
        p_email: data.email,
        p_company: data.company,
        p_phone: data.phone,
        p_purpose: data.purpose,
        p_meeting_type: data.meetingType,
        p_date: data.date,
        p_time: data.time,
        p_timezone: data.timezone,
        p_duration: duration,
      });

      if (!error && inserted) {
        row = inserted as unknown as MeetingRow;
        break;
      }
      lastError = error;
      if (!error?.message?.includes("meetings_meeting_ref_key")) break; // retry only on ref collision
    }

    if (!row) {
      console.error("[meetings] insert failed", lastError);
      throw new Error("We could not confirm the slot. Please retry.");
    }

    const record = toRecord(row);

    // Email delivery must never roll back a confirmed meeting.
    // The deployed send-meeting-confirmation Edge Function owns delivery.
    try {
      const response = await fetch(`${CROSX_FUNCTIONS_URL}/send-meeting-confirmation`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey: CROSX_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${CROSX_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          name: record.fullName,
          email: record.email,
          company: record.company,
          phone: record.phone,
          meetingId: record.ticketId,
          date: record.date,
          time: record.time,
          timezone: record.timezone,
          meetingType: record.meetingType,
          agenda: record.purpose,
        }),
      });
      const payload = (await response.json().catch(() => null)) as { success?: boolean } | null;
      if (response.ok && payload?.success) {
        await crosxRpc("crosx_mark_email_sent", { p_ref: record.ticketId });
      } else {
        console.error("[meetings] send-meeting-confirmation failed", response.status, payload);
      }
    } catch (error) {
      console.error("[meetings] confirmation email threw", error);
    }

    return record;
  });

async function lookup(ref: string, email: string): Promise<MeetingLookupResult> {
  const meetingRefValue = clean(ref, 24).toUpperCase();
  const emailValue = clean(email, 200).toLowerCase();

  if (!REF_RE.test(meetingRefValue) || !EMAIL_RE.test(emailValue)) {
    return { ok: false, error: GENERIC_LOOKUP_ERROR };
  }

  const { crosxRpc } = await import("./crosx-supabase.public");
  const { data, error } = await crosxRpc("crosx_find_meeting", {
    p_ref: meetingRefValue,
    p_email: emailValue,
  });

  if (error) {
    console.error("[meetings] lookup failed", error);
    return { ok: false, error: "Something went wrong. Please try again in a moment." };
  }
  if (!data) return { ok: false, error: GENERIC_LOOKUP_ERROR };
  return { ok: true, meeting: toRecord(data as unknown as MeetingRow) };
}

/** Meeting ID alone is never enough — the booking email must match. */
export const findMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: { meetingId: string; email: string }) => data)
  .handler(async ({ data }): Promise<MeetingLookupResult> => lookup(data.meetingId, data.email));

/** Signed-in customers: only meetings booked with their own verified email. */
export const listMyMeetings = createServerFn({ method: "POST" })
  .middleware([requireCrosxAuth])
  .handler(async ({ context }): Promise<MeetingRecord[]> => {
    const email = (context.claims as { email?: string } | null)?.email;
    if (!email) return [];
    const { data, error } = await context.supabase
      .from("meetings")
      .select(ROW_COLUMNS)
      .order("meeting_date", { ascending: true });
    if (error) {
      console.error("[meetings] listMyMeetings failed", error);
      return [];
    }
    return (data as MeetingRow[]).map(toRecord);
  });

export const cancelMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: { meetingId: string; email: string }) => data)
  .handler(async ({ data }): Promise<MeetingLookupResult> => {
    const found = await lookup(data.meetingId, data.email);
    if (!found.ok) return found;
    if (found.meeting.status === "cancelled") return found;

    const { crosxRpc } = await import("./crosx-supabase.public");
    const { data: updated, error } = await crosxRpc(
      "crosx_cancel_meeting",
      { p_ref: found.meeting.ticketId, p_email: data.email.trim().toLowerCase() },
    );

    if (error || !updated) {
      console.error("[meetings] cancel failed", error);
      return { ok: false, error: "We could not cancel this meeting. Please try again." };
    }
    return { ok: true, meeting: toRecord(updated as unknown as MeetingRow) };
  });

export const rescheduleMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: { meetingId: string; email: string; date: string; time: string }) => data)
  .handler(async ({ data }): Promise<MeetingLookupResult> => {
    const date = clean(data.date, 10);
    const time = clean(data.time, 5);
    if (!DATE_RE.test(date) || !TIME_RE.test(time)) {
      return { ok: false, error: "Pick a new date and time slot." };
    }

    const found = await lookup(data.meetingId, data.email);
    if (!found.ok) return found;
    if (found.meeting.status === "cancelled") {
      return { ok: false, error: "This meeting was cancelled. Please book a new slot." };
    }

    const { crosxRpc } = await import("./crosx-supabase.public");
    const { data: updated, error } = await crosxRpc(
      "crosx_reschedule_meeting",
      {
        p_ref: found.meeting.ticketId,
        p_email: data.email.trim().toLowerCase(),
        p_date: date,
        p_time: time,
      },
    );

    if (error || !updated) {
      console.error("[meetings] reschedule failed", error);
      return { ok: false, error: "We could not reschedule this meeting. Please try again." };
    }
    return { ok: true, meeting: toRecord(updated as unknown as MeetingRow) };
  });
