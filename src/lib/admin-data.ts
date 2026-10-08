/**
 * Admin console demo dataset.
 * Front-end only: no backend reads/writes. Mirrors the publisher panel's data
 * shapes so both consoles feel like one product.
 */
import { inr, num } from "./publisher-data";

export { inr, num };

/* ------------------------------------------------------------------ helpers */

const rnd = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const pick = <T,>(arr: readonly T[], seed: number): T => arr[Math.floor(rnd(seed) * arr.length)]!;

const stamp = (seed: number) => {
  const day = 1 + Math.floor(rnd(seed) * 28);
  const hour = Math.floor(rnd(seed + 3) * 24);
  const min = Math.floor(rnd(seed + 7) * 60);
  return `2026-09-${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};

const dateOnly = (seed: number) => `2026-09-${String(1 + Math.floor(rnd(seed) * 28)).padStart(2, "0")}`;

/* ---------------------------------------------------------------- constants */

export const GEOS = ["India", "UAE", "Singapore", "United Kingdom", "Indonesia", "Malaysia"] as const;
export const DEVICES = ["Mobile", "Desktop", "Tablet"] as const;
export const CATEGORIES = ["Trading", "Investment", "Finance", "Insurance", "Crypto"] as const;
export const MODELS = ["CPL", "CPA", "CPI", "CPS"] as const;
export const TRAFFIC = ["Meta Ads", "Google Ads", "SEO", "Email", "Push", "Native"] as const;

export const ADVERTISERS = [
  "Zerodha Capital",
  "Angel One",
  "Groww Invest",
  "Upstox Pro",
  "Bajaj Finserv",
  "HDFC Life",
  "CoinDCX",
  "Paytm Money",
  "ICICI Direct",
  "5paisa",
] as const;

const PUBLISHER_NAMES = [
  "Rohan Mehta",
  "Ananya Sharma",
  "Vikram Desai",
  "Priya Nair",
  "Arjun Kapoor",
  "Sneha Iyer",
  "Kabir Malhotra",
  "Meera Joshi",
  "Aditya Rao",
  "Ishita Bose",
  "Nikhil Verma",
  "Tara Menon",
  "Rahul Saxena",
  "Divya Pillai",
  "Siddharth Jain",
  "Neha Chatterjee",
  "Karan Bhatia",
  "Riya Ghosh",
  "Manav Shetty",
  "Pooja Reddy",
  "Yash Agarwal",
  "Lakshmi Prasad",
  "Dev Anand",
  "Simran Kaur",
  "Harsh Trivedi",
  "Aisha Khan",
  "Varun Sethi",
  "Naina Dutta",
] as const;

const COMPANIES = [
  "NorthEdge Media",
  "PulseGrid Labs",
  "Vertex Traffic",
  "BlueOrbit Digital",
  "Skyline Performance",
  "Nimbus Reach",
  "IronLeaf Media",
  "Cobalt Funnel",
] as const;

/* ------------------------------------------------------------ account totals */

export const ADMIN_TOTALS = {
  totalRevenue: 18_942_500,
  totalPaid: 12_408_300,
  netEarning: 6_534_200,
  pendingPayout: 2_186_400,
  publishers: 428,
  activePublishers: 296,
  pendingPublishers: 74,
  suspendedPublishers: 58,
  campaigns: 126,
  activeCampaigns: 84,
  approvalRequests: 12,
  monthlyClicks: 4_286_140,
  uniqueClicks: 3_318_902,
  conversions: 128_460,
  leads: 46_820,
  approvalRate: 89.4,
  mobileShare: 74,
  desktopShare: 22,
  epc: 4.42,
  nextPayoutDate: "15 Sep 2026",
};

/* ---------------------------------------------------------------- timeseries */

export type SeriesPoint = {
  date: string;
  clicks: number;
  conversions: number;
  revenue: number;
  payout: number;
};

export type RangeKey = "today" | "7d" | "month" | "last-month";

export const RANGE_OPTIONS: { key: RangeKey; label: string; caption: string }[] = [
  { key: "today", label: "Today", caption: "hourly buckets, last 24h" },
  { key: "7d", label: "Last 7 Days", caption: "daily buckets, this week" },
  { key: "month", label: "This Month", caption: "weekly buckets, Sep 2026" },
  { key: "last-month", label: "Last Month", caption: "weekly buckets, Aug 2026" },
];

const makeSeries = (labels: string[], base: number, seed: number): SeriesPoint[] =>
  labels.map((date, i) => {
    const clicks = Math.round(base * (0.72 + rnd(seed + i) * 0.6));
    const conversions = Math.round(clicks * (0.026 + rnd(seed + i + 40) * 0.014));
    const revenue = Math.round(conversions * (118 + rnd(seed + i + 80) * 62));
    return { date, clicks, conversions, revenue, payout: Math.round(revenue * 0.66) };
  });

export const TODAY_SERIES = makeSeries(
  ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
  24_800,
  11,
);
export const WEEK_SERIES = makeSeries(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], 138_400, 23);
export const MONTH_SERIES = makeSeries(
  ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
  962_000,
  37,
);
export const LAST_MONTH_SERIES = makeSeries(
  ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
  884_000,
  53,
);

export function seriesFor(range: RangeKey): SeriesPoint[] {
  if (range === "today") return TODAY_SERIES;
  if (range === "month") return MONTH_SERIES;
  if (range === "last-month") return LAST_MONTH_SERIES;
  return WEEK_SERIES;
}

/* ---------------------------------------------------------------- publishers */

export type PublisherStatus = "Active" | "Pending" | "Suspended" | "Terminated";

export type AdminPublisher = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: PublisherStatus;
  tier: "Growth Partner" | "Elite Partner" | "Starter";
  geo: string;
  traffic: string;
  joined: string;
  campaigns: number;
  clicks: number;
  conversions: number;
  revenue: number;
  payoutDue: number;
  approvalRate: number;
  kyc: "Verified" | "In Review" | "Rejected";
  lastActive: string;
};

export const PUBLISHERS: AdminPublisher[] = PUBLISHER_NAMES.map((name, i) => {
  const status: PublisherStatus = i < 16 ? "Active" : i < 23 ? "Pending" : "Suspended";
  const clicks = Math.round(8_400 + rnd(i + 1) * 96_000);
  const conversions = Math.round(clicks * (0.02 + rnd(i + 9) * 0.02));
  const revenue = Math.round(conversions * (120 + rnd(i + 17) * 80));
  return {
    id: `PUB-${2400 + i * 7}`,
    name,
    company: pick(COMPANIES, i + 2),
    email: `${name.split(" ")[0]!.toLowerCase()}@${pick(COMPANIES, i + 2).split(" ")[0]!.toLowerCase()}.com`,
    status,
    tier: i % 7 === 0 ? "Elite Partner" : i % 3 === 0 ? "Starter" : "Growth Partner",
    geo: pick(GEOS, i + 4),
    traffic: pick(TRAFFIC, i + 6),
    joined: dateOnly(i + 11),
    campaigns: 2 + Math.floor(rnd(i + 13) * 18),
    clicks: status === "Pending" ? 0 : clicks,
    conversions: status === "Pending" ? 0 : conversions,
    revenue: status === "Pending" ? 0 : revenue,
    payoutDue: status === "Active" ? Math.round(revenue * 0.28) : 0,
    approvalRate: Math.round(72 + rnd(i + 19) * 26),
    kyc: status === "Pending" ? "In Review" : status === "Suspended" ? "Rejected" : "Verified",
    lastActive: stamp(i + 23),
  };
});

export const publishersByStatus = (status: PublisherStatus) =>
  PUBLISHERS.filter((p) => p.status === status);

/* ----------------------------------------------------------------- campaigns */

export type CampaignStatus = "Active" | "Paused" | "Pending" | "Ended";

export type AdminCampaign = {
  id: string;
  slug: string;
  name: string;
  advertiser: string;
  category: (typeof CATEGORIES)[number];
  model: (typeof MODELS)[number];
  revenuePerConv: number;
  publisherPayout: number;
  status: CampaignStatus;
  geo: string;
  dailyCap: number;
  publishers: number;
  clicks: number;
  conversions: number;
  revenue: number;
  createdAt: string;
};

const CAMPAIGN_TITLES = [
  "Demat Account Opening",
  "Mutual Fund SIP Signup",
  "Credit Card Approval",
  "Term Life Insurance Lead",
  "Crypto KYC Complete",
  "Forex Trading Deposit",
  "Personal Loan Lead",
  "Gold Savings Plan",
  "Health Insurance Quote",
  "Stock Broking App Install",
  "Fixed Deposit Booking",
  "Business Loan Lead",
  "NPS Registration",
  "Digital Gold Purchase",
  "Options Trading Course",
  "Car Insurance Renewal",
  "Home Loan Enquiry",
  "Wealth Advisory Signup",
  "US Stocks Account",
  "SME Current Account",
  "Robo Advisory Trial",
  "Bond Investment Lead",
  "Travel Insurance Quote",
  "Tax Filing Signup",
  "Credit Score Check",
  "Neo Bank Onboarding",
] as const;

export const CAMPAIGNS: AdminCampaign[] = CAMPAIGN_TITLES.map((title, i) => {
  const status: CampaignStatus =
    i % 9 === 4 ? "Pending" : i % 7 === 3 ? "Paused" : i % 11 === 9 ? "Ended" : "Active";
  const clicks = Math.round(18_000 + rnd(i + 31) * 210_000);
  const conversions = Math.round(clicks * (0.018 + rnd(i + 41) * 0.022));
  const revenuePerConv = Math.round(140 + rnd(i + 51) * 460);
  return {
    id: `CMP-${1200 + i * 13}`,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: title,
    advertiser: pick(ADVERTISERS, i + 5),
    category: pick(CATEGORIES, i + 8),
    model: pick(MODELS, i + 12),
    revenuePerConv,
    publisherPayout: Math.round(revenuePerConv * 0.68),
    status,
    geo: pick(GEOS, i + 15),
    dailyCap: [250, 500, 1000, 2000, 5000][i % 5]!,
    publishers: 4 + Math.floor(rnd(i + 21) * 62),
    clicks,
    conversions,
    revenue: conversions * revenuePerConv,
    createdAt: dateOnly(i + 27),
  };
});

export type ApprovalRequest = {
  id: string;
  publisher: string;
  publisherId: string;
  campaign: string;
  traffic: string;
  geo: string;
  requestedAt: string;
  monthlyVolume: string;
  note: string;
};

export const APPROVAL_REQUESTS: ApprovalRequest[] = Array.from({ length: 12 }, (_, i) => ({
  id: `REQ-${8100 + i * 9}`,
  publisher: PUBLISHER_NAMES[i]!,
  publisherId: `PUB-${2400 + i * 7}`,
  campaign: CAMPAIGN_TITLES[(i * 3) % CAMPAIGN_TITLES.length]!,
  traffic: pick(TRAFFIC, i + 33),
  geo: pick(GEOS, i + 44),
  requestedAt: stamp(i + 55),
  monthlyVolume: `${10 + Math.floor(rnd(i + 66) * 90)}K clicks / mo`,
  note: [
    "Running compliant in-house creatives only.",
    "Existing advertiser relationship, wants higher cap.",
    "Requesting geo expansion to UAE.",
    "Needs postback whitelist for new server IP.",
  ][i % 4]!,
}));

/* ------------------------------------------------------------------- reports */

export type ClickRow = {
  id: string;
  publisher: string;
  campaign: string;
  advertiser: string;
  device: string;
  os: string;
  geo: string;
  ip: string;
  sub1: string;
  timestamp: string;
  converted: boolean;
};

export const CLICK_ROWS: ClickRow[] = Array.from({ length: 46 }, (_, i) => ({
  id: `CLK-${920_400 + i * 17}`,
  publisher: pick(PUBLISHER_NAMES, i + 2),
  campaign: pick(CAMPAIGN_TITLES, i + 5),
  advertiser: pick(ADVERTISERS, i + 8),
  device: pick(DEVICES, i + 11),
  os: pick(["Android 15", "iOS 19", "Windows 11", "macOS 16"], i + 14),
  geo: pick(GEOS, i + 17),
  ip: `${49 + Math.floor(rnd(i + 20) * 160)}.${Math.floor(rnd(i + 23) * 255)}.${Math.floor(rnd(i + 26) * 255)}.${Math.floor(rnd(i + 29) * 255)}`,
  sub1: `sub_${1000 + i * 7}`,
  timestamp: stamp(i + 32),
  converted: rnd(i + 35) > 0.72,
}));

export type ConversionRow = {
  id: string;
  clickId: string;
  publisher: string;
  campaign: string;
  advertiser: string;
  status: "Approved" | "Pending" | "Rejected";
  revenue: number;
  payout: number;
  geo: string;
  timestamp: string;
};

export const CONVERSION_ROWS: ConversionRow[] = Array.from({ length: 42 }, (_, i) => {
  const revenue = Math.round(160 + rnd(i + 61) * 520);
  return {
    id: `CNVS-${44_200 + i * 11}`,
    clickId: `CLK-${920_400 + i * 17}`,
    publisher: pick(PUBLISHER_NAMES, i + 3),
    campaign: pick(CAMPAIGN_TITLES, i + 6),
    advertiser: pick(ADVERTISERS, i + 9),
    status: i % 8 === 5 ? "Rejected" : i % 4 === 1 ? "Pending" : "Approved",
    revenue,
    payout: Math.round(revenue * 0.68),
    geo: pick(GEOS, i + 12),
    timestamp: stamp(i + 15),
  };
});

export type LeadRow = {
  id: string;
  name: string;
  phone: string;
  publisher: string;
  campaign: string;
  status: "Qualified" | "Pending" | "Rejected" | "Duplicate";
  score: number;
  geo: string;
  timestamp: string;
};

export const LEAD_ROWS: LeadRow[] = Array.from({ length: 38 }, (_, i) => ({
  id: `LEAD-${71_500 + i * 13}`,
  name: pick(PUBLISHER_NAMES, i + 19),
  phone: `+91 9${String(100_000_000 + Math.floor(rnd(i + 22) * 899_999_999)).slice(0, 9)}`,
  publisher: pick(PUBLISHER_NAMES, i + 25),
  campaign: pick(CAMPAIGN_TITLES, i + 28),
  status:
    i % 9 === 7 ? "Duplicate" : i % 7 === 4 ? "Rejected" : i % 3 === 1 ? "Pending" : "Qualified",
  score: Math.round(38 + rnd(i + 31) * 60),
  geo: pick(GEOS, i + 34),
  timestamp: stamp(i + 37),
}));

/* ------------------------------------------------------------------ postback */

export const GLOBAL_POSTBACK_URL =
  "https://track.crosx.in/postback?cid={click_id}&event={event}&payout={payout}&status={status}&sub1={sub1}";

export const POSTBACK_MACROS = [
  { macro: "{click_id}", description: "Unique CrosX click identifier" },
  { macro: "{event}", description: "Conversion event name fired by the advertiser" },
  { macro: "{payout}", description: "Publisher payout for the conversion" },
  { macro: "{status}", description: "approved / pending / rejected" },
  { macro: "{sub1}", description: "Publisher Sub ID passed on the click" },
  { macro: "{txn_id}", description: "Advertiser transaction reference" },
];

export type PostbackLogRow = {
  id: string;
  publisher: string;
  campaign: string;
  event: string;
  status: number;
  ok: boolean;
  latencyMs: number;
  attempt: number;
  timestamp: string;
  response: string;
};

export const POSTBACK_LOG_ROWS: PostbackLogRow[] = Array.from({ length: 28 }, (_, i) => {
  const ok = rnd(i + 71) > 0.22;
  return {
    id: `PB-${55_100 + i * 7}`,
    publisher: pick(PUBLISHER_NAMES, i + 41),
    campaign: pick(CAMPAIGN_TITLES, i + 44),
    event: pick(["Conversion", "Approved", "Rejected", "Reversal"], i + 47),
    status: ok ? 200 : pick([500, 502, 404, 408], i + 50),
    ok,
    latencyMs: Math.round(48 + rnd(i + 53) * 940),
    attempt: ok ? 1 : 1 + Math.floor(rnd(i + 56) * 3),
    timestamp: stamp(i + 59),
    response: ok ? "OK" : pick(["Timeout", "Bad Gateway", "Endpoint not found"], i + 62),
  };
});

export const POSTBACK_TOTALS = {
  fired: 128_460,
  delivered: 121_884,
  failed: 6_576,
  avgLatency: 214,
  successRate: 94.9,
};

export const API_KEYS = {
  publicKey: "crx_live_pk_9f2c41ab77de4c",
  secretKey: "crx_live_sk_••••••••••••••••4b71",
  webhookSecret: "whsec_••••••••••••3ad9",
  rotatedAt: "2026-08-22",
};

export const API_ENDPOINTS = [
  { method: "GET", path: "/v1/admin/campaigns", description: "List every campaign with live stats" },
  { method: "POST", path: "/v1/admin/campaigns", description: "Create a campaign" },
  { method: "GET", path: "/v1/admin/publishers", description: "List publishers and statuses" },
  { method: "PATCH", path: "/v1/admin/publishers/:id", description: "Approve or suspend a publisher" },
  { method: "GET", path: "/v1/admin/conversions", description: "Conversion feed with filters" },
  { method: "POST", path: "/v1/admin/postback/test", description: "Fire a test postback" },
];

/* ------------------------------------------------------------------- webhook */

export type WebhookEndpoint = {
  id: string;
  label: string;
  url: string;
  events: number;
  status: "Live" | "Paused" | "Failing";
  successRate: number;
  lastDelivery: string;
  createdAt: string;
};

export const WEBHOOK_ENDPOINTS: WebhookEndpoint[] = [
  {
    id: "WH-1041",
    label: "Advertiser Sync — Zerodha",
    url: "https://api.zerodha-partner.in/hooks/crosx",
    events: 6,
    status: "Live",
    successRate: 99.4,
    lastDelivery: "2026-09-06 07:41",
    createdAt: "2026-04-11",
  },
  {
    id: "WH-1042",
    label: "Internal Data Lake",
    url: "https://ingest.crosx.in/lake/v2/events",
    events: 11,
    status: "Live",
    successRate: 98.1,
    lastDelivery: "2026-09-06 07:58",
    createdAt: "2026-02-03",
  },
  {
    id: "WH-1043",
    label: "Finance Reconciliation",
    url: "https://ops.crosx.in/finance/webhook",
    events: 4,
    status: "Live",
    successRate: 96.8,
    lastDelivery: "2026-09-06 06:12",
    createdAt: "2026-05-27",
  },
  {
    id: "WH-1044",
    label: "Groww Partner Bridge",
    url: "https://partners.groww.in/crosx/events",
    events: 5,
    status: "Failing",
    successRate: 71.2,
    lastDelivery: "2026-09-05 23:04",
    createdAt: "2026-06-14",
  },
  {
    id: "WH-1045",
    label: "Slack Alerts",
    url: "https://hooks.slack.com/services/T0/B0/crosx-alerts",
    events: 3,
    status: "Paused",
    successRate: 100,
    lastDelivery: "2026-08-30 18:22",
    createdAt: "2026-01-19",
  },
  {
    id: "WH-1046",
    label: "CoinDCX Compliance",
    url: "https://compliance.coindcx.com/hooks/crosx",
    events: 7,
    status: "Live",
    successRate: 97.6,
    lastDelivery: "2026-09-06 05:36",
    createdAt: "2026-07-02",
  },
];

export type WebhookEvent = {
  key: string;
  label: string;
  description: string;
  subscribers: number;
  volume24h: number;
  enabled: boolean;
};

export const WEBHOOK_EVENTS: WebhookEvent[] = [
  {
    key: "conversion.created",
    label: "Conversion Created",
    description: "Fired the moment a conversion is recorded on any campaign.",
    subscribers: 5,
    volume24h: 4_218,
    enabled: true,
  },
  {
    key: "conversion.approved",
    label: "Conversion Approved",
    description: "Advertiser approved a pending conversion.",
    subscribers: 4,
    volume24h: 3_760,
    enabled: true,
  },
  {
    key: "conversion.rejected",
    label: "Conversion Rejected",
    description: "Conversion rejected during advertiser validation.",
    subscribers: 4,
    volume24h: 412,
    enabled: true,
  },
  {
    key: "publisher.registered",
    label: "Publisher Registered",
    description: "A new publisher completed signup and KYC submission.",
    subscribers: 3,
    volume24h: 26,
    enabled: true,
  },
  {
    key: "publisher.approved",
    label: "Publisher Approved",
    description: "Admin approved a pending publisher account.",
    subscribers: 3,
    volume24h: 11,
    enabled: true,
  },
  {
    key: "campaign.created",
    label: "Campaign Created",
    description: "New campaign published to the marketplace.",
    subscribers: 2,
    volume24h: 4,
    enabled: true,
  },
  {
    key: "campaign.paused",
    label: "Campaign Paused",
    description: "Campaign paused by admin or cap exhaustion.",
    subscribers: 2,
    volume24h: 2,
    enabled: false,
  },
  {
    key: "payout.requested",
    label: "Payout Requested",
    description: "Publisher submitted a withdrawal request.",
    subscribers: 3,
    volume24h: 18,
    enabled: true,
  },
  {
    key: "payout.paid",
    label: "Payout Paid",
    description: "Finance marked a payout as settled.",
    subscribers: 3,
    volume24h: 9,
    enabled: true,
  },
  {
    key: "postback.failed",
    label: "Postback Failed",
    description: "Outbound postback failed after all retries.",
    subscribers: 2,
    volume24h: 64,
    enabled: true,
  },
];

export type DeliveryLogRow = {
  id: string;
  endpoint: string;
  event: string;
  status: number;
  ok: boolean;
  latencyMs: number;
  attempt: number;
  timestamp: string;
};

export const DELIVERY_LOGS: DeliveryLogRow[] = Array.from({ length: 30 }, (_, i) => {
  const ok = rnd(i + 91) > 0.2;
  return {
    id: `DLV-${33_800 + i * 5}`,
    endpoint: WEBHOOK_ENDPOINTS[i % WEBHOOK_ENDPOINTS.length]!.label,
    event: WEBHOOK_EVENTS[i % WEBHOOK_EVENTS.length]!.key,
    status: ok ? pick([200, 201, 202], i + 94) : pick([500, 502, 429, 408], i + 97),
    ok,
    latencyMs: Math.round(38 + rnd(i + 100) * 780),
    attempt: ok ? 1 : 1 + Math.floor(rnd(i + 103) * 4),
    timestamp: stamp(i + 106),
  };
});

export const WEBHOOK_TOTALS = {
  endpoints: WEBHOOK_ENDPOINTS.length,
  events: WEBHOOK_EVENTS.length,
  delivered24h: 8_724,
  failed24h: 186,
  successRate: 97.9,
  avgLatency: 186,
};

/* ------------------------------------------------------------------ earnings */

export const MONTHLY_FINANCE = [
  { month: "Feb", revenue: 1_284_000, paid: 812_000 },
  { month: "Mar", revenue: 1_486_000, paid: 964_000 },
  { month: "Apr", revenue: 1_712_000, paid: 1_118_000 },
  { month: "May", revenue: 1_938_000, paid: 1_284_000 },
  { month: "Jun", revenue: 2_246_000, paid: 1_492_000 },
  { month: "Jul", revenue: 2_584_000, paid: 1_726_000 },
  { month: "Aug", revenue: 2_912_000, paid: 1_948_000 },
  { month: "Sep", revenue: 3_180_500, paid: 2_064_300 },
];

export const REVENUE_BY_ADVERTISER = ADVERTISERS.slice(0, 8).map((advertiser, i) => ({
  advertiser,
  revenue: Math.round(680_000 + rnd(i + 121) * 2_400_000),
  conversions: Math.round(2_400 + rnd(i + 124) * 12_000),
  share: Math.round(6 + rnd(i + 127) * 16),
}));

export const PAID_BY_METHOD = [
  { method: "Bank Transfer (NEFT/IMPS)", amount: 8_142_200, share: 66 },
  { method: "UPI", amount: 2_684_600, share: 22 },
  { method: "USDT (TRC-20)", amount: 986_500, share: 8 },
  { method: "PayPal", amount: 595_000, share: 4 },
];

/* ------------------------------------------------------------------- payment */

export type PayoutRow = {
  id: string;
  publisher: string;
  publisherId: string;
  amount: number;
  method: string;
  requestedAt: string;
  paidAt?: string;
  status: "Pending" | "In Review" | "Approved" | "Paid" | "Failed";
  reference: string;
  period: string;
};

const METHODS = ["Bank Transfer", "UPI", "USDT (TRC-20)", "PayPal"] as const;

const makePayout = (i: number, status: PayoutRow["status"]): PayoutRow => ({
  id: `PO-${60_200 + i * 11}`,
  publisher: pick(PUBLISHER_NAMES, i + 131),
  publisherId: `PUB-${2400 + (i % 28) * 7}`,
  amount: Math.round(18_000 + rnd(i + 134) * 380_000),
  method: pick(METHODS, i + 137),
  requestedAt: dateOnly(i + 140),
  paidAt: status === "Paid" ? dateOnly(i + 143) : undefined,
  status,
  reference: `CRX${String(940_000 + i * 37)}`,
  period: i % 2 === 0 ? "01–15 Sep 2026" : "16–31 Aug 2026",
});

export const PENDING_PAYOUTS: PayoutRow[] = Array.from({ length: 16 }, (_, i) =>
  makePayout(i, i % 5 === 0 ? "In Review" : i % 7 === 3 ? "Approved" : "Pending"),
);

export const PAID_PAYOUTS: PayoutRow[] = Array.from({ length: 22 }, (_, i) =>
  makePayout(i + 40, "Paid"),
);

export const PAYMENT_HISTORY: PayoutRow[] = Array.from({ length: 28 }, (_, i) =>
  makePayout(i + 80, i % 11 === 6 ? "Failed" : i % 4 === 1 ? "Pending" : "Paid"),
).sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));

export const PAYMENT_TOTALS = {
  pendingAmount: PENDING_PAYOUTS.reduce((s, p) => s + p.amount, 0),
  pendingCount: PENDING_PAYOUTS.length,
  paidAmount: PAID_PAYOUTS.reduce((s, p) => s + p.amount, 0),
  paidCount: PAID_PAYOUTS.length,
  failedCount: PAYMENT_HISTORY.filter((p) => p.status === "Failed").length,
  avgTicket: 96_400,
};

/* ---------------------------------------------------------------- management */

export type MeetingRow = {
  id: string;
  name: string;
  email: string;
  company: string;
  date: string;
  time: string;
  timezone: string;
  topic: string;
  status: "Confirmed" | "Completed" | "Cancelled" | "Rescheduled";
};

export const MEETINGS: MeetingRow[] = Array.from({ length: 16 }, (_, i) => ({
  id: `CRX-MT-${String(4100 + i * 13)}`,
  name: pick(PUBLISHER_NAMES, i + 151),
  email: `${pick(PUBLISHER_NAMES, i + 151).split(" ")[0]!.toLowerCase()}@${pick(COMPANIES, i + 154).split(" ")[0]!.toLowerCase()}.com`,
  company: pick(COMPANIES, i + 154),
  date: dateOnly(i + 157),
  time: `${String(9 + (i % 8)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
  timezone: pick(["Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Europe/London"], i + 160),
  topic: pick(
    ["Publisher onboarding", "Advertiser demo", "Payout escalation", "Campaign scaling", "Compliance review"],
    i + 163,
  ),
  status:
    i % 9 === 7 ? "Cancelled" : i % 5 === 3 ? "Rescheduled" : i % 3 === 0 ? "Completed" : "Confirmed",
}));

