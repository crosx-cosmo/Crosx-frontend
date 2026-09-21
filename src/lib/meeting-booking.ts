/**
 * Meeting booking domain logic.
 *
 * Availability is generated locally with realistic demo data. Every read goes
 * through `getAvailability` / `createBooking` so a real backend or calendar
 * integration can replace the implementations without touching the UI.
 */

export type MeetingTypeId = "strategy" | "audit" | "onboarding" | "partnership";

export type MeetingType = {
  id: MeetingTypeId;
  label: string;
  duration: number;
  description: string;
};

export const MEETING_TYPES: MeetingType[] = [
  {
    id: "strategy",
    label: "Growth strategy call",
    duration: 30,
    description: "Goals, channels and a realistic growth model for your brand.",
  },
  {
    id: "audit",
    label: "Performance audit review",
    duration: 45,
    description: "We review your current spend, funnels and measurement setup.",
  },
  {
    id: "onboarding",
    label: "Enterprise onboarding",
    duration: 60,
    description: "Scoping, compliance and delivery plan with the founders.",
  },
  {
    id: "partnership",
    label: "Partnership / affiliate",
    duration: 30,
    description: "Publisher, influencer and media partnership discussions.",
  },
];

export const TIMEZONES = [
  { id: "Asia/Kolkata", label: "India Standard Time (GMT+5:30)" },
  { id: "Asia/Dubai", label: "Gulf Standard Time (GMT+4:00)" },
  { id: "Europe/London", label: "United Kingdom (GMT+0:00)" },
  { id: "Europe/Berlin", label: "Central Europe (GMT+1:00)" },
  { id: "America/New_York", label: "US Eastern (GMT-5:00)" },
  { id: "America/Los_Angeles", label: "US Pacific (GMT-8:00)" },
  { id: "Asia/Singapore", label: "Singapore (GMT+8:00)" },
  { id: "Australia/Sydney", label: "Australia Eastern (GMT+10:00)" },
] as const;

export type TimezoneId = (typeof TIMEZONES)[number]["id"];

export function defaultTimezone(): TimezoneId {
  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = TIMEZONES.find((tz) => tz.id === resolved);
    if (match) return match.id;
  } catch {
    /* ignore — fall back below */
  }
  return "Asia/Kolkata";
}

export type DayOption = {
  /** ISO date, e.g. 2026-09-02 */
  date: string;
  weekday: string;
  day: string;
  month: string;
  available: boolean;
};

export type SlotOption = {
  /** 24h local time, e.g. "14:30" */
  time: string;
  label: string;
  available: boolean;
};

const SLOT_TIMES = [
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/** Deterministic pseudo-random so availability is stable across renders. */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h % 1000) / 1000;
}

export function formatTimeLabel(time: string) {
  const [hRaw, m] = time.split(":");
  const h = Number(hRaw);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${suffix}`;
}

/** Next 21 days of demo availability (weekends closed). */
export function getAvailability(days = 21): DayOption[] {
  const out: DayOption[] = [];
  const today = new Date();
  for (let i = 1; i <= days; i += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    out.push({
      date: toISODate(d),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: String(d.getDate()).padStart(2, "0"),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      available: !weekend,
    });
  }
  return out;
}

export function getSlots(date: string, meetingType: MeetingTypeId): SlotOption[] {
  if (!date) return [];
  return SLOT_TIMES.map((time) => ({
    time,
    label: formatTimeLabel(time),
    available: seeded(`${date}-${time}-${meetingType}`) > 0.32,
  }));
}

export type BookingDraft = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  purpose: string;
  meetingType: MeetingTypeId;
  date: string;
  time: string;
  timezone: string;
};

export function meetingTypeLabel(id: string) {
  return MEETING_TYPES.find((t) => t.id === id)?.label ?? id;
}

export function statusLabel(status: string) {
  switch (status) {
    case "cancelled":
      return "Cancelled";
    case "rescheduled":
      return "Rescheduled";
    case "completed":
      return "Completed";
    default:
      return "Confirmed";
  }
}

export function timezoneLabel(id: string) {
  return TIMEZONES.find((tz) => tz.id === id)?.label ?? id;
}

export function formatLongDate(date: string) {
  if (!date) return "";
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function icsStamp(date: string, time: string, addMinutes = 0) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d, hh, mm + addMinutes));
  return `${dt.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

export type CalendarSource = {
  ticketId: string;
  date: string;
  time: string;
  duration: number;
  meetingType: string;
  purpose: string;
};

/** Builds a downloadable .ics payload for the "Add to calendar" action. */
export function buildCalendarFile(booking: CalendarSource) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CrosX//Meeting Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.ticketId}@crosx.in`,
    `DTSTAMP:${icsStamp(booking.date, booking.time)}`,
    `DTSTART:${icsStamp(booking.date, booking.time)}`,
    `DTEND:${icsStamp(booking.date, booking.time, booking.duration)}`,
    `SUMMARY:CrosX — ${meetingTypeLabel(booking.meetingType)}`,
    `DESCRIPTION:Ticket ${booking.ticketId}. ${booking.purpose.replace(/\n/g, " ")}`,
    "LOCATION:Online (link shared by email)",
    "ORGANIZER;CN=CrosX:mailto:contact@crosx.in",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}
