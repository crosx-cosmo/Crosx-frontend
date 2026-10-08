/**
 * Shape of the Admin → Create Campaign draft. Mirrors every field the
 * publisher-facing Campaign Marketplace renders (see src/lib/publisher-data.ts,
 * campaign-terms-data.ts and campaign-postback-data.ts) so the admin form is the
 * single source for those marketplace details. Frontend-only demo data.
 */

import type { CampaignCategory } from "@/lib/publisher-data";

export type DraftEvent = {
  id: string;
  name: string;
  slug: string;
  description: string;
  advertiserEvent: string;
  payable: boolean;
  alert: boolean;
  payout: string;
  cap: string;
  enabled: boolean;
};

export type CampaignDraft = {
  /* basics */
  name: string;
  tagline: string;
  advertiser: string;
  category: CampaignCategory;
  offerId: string;
  logoUrl: string;
  kpi: string;
  status: "Active" | "Paused";
  description: string;

  /* payout */
  model: string;
  revenue: string;
  payout: string;
  epc: string;
  dailyCap: string;
  monthlyCap: string;
  approvalRate: string;
  conversionDays: string;
  events: DraftEvent[];

  /* targeting */
  geo: string;
  devices: string;
  allowed: string[];
  disallowed: string[];
  trafficRules: string[];
  conversionRules: string[];
  kpiRules: string[];
  publisherRequirements: string[];
  kycRequirements: string[];
  brandGuidelines: string[];
  terms: string[];

  /* tracking */
  trackingType: string;
  trackingUrl: string;
  trackingParams: string[];
  supportedParams: string[];
  postbackUrl: string;
  landingPages: string[];
  creativeNotes: string;
};

let eventSeq = 0;
export function newDraftEvent(): DraftEvent {
  eventSeq += 1;
  return {
    id: `EV-NEW-${eventSeq}`,
    name: "",
    slug: "",
    description: "",
    advertiserEvent: "",
    payable: true,
    alert: false,
    payout: "",
    cap: "",
    enabled: true,
  };
}

export const DEMO_DRAFT: CampaignDraft = {
  name: "Angel One Demat Account",
  tagline: "Trading & Demat Account Opening",
  advertiser: "Angel One Broking Pvt Ltd",
  category: "Trading",
  offerId: "CMP-1042",
  logoUrl: "",
  kpi: "Verified demat account activation with completed KYC and first login",
  status: "Active",
  description:
    "Promote Angel One demat and trading account opening to eligible Indian users. Payout confirms after KYC approval and first successful login.",

  model: "CPA",
  revenue: "520",
  payout: "360",
  epc: "18.40",
  dailyCap: "1000",
  monthlyCap: "25000",
  approvalRate: "91.4",
  conversionDays: "2",
  events: [
    {
      id: "EV-1",
      name: "Registration",
      slug: "registration",
      description: "User signs up with a valid mobile number and verifies OTP.",
      advertiserEvent: "signup_complete",
      payable: false,
      alert: false,
      payout: "40",
      cap: "2000",
      enabled: true,
    },
    {
      id: "EV-2",
      name: "KYC Completed",
      slug: "kyc_completed",
      description: "Identity documents submitted and approved by the advertiser.",
      advertiserEvent: "kyc_approved",
      payable: true,
      alert: true,
      payout: "160",
      cap: "1200",
      enabled: true,
    },
    {
      id: "EV-3",
      name: "Account Activated",
      slug: "account_activated",
      description: "Primary conversion — account fully activated and billable.",
      advertiserEvent: "account_active",
      payable: true,
      alert: true,
      payout: "360",
      cap: "1000",
      enabled: true,
    },
    {
      id: "EV-4",
      name: "First Transaction",
      slug: "first_transaction",
      description: "User completes their first funded trade within the attribution window.",
      advertiserEvent: "first_trade",
      payable: true,
      alert: false,
      payout: "220",
      cap: "800",
      enabled: false,
    },
  ],

  geo: "India",
  devices: "Mobile + Desktop",
  allowed: ["Search", "Social", "Display", "Native"],
  disallowed: ["Incentivized", "Spam", "Misleading claims", "Brand bidding"],
  trafficRules: [
    "All traffic must be opt-in and comply with platform policies and local laws.",
    "Traffic must be geo-targeted to India only.",
    "Only CrosX tracking links may be used for this campaign.",
  ],
  conversionRules: [
    "A conversion is counted when the referred user activates the demat account.",
    "Duplicate, refunded or reversed actions are reversed automatically.",
    "Attribution window is 2 days from the initial click.",
  ],
  kpiRules: [
    "Payout is awarded only on confirmed, billable conversions.",
    "EPC benchmark is ₹18.40; unusually low quality may trigger review.",
    "Conversion rate must remain within Trading vertical norms.",
  ],
  publisherRequirements: [
    "Minimum 30 days of active traffic history on CrosX.",
    "Approved traffic sources declared during onboarding.",
    "Account manager approval required before scaling above the daily cap.",
  ],
  kycRequirements: [
    "Receiver Aadhaar and PAN on file.",
    "Selfie verification completed.",
    "Bank or UPI payout details verified.",
  ],
  brandGuidelines: [
    "Use only advertiser-approved creatives, logos and messaging.",
    "No guaranteed-return or assured-profit claims.",
    "Disclose material relationships per local advertising regulations.",
  ],
  terms: [
    "Conversions validate within 2 business days on average.",
    "Payments release for approved conversions in the next payout cycle.",
    "Disputes must be raised within 15 days of the conversion date.",
    "Violations may result in suspension and forfeiture of pending earnings.",
  ],

  trackingType: "Server-to-Server Postback",
  trackingUrl: "https://track.crosx.in/click?cmp=angel-one-demat&pub={pub_id}&sub1={sub1}",
  trackingParams: ["{click_id}", "{pub_id}", "{sub1}", "{offer_id}"],
  supportedParams: ["{click_id}", "{sub_id}", "{event}", "{payout}", "{ip}", "{timestamp}"],
  postbackUrl: "https://advertiser.angelone.in/postback?cid={click_id}&event={event}",
  landingPages: ["Demat Account", "Trading Account", "Mobile App Install"],
  creativeNotes:
    "Banner set 300x250 / 728x90 and 3 static creatives available in the advertiser kit. Hindi and English copy approved.",
};

export const TRACKING_TYPES = [
  "Server-to-Server Postback",
  "Pixel (Image)",
  "JavaScript Tag",
  "API Conversion",
] as const;

export const DEVICE_OPTIONS = ["Mobile + Desktop", "Mobile first", "Mobile only", "Desktop only"] as const;
