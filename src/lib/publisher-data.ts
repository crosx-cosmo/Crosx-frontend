/**
 * Centralised frontend-only demo dataset for the CrosX Publisher Console.
 * Every dashboard surface reads from here so numbers stay internally consistent.
 * No backend, no persistence — mock data only.
 */

export type CampaignCategory = "Trading" | "Investment" | "Finance" | "Insurance" | "Crypto";

export type Campaign = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: CampaignCategory;
  payout: number;
  epc: number;
  cr: number;
  geo: string;
  devices: string;
  status: "Active" | "Paused";
  approvalRate: number;
  avgConversionDays: number;
  description: string;
  allowed: string[];
  disallowed: string[];
  /** live performance for campaigns the publisher already promotes */
  clicks: number;
  conversions: number;
  revenue: number;
  share: number;
  joined: boolean;
  landingPages: string[];
  linkCode: string;
};

const BASE_ALLOWED = ["Search", "Social", "Display", "Native"];
const BASE_DISALLOWED = ["Incentivized", "Spam", "Misleading claims"];

export const CAMPAIGNS: Campaign[] = [
  {
    id: "CMP-1001",
    slug: "indiabulls-trading",
    name: "Indiabulls Trading",
    tagline: "Trading & Demat Account",
    category: "Trading",
    payout: 120,
    epc: 18.42,
    cr: 3.89,
    geo: "India",
    devices: "Mobile + Desktop",
    status: "Active",
    approvalRate: 91.4,
    avgConversionDays: 1.8,
    description:
      "Promote Indiabulls trading and demat account offers to eligible Indian users. Payout confirms after KYC completion and first login.",
    allowed: BASE_ALLOWED,
    disallowed: BASE_DISALLOWED,
    clicks: 52840,
    conversions: 2184,
    revenue: 58320,
    share: 42,
    joined: true,
    landingPages: ["Trading Account", "Demat Account", "Mobile App Install"],
    linkCode: "ib123",
  },
  {
    id: "CMP-1002",
    slug: "zerodha",
    name: "Zerodha",
    tagline: "Discount Broking Account",
    category: "Trading",
    payout: 150,
    epc: 21.84,
    cr: 3.49,
    geo: "India",
    devices: "Mobile + Desktop",
    status: "Active",
    approvalRate: 89.2,
    avgConversionDays: 2.1,
    description:
      "Drive high-intent Indian investors to open a Zerodha broking account. Conversions validate on completed account activation.",
    allowed: BASE_ALLOWED,
    disallowed: BASE_DISALLOWED,
    clicks: 38210,
    conversions: 1642,
    revenue: 46800,
    share: 26,
    joined: true,
    landingPages: ["Open Account", "Kite App Install"],
    linkCode: "zr456",
  },
  {
    id: "CMP-1003",
    slug: "groww",
    name: "Groww",
    tagline: "Investment & Mutual Funds",
    category: "Investment",
    payout: 180,
    epc: 19.72,
    cr: 3.24,
    geo: "India",
    devices: "Mobile first",
    status: "Active",
    approvalRate: 87.6,
    avgConversionDays: 2.4,
    description:
      "Acquire new Groww investors for mutual funds and stocks. Best performance from finance content and creator traffic.",
    allowed: BASE_ALLOWED,
    disallowed: BASE_DISALLOWED,
    clicks: 31490,
    conversions: 1284,
    revenue: 30150,
    share: 18,
    joined: true,
    landingPages: ["Investment Account", "Mutual Funds", "App Install"],
    linkCode: "gw789",
  },
  {
    id: "CMP-1004",
    slug: "alice-blue",
    name: "Alice Blue",
    tagline: "Low Brokerage Trading",
    category: "Trading",
    payout: 100,
    epc: 16.91,
    cr: 3.36,
    geo: "India",
    devices: "Mobile + Desktop",
    status: "Active",
    approvalRate: 88.1,
    avgConversionDays: 1.6,
    description:
      "Alice Blue rewards publishers for verified demat sign-ups from Indian traffic with fast approval cycles.",
    allowed: BASE_ALLOWED,
    disallowed: BASE_DISALLOWED,
    clicks: 24620,
    conversions: 982,
    revenue: 16400,
    share: 14,
    joined: true,
    landingPages: ["Trading Account", "Brokerage Calculator"],
    linkCode: "ab321",
  },
  {
    id: "CMP-1005",
    slug: "angel-one",
    name: "Angel One",
    tagline: "Full Service Broking",
    category: "Trading",
    payout: 130,
    epc: 17.8,
    cr: 3.12,
    geo: "India",
    devices: "Mobile + Desktop",
    status: "Active",
    approvalRate: 90.2,
    avgConversionDays: 1.9,
    description:
      "Angel One pays for verified demat accounts with completed KYC. Strong converter for search and comparison traffic.",
    allowed: BASE_ALLOWED,
    disallowed: BASE_DISALLOWED,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    share: 0,
    joined: false,
    landingPages: ["Open Demat", "App Install"],
    linkCode: "ao654",
  },
  {
    id: "CMP-1006",
    slug: "upstox",
    name: "Upstox",
    tagline: "Trading & Investing App",
    category: "Trading",
    payout: 140,
    epc: 20.14,
    cr: 3.41,
    geo: "India",
    devices: "Mobile first",
    status: "Active",
    approvalRate: 92.0,
    avgConversionDays: 1.7,
    description:
      "Upstox converts best on mobile app installs followed by KYC completion within 48 hours.",
    allowed: BASE_ALLOWED,
    disallowed: BASE_DISALLOWED,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    share: 0,
    joined: false,
    landingPages: ["App Install", "Open Account"],
    linkCode: "up987",
  },
  {
    id: "CMP-1007",
    slug: "5paisa",
    name: "5Paisa",
    tagline: "Flat Fee Broking",
    category: "Trading",
    payout: 110,
    epc: 15.92,
    cr: 2.98,
    geo: "India",
    devices: "Mobile + Desktop",
    status: "Active",
    approvalRate: 86.4,
    avgConversionDays: 2.2,
    description:
      "Flat-fee broking offer with steady approval rates across tier-2 and tier-3 Indian geographies.",
    allowed: BASE_ALLOWED,
    disallowed: BASE_DISALLOWED,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    share: 0,
    joined: false,
    landingPages: ["Open Account", "Pricing Page"],
    linkCode: "fp135",
  },
  {
    id: "CMP-1008",
    slug: "motilal-oswal",
    name: "Motilal Oswal",
    tagline: "Wealth & Advisory",
    category: "Finance",
    payout: 160,
    epc: 17.34,
    cr: 2.76,
    geo: "India",
    devices: "Desktop first",
    status: "Active",
    approvalRate: 84.9,
    avgConversionDays: 2.8,
    description:
      "Premium wealth advisory offer — highest payout for qualified high-net-worth Indian leads.",
    allowed: BASE_ALLOWED,
    disallowed: BASE_DISALLOWED,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    share: 0,
    joined: false,
    landingPages: ["Advisory Signup", "Research Reports"],
    linkCode: "mo246",
  },
];

