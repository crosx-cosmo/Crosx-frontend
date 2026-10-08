import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { CalendarDays, Clock, Mail, Search, Ticket } from "lucide-react";

import { AuthAlert, AuthInput, type FieldState } from "@/components/auth/AuthField";
import { MeetingTicket } from "@/components/meeting/MeetingBooking";
import { LuxButton, LuxLink } from "@/components/ui-kit/LuxButton";
import { BRAND } from "@/lib/content";
import { EASE_LUX } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import {
  formatLongDate,
  formatTimeLabel,
  getAvailability,
  getSlots,
  meetingTypeLabel,
  statusLabel,
  type MeetingTypeId,
} from "@/lib/meeting-booking";
import {
  findMeeting,
  listMyMeetings,
  rescheduleMeeting,
  type MeetingRecord,
} from "@/lib/meetings.functions";
import { useSupabaseSession } from "@/lib/supabase-auth";

const CARD = "glass relative overflow-hidden rounded-3xl p-5 shadow-lux sm:p-7";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function MeetingLookup({ initialRef = "" }: { initialRef?: string }) {
  const { user, isAuthenticated } = useSupabaseSession();
  const search = useServerFn(findMeeting);
  const listMine = useServerFn(listMyMeetings);

  const [meetingId, setMeetingId] = useState(initialRef.toUpperCase());
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meeting, setMeeting] = useState<MeetingRecord | null>(null);
  const [mine, setMine] = useState<MeetingRecord[]>([]);
  const [rescheduling, setRescheduling] = useState(false);

  // Signed-in customers get their own meetings without typing anything.
  useEffect(() => {
    if (!isAuthenticated) {
      setMine([]);
      return;
    }
    if (user?.email) setEmail((current) => current || user.email!);
    let active = true;
    void listMine({ data: undefined })
      .then((rows) => {
        if (active) setMine(rows);
      })
      .catch(() => {
        if (active) setMine([]);
      });
    return () => {
      active = false;
    };
  }, [isAuthenticated, user?.email, listMine]);

  const errors = {
    meetingId: /^[A-Z0-9-]{6,24}$/.test(meetingId.trim().toUpperCase())
      ? ""
      : "Enter the Meeting ID from your confirmation (e.g. CX-2026-AB12CD).",
    email: EMAIL_RE.test(email.trim()) ? "" : "Enter the email address used while booking.",
  };
  const isValid = !errors.meetingId && !errors.email;

  const fieldState = (key: keyof typeof errors, value: string): FieldState => {
    if (errors[key] && touched[key]) return "error";
    if (!errors[key] && value.length > 0) return "valid";
    return "idle";
  };

  async function onSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setTouched({ meetingId: true, email: true });
    if (!isValid || busy) {
      if (!isValid) setError("Enter both your Meeting ID and booking email.");
      return;
    }
    setError(null);
    setBusy(true);
    setRescheduling(false);
    try {
      const result = await search({
        data: { meetingId: meetingId.trim().toUpperCase(), email: email.trim() },
      });
      if (result.ok) {
        setMeeting(result.meeting);
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setMeeting(null);
        setError(result.error);
      }
    } catch {
      setMeeting(null);
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  function openMine(record: MeetingRecord) {
    setMeeting(record);
    setMeetingId(record.ticketId);
    setEmail(record.email);
    setError(null);
    setRescheduling(false);
  }

  if (meeting && rescheduling) {
    return (
      <RescheduleForm
        meeting={meeting}
        onCancel={() => setRescheduling(false)}
        onDone={(updated) => {
          setMeeting(updated);
          setMine((rows) =>
            rows.map((row) => (row.ticketId === updated.ticketId ? updated : row)),
          );
          setRescheduling(false);
        }}
      />
    );
  }

  if (meeting) {
    return (
      <div className="flex flex-col gap-6">
        <MeetingTicket
          booking={meeting}
          rescheduleLabel="Reschedule meeting"
          onReschedule={() => setRescheduling(true)}
          onUpdate={(updated) => {
            setMeeting(updated);
            setMine((rows) =>
              rows.map((row) => (row.ticketId === updated.ticketId ? updated : row)),
            );
          }}
        />
        <div className="text-center">
          <LuxButton
            variant="ghostGlass"
            size="sm"
            onClick={() => {
              setMeeting(null);
              setError(null);
            }}
          >
            <Search className="size-4" aria-hidden="true" />
            Look up another meeting
          </LuxButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full min-w-0 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
      <form onSubmit={onSubmit} noValidate className={cn(CARD, "flex min-w-0 flex-col gap-5")}>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-base font-bold text-foreground sm:text-lg">Verify and retrieve</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            For your security, a Meeting ID alone never reveals meeting details — we also verify the
            email address used when the meeting was booked.
          </p>
        </div>

        <AuthInput
          id="lookup-meeting-id"
          label="Meeting ID"
          icon={Ticket}
          value={meetingId}
          onValueChange={(v) => setMeetingId(v.toUpperCase())}
          onBlur={() => setTouched((t) => ({ ...t, meetingId: true }))}
          state={fieldState("meetingId", meetingId)}
          message={touched["meetingId"] ? errors.meetingId : undefined}
          placeholder="CX-2026-AB12CD"
          autoComplete="off"
          required
        />

        <AuthInput
          id="lookup-email"
          label="Booking email"
          icon={Mail}
          type="email"
          value={email}
          onValueChange={setEmail}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          state={fieldState("email", email)}
          message={touched["email"] ? errors.email : undefined}
          placeholder="you@company.com"
          autoComplete="email"
          required
        />

        {error ? <AuthAlert>{error}</AuthAlert> : null}

        <LuxButton type="submit" variant="brand" size="lg" disabled={busy} className="w-full">
          <Search className="size-4" aria-hidden="true" />
          {busy ? "Verifying…" : "Find my meeting"}
        </LuxButton>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Lost your Meeting ID? Write to{" "}
          <a
            href={`mailto:${BRAND.email}`}
            className="font-semibold text-brand underline-sweep"
          >
            {BRAND.email}
          </a>{" "}
          from your booking email address and we will help you.
        </p>
      </form>

      <aside className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-24">
        {isAuthenticated && mine.length > 0 ? (
          <div className={cn(CARD, "flex min-w-0 flex-col gap-4")}>
            <h2 className="text-base font-bold text-foreground sm:text-lg">Your meetings</h2>
            <ul className="flex flex-col gap-3">
              {mine.map((row) => (
                <li key={row.ticketId}>
                  <button
                    type="button"
                    onClick={() => openMine(row)}
                    className="group flex w-full min-w-0 flex-col gap-1.5 rounded-2xl border border-hairline bg-surface/50 p-4 text-left transition-colors duration-300 hover:border-brand/45"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-extrabold tracking-[0.06em] text-brand">
                        {row.ticketId}
                      </span>
                      <span className="rounded-full border border-hairline px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        {statusLabel(row.status)}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {meetingTypeLabel(row.meetingType)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatLongDate(row.date)} · {formatTimeLabel(row.time)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={cn(CARD, "flex min-w-0 flex-col gap-3")}>
          <h2 className="text-base font-bold text-foreground sm:text-lg">No meeting yet?</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Book a working session with a senior CrosX strategist — confirmation and Meeting ID are
            issued instantly.
          </p>
          <LuxLink href="/book-meeting" variant="outline" size="sm" className="w-fit">
            <CalendarDays className="size-4" aria-hidden="true" />
            Book a meeting
          </LuxLink>
        </div>
      </aside>
    </div>
  );
}

function RescheduleForm({
  meeting,
  onCancel,
  onDone,
}: {
  meeting: MeetingRecord;
  onCancel: () => void;
  onDone: (updated: MeetingRecord) => void;
}) {
  const reschedule = useServerFn(rescheduleMeeting);
  const [date, setDate] = useState(meeting.date);
  const [time, setTime] = useState(meeting.time);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = useMemo(() => getAvailability(), []);
  const slots = useMemo(
    () => getSlots(date, meeting.meetingType as MeetingTypeId),
    [date, meeting.meetingType],
  );

  async function submit() {
    if (!date || !time || busy) {
      setError("Pick a new date and time slot.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await reschedule({
        data: { meetingId: meeting.ticketId, email: meeting.email, date, time },
      });
      if (result.ok) onDone(result.meeting);
      else setError(result.error);
    } catch {
      setError("We could not reschedule this meeting. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_LUX }}
      className={cn(CARD, "mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-6")}
    >
      <div className="flex flex-col gap-1.5">
        <h2 className="text-base font-bold text-foreground sm:text-lg">
          Reschedule {meeting.ticketId}
        </h2>
        <p className="text-sm text-muted-foreground">
          Currently {formatLongDate(meeting.date)} · {formatTimeLabel(meeting.time)}
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <CalendarDays className="size-3.5 text-brand" aria-hidden="true" />
          New date
        </span>
        <div className="flex w-full min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-1 pb-2 [scrollbar-width:thin]">
          {days.map((day) => (
            <button
              key={day.date}
              type="button"
              disabled={!day.available}
              onClick={() => {
                setDate(day.date);
                setTime("");
              }}
              className={cn(
                "flex shrink-0 snap-start flex-col items-center gap-0.5 rounded-2xl border px-3 py-2.5 transition-colors duration-300",
                !day.available && "cursor-not-allowed opacity-35",
                date === day.date
                  ? "border-brand/60 bg-brand/10 text-brand"
                  : "border-hairline bg-surface/50 text-foreground hover:border-brand/40",
              )}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {day.weekday}
              </span>
              <span className="text-sm font-extrabold">{day.day}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {day.month}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Clock className="size-3.5 text-brand" aria-hidden="true" />
          New time slot
        </span>
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {slots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              disabled={!slot.available}
              onClick={() => setTime(slot.time)}
              className={cn(
                "rounded-xl border px-2 py-2.5 text-sm font-semibold transition-colors duration-300",
                !slot.available && "cursor-not-allowed opacity-35",
                time === slot.time
                  ? "border-brand/60 bg-brand/10 text-brand"
                  : "border-hairline bg-surface/50 text-foreground hover:border-brand/40",
              )}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      {error ? <AuthAlert>{error}</AuthAlert> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <LuxButton variant="brand" size="lg" onClick={submit} disabled={busy}>
          {busy ? "Updating…" : "Confirm new slot"}
        </LuxButton>
        <LuxButton variant="ghostGlass" size="lg" onClick={onCancel}>
          Keep existing slot
        </LuxButton>
      </div>
    </motion.div>
  );
}
