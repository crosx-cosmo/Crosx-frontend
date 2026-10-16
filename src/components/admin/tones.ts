import type { BadgeTone } from "@/components/dashboard/kit";

/** Shared status → badge tone mapping for every admin table. */
export function toneFor(status: string): BadgeTone {
  const s = status.toLowerCase();
  if (
    ["active", "approved", "paid", "live", "qualified", "verified", "delivered", "opened", "confirmed", "completed"].includes(s)
  )
    return "success";
  if (["pending", "in review", "queued", "paused", "rescheduled", "starter"].includes(s))
    return "warn";
  if (["suspended", "terminated", "rejected", "failed", "failing", "bounced", "cancelled", "duplicate", "ended"].includes(s))
    return "danger";
  return "neutral";
}