export const CATEGORIES = ["All", "Finance", "Trading", "Insurance", "Crypto"] as const;

export const TOTAL_CAMPAIGNS_AVAILABLE = 48;

/** Weekly performance series (Aug 2 – Aug 8, 2026). */
export type SeriesPoint = {
  day: string;
  date: string;
  clicks: number;
  conversions: number;
  earnings: number;
};

export const WEEK_SERIES: SeriesPoint[] = [
  { day: "Mon", date: "Aug 2", clicks: 24820, conversions: 912, earnings: 14820 },
  { day: "Tue", date: "Aug 3", clicks: 27410, conversions: 1048, earnings: 16240 },
  { day: "Wed", date: "Aug 4", clicks: 29840, conversions: 1214, earnings: 18920 },
  { day: "Thu", date: "Aug 5", clicks: 28190, conversions: 1180, earnings: 17640 },
  { day: "Fri", date: "Aug 6", clicks: 27630, conversions: 1092, earnings: 16820 },
  { day: "Sat", date: "Aug 7", clicks: 25330, conversions: 1006, earnings: 15240 },
  { day: "Sun", date: "Aug 8", clicks: 21700, conversions: 960, earnings: 15170 },
];

export const TODAY_SERIES: SeriesPoint[] = [
  { day: "00:00", date: "Aug 8", clicks: 1420, conversions: 52, earnings: 820 },
  { day: "04:00", date: "Aug 8", clicks: 2180, conversions: 84, earnings: 1240 },
  { day: "08:00", date: "Aug 8", clicks: 4260, conversions: 186, earnings: 2940 },
  { day: "12:00", date: "Aug 8", clicks: 5320, conversions: 242, earnings: 3820 },
  { day: "16:00", date: "Aug 8", clicks: 4840, conversions: 208, earnings: 3410 },
  { day: "20:00", date: "Aug 8", clicks: 3680, conversions: 188, earnings: 2940 },
];

