import { useState } from "react";
import { ArrowRight, ChevronRight, FileText, Gavel, Shield, TriangleAlert } from "lucide-react";
import { ActionButton, Modal, Panel } from "@/components/dashboard/kit";
import { campaignTermsFor, type CampaignTerms } from "@/lib/campaign-terms-data";
import type { Campaign } from "@/lib/publisher-data";

type SectionKey = keyof Omit<CampaignTerms, "lastUpdated">;

const SECTIONS: Array<{
  key: SectionKey;
  label: string;
  icon: React.ElementType;
  accent?: "brand" | "amber" | "danger";
  blurb: string;
}> = [
  {
    key: "kpiRules",
    label: "KPI Rules",
    icon: Gavel,
    blurb: "Performance benchmarks and the billable actions this campaign pays for.",
  },
  {
    key: "conversionRules",
    label: "Conversion Rules",
    icon: FileText,
    blurb: "How a conversion is counted, attributed and reversed.",
  },
  {
    key: "trafficGuidelines",
    label: "Traffic Guidelines",
    icon: Shield,
    blurb: "Allowed sources, geo and device requirements for your traffic.",
  },
  {
    key: "prohibitedActivities",
    label: "Prohibited Activities",
    icon: TriangleAlert,
    accent: "danger",
    blurb: "Activities that lead to rejected conversions or account action.",
  },
  {
    key: "brandGuidelines",
    label: "Brand Guidelines",
    icon: FileText,
    blurb: "Creative, messaging and disclosure rules set by the advertiser.",
  },
  {
    key: "approvalPaymentRules",
    label: "Approval/Payment",
    icon: Gavel,
    blurb: "Validation windows, payout cycles and dispute timelines.",
  },
];

function TermsSection({
  icon: Icon,
  title,
  items,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  items: string[];
  accent?: "brand" | "amber" | "danger";
}) {
  const accentClass =
    accent === "danger" ? "text-red-500" : accent === "amber" ? "text-amber-500" : "text-brand";

  return (
    <section className="rounded-2xl border border-hairline bg-surface-2/30 p-4 sm:p-5">
      <h4
        className={`mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] ${accentClass}`}
      >
        <Icon className="size-4" aria-hidden="true" />
        {title}
      </h4>
      <ul className="grid gap-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground"
          >
            <span className="mt-1.5 block h-1 w-1 rounded-full bg-brand" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CampaignTermsPanel({ campaign }: { campaign: Campaign }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<SectionKey | null>(null);
  const terms = campaignTermsFor(campaign);
  const active = SECTIONS.find((s) => s.key === section) ?? null;

  return (
    <>
      <Panel
        title="Terms & Conditions"
        description="KPI Rules, Conversion Rules, Traffic Guidelines, Prohibited Activities, Brand Guidelines, Approval/Payment Rules and campaign-specific notes."
        action={
          <ActionButton icon={ArrowRight} onClick={() => setOpen(true)} className="group">
            Read Full Terms
          </ActionButton>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSection(s.key)}
              aria-label={`Open ${s.label} details`}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-2/40 px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/45 hover:bg-brand/5 hover:shadow-[0_0_26px_-16px_var(--color-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft active:translate-y-0 active:scale-[0.99]"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <s.icon
                  className={`size-4 shrink-0 ${s.accent === "danger" ? "text-red-500" : "text-brand"}`}
                  aria-hidden="true"
                />
                <span className="truncate text-[13px] font-semibold text-foreground">
                  {s.label}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <span className="rounded-full bg-brand/12 px-2.5 py-1 text-[11px] font-bold text-brand">
                  {terms[s.key].length}
                </span>
                <ChevronRight
                  className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
                  aria-hidden="true"
                />
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-hairline bg-brand/5 p-4">
          <p className="flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
            <span>
              <span className="font-semibold text-foreground">Publisher view-only:</span> these
              terms are set by the advertiser and cannot be edited. Violations may result in
              campaign suspension or account termination.
            </span>
          </p>
        </div>
      </Panel>

      {/* Single-section detail view */}
      <Modal
        open={active !== null}
        onClose={() => setSection(null)}
        title={active ? active.label : ""}
        description={
          active
            ? `${campaign.name} — ${active.blurb} Last updated ${terms.lastUpdated}.`
            : undefined
        }
        footer={
          <ActionButton variant="solid" onClick={() => setSection(null)}>
            Close
          </ActionButton>
        }
      >
        {active ? (
          <TermsSection
            icon={active.icon}
            title={active.label}
            items={terms[active.key]}
            accent={active.accent}
          />
        ) : null}
      </Modal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Campaign Terms & Conditions"
        description={`${campaign.name} — last updated ${terms.lastUpdated}`}
        footer={
          <ActionButton variant="solid" icon={FileText} onClick={() => setOpen(false)}>
            I Understand
          </ActionButton>
        }
      >
        <div className="grid gap-4">
          {SECTIONS.map((s) => (
            <TermsSection
              key={s.key}
              icon={s.icon}
              title={s.label}
              items={terms[s.key]}
              accent={s.accent}
            />
          ))}
          <TermsSection
            icon={TriangleAlert}
            title="Campaign-Specific Important Notes"
            items={terms.importantNotes}
            accent="amber"
          />

          <div className="rounded-2xl border border-hairline bg-surface-2/40 p-4 text-center">
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              By running traffic to this campaign, you agree to comply with all the terms above.
              Contact your CrosX account manager if anything is unclear.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
