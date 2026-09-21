import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { DocLayout, DocContact, type DocBlock } from "@/components/layout/DocSection";

const TITLE = "Privacy Policy — CrosX";
const DESCRIPTION =
  "How CrosX collects, uses, stores and protects information across our website, enquiry and meeting forms, partner platform and marketing campaigns.";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://crosx.in/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://crosx.in/privacy" }],
  }),
});

const BLOCKS: DocBlock[] = [
  {
    id: "overview",
    title: "Overview",
    body: [
      "CrosX is an advertising and marketing agency. This policy explains what information we collect through our website, enquiry and meeting forms, partner registration and dashboards, and how we handle it.",
      "We aim to collect the minimum information needed to respond to you, deliver services and operate campaigns. If anything here is unclear, write to us and we will explain it in plain terms.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: [
      "Depending on how you interact with us, we may collect the following categories of information:",
    ],
    bullets: [
      "Identity and contact details: name, business email, phone number, company name",
      "Business details: website, company type, country, state, city, pincode, tax identifiers where you provide them",
      "Partner account data: traffic sources, account type, payout and invoice details you submit",
      "Enquiry and meeting details: purpose, meeting type, preferred date, time and timezone",
      "Technical data: IP address, device and browser type, approximate location, referring pages",
      "Usage data: pages viewed, clicks, session activity and interactions on our dashboards",
    ],
  },
  {
    id: "how-we-collect",
    title: "How we collect it",
    body: [
      "Information reaches us in three ways: you give it to us directly (forms, registration, email, calls), it is collected automatically as you use our website and dashboards, or it is shared with us by a client or advertising platform in the course of running a campaign.",
      "We do not knowingly collect information from children, and our services are intended for business use only.",
    ],
  },
  {
    id: "contact-and-meetings",
    title: "Contact and meeting enquiries",
    body: [
      "When you submit a contact enquiry or book a meeting, we use the details you provide to confirm the appointment, prepare for the conversation and follow up on it.",
      "Meeting confirmations, calendar files and follow-up emails are sent only to the address you supplied. We do not add enquiry contacts to unrelated marketing lists without a clear opt-in.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    body: [
      "We use cookies and local browser storage for essential functions such as keeping you signed in, remembering your theme preference and protecting forms against automated abuse.",
      "We may also use cookies and comparable identifiers to understand how the site is used and to measure the performance of our own marketing.",
      "You can block or delete cookies in your browser settings. Some parts of the site — particularly authenticated dashboards — may not work correctly if essential cookies or storage are disabled.",
    ],
  },
  {
    id: "analytics-tracking",
    title: "Analytics and tracking technologies",
    body: [
      "Our work involves measurement, so tracking technologies are part of the service we deliver. On our own website we use analytics to understand traffic and improve content.",
      "For client campaigns we may operate click tracking, conversion tracking, server-side event pipelines, postbacks and attribution logic. This can involve click identifiers, sub-parameters, device and geo signals, and timestamps.",
      "Where we handle campaign data on behalf of a client, the client determines the purpose of that processing and we act on their instructions under the terms of our engagement.",
    ],
  },
  {
    id: "campaign-data",
    title: "Campaign and marketing data",
    body: [
      "Campaign records may include impressions, clicks, leads, conversions, spend, payouts and the technical attributes attached to those events.",
      "Lead information generated through campaigns is passed to the relevant advertiser or client and is used for validation, fraud prevention, reporting and payout calculation.",
      "We do not sell personal information, and we do not use client campaign data to benefit an unrelated client.",
    ],
  },
  {
    id: "how-we-use-data",
    title: "How we use information",
    body: ["We use information for the following purposes:"],
    bullets: [
      "Responding to enquiries and scheduling meetings",
      "Creating and administering partner and dashboard accounts",
      "Delivering, optimising and reporting on advertising campaigns",
      "Validating leads, detecting fraud and preventing abuse",
      "Calculating payouts, invoices and account balances",
      "Improving our website, products and service quality",
      "Meeting legal, accounting and contractual obligations",
    ],
  },
  {
    id: "third-parties",
    title: "Third-party services",
    body: [
      "To operate we rely on third-party providers, which may include hosting and database infrastructure, authentication and email delivery, bot-protection services, advertising and analytics platforms, and payment or payout processors.",
      "These providers process information only as needed to deliver their function. Their own terms and privacy notices govern their handling of data, and we recommend reviewing them where relevant.",
      "We may also disclose information where required by law, to enforce our terms, or to protect our rights, users or systems.",
    ],
  },
  {
    id: "security",
    title: "Security",
    body: [
      "We use access controls, authenticated sessions, role-based permissions, encrypted transport and least-privilege access to protect the information we hold.",
      "No system is completely secure. We do not claim any specific certification or audit standard on this page; if you need details of our controls for a vendor review, contact us and we will share what applies to your engagement.",
    ],
  },
  {
    id: "retention",
    title: "Data retention",
    body: [
      "We keep information for as long as it is needed for the purpose it was collected, and then for any period required by contract, tax, accounting or legal obligations.",
      "Enquiry records, account data, campaign logs and financial records have different retention needs, so retention periods vary by category. When information is no longer needed, we delete or anonymise it.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights and choices",
    body: [
      "Subject to applicable law, you may ask us to access, correct, update or delete the personal information we hold about you, object to certain processing, or withdraw a consent you previously gave.",
      "You can also edit much of your own account information directly inside your CrosX dashboard, and unsubscribe from marketing emails using the link in those emails.",
      "Where we process data on behalf of a client, we will direct your request to that client where appropriate.",
    ],
  },
  {
    id: "international",
    title: "International transfers",
    body: [
      "Our providers and advertising platforms may process information in countries other than yours. Where that happens we take reasonable steps to ensure the information continues to be handled in line with this policy and the applicable terms.",
    ],
  },
  {
    id: "updates",
    title: "Updates to this policy",
    body: [
      "We may update this policy as our services, providers or legal obligations change. The version published on this page is the current one.",
      "Where a change materially affects how we handle your information, we will make reasonable efforts to notify you.",
    ],
  },
  {
    id: "contact",
    title: "Contact information",
    body: [
      "For any privacy question, access request or data concern, email contact@crosx.in. Please include enough detail for us to identify the relevant records so we can respond accurately.",
    ],
  },
];

function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="Transparency is part of how we work. This page explains what we collect, why we collect it, who we share it with and what you can ask us to do about it."
      meta="Applies to crosx.in, our partner dashboards and our marketing operations"
    >
      <DocLayout
        blocks={BLOCKS}
        footer={
          <DocContact note="Privacy questions, access requests and vendor reviews all go to the same inbox — a founder reads it." />
        }
      />
    </PageShell>
  );
}