export const MONTH_SERIES: SeriesPoint[] = Array.from({ length: 8 }, (_, i) => {
  const base = WEEK_SERIES[i % WEEK_SERIES.length]!;
  const factor = 3.4 + Math.sin(i / 1.6) * 0.5;
  return {
    day: `W${Math.floor(i / 2) + 1}${i % 2 ? "b" : "a"}`,
    date: `Aug ${i * 4 + 1}`,
    clicks: Math.round(base.clicks * factor * 0.28),
    conversions: Math.round(base.conversions * factor * 0.3),
    earnings: Math.round(base.earnings * factor * 0.29),
  };
});

export const LAST_MONTH_SERIES: SeriesPoint[] = MONTH_SERIES.map((p, i) => ({
  ...p,
  date: `Jul ${i * 4 + 1}`,
  clicks: Math.round(p.clicks * 0.88),
  conversions: Math.round(p.conversions * 0.9),
  earnings: Math.round(p.earnings * 0.87),
}));

export type RangeKey = "today" | "7d" | "month" | "last-month";

export const RANGE_OPTIONS: { key: RangeKey; label: string; caption: string }[] = [
  { key: "today", label: "Today", caption: "Aug 8, 2026" },
  { key: "7d", label: "Last 7 Days", caption: "Aug 2 – Aug 8, 2026" },
  { key: "month", label: "This Month", caption: "Aug 1 – Aug 8, 2026" },
  { key: "last-month", label: "Last Month", caption: "Jul 1 – Jul 31, 2026" },
];

export function seriesFor(range: RangeKey): SeriesPoint[] {
  switch (range) {
    case "today":
      return TODAY_SERIES;
    case "month":
      return MONTH_SERIES;
    case "last-month":
      return LAST_MONTH_SERIES;
    default:
      return WEEK_SERIES;
  }
}

/** Account level totals used by KPI cards. */
export const ACCOUNT_TOTALS = {
  totalCampaigns: 48,
  activeCampaigns: 21,
  monthlyClicks: 184920,
  weeklyClicks: 26412,
  conversions: 7412,
  weeklyConversions: 1024,
  earnings: 124850,
  weeklyEarnings: 18640,
  pendingPayout: 32400,
  paidPayout: 92450,
  lastMonthEarnings: 108420,
  nextPayoutDate: "Aug 15, 2026",
  uniqueClicks: 142810,
  mobileShare: 72,
  desktopShare: 28,
};

export type Activity = {
  id: string;
  type: "conversion" | "click" | "payout" | "join";
  title: string;
  campaign: string;
  meta: string;
  time: string;
};

export const RECENT_ACTIVITY: Activity[] = [
  {
    id: "ACT-1",
    type: "conversion",
    title: "Conversion approved",
    campaign: "Indiabulls Trading",
    meta: "₹120 earned",
    time: "2 minutes ago",
  },
  {
    id: "ACT-2",
    type: "click",
    title: "New click received",
    campaign: "Zerodha",
    meta: "Mobile • India",
    time: "5 minutes ago",
  },
  {
    id: "ACT-3",
    type: "payout",
    title: "Payout processed",
    campaign: "Invoice #INV-001",
    meta: "₹42,300",
    time: "1 hour ago",
  },
  {
    id: "ACT-4",
    type: "join",
    title: "Campaign joined",
    campaign: "Groww",
    meta: "Today, 9:42 AM",
    time: "Today, 9:42 AM",
  },
];

/** Sub-ID slots (x1–x10) carried on every click and conversion record. */
export type SubIds = Partial<Record<"x1" | "x2" | "x3" | "x4" | "x5" | "x6" | "x7" | "x8" | "x9" | "x10", string>>;

