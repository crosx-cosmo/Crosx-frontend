import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { DocLayout, DocContact, type DocBlock } from "@/components/layout/DocSection";

const TITLE = "Payment Policy — CrosX";
const DESCRIPTION =
  "CrosX publisher payment terms: minimum payout, cycles, methods, verification, KYC, holds, processing times and policy updates.";

export const Route = createFileRoute("/payment-policy")({
  component: PaymentPolicyPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://crosx.in/payment-policy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://crosx.in/payment-policy" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: TITLE,
          description: DESCRIPTION,
          url: "https://crosx.in/payment-policy",
          isPartOf: { "@type": "WebSite", name: "CrosX", url: "https://crosx.in" },
        }),
      },
    ],
  }),
});

const BLOCKS: DocBlock[] = [
  {
    id: "overview",
    title: "Overview",
    body: [
      "This Payment Policy explains how CrosX calculates, verifies and sends payouts to approved publishers. By registering a publisher account and promoting campaigns, you agree to these terms.",
      "The policy works alongside our Terms of Service and Privacy Policy. If anything is unclear, contact us before running traffic.",
    ],
  },
  {
    id: "minimum-payout",
    title: "Minimum payout",
    body: [
      "Publisher accounts must reach a minimum payable balance before a payout is issued. This threshold helps us keep processing efficient and cost-effective for partners.",
    ],
    bullets: ["Minimum payout threshold: ₹500"],
  },
  {
    id: "payment-cycles",
    title: "Payment cycles",
    body: [
      "CrosX supports multiple payout cycles depending on the campaign, account standing and agreement with the publisher. Available cycles include:",
    ],
    bullets: ["Instant", "Daily", "Monthly", "Net 30", "Net 65"],
  },
  {
    id: "payment-methods",
    title: "Payment methods",
    body: [
      "Payouts are sent through the method registered and verified on the publisher account. Choose the method that works best for your location and banking setup.",
    ],
    bullets: ["Bank Transfer", "UPI", "PayPal"],
  },
  {
    id: "payment-verification",
    title: "Payment verification",
    body: [
      "Before a payout can be released, we verify the receiving account details to prevent failed transfers and fraud. You may be asked to submit one of the following:",
    ],
    bullets: ["Cancelled Cheque", "Passbook copy", "UPI details"],
  },
  {
    id: "kyc-requirements",
    title: "KYC requirements",
    body: [
      "Know Your Customer verification is required for all publisher accounts before the first payout. This helps us meet regulatory and compliance obligations.",
    ],
    bullets: ["Receiver Aadhaar", "Receiver PAN", "Receiver selfie"],
  },
  {
    id: "invalid-fraudulent-traffic",
    title: "Invalid or fraudulent traffic",
    body: [
      "CrosX monitors traffic quality continuously. Invalid, incentivised, bot-generated, self-converted or otherwise fraudulent traffic may be rejected.",
      "If invalid or fraudulent conversions are detected, related payouts may be withheld and the account may be suspended or terminated.",
    ],
  },
  {
    id: "reversal-chargeback",
    title: "Reversal & chargeback",
    body: [
      "Client-side reversals and chargebacks are rare, but they can happen in exceptional cases. When they do, affected or missing conversions may be adjusted in the following payout cycle.",
      "Publishers are notified of any significant adjustments through their dashboard and email.",
    ],
  },
  {
    id: "processing-time",
    title: "Processing time",
    body: [
      "Payout processing times depend on the selected payment method and campaign terms. Typical timelines are:",
    ],
    bullets: [
      "Instant payouts for eligible accounts and methods",
      "24–48 hours for standard bank/UPI transfers",
      "Weekly processing in some cases depending on method or campaign",
    ],
  },
  {
    id: "payment-hold",
    title: "Payment hold",
    body: [
      "Payments may be temporarily held for verification, dispute resolution, suspicious activity or compliance checks. Holds are applied to protect both CrosX and our advertisers.",
      "We aim to resolve holds quickly and communicate the reason and expected timeline through the publisher dashboard.",
    ],
  },
  {
    id: "taxes-fees",
    title: "Taxes & fees",
    body: [
      "Applicable taxes, platform fees or intermediary charges may vary depending on the campaign, client relationship, payment method and local regulations.",
      "Publishers are responsible for reporting and remitting any income tax or other obligations in their jurisdiction.",
    ],
  },
  {
    id: "account-closure",
    title: "Account closure",
    body: [
      "When a publisher account is closed, any eligible remaining balance will be transferred to the publisher’s registered bank account within 30–60 days after account closure, subject to verification and pending investigations.",
    ],
  },
  {
    id: "policy-changes",
    title: "Policy changes",
    body: [
      "CrosX may update this Payment Policy when required by business, legal or operational changes. We will provide reasonable notice of material changes through the dashboard or registered email.",
      "Continued use of the publisher platform after an update means you accept the revised policy.",
    ],
  },
  {
    id: "contact",
    title: "Contact information",
    body: [
      "For payout questions, verification status or payment disputes, email contact@crosx.in with your publisher ID and the relevant campaign details.",
    ],
  },
];

function PaymentPolicyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Payment Policy"
      intro="Clear payout terms for CrosX publishers — minimums, cycles, methods, verification, KYC and how we handle invalid traffic, holds and account closure."
      meta="Applies to CrosX publisher accounts and partner payouts"
    >
      <DocLayout
        blocks={BLOCKS}
        footer={
          <DocContact note="Questions about a payout, verification or account status? Reach out and our finance team will assist you." />
        }
      />
    </PageShell>
  );
}
