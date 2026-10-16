import type { Campaign } from "@/lib/publisher-data";

export type CampaignTerms = {
  kpiRules: string[];
  conversionRules: string[];
  trafficGuidelines: string[];
  prohibitedActivities: string[];
  brandGuidelines: string[];
  approvalPaymentRules: string[];
  importantNotes: string[];
  lastUpdated: string;
};

/** Deterministic terms for a campaign, derived from campaign metadata. */
export function campaignTermsFor(campaign: Campaign): CampaignTerms {
  const base = campaign.name;
  const payout = campaign.payout;
  const epc = campaign.epc;

  return {
    kpiRules: [
      `Payout of ₹${payout} is awarded only on confirmed, billable conversions.`,
      `Earnings per click (EPC) benchmark is ₹${epc.toFixed(2)}; unusually low quality may trigger review.`,
      `Conversion rate must remain within network norms for the ${campaign.category} vertical.`,
      `Only conversions meeting the target action (e.g., first transaction, KYC, install) are billable.`,
    ],
    conversionRules: [
      `A conversion is counted when a referred user completes the required action on ${base}.`,
      `Duplicate, refunded, or reversed actions are reversed automatically.`,
      `Attribution window is ${campaign.avgConversionDays} days from the initial click.`,
      `Cookie and fingerprint attribution must not be manipulated or bypassed.`,
    ],
    trafficGuidelines: [
      `Allowed sources: ${campaign.allowed.join(", ")}.`,
      `All traffic must be opt-in and comply with platform policies and local laws.`,
      `Traffic must be geo-targeted to: ${campaign.geo}.`,
      `Supported devices: ${campaign.devices}.`,
      `Publishers must use only the CrosX tracking links provided for this campaign.`,
    ],
    prohibitedActivities: [
      `Incentivized, forced, or fraudulent conversions.`,
      `Spam, malware, or misleading advertisements.`,
      `Adult, gambling, or illegal content placements.`,
      `Brand-bidding on advertiser trademarks or misspellings without approval.`,
      `Re-brokering traffic without written approval from the advertiser.`,
      `Using automated tools, bots, or fake clicks to inflate volume.`,
    ],
    brandGuidelines: [
      `Use only advertiser-approved creatives, logos, and messaging.`,
      `Do not make unsubstantiated claims about returns, rewards, or guarantees.`,
      `Disclose material relationships per local advertising regulations.`,
      `Maintain brand tone; avoid sensational or aggressive language.`,
    ],
    approvalPaymentRules: [
      `Conversions are validated within ${campaign.avgConversionDays} business days on average.`,
      `Payments are released for approved conversions in the next publisher payout cycle.`,
      `Accounts with high rejection rates may be paused or removed from the campaign.`,
      `Disputes must be raised within 15 days of the conversion date.`,
    ],
    importantNotes: [
      `Campaign status is currently ${campaign.status}. Paused campaigns may not accrue new conversions.`,
      `Always generate tracking links through the CrosX panel to ensure attribution.`,
      `Sub IDs should be used consistently to help with optimisation and reporting.`,
      `Violations may result in account suspension and forfeiture of pending earnings.`,
    ],
    lastUpdated: "2026-08-01",
  };
}