export type EmailRow = {
  id: string;
  template: string;
  subject: string;
  recipient: string;
  audience: string;
  sentAt: string;
  status: "Delivered" | "Opened" | "Bounced" | "Queued";
  opens: number;
  clicks: number;
};

export const EMAIL_LOGS: EmailRow[] = Array.from({ length: 24 }, (_, i) => {
  const template = pick(
    [
      "Meeting Confirmation",
      "Publisher Approved",
      "Payout Processed",
      "Campaign Launch Alert",
      "Monthly Statement",
      "Password Reset",
    ],
    i + 171,
  );
  return {
    id: `EM-${77_400 + i * 9}`,
    template,
    subject: `${template} — CrosX`,
    recipient: `${pick(PUBLISHER_NAMES, i + 174).split(" ")[0]!.toLowerCase()}@${pick(COMPANIES, i + 177).split(" ")[0]!.toLowerCase()}.com`,
    audience: pick(["Publishers", "Advertisers", "Internal", "Leads"], i + 180),
    sentAt: stamp(i + 183),
    status: i % 11 === 8 ? "Bounced" : i % 7 === 5 ? "Queued" : i % 2 === 0 ? "Opened" : "Delivered",
    opens: Math.round(rnd(i + 186) * 4),
    clicks: Math.round(rnd(i + 189) * 2),
  };
});

