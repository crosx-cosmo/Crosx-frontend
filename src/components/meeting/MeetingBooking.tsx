import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  Clock3,
  Globe2,
  Loader2,
  Mail,
  Phone,
  RotateCcw,
  ShieldCheck,
  Ticket,
  User,
  X,
} from "lucide-react";
import { AuthInput, CONTROL_BASE, controlTone, type FieldState } from "@/components/auth/AuthField";
import { Eyebrow } from "@/components/ui-kit/Section";
import { LuxButton, LuxLink } from "@/components/ui-kit/LuxButton";
import { Logo } from "@/components/brand/Logo";
import { BRAND } from "@/lib/content";
import { EASE_LUX } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import {
  buildCalendarFile,
  defaultTimezone,
  formatLongDate,
  formatTimeLabel,
  getAvailability,
  getSlots,
  meetingTypeLabel,
  MEETING_TYPES,
  statusLabel,
  timezoneLabel,
  TIMEZONES,
  type DayOption,
  type MeetingTypeId,
} from "@/lib/meeting-booking";
import { cancelMeeting, createMeeting, type MeetingRecord } from "@/lib/meetings.functions";

const CARD = "glass relative overflow-hidden rounded-3xl p-5 shadow-lux sm:p-7";

function Req() {
  return (
    <span aria-hidden="true" className="ml-0.5 text-destructive">
      *
    </span>
  );
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
    >
      {children}
    </label>
  );
}

function StepBadge({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-brand/40 bg-brand/10 text-xs font-extrabold text-brand">
        {n}
      </span>
      <h2 className="text-base font-bold text-foreground sm:text-lg">{title}</h2>
    </div>
  );
}

