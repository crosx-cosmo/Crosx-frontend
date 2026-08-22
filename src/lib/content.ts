import {
  Target,
  Share2,
  Users,
  TrendingUp,
  Megaphone,
  Layers,
  ShoppingBag,
  Workflow,
  MousePointerClick,
  PenTool,
  Smartphone,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export const BRAND = {
  name: "CrosX",
  tagline: "Advertising & Marketing Agency",
  email: "contact@crosx.in",
  founder: "Amal Pradhan",
  coFounder: "Santanu Patra",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Industries", href: "#industries" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Clients", href: "#clients" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const CLIENT_LOGOS = [
  { name: "Bajaj Broking", domain: "bajajbroking.in" },
  { name: "Tide", domain: "tide.co" },
  { name: "Aditya Birla Capital Money", domain: "adityabirlacapital.com" },
  { name: "Paytm Money", domain: "paytmmoney.com" },
  { name: "Indiabulls Securities", domain: "indiabullsventures.com" },
  { name: "SMC Global", domain: "smcindiaonline.com" },
  { name: "Licious", domain: "licious.in" },
] as const;

export interface Metric {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const METRICS: Metric[] = [
  { label: "Clients Served", value: 240, suffix: "+" },
  { label: "Campaigns Launched", value: 3800, suffix: "+" },
  { label: "Revenue Generated", value: 1.4, prefix: "$", suffix: "B", decimals: 1 },
  { label: "Monthly Clicks", value: 92, suffix: "M" },
  { label: "Avg. Conversion Rate", value: 8.6, suffix: "%", decimals: 1 },
  { label: "Countries", value: 18 },
  { label: "Years Experience", value: 11 },
];

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
  span?: "wide" | "tall" | "default";
}

export const SERVICES: Service[] = [
  {
    title: "Performance Marketing",
    description:
      "Full-funnel paid acquisition across Meta, Google, and programmatic — engineered around CAC, ROAS and incremental revenue.",
    icon: Target,
    span: "wide",
  },
  {
    title: "Affiliate Marketing",
    description:
      "Curated publisher networks with fraud-controlled payouts and cohort-level tracking.",
    icon: Share2,
  },
  {
    title: "Lead Generation",
    description:
      "Qualified pipeline at predictable cost, validated in real time before it reaches your CRM.",
    icon: Users,
  },
  {
    title: "Brand Growth",
    description: "Positioning, share-of-voice and always-on brand demand modelling.",
    icon: TrendingUp,
  },
  {
    title: "Influencer Marketing",
    description: "Vetted creators, contracted deliverables, measured lift — not vanity reach.",
    icon: Megaphone,
  },
  {
    title: "Campaign Management",
    description:
      "Dedicated pods running daily optimisation cycles across every channel you operate.",
    icon: Layers,
  },
  {
    title: "Media Buying",
    description: "Enterprise buying power with transparent margins and audited spend.",
    icon: ShoppingBag,
  },
  {
    title: "Marketing Automation",
    description: "Lifecycle journeys, triggers and CRM orchestration wired to revenue events.",
    icon: Workflow,
  },
  {
    title: "Conversion Optimization",
    description: "Continuous experimentation on landing, checkout and onboarding surfaces.",
    icon: MousePointerClick,
  },
  {
    title: "Creative Strategy",
    description: "Performance creative systems: hooks, iterations and asset velocity at scale.",
    icon: PenTool,
  },
  {
    title: "App Promotion",
    description: "Install-to-retention growth with SKAdNetwork and MMP-grade attribution.",
    icon: Smartphone,
  },
  {
    title: "Analytics",
    description: "Warehouse-native dashboards with a single source of truth for every stakeholder.",
    icon: BarChart3,
    span: "wide",
  },
];

export const COMPARISON = {
  rows: [
    "Return on ad spend",
    "Real-time analytics",
    "Data-driven decisioning",
    "Dedicated account manager",
    "Daily campaign optimization",
    "Transparent reporting",
    "Enterprise-grade security",
  ],
  traditional: [
    "Estimated monthly",
    "Weekly spreadsheets",
    "Gut-feel creative calls",
    "Shared junior resource",
    "Monthly review cycles",
    "Opaque agency margin",
    "Ad-hoc access control",
  ],
  crosx: [
    "3.4x median, tracked live",
    "Live executive dashboards",
    "Model-assisted budget shifts",
    "Named senior strategist",
    "Daily optimisation cadence",
    "Full spend transparency",
    "SSO, RBAC & audit logs",
  ],
} as const;

export interface Feature {
  title: string;
  description: string;
  points: string[];
}

export const FEATURES: Feature[] = [
  {
    title: "Growth Strategy & Marketing Intelligence",
    description:
      "We start with a commercial model, not a media plan. Every channel is mapped to a revenue outcome before a rupee is spent.",
    points: [
      "Market & competitor intelligence",
      "Channel mix modelling",
      "Budget scenario planning",
      "Quarterly growth roadmaps",
    ],
  },
  {
    title: "Customer Acquisition & Retention",
    description:
      "Acquisition without retention is churn with a marketing budget. We engineer both sides of the lifecycle in one system.",
    points: [
      "Cohort-level CAC control",
      "Lifecycle & CRM journeys",
      "Win-back and reactivation",
      "LTV:CAC governance",
    ],
  },
  {
    title: "AI Optimization, Tracking & Attribution",
    description:
      "Server-side tracking, clean identity resolution and model-assisted bidding keep decisions accurate in a privacy-first world.",
    points: [
      "Server-side event pipelines",
      "Multi-touch attribution",
      "Incrementality testing",
      "Anomaly & fraud detection",
    ],
  },
  {
    title: "Automation, Dashboards & Reporting",
    description:
      "One executive dashboard your board can trust — refreshed continuously, exportable, and reconciled with finance.",
    points: [
      "Warehouse-native reporting",
      "Automated alerting",
      "Board-ready exports",
      "Finance-reconciled spend",
    ],
  },
];

export const PROCESS = [
  {
    step: "01",
    title: "Discovery",
    copy: "Commercial audit, data access, and a baseline of what actually drives revenue today.",
  },
  {
    step: "02",
    title: "Planning",
    copy: "Channel mix, budget scenarios and forecast targets agreed with your leadership.",
  },
  {
    step: "03",
    title: "Strategy",
    copy: "Creative territories, audience architecture and measurement framework locked.",
  },
  {
    step: "04",
    title: "Execution",
    copy: "Campaigns launched in structured waves with clean tracking from day one.",
  },
  {
    step: "05",
    title: "Optimization",
    copy: "Daily bid, budget and creative iteration against live performance signals.",
  },
  {
    step: "06",
    title: "Scaling",
    copy: "Proven pockets scaled across geographies, channels and new product lines.",
  },
];

export interface CaseStudy {
  client: string;
  industry: string;
  objective: string;
  strategy: string;
  revenue: string;
  growth: string;
  conversion: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    client: "Broking Platform",
    industry: "Financial Services",
    objective: "Lower cost per funded account across tier-2 and tier-3 India.",
    strategy:
      "Rebuilt the acquisition funnel with server-side tracking, regional creative systems and intent-led media buying.",
    revenue: "$42M attributed",
    growth: "+218% growth",
    conversion: "+64% conversion",
  },
  {
    client: "Neobank",
    industry: "Fintech",
    objective: "Scale qualified SME sign-ups without inflating acquisition cost.",
    strategy:
      "Cohort-based bidding, lifecycle automation and an incrementality testing programme across paid social.",
    revenue: "$27M attributed",
    growth: "+164% growth",
    conversion: "+48% conversion",
  },
  {
    client: "D2C Food Brand",
    industry: "Commerce",
    objective: "Improve contribution margin while growing monthly orders.",
    strategy:
      "Creative velocity programme with 40+ monthly variants, plus retention journeys tied to reorder windows.",
    revenue: "$19M attributed",
    growth: "+132% growth",
    conversion: "+39% conversion",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "CrosX rebuilt our measurement stack in six weeks. For the first time our board and our media team are reading the same numbers.",
    name: "Rohit Menon",
    role: "VP Growth, Financial Services",
    initials: "RM",
  },
  {
    quote:
      "The optimisation cadence is genuinely daily. We saw cost per funded account drop 41% in a single quarter without cutting volume.",
    name: "Ananya Shah",
    role: "Head of Performance, Fintech",
    initials: "AS",
  },
  {
    quote:
      "They operate like an in-house team with agency scale. Transparent spend, senior strategists, zero theatre.",
    name: "Dev Kapoor",
    role: "CMO, D2C Commerce",
    initials: "DK",
  },
  {
    quote:
      "Creative output tripled and quality went up. Our best performing hook this year came out of their testing programme.",
    name: "Meera Iyer",
    role: "Brand Director, Retail",
    initials: "MI",
  },
];