export const EMAIL_TEMPLATES = [
  {
    key: "meeting-confirmation",
    name: "Meeting Confirmation",
    audience: "Leads",
    updated: "2026-09-04",
    sent30d: 186,
    openRate: 68.4,
  },
  {
    key: "publisher-approved",
    name: "Publisher Approved",
    audience: "Publishers",
    updated: "2026-08-28",
    sent30d: 74,
    openRate: 81.2,
  },
  {
    key: "payout-processed",
    name: "Payout Processed",
    audience: "Publishers",
    updated: "2026-08-19",
    sent30d: 212,
    openRate: 92.6,
  },
  {
    key: "campaign-launch",
    name: "Campaign Launch Alert",
    audience: "Publishers",
    updated: "2026-09-01",
    sent30d: 428,
    openRate: 57.9,
  },
  {
    key: "monthly-statement",
    name: "Monthly Statement",
    audience: "Publishers",
    updated: "2026-09-01",
    sent30d: 296,
    openRate: 74.1,
  },
];

export const EMAIL_TOTALS = {
  sent30d: 1_196,
  delivered: 1_164,
  openRate: 72.8,
  bounceRate: 2.7,
};

/* ------------------------------------------------------------------ activity */

export type AdminActivity = {
  id: string;
  kind: "publisher" | "campaign" | "payout" | "postback" | "meeting";
  title: string;
  meta: string;
  time: string;
};