export type ClickRecord = {
  id: string;
  time: string;
  timestamp: string;
  date: string;
  campaign: string;
  offerId: string;
  device: "Mobile" | "Desktop";
  os: string;
  browser: string;
  geo: string;
  ip: string;
  sub1: string;
} & SubIds;

const CLICK_SEED = [
  {
    campaign: "Indiabulls Trading",
    offerId: "OF-4021",
    device: "Mobile",
    sub1: "instagram",
    os: "Android 14",
    browser: "Chrome 126",
    ipPrefix: "49.36",
  },
  {
    campaign: "Zerodha",
    offerId: "OF-3312",
    device: "Mobile",
    sub1: "youtube",
    os: "iOS 17.5",
    browser: "Safari 17",
    ipPrefix: "103.21",
  },
  {
    campaign: "Groww",
    offerId: "OF-2874",
    device: "Desktop",
    sub1: "telegram",
    os: "Windows 11",
    browser: "Edge 126",
    ipPrefix: "182.71",
  },
  {
    campaign: "Alice Blue",
    offerId: "OF-5190",
    device: "Mobile",
    sub1: "instagram",
    os: "Android 13",
    browser: "Chrome 125",
    ipPrefix: "117.20",
  },
] as const;

const CREATIVES = ["banner_320x50", "story_reel", "native_feed", "text_link"] as const;
const PLACEMENTS = ["feed", "bio_link", "broadcast", "sidebar"] as const;

function subIdsFor(i: number, seed: (typeof CLICK_SEED)[number]): SubIds {
  return {
    x1: seed.sub1,
    x2: `camp_${seed.offerId.toLowerCase()}`,
    x3: CREATIVES[i % CREATIVES.length]!,
    x4: PLACEMENTS[i % PLACEMENTS.length]!,
    x5: `adset_${100 + (i % 12)}`,
    x6: i % 2 === 0 ? "in" : "in-mh",
    x7: i % 3 === 0 ? "ret" : "cold",
    x8: `sess_${(90210 + i).toString(36)}`,
    x9: i % 4 === 0 ? "utm_paid" : "utm_organic",
    x10: i % 5 === 0 ? "v2" : undefined,
  };
}

