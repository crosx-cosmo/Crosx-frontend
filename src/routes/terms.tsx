import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { DocLayout, DocContact, type DocBlock } from "@/components/layout/DocSection";

const TITLE = "Terms of Service — CrosX";
const DESCRIPTION =
  "The terms that govern use of the CrosX website, enquiries and meetings, partner dashboards and our advertising and marketing services.";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://crosx.in/terms" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://crosx.in/terms" }],
  }),
});

const BLOCKS: DocBlock[] = [
  {
    id: "acceptance",
    title: "Acceptance of these terms",
    body: [
      "These terms govern your use of the CrosX website, our enquiry and meeting forms, and our partner registration and dashboard experiences. By using them you agree to these terms.",
      "Where we sign a separate agreement, proposal, insertion order or statement of work with you, that document takes precedence over these terms for the services it covers.",
    ],
  },
  {
    id: "website-use",
    title: "Website usage",
    body: [
      "You may use this website for lawful business purposes only. You agree not to attempt to disrupt the site, bypass authentication, scrape at scale, probe for vulnerabilities or misuse any form or endpoint.",
      "We may change, suspend or withdraw parts of the site at any time, including pages, features and content, without prior notice.",
    ],
  },
  {
    id: "enquiries-meetings",
    title: "Enquiries and meetings",
    body: [
      "Information you submit through an enquiry or meeting request should be accurate and yours to share. Meeting slots are offered subject to availability and are confirmed by the details we send you.",
      "A booked meeting is a business conversation only. It does not create an engagement, a commercial commitment or a guarantee of service until a separate agreement is in place.",
      "Either side may reschedule or cancel a meeting; we ask for reasonable notice by email.",
    ],
  },
  {
    id: "accounts",
    title: "Accounts and partner access",
    body: [
      "Some areas — including publisher and partner dashboards — require an account and email verification. You are responsible for the accuracy of your registration details and for keeping your credentials secure.",
      "You must not share access, create accounts on behalf of another party without authority, or submit false business, traffic or payout information.",
      "We may suspend or close an account where we identify fraud, policy breach, invalid traffic or misrepresented information.",
    ],
  },
  {
    id: "services",
    title: "Advertising and marketing services",
    body: [
      "Our services may include strategy, media buying, performance marketing, lead generation, creative, tracking and analytics, as set out in the applicable agreement.",
      "Scope, deliverables, cadence, fees and reporting are defined per engagement. Anything not stated in that agreement is out of scope until agreed in writing.",
      "Marketing outcomes depend on factors outside our control — market conditions, platform policies, product, pricing, sales follow-up and creative approvals. We commit to method, effort and transparency, not to guaranteed results, unless a specific target is expressly agreed in writing.",
    ],
  },
  {
    id: "client-responsibilities",
    title: "Campaign information and client responsibilities",
    body: [
      "You are responsible for the accuracy and legality of the material and claims you ask us to promote, and for holding the necessary rights, licences, approvals and regulatory permissions.",
      "Where we need access to ad accounts, analytics, websites, tags or CRM systems, you agree to provide it promptly. Delays or missing access may affect timelines and performance.",
      "Tracking accuracy depends on the implementation staying intact. If tags, postbacks or site structure change without notice, reported figures may be affected.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: [
      "The CrosX name, logo, website design, copy, dashboards, tooling and underlying methods are our intellectual property and may not be copied, reproduced or reused without written permission.",
      "You retain ownership of your brand assets, content and data. Deliverables created specifically for you transfer or license to you as set out in your agreement, once fees for them are paid.",
      "We may reference the fact of a working relationship and non-confidential, non-sensitive results in our portfolio only where you have agreed to it.",
    ],
  },
  {
    id: "third-party-platforms",
    title: "Third-party platforms",
    body: [
      "Campaigns run on third-party platforms and rely on third-party tools for hosting, tracking, verification and reporting. Those platforms set their own policies, pricing, review processes and reporting methods.",
      "We are not responsible for platform outages, account restrictions, policy decisions, algorithm changes or discrepancies between platform reports, and we cannot guarantee reinstatement of a restricted account.",
    ],
  },
  {
    id: "payments",
    title: "Fees, payments and payouts",
    body: [
      "Where fees apply, they are set out in your agreement or proposal, together with the billing cycle and payment terms. Media budgets are separate from service fees unless stated otherwise.",
      "Invoices are payable within the agreed terms. Late or unpaid amounts may lead to paused work or suspended access, and taxes and platform charges apply where relevant.",
      "For partners, payouts are calculated from approved and validated activity, subject to the stated minimum threshold, verification checks and any applicable clawback for invalid, duplicated or fraudulent events.",
    ],
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    body: [
      "Each side may receive commercially sensitive information — strategy, pricing, performance data, roadmaps and account details. That information stays confidential and is used only for the engagement.",
      "This obligation continues after the engagement ends, and does not apply to information that is public, independently developed or required to be disclosed by law.",
    ],
  },
  {
    id: "limitations",
    title: "Limitations of liability",
    body: [
      "The website and its content are provided as is. To the extent permitted by law, we exclude liability for indirect, incidental or consequential loss, including lost profits, lost revenue or lost data.",
      "Where liability cannot be excluded, our total liability for a claim is limited to the fees paid to us for the services giving rise to that claim in the preceding period defined in your agreement.",
      "Nothing in these terms limits liability where it cannot lawfully be limited.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    body: [
      "Either party may end an engagement in line with the notice provisions of the applicable agreement. Fees and media costs incurred up to the effective date remain payable.",
      "We may restrict or terminate website or dashboard access immediately where these terms are breached, where activity appears fraudulent, or where continued access presents a security or legal risk.",
      "On termination we will cooperate on a reasonable handover of accounts and assets that belong to you.",
    ],
  },
  {
    id: "updates",
    title: "Changes to these terms",
    body: [
      "We may update these terms as our services and obligations evolve. The version published on this page is the current one, and continued use after an update means you accept it.",
    ],
  },
  {
    id: "contact",
    title: "Contact information",
    body: [
      "For questions about these terms, contracts, invoices or account access, email contact@crosx.in and our team will respond.",
    ],
  },
];

function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      intro="Clear, business-friendly terms for working with CrosX — covering the website, enquiries and meetings, partner accounts, campaign delivery and commercial obligations on both sides."
      meta="Applies to crosx.in, our partner dashboards and our service engagements"
    >
      <DocLayout
        blocks={BLOCKS}
        footer={
          <DocContact note="Need a signed agreement, DPA or vendor paperwork before you start? Ask us and we will get it moving." />
        }
      />
    </PageShell>
  );
}