export const RECENT_ACTIVITY: AdminActivity[] = [
  {
    id: "AC-1",
    kind: "publisher",
    title: "Ananya Sharma approved",
    meta: "KYC verified · Growth Partner tier",
    time: "6 min ago",
  },
  {
    id: "AC-2",
    kind: "payout",
    title: "Payout PO-60321 released",
    meta: "₹1,84,200 · Bank Transfer",
    time: "24 min ago",
  },
  {
    id: "AC-3",
    kind: "campaign",
    title: "Credit Card Approval cap raised",
    meta: "Daily cap 2,000 → 5,000",
    time: "1 hr ago",
  },
  {
    id: "AC-4",
    kind: "postback",
    title: "Postback failure spike",
    meta: "Groww Partner Bridge · 14 retries",
    time: "2 hrs ago",
  },
  {
    id: "AC-5",
    kind: "meeting",
    title: "Advertiser demo booked",
    meta: "CoinDCX · 08 Sep, 15:30 IST",
    time: "3 hrs ago",
  },
  {
    id: "AC-6",
    kind: "publisher",
    title: "Harsh Trivedi suspended",
    meta: "Traffic quality violation",
    time: "5 hrs ago",
  },
  {
    id: "AC-7",
    kind: "campaign",
    title: "US Stocks Account launched",
    meta: "Angel One · CPA ₹520",
    time: "8 hrs ago",
  },
];