export function MeetingBooking() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [meetingType, setMeetingType] = useState<MeetingTypeId>("strategy");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  // Deterministic during SSR; the visitor's real timezone is applied after hydration.
  const [timezone, setTimezone] = useState<string>("Asia/Kolkata");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<MeetingRecord | null>(null);
  const submitBooking = useServerFn(createMeeting);

  // Availability depends on the visitor's local date, so it is resolved after
  // hydration. Computing it during SSR (server clock) mismatched the client
  // render and made React discard already-typed form values.
  const [days, setDays] = useState<DayOption[]>([]);

  useEffect(() => {
    setDays(getAvailability());
    setTimezone(defaultTimezone());
  }, []);

  const slots = useMemo(() => getSlots(date, meetingType), [date, meetingType]);
  const selectedType = MEETING_TYPES.find((t) => t.id === meetingType)!;

  const errors = {
    fullName: fullName.trim().length < 2 ? "Enter your full name." : "",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ? "" : "Enter a valid work email.",
    company: company.trim().length < 2 ? "Enter your company name." : "",
    phone: phone.trim().replace(/\D/g, "").length < 8 ? "Enter a valid phone number." : "",
    purpose: purpose.trim().length < 12 ? "Add at least a short line about your goals." : "",
    date: date ? "" : "Pick a preferred date.",
    time: time ? "" : "Pick a time slot.",
  };
  const isValid = Object.values(errors).every((v) => !v);

  const fieldState = (key: keyof typeof errors, value: string): FieldState => {
    if (errors[key] && touched[key]) return "error";
    if (!errors[key] && value.length > 0) return "valid";
    return "idle";
  };
  const markTouched = (key: string) => setTouched((t) => ({ ...t, [key]: true }));

  async function onSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      company: true,
      phone: true,
      purpose: true,
      date: true,
      time: true,
    });
    if (!isValid || submitting) {
      if (!isValid) setError("Please complete the highlighted fields before confirming.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const result = await submitBooking({
        data: {
          fullName: fullName.trim(),
          email: email.trim(),
          company: company.trim(),
          phone: phone.trim(),
          purpose: purpose.trim(),
          meetingType,
          date,
          time,
          timezone,
        },
      });
      setBooking(result);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("We could not confirm the slot. Please retry or email contact@crosx.in.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetFlow() {
    setBooking(null);
    setDate("");
    setTime("");
    setTouched({});
  }

  if (booking) {
    return <MeetingTicket booking={booking} onReschedule={resetFlow} />;
  }

  return (
    <div className="grid w-full min-w-0 gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
      <form onSubmit={onSubmit} noValidate className="flex min-w-0 flex-col gap-6">
        <div className={CARD}>
          <StepBadge n={1} title="Your details" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <AuthInput
              id="mb-name"
              label="Full name"
              icon={User}
              required
              autoComplete="name"
              value={fullName}
              onValueChange={setFullName}
              onBlur={() => markTouched("fullName")}
              state={fieldState("fullName", fullName)}
              message={touched.fullName ? errors.fullName : ""}
            />
            <AuthInput
              id="mb-email"
              label="Work email"
              icon={Mail}
              type="email"
              required
              autoComplete="email"
              value={email}
              onValueChange={setEmail}
              onBlur={() => markTouched("email")}
              state={fieldState("email", email)}
              message={touched.email ? errors.email : ""}
            />
            <AuthInput
              id="mb-company"
              label="Company"
              icon={Building2}
              required
              autoComplete="organization"
              value={company}
              onValueChange={setCompany}
              onBlur={() => markTouched("company")}
              state={fieldState("company", company)}
              message={touched.company ? errors.company : ""}
            />
            <AuthInput
              id="mb-phone"
              label="Phone number"
              icon={Phone}
              type="tel"
              required
              autoComplete="tel"
              value={phone}
              onValueChange={setPhone}
              onBlur={() => markTouched("phone")}
              state={fieldState("phone", phone)}
              message={touched.phone ? errors.phone : ""}
            />
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Label htmlFor="mb-purpose">
              Meeting purpose / requirement
              <Req />
            </Label>
            <textarea
              id="mb-purpose"
              required
              rows={4}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              onBlur={() => markTouched("purpose")}
              placeholder="Share your goals, current spend, channels and what you'd like to solve."
              aria-invalid={Boolean(touched.purpose && errors.purpose)}
              className={cn(
                CONTROL_BASE,
                controlTone(fieldState("purpose", purpose)),
                "h-auto resize-y px-4 py-3 leading-relaxed",
              )}
            />
            {touched.purpose && errors.purpose && (
              <p className="text-xs font-medium text-destructive">{errors.purpose}</p>
            )}
          </div>
        </div>

        <div className={CARD}>
          <StepBadge n={2} title="Preferred meeting type" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {MEETING_TYPES.map((type) => {
              const active = type.id === meetingType;
              return (
                <button
                  key={type.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setMeetingType(type.id);
                    setTime("");
                  }}
                  className={cn(
                    "group relative flex flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition-[border-color,background-color,box-shadow,transform] duration-300",
                    active
                      ? "border-brand/60 bg-brand/[0.07] shadow-[0_18px_44px_-26px_var(--brand)]"
                      : "border-border/70 bg-surface/50 hover:-translate-y-0.5 hover:border-brand/40",
                  )}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="text-sm font-bold text-foreground">{type.label}</span>
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
                        active ? "border-brand bg-brand text-primary-foreground" : "border-border",
                      )}
                    >
                      {active && <Check className="size-3" aria-hidden="true" />}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                    <Clock3 className="size-3" aria-hidden="true" />
                    {type.duration} min
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {type.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={CARD}>
          <StepBadge n={3} title="Date, time & timezone" />

          <div className="mt-6 flex flex-col gap-3">
            <Label>
              Available dates
              <Req />
            </Label>
            <div className="-mx-1 flex w-full min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-1 pb-2 [scrollbar-width:thin]">
              {days.map((d) => {
                const active = d.date === date;
                return (
                  <button
                    key={d.date}
                    type="button"
                    disabled={!d.available}
                    aria-pressed={active}
                    onClick={() => {
                      setDate(d.date);
                      setTime("");
                      markTouched("date");
                    }}
                    className={cn(
                      "flex min-w-[4.25rem] shrink-0 snap-start flex-col items-center gap-0.5 rounded-2xl border px-3 py-3 transition-[border-color,background-color,transform] duration-300",
                      active
                        ? "border-brand/60 bg-brand/[0.09] shadow-[0_14px_36px_-24px_var(--brand)]"
                        : "border-border/70 bg-surface/50 hover:border-brand/40",
                      !d.available && "cursor-not-allowed opacity-35 hover:border-border/70",
                    )}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {d.weekday}
                    </span>
                    <span
                      className={cn(
                        "font-display text-lg font-extrabold",
                        active ? "text-brand" : "text-foreground",
                      )}
                    >
                      {d.day}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {d.month}
                    </span>
                  </button>
                );
              })}
            </div>
            {touched.date && errors.date && (
              <p className="text-xs font-medium text-destructive">{errors.date}</p>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <Label>
              Time slots
              <Req />
            </Label>
            {date ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {slots.map((s) => {
                  const active = s.time === time;
                  return (
                    <button
                      key={s.time}
                      type="button"
                      disabled={!s.available}
                      aria-pressed={active}
                      onClick={() => {
                        setTime(s.time);
                        markTouched("time");
                      }}
                      className={cn(
                        "h-11 rounded-xl border text-sm font-semibold transition-[border-color,background-color,color,transform] duration-300",
                        active
                          ? "border-brand bg-brand text-primary-foreground shadow-[0_14px_34px_-20px_var(--brand)]"
                          : "border-border/70 bg-surface/50 text-foreground hover:-translate-y-0.5 hover:border-brand/40",
                        !s.available &&
                          "cursor-not-allowed border-dashed text-muted-foreground opacity-45 hover:translate-y-0 hover:border-border/70",
                      )}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border/70 bg-surface/40 px-4 py-4 text-xs text-muted-foreground">
                Select a date to see live availability.
              </p>
            )}
            {touched.time && errors.time && (
              <p className="text-xs font-medium text-destructive">{errors.time}</p>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Label htmlFor="mb-tz">
              Timezone
              <Req />
            </Label>
            <div className="relative">
              <Globe2
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <select
                id="mb-tz"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className={cn(CONTROL_BASE, controlTone("idle"), "appearance-none pr-10")}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.id} value={tz.id}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </form>

      <aside className="min-w-0 lg:sticky lg:top-24">
        <div className={cn(CARD, "grain")}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-brand/15 blur-[90px]"
          />
          <div className="relative flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-foreground sm:text-lg">Booking summary</h2>
            <Eyebrow>Review</Eyebrow>
          </div>

          <dl className="relative mt-6 flex flex-col divide-y divide-hairline text-sm">
            <SummaryRow icon={CalendarDays} label="Meeting type" value={selectedType.label} />
            <SummaryRow icon={Clock3} label="Duration" value={`${selectedType.duration} minutes`} />
            <SummaryRow
              icon={CalendarCheck}
              label="Date"
              value={date ? formatLongDate(date) : "Not selected"}
              muted={!date}
            />
            <SummaryRow
              icon={Clock3}
              label="Time"
              value={time ? formatTimeLabel(time) : "Not selected"}
              muted={!time}
            />
            <SummaryRow icon={Globe2} label="Timezone" value={timezoneLabel(timezone)} />
            <SummaryRow
              icon={User}
              label="Attendee"
              value={fullName.trim() || "Not provided"}
              muted={!fullName.trim()}
            />
            <SummaryRow
              icon={Building2}
              label="Company"
              value={company.trim() || "Not provided"}
              muted={!company.trim()}
            />
          </dl>

          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: EASE_LUX }}
                role="alert"
                className="relative mt-5 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <LuxButton
            type="button"
            variant="brand"
            size="lg"
            disabled={submitting}
            onClick={onSubmit}
            className="relative mt-6 w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Confirming slot…
              </>
            ) : (
              <>
                Confirm Meeting
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </LuxButton>

          <p className="relative mt-4 inline-flex items-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-brand" aria-hidden="true" />
            No spam. A senior strategist joins every call.
          </p>
        </div>
      </aside>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  muted,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="inline-flex min-w-0 shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
        {label}
      </dt>
      <dd
        className={cn(
          "min-w-0 max-w-[58%] break-words text-right text-sm font-semibold",
          muted ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export function MeetingTicket({
  booking,
  onReschedule,
  rescheduleLabel = "Reschedule",
  onUpdate,
}: {
  booking: MeetingRecord;
  onReschedule: () => void;
  rescheduleLabel?: string;
  onUpdate?: (meeting: MeetingRecord) => void;
}) {
  const cancelFn = useServerFn(cancelMeeting);
  const [cancelled, setCancelled] = useState(booking.status === "cancelled");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function onCancel() {
    if (busy) return;
    setBusy(true);
    setActionError(null);
    try {
      const result = await cancelFn({
        data: { meetingId: booking.ticketId, email: booking.email },
      });
      if (result.ok) {
        setCancelled(true);
        onUpdate?.(result.meeting);
      } else {
        setActionError(result.error);
      }
    } catch {
      setActionError("We could not cancel this meeting. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function addToCalendar() {
    const blob = new Blob([buildCalendarFile(booking)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crosx-meeting-${booking.ticketId}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_LUX }}
      className="mx-auto w-full max-w-3xl"
    >
      <div className="grain glass relative overflow-hidden rounded-[2rem] shadow-lux">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[120px]"
        />

        <div className="relative flex flex-col gap-5 border-b border-dashed border-hairline px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Meeting confirmation
            </p>
          </div>
          <span
            className={cn(
              "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]",
              cancelled
                ? "border-destructive/50 bg-destructive/10 text-destructive"
                : "border-brand/45 bg-brand/10 text-brand",
            )}
          >
            {cancelled ? (
              <X className="size-3.5" aria-hidden="true" />
            ) : (
              <Check className="size-3.5" aria-hidden="true" />
            )}
            {cancelled ? "Cancelled" : statusLabel(booking.status)}
          </span>
        </div>

        <div className="relative px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Ticket className="size-3.5 text-brand" aria-hidden="true" />
              Meeting ID
            </span>
            <p className="font-display text-2xl font-extrabold tracking-[0.08em] text-brand sm:text-3xl">
              {booking.ticketId}
            </p>
          </div>

          <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <TicketField label="Date" value={formatLongDate(booking.date)} />
            <TicketField
              label="Time"
              value={`${formatTimeLabel(booking.time)} · ${booking.duration} min`}
            />
            <TicketField label="Timezone" value={timezoneLabel(booking.timezone)} />
            <TicketField label="Meeting type" value={meetingTypeLabel(booking.meetingType)} />
            <TicketField label="Attendee" value={booking.fullName} />
            <TicketField label="Company" value={booking.company} />
            <TicketField label="Email" value={booking.email} />
            <TicketField label="Phone" value={booking.phone} />
          </dl>

          <div className="mt-7 rounded-2xl border border-hairline bg-surface/50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Agenda shared
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{booking.purpose}</p>
          </div>

          {cancelled ? (
            <p className="mt-7 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              This meeting has been cancelled. You can book a new slot any time.
            </p>
          ) : null}

          {actionError ? (
            <p className="mt-7 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {actionError}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LuxButton variant="brand" size="lg" onClick={addToCalendar} disabled={cancelled}>
              <CalendarPlus className="size-4" aria-hidden="true" />
              Add to Calendar
            </LuxButton>
            {!cancelled && (
              <LuxButton variant="ghostGlass" size="lg" onClick={onReschedule}>
                <RotateCcw className="size-4" aria-hidden="true" />
                {rescheduleLabel}
              </LuxButton>
            )}
            {!cancelled && (
              <LuxButton variant="outline" size="lg" onClick={onCancel} disabled={busy}>
                <X className="size-4" aria-hidden="true" />
                {busy ? "Cancelling…" : "Cancel meeting"}
              </LuxButton>
            )}
          </div>


          <p className="mt-7 text-xs text-muted-foreground">
            Need to change anything? Contact support at{" "}
            <a
              href={`mailto:${BRAND.email}?subject=Meeting%20${booking.ticketId}`}
              className="font-semibold text-brand underline-sweep"
            >
              {BRAND.email}
            </a>
            .
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <LuxLink href={`mailto:${BRAND.email}`} variant="ghostGlass" size="sm">
          Contact Us
        </LuxLink>
      </div>
    </motion.div>
  );
}

function TicketField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-bold text-foreground">{value}</dd>
    </div>
  );
}
