import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Campaign } from "@/lib/publisher-data";
import { conversionEventsFor } from "@/lib/campaign-postback-data";

/**
 * Frontend-only state for campaign postbacks.
 *
 * Priority rule (mirrors what the backend will persist later):
 * - An event with at least one ACTIVE event-specific postback sends that
 *   event's conversions ONLY to those postbacks.
 * - An event with no active event-specific postback falls back to the single
 *   campaign-level GLOBAL postback.
 */

export type PostbackConfig = {
  id: string;
  /** null = campaign-level global fallback postback. */
  eventSlug: string | null;
  url: string;
  active: boolean;
  lastTest: { ok: boolean; status: number; at: string } | null;
};

export type PostbackScope = { kind: "global" } | { kind: "event"; slug: string; name: string };

type Store = {
  campaign: Campaign;
  global: PostbackConfig;
  forEvent: (slug: string) => PostbackConfig[];
  activeForEvent: (slug: string) => PostbackConfig[];
  /** True when the event overrides the global fallback. */
  isOverridden: (slug: string) => boolean;
  savePostback: (input: {
    id?: string;
    eventSlug: string | null;
    url: string;
    active: boolean;
  }) => void;
  removePostback: (id: string) => void;
  toggleActive: (id: string) => void;
  /** Simulates firing a single postback and records the result. */
  testPostback: (id: string) => Promise<{ ok: boolean; status: number }>;
};

const Ctx = createContext<Store | null>(null);

export const DEFAULT_GLOBAL_URL =
  "https://tracker.example.com/pb?cid={click_id}&event={event}&payout={payout}&s1={x1}";

function nowTime() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

export function isValidPostbackUrl(url: string) {
  const v = url.trim();
  if (!/^https?:\/\//i.test(v)) return false;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

export function CampaignPostbackProvider({
  campaign,
  children,
}: {
  campaign: Campaign;
  children: ReactNode;
}) {
  const [items, setItems] = useState<PostbackConfig[]>(() => {
    const events = conversionEventsFor(campaign);
    const first = events[0];
    return [
      {
        id: `${campaign.id}-PBC-GLOBAL`,
        eventSlug: null,
        url: DEFAULT_GLOBAL_URL,
        active: true,
        lastTest: { ok: true, status: 200, at: "10:48:12" },
      },
      ...(first
        ? [
            {
              id: `${campaign.id}-PBC-1`,
              eventSlug: first.slug,
              url: `https://tracker.example.com/${first.slug}?cid={click_id}&payout={payout}`,
              active: true,
              lastTest: { ok: true, status: 200, at: "10:41:03" },
            } satisfies PostbackConfig,
          ]
        : []),
    ];
  });

  const global = useMemo(
    () => items.find((i) => i.eventSlug === null)!,
    [items],
  );

  const forEvent = useCallback(
    (slug: string) => items.filter((i) => i.eventSlug === slug),
    [items],
  );

  const activeForEvent = useCallback(
    (slug: string) => items.filter((i) => i.eventSlug === slug && i.active),
    [items],
  );

  const savePostback = useCallback<Store["savePostback"]>((input) => {
    setItems((prev) => {
      if (input.id) {
        return prev.map((i) =>
          i.id === input.id ? { ...i, url: input.url, active: input.active } : i,
        );
      }
      return [
        ...prev,
        {
          id: `PBC-${Date.now()}`,
          eventSlug: input.eventSlug,
          url: input.url,
          active: input.active,
          lastTest: null,
        },
      ];
    });
  }, []);

  const value = useMemo<Store>(
    () => ({
      campaign,
      global,
      forEvent,
      activeForEvent,
      isOverridden: (slug) => items.some((i) => i.eventSlug === slug && i.active),
      savePostback,
      removePostback: (id) =>
        setItems((prev) => prev.filter((i) => i.id === id ? i.eventSlug === null : true)),
      toggleActive: (id) =>
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, active: !i.active } : i))),
      testPostback: (id) =>
        new Promise((resolve) => {
          setTimeout(() => {
            const target = items.find((i) => i.id === id);
            const ok = !!target && target.active && isValidPostbackUrl(target.url);
            const status = ok ? 200 : target && !target.active ? 409 : 500;
            setItems((prev) =>
              prev.map((i) =>
                i.id === id ? { ...i, lastTest: { ok, status, at: nowTime() } } : i,
              ),
            );
            resolve({ ok, status });
          }, 450);
        }),
    }),
    [campaign, global, forEvent, activeForEvent, items, savePostback],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCampaignPostbacks() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useCampaignPostbacks must be used inside CampaignPostbackProvider");
  return ctx;
}