export const AWARDS = [
  {
    title: "Enterprise Standards",
    copy: "SOC-aligned processes, SSO and role-based access across every workspace.",
  },
  {
    title: "Trusted Partner",
    copy: "Official partner status across major ad platforms and measurement vendors.",
  },
  {
    title: "Certified Experts",
    copy: "Every strategist certified across search, social and analytics stacks.",
  },
  { title: "High Satisfaction", copy: "96% client retention rate across enterprise engagements." },
  {
    title: "Premium Support",
    copy: "Named strategist, shared channel and a four-hour response SLA.",
  },
];

export const INDUSTRIES = [
  "Financial Services",
  "Fintech & Neobanking",
  "Insurance",
  "D2C & Commerce",
  "SaaS & B2B",
  "Healthcare",
  "Real Estate",
  "Travel & Mobility",
  "Education",
  "Gaming & Apps",
];

export const FAQS = [
  {
    q: "What size of businesses does CrosX work with?",
    a: "We work with funded scale-ups and enterprise brands typically spending between $50K and $5M per month on marketing. Engagements start with a commercial audit so both sides know the numbers before we commit.",
  },
  {
    q: "How quickly can we see results?",
    a: "Tracking and measurement are live within the first two weeks. Most clients see meaningful movement in cost per acquisition between week four and week eight, once the first optimisation cycles compound.",
  },
  {
    q: "Do you provide transparent reporting on ad spend?",
    a: "Yes. You keep ownership of every ad account, and our dashboards reconcile media spend with your finance data. There is no hidden margin between your budget and the platforms.",
  },
  {
    q: "Who will actually work on our account?",
    a: "A named senior strategist leads the engagement, supported by a dedicated pod covering media, creative and analytics. You meet the exact people before signing.",
  },
  {
    q: "How do you handle data security?",
    a: "Access is granted through SSO with role-based permissions and full audit logging. We follow least-privilege access and sign enterprise DPAs as standard.",
  },
  {
    q: "Can you work alongside our in-house marketing team?",
    a: "Frequently. Many engagements are hybrid — we own measurement and paid performance while your in-house team owns brand and content, operating from one shared roadmap.",
  },
];
