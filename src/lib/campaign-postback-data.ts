/**
 * Frontend-only demo data for campaign conversion events and publisher-side
 * postback configuration shown on the campaign detail page.
 */

import type { Campaign } from "@/lib/publisher-data";

export type ConversionEvent = {
  id: string;
  name: string;
  slug: string;
  payout: number;
  status: "Active" | "Paused";
  description: string;
};

/** Deterministic per-campaign event list derived from the campaign payout. */
export function conversionEventsFor(campaign: Campaign): ConversionEvent[] {
  const base = campaign.payout;
  return [
    {
      id: `${campaign.id}-EV1`,
      name: "Registration",
      slug: "registration",
      payout: Math.round(base * 0.15),
      status: "Active",
      description: "User signs up with a valid mobile number and verifies OTP.",
    },
    {
      id: `${campaign.id}-EV2`,
      name: "KYC Completed",
      slug: "kyc_completed",
      payout: Math.round(base * 0.45),
      status: "Active",
      description: "Identity documents submitted and approved by the advertiser.",
    },
    {
      id: `${campaign.id}-EV3`,
      name: "Account Activated",
      slug: "account_activated",
      payout: base,
      status: campaign.status === "Paused" ? "Paused" : "Active",
      description: "Primary conversion — account fully activated and billable.",
    },
    {
      id: `${campaign.id}-EV4`,
      name: "First Transaction",
      slug: "first_transaction",
      payout: Math.round(base * 0.6),
      status: campaign.approvalRate > 80 ? "Active" : "Paused",
      description: "User completes their first funded transaction or trade.",
    },
  ];
}

export const CAMPAIGN_MACROS: { macro: string; desc: string; example: string }[] = [
  {
    macro: "{click_id}",
    desc: "Unique CrosX click identifier",
    example: "https://tracker.com/pb?click_id={click_id}",
  },
  {
    macro: "{sub_id}",
    desc: "Your primary sub ID for this click",
    example: "https://tracker.com/pb?click_id={click_id}&sub_id={sub_id}",
  },
  {
    macro: "{event}",
    desc: "Conversion event name that fired",
    example: "https://tracker.com/pb?click_id={click_id}&event={event}",
  },
  {
    macro: "{ip}",
    desc: "IP address recorded on the click",
    example: "https://tracker.com/pb?click_id={click_id}&ip={ip}",
  },
  {
    macro: "{offer_id}",
    desc: "Campaign / offer identifier",
    example: "https://tracker.com/pb?click_id={click_id}&offer_id={offer_id}",
  },
  {
    macro: "{payout}",
    desc: "Payout amount for the event",
    example: "https://tracker.com/pb?click_id={click_id}&payout={payout}",
  },
  {
    macro: "{timestamp}",
    desc: "Unix time when the event fired",
    example: "https://tracker.com/pb?click_id={click_id}&ts={timestamp}",
  },
  ...Array.from({ length: 10 }, (_, i) => ({
    macro: `{x${i + 1}}`,
    desc: `Sub ID ${i + 1} — custom tracking parameter`,
    example: `https://tracker.com/pb?click_id={click_id}&sub${i + 1}={x${i + 1}}`,
  })),
];

export type CampaignPostbackLog = {
  id: string;
  event: string;
  clickId: string;
  ok: boolean;
  status: number;
  time: string;
};

const LOG_EVENTS = [
  "account_activated",
  "kyc_completed",
  "registration",
  "first_transaction",
] as const;

export function campaignPostbackLogs(campaign: Campaign): CampaignPostbackLog[] {
  return Array.from({ length: 6 }, (_, i) => {
    const ok = i !== 2 && i !== 5;
    return {
      id: `${campaign.id}-PB-${i}`,
      event: LOG_EVENTS[i % LOG_EVENTS.length]!,
      clickId: `cx${(9481027 - i * 137).toString(36)}`,
      ok,
      status: ok ? 200 : i === 2 ? 500 : 504,
      time: `10:${String(48 - i * 6).padStart(2, "0")}:${String((37 + i * 7) % 60).padStart(2, "0")}`,
    };
  });
}
