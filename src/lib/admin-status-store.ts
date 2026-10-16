import { useSyncExternalStore } from "react";

import {
  MEETINGS,
  PUBLISHERS,
  type AdminPublisher,
  type MeetingRow,
  type PublisherStatus,
} from "./admin-data";

/**
 * In-session override layer for admin management actions.
 *
 * Rows still come from the existing admin data source; this store only holds the
 * status changes an admin makes, so every admin page (All / Active / Pending /
 * Suspended / Meetings) reflects the same state immediately after an action.
 */

export type PublisherPatch = Partial<Pick<AdminPublisher, "status" | "kyc">>;
export type MeetingPatch = Partial<Pick<MeetingRow, "status" | "date" | "time" | "timezone">>;

const publisherPatches = new Map<string, PublisherPatch>();
const meetingPatches = new Map<string, MeetingPatch>();
const listeners = new Set<() => void>();

let publisherSnapshot: AdminPublisher[] = PUBLISHERS;
let meetingSnapshot: MeetingRow[] = MEETINGS;

function recompute() {
  publisherSnapshot = PUBLISHERS.map((row) => {
    const patch = publisherPatches.get(row.id);
    return patch ? { ...row, ...patch } : row;
  });
  meetingSnapshot = MEETINGS.map((row) => {
    const patch = meetingPatches.get(row.id);
    return patch ? { ...row, ...patch } : row;
  });
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function usePublisherRows(): AdminPublisher[] {
  return useSyncExternalStore(
    subscribe,
    () => publisherSnapshot,
    () => publisherSnapshot,
  );
}

export function useMeetingRows(): MeetingRow[] {
  return useSyncExternalStore(
    subscribe,
    () => meetingSnapshot,
    () => meetingSnapshot,
  );
}

export function patchPublisher(id: string, patch: PublisherPatch) {
  publisherPatches.set(id, { ...publisherPatches.get(id), ...patch });
  recompute();
}

export function patchMeeting(id: string, patch: MeetingPatch) {
  meetingPatches.set(id, { ...meetingPatches.get(id), ...patch });
  recompute();
}

/** KYC state that goes with a publisher status change. */
export function kycForStatus(status: PublisherStatus): AdminPublisher["kyc"] {
  if (status === "Active") return "Verified";
  if (status === "Pending") return "In Review";
  return "Rejected";
}