export const ADMIN_NOTIFICATIONS = [
  {
    id: "AN-1",
    title: "12 campaign approval requests waiting",
    body: "Oldest request is 2 days old.",
    time: "12 min ago",
    read: false,
  },
  {
    id: "AN-2",
    title: "Webhook endpoint failing",
    body: "Groww Partner Bridge success rate at 71%.",
    time: "48 min ago",
    read: false,
  },
  {
    id: "AN-3",
    title: "₹21.8L pending payouts",
    body: "16 requests queued for the 15 Sep cycle.",
    time: "2 hrs ago",
    read: false,
  },
  {
    id: "AN-4",
    title: "New advertiser onboarded",
    body: "5paisa signed a CPL agreement.",
    time: "Yesterday",
    read: true,
  },
];

/* ------------------------------------------------------------------- profile */

export const ADMIN_PROFILE = {
  name: "Amal Pradhan",
  role: "Super Admin",
  email: "admin@crosx.in",
  phone: "+91 98765 43210",
  company: "CrosX Media Pvt Ltd",
  location: "Kolkata, India",
  timezone: "Asia/Kolkata (GMT+5:30)",
  joined: "12 Jan 2025",
  lastLogin: "2026-09-06 07:12 IST",
  twoFactor: true,
};

export const ADMIN_TEAM = [
  { name: "Amal Pradhan", role: "Super Admin", email: "admin@crosx.in", status: "Active" },
  { name: "Santanu Patra", role: "Operations Lead", email: "ops@crosx.in", status: "Active" },
  { name: "Ritika Shah", role: "Finance Manager", email: "finance@crosx.in", status: "Active" },
  { name: "Imran Qureshi", role: "Compliance", email: "compliance@crosx.in", status: "Invited" },
];

export const ADMIN_SETTINGS_GROUPS = [
  {
    title: "Platform",
    items: [
      { key: "auto-approve-publishers", label: "Auto-approve verified publishers", value: false },
      { key: "marketplace-open", label: "Campaign marketplace open to all tiers", value: true },
      { key: "maintenance", label: "Maintenance mode", value: false },
    ],
  },
  {
    title: "Payouts",
    items: [
      { key: "auto-payout", label: "Auto-release payouts on cycle date", value: true },
      { key: "manual-review", label: "Manual review above ₹2,00,000", value: true },
      { key: "hold-new", label: "Hold first payout for new publishers", value: true },
    ],
  },
  {
    title: "Notifications",
    items: [
      { key: "approval-alerts", label: "Email me on approval requests", value: true },
      { key: "failure-alerts", label: "Alert on postback / webhook failures", value: true },
      { key: "daily-digest", label: "Daily performance digest", value: false },
    ],
  },
];
