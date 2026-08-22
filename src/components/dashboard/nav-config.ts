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

export type NavLeaf = { label: string; to: string; icon: LucideIcon; badge?: string | number };
export type NavGroup = { label: string; icon: LucideIcon; children: NavLeaf[] };
export type NavItem = NavLeaf | NavGroup;

export const isGroup = (item: NavItem): item is NavGroup => "children" in item;

export const DASHBOARD_NAV: NavItem[] = [
  { label: "Dashboard", to: "/publisher/dashboard", icon: LayoutDashboard },
  {
    label: "Campaign",
    icon: Target,
    children: [
      {
        label: "All Campaign",
        to: "/publisher/dashboard/campaigns/all",
        icon: ListChecks,
        badge: 48,
      },
      {
        label: "Active Campaign",
        to: "/publisher/dashboard/campaigns/active",
        icon: Zap,
        badge: 21,
      },
    ],
  },
  {
    label: "Report",
    icon: BarChart3,
    children: [
      { label: "Clicks", to: "/publisher/dashboard/reports/clicks", icon: MousePointerClick },
      { label: "Conversion", to: "/publisher/dashboard/reports/conversions", icon: Gauge },
      { label: "Leads", to: "/publisher/dashboard/reports/leads", icon: Users },
    ],
  },
  {
    label: "Postback",
    icon: Radio,
    children: [
      { label: "Global Postback", to: "/publisher/dashboard/postback/global", icon: Radio },
      {
        label: "Postback Logs",
        to: "/publisher/dashboard/postback/logs",
        icon: ScrollText,
        badge: 3,
      },
      { label: "IP Whitelist", to: "/publisher/dashboard/postback/ip-whitelist", icon: ShieldCheck },
    ],
  },
  {
    label: "Payment",
    icon: Wallet,
    children: [
      {
        label: "Total Payout",
        to: "/publisher/dashboard/payment/total-payout",
        icon: BadgeIndianRupee,
      },
      { label: "Pending Payout", to: "/publisher/dashboard/payment/pending-payout", icon: Wallet },
      { label: "Invoice", to: "/publisher/dashboard/payment/invoice", icon: FileText },
    ],
  },
  { label: "Profile", to: "/publisher/dashboard/profile", icon: UserRound },
  { label: "API", to: "/publisher/dashboard/api", icon: Braces },
  { label: "Settings", to: "/publisher/dashboard/settings", icon: Settings },
];

export const API_KEY_ICON = KeyRound;
