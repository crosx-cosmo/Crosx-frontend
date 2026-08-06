import {
  BadgeIndianRupee,
  BarChart3,
  Braces,
  FileText,
  Gauge,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  MousePointerClick,
  Radio,
  ScrollText,
  Settings,
  ShieldCheck,
  Target,
  UserRound,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavLeaf = { label: string; to: string; icon: LucideIcon };
export type NavGroup = { label: string; icon: LucideIcon; children: NavLeaf[] };
export type NavItem = NavLeaf | NavGroup;

export const isGroup = (item: NavItem): item is NavGroup => "children" in item;

export const DASHBOARD_NAV: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  {
    label: "Campaign",
    icon: Target,
    children: [
      { label: "All Campaign", to: "/dashboard/campaigns/all", icon: ListChecks },
      { label: "Active Campaign", to: "/dashboard/campaigns/active", icon: Zap },
    ],
  },
  {
    label: "Report",
    icon: BarChart3,
    children: [
      { label: "Clicks", to: "/dashboard/reports/clicks", icon: MousePointerClick },
      { label: "Conversion", to: "/dashboard/reports/conversions", icon: Gauge },
      { label: "Leads", to: "/dashboard/reports/leads", icon: Users },
    ],
  },
  {
    label: "Postback",
    icon: Radio,
    children: [
      { label: "Global Postback", to: "/dashboard/postback/global", icon: Radio },
      { label: "Postback Logs", to: "/dashboard/postback/logs", icon: ScrollText },
      { label: "IP Whitelist", to: "/dashboard/postback/ip-whitelist", icon: ShieldCheck },
    ],
  },
  {
    label: "Payment",
    icon: Wallet,
    children: [
      { label: "Total Payout", to: "/dashboard/payment/total-payout", icon: BadgeIndianRupee },
      { label: "Pending Payout", to: "/dashboard/payment/pending-payout", icon: Wallet },
      { label: "Invoice", to: "/dashboard/payment/invoice", icon: FileText },
    ],
  },
  { label: "Profile", to: "/dashboard/profile", icon: UserRound },
  { label: "API", to: "/dashboard/api", icon: Braces },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

export const API_KEY_ICON = KeyRound;
