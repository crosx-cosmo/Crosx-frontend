import {
  BarChart3,
  Braces,
  CheckCheck,
  CircleDollarSign,
  Coins,
  FileClock,
  FilePlus2,
  Gauge,
  Globe,
  LayoutDashboard,
  ListChecks,
  Mail,
  MousePointerClick,
  PauseCircle,
  Radio,
  ScrollText,
  Send,
  Settings,
  ShieldAlert,
  Target,
  TrendingUp,
  UserCheck,
  UserRound,
  Users,
  Wallet,
  Webhook,
  Zap,
  CalendarClock,
  Banknote,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavLeaf = { label: string; to: string; icon: LucideIcon; badge?: string | number };
export type NavGroup = { label: string; icon: LucideIcon; children: NavLeaf[] };
export type NavItem = NavLeaf | NavGroup;

export const isGroup = (item: NavItem): item is NavGroup => "children" in item;

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  {
    label: "Campaign",
    icon: Target,
    children: [
      { label: "Create Campaign", to: "/admin/dashboard/campaigns/create", icon: FilePlus2 },
      { label: "All Campaigns", to: "/admin/dashboard/campaigns/all", icon: ListChecks, badge: 126 },
      {
        label: "Approval Requests",
        to: "/admin/dashboard/campaigns/approvals",
        icon: CheckCheck,
        badge: 12,
      },
    ],
  },
  {
    label: "Publisher",
    icon: Users,
    children: [
      { label: "All Publishers", to: "/admin/dashboard/publishers/all", icon: Users, badge: 428 },
      { label: "Active Publishers", to: "/admin/dashboard/publishers/active", icon: UserCheck },
      {
        label: "Pending Publishers",
        to: "/admin/dashboard/publishers/pending",
        icon: FileClock,
        badge: 74,
      },
      {
        label: "Suspended Publishers",
        to: "/admin/dashboard/publishers/suspended",
        icon: ShieldAlert,
      },
    ],
  },
  {
    label: "Report",
    icon: BarChart3,
    children: [
      { label: "Clicks", to: "/admin/dashboard/reports/clicks", icon: MousePointerClick },
      { label: "Conversions", to: "/admin/dashboard/reports/conversions", icon: Gauge },
      { label: "Leads", to: "/admin/dashboard/reports/leads", icon: Users },
    ],
  },
  {
    label: "Postback",
    icon: Radio,
    children: [
      { label: "Global Postback", to: "/admin/dashboard/postback/global", icon: Globe },
      { label: "API", to: "/admin/dashboard/postback/api", icon: Braces },
      { label: "Postback Logs", to: "/admin/dashboard/postback/logs", icon: ScrollText, badge: 7 },
      { label: "Test Postback", to: "/admin/dashboard/postback/test", icon: Send },
    ],
  },
  {
    label: "Webhook",
    icon: Webhook,
    children: [
      { label: "Endpoints", to: "/admin/dashboard/webhook/endpoints", icon: Globe },
      { label: "Events", to: "/admin/dashboard/webhook/events", icon: Zap },
      { label: "Delivery Logs", to: "/admin/dashboard/webhook/logs", icon: ScrollText },
    ],
  },
  {
    label: "Earning",
    icon: TrendingUp,
    children: [
      { label: "Total Revenue", to: "/admin/dashboard/earning/revenue", icon: CircleDollarSign },
      { label: "Total Paid", to: "/admin/dashboard/earning/paid", icon: Banknote },
      { label: "Total Earning", to: "/admin/dashboard/earning/net", icon: Coins },
    ],
  },
  {
    label: "Payment",
    icon: Wallet,
    children: [
      { label: "Pending Payout", to: "/admin/dashboard/payment/pending", icon: PauseCircle, badge: 16 },
      { label: "Paid", to: "/admin/dashboard/payment/paid", icon: Banknote },
      { label: "Payment History", to: "/admin/dashboard/payment/history", icon: FileClock },
    ],
  },
  {
    label: "Management",
    icon: CalendarClock,
    children: [
      { label: "Meetings", to: "/admin/dashboard/management/meetings", icon: CalendarClock },
      { label: "Email", to: "/admin/dashboard/management/email", icon: Mail },
    ],
  },
  { label: "Profile", to: "/admin/dashboard/profile", icon: UserRound },
  { label: "Settings", to: "/admin/dashboard/settings", icon: Settings },
];