export const CLICK_RECORDS: ClickRecord[] = Array.from({ length: 48 }, (_, i) => {
  const seed = CLICK_SEED[i % CLICK_SEED.length]!;
  const minute = 42 - i;
  const hour = 10 + Math.floor(minute / 60);
  const mm = ((minute % 60) + 60) % 60;
  const time = `${String(hour).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  const date = i < 16 ? "Aug 08, 2026" : i < 32 ? "Aug 07, 2026" : "Aug 06, 2026";
  return {
    id: `CLK-${88291 - i}`,
    time,
    date,
    timestamp: `${date} ${time}:${String((i * 7) % 60).padStart(2, "0")}`,
    campaign: seed.campaign,
    offerId: seed.offerId,
    device: seed.device,
    os: seed.os,
    browser: seed.browser,
    geo: "India",
    ip: `${seed.ipPrefix}.${12 + (i % 200)}.${(i * 13) % 250}`,
    sub1: seed.sub1,
    ...subIdsFor(i, seed),
  };
});

export type ConversionRecord = {
  id: string;
  clickId: string;
  campaign: string;
  offerId: string;
  event: string;
  payout: number;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
  time: string;
  timestamp: string;
  device: "Mobile" | "Desktop";
  os: string;
  browser: string;
  geo: string;
  ip: string;
  sub1: string;
} & SubIds;

const CONV_STATUS: ConversionRecord["status"][] = [
  "Approved",
  "Approved",
  "Pending",
  "Rejected",
  "Approved",
  "Approved",
];

const CONV_EVENTS = ["Signup", "KYC Complete", "First Trade", "Account Funded"] as const;

export const CONVERSION_RECORDS: ConversionRecord[] = Array.from({ length: 42 }, (_, i) => {
  const campaign = CAMPAIGNS[i % 4]!;
  const click = CLICK_RECORDS[i % CLICK_RECORDS.length]!;
  const date = i < 12 ? "Aug 08, 2026" : i < 26 ? "Aug 07, 2026" : "Aug 06, 2026";
  const time = `${String(9 + (i % 10)).padStart(2, "0")}:${String((i * 11) % 60).padStart(2, "0")}`;
  return {
    id: `CV-${10291 - i}`,
    clickId: click.id,
    campaign: campaign.name,
    offerId: click.offerId,
    event: CONV_EVENTS[i % CONV_EVENTS.length]!,
    payout: campaign.payout,
    status: CONV_STATUS[i % CONV_STATUS.length]!,
    date,
    time,
    timestamp: `${date} ${time}:${String((i * 5) % 60).padStart(2, "0")}`,
    device: click.device,
    os: click.os,
    browser: click.browser,
    geo: click.geo,
    ip: click.ip,
    sub1: click.sub1,
    x1: click.x1,
    x2: click.x2,
    x3: click.x3,
    x4: click.x4,
    x5: click.x5,
    x6: click.x6,
    x7: click.x7,
    x8: click.x8,
    x9: click.x9,
    x10: click.x10,
  };
});

export const CONVERSION_TOTALS = {
  total: 7412,
  approved: 6482,
  pending: 612,
  rejected: 318,
};

export type LeadRecord = {
  id: string;
  campaign: string;
  payout: number;
  status: "Qualified" | "Pending" | "Rejected";
  date: string;
};

const LEAD_STATUS: LeadRecord["status"][] = [
  "Qualified",
  "Pending",
  "Qualified",
  "Rejected",
  "Qualified",
];

export const LEAD_RECORDS: LeadRecord[] = Array.from({ length: 36 }, (_, i) => {
  const campaign = CAMPAIGNS[i % 4]!;
  return {
    id: `LD-${82921 - i}`,
    campaign: campaign.name,
    payout: campaign.payout,
    status: LEAD_STATUS[i % LEAD_STATUS.length]!,
    date: i < 10 ? "Aug 08" : i < 24 ? "Aug 07" : "Aug 06",
  };
});

export const LEAD_TOTALS = { total: 1284, qualified: 982, pending: 182, rejected: 120 };

export type PostbackLog = {
  id: string;
  requestId: string;
  time: string;
  campaign: string;
  event: "conversion" | "approved" | "rejected" | "reversal";
  status: number;
  ok: boolean;
  response: string;
};

const LOG_SEED: Array<Omit<PostbackLog, "id" | "time">> = [
  {
    requestId: "PB-829105",
    campaign: "Groww",
    event: "conversion",
    status: 200,
    ok: true,
    response: "OK",
  },
  {
    requestId: "PB-829104",
    campaign: "Zerodha",
    event: "conversion",
    status: 200,
    ok: true,
    response: "OK",
  },
  {
    requestId: "PB-829102",
    campaign: "Groww",
    event: "conversion",
    status: 500,
    ok: false,
    response: "Internal Server Error",
  },
  {
    requestId: "PB-829101",
    campaign: "Indiabulls Trading",
    event: "approved",
    status: 200,
    ok: true,
    response: "OK",
  },
  {
    requestId: "PB-829100",
    campaign: "Alice Blue",
    event: "rejected",
    status: 200,
    ok: true,
    response: "OK",
  },
  {
    requestId: "PB-829099",
    campaign: "Zerodha",
    event: "conversion",
    status: 504,
    ok: false,
    response: "Gateway Timeout",
  },
  {
    requestId: "PB-829098",
    campaign: "Indiabulls Trading",
    event: "reversal",
    status: 200,
    ok: true,
    response: "OK",
  },
  {
    requestId: "PB-829097",
    campaign: "Groww",
    event: "conversion",
    status: 500,
    ok: false,
    response: "Internal Server Error",
  },
];

export const POSTBACK_LOGS: PostbackLog[] = Array.from({ length: 24 }, (_, i) => {
  const seed = LOG_SEED[i % LOG_SEED.length]!;
  const sec = 12 - i * 3;
  const minute = 42 - Math.floor(i * 1.4);
  return {
    ...seed,
    id: `LOG-${i}`,
    requestId: `PB-${829105 - i}`,
    time: `10:${String(((minute % 60) + 60) % 60).padStart(2, "0")}:${String(((sec % 60) + 60) % 60).padStart(2, "0")}`,
  };
});

export const POSTBACK_TOTALS = {
  total: 12842,
  success: 12391,
  failed: 451,
  successRate: 96.5,
};

export const POSTBACK_URL =
  "https://crosx.in/api/postback?click_id={click_id}&status={status}&payout={payout}";

export const POSTBACK_MACROS = [
  { macro: "{click_id}", desc: "Unique CrosX click identifier" },
  { macro: "{campaign_id}", desc: "Campaign the conversion belongs to" },
  { macro: "{publisher_id}", desc: "Your publisher ID" },
  { macro: "{payout}", desc: "Payout amount for the conversion" },
  { macro: "{conversion_id}", desc: "Unique conversion identifier" },
  { macro: "{sub1}", desc: "Custom tracking parameter 1" },
  { macro: "{sub2}", desc: "Custom tracking parameter 2" },
];

export const POSTBACK_EVENTS = ["Conversion", "Approved", "Rejected", "Reversal"];

export type WhitelistIp = { id: string; ip: string; label: string; active: boolean };

export const INITIAL_IPS: WhitelistIp[] = [
  { id: "IP-1", ip: "18.235.105.199", label: "Amazon AWS", active: true },
  { id: "IP-2", ip: "103.21.244.18", label: "Office Network", active: true },
];

export const MONTHLY_EARNINGS = [
  { month: "Mar", earnings: 74200 },
  { month: "Apr", earnings: 81600 },
  { month: "May", earnings: 96400 },
  { month: "Jun", earnings: 92180 },
  { month: "Jul", earnings: 108420 },
  { month: "Aug", earnings: 124850 },
];

export const PENDING_BREAKDOWN = [
  { campaign: "Indiabulls Trading", amount: 12400 },
  { campaign: "Zerodha", amount: 11800 },
  { campaign: "Groww", amount: 8200 },
];

export type Invoice = {
  id: string;
  period: string;
  amount: number;
  status: "Pending" | "Paid";
};

export const INVOICES: Invoice[] = [
  { id: "INV-002", period: "August 2026", amount: 32400, status: "Pending" },
  { id: "INV-001", period: "July 2026", amount: 42300, status: "Paid" },
  { id: "INV-000", period: "June 2026", amount: 31750, status: "Paid" },
];

export type PublisherProfile = {
  fullName: string;
  publisherId: string;
  email: string;
  phone: string;
  country: string;
  website: string;
  trafficSources: string[];
  joined: string;
};

export const INITIAL_PROFILE: PublisherProfile = {
  fullName: "Aman Kumar",
  publisherId: "PUB-10291",
  email: "aman@example.com",
  phone: "+91 98XXXXXX21",
  country: "India",
  website: "amanfinance.in",
  trafficSources: ["Instagram", "YouTube", "Telegram"],
  joined: "June 14, 2026",
};

export const API_KEYS = {
  publicKey: "pk_live_9f2b41c7ad5e8291",
  secretKey: "sk_live_5c81ba0e7d43f6920af1",
  requestsToday: 2842,
  rateLimit: 8000,
};

export const API_DOCS = [
  { title: "Campaign API", desc: "Get available campaigns", path: "GET /v1/campaigns" },
  { title: "Conversion API", desc: "Track conversions", path: "POST /v1/conversions" },
  { title: "Stats API", desc: "Fetch publisher statistics", path: "GET /v1/stats" },
];

export type Notification = {
  id: string;
  title: string;
  time: string;
  read: boolean;
  kind: "payout" | "campaign" | "conversion" | "api";
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "N-1",
    title: "Your ₹42,300 payout has been processed.",
    time: "1 hour ago",
    read: false,
    kind: "payout",
  },
  {
    id: "N-2",
    title: "New campaign available: Upstox.",
    time: "3 hours ago",
    read: false,
    kind: "campaign",
  },
  {
    id: "N-3",
    title: "24 conversions were approved.",
    time: "Yesterday",
    read: false,
    kind: "conversion",
  },
  {
    id: "N-4",
    title: "Your API usage reached 35%.",
    time: "Yesterday",
    read: true,
    kind: "api",
  },
];

export const NOTIFICATION_SETTINGS = [
  { key: "campaignUpdates", label: "Campaign Updates" },
  { key: "conversionApproved", label: "Conversion Approved" },
  { key: "paymentUpdates", label: "Payment Updates" },
  { key: "newCampaigns", label: "New Campaigns" },
  { key: "weeklyReport", label: "Weekly Performance Report" },
] as const;

export const inr = (value: number) =>
  `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const num = (value: number) => value.toLocaleString("en-US");
