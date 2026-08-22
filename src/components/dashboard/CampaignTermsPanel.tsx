import { useState } from "react";
import { ArrowRight, FileText, Gavel, Shield, TriangleAlert } from "lucide-react";
import { ActionButton, Modal, Panel } from "@/components/dashboard/kit";
import { campaignTermsFor } from "@/lib/campaign-terms-data";
import type { Campaign } from "@/lib/publisher-data";

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
    accent === "danger"
      ? "text-red-500"
      : accent === "amber"
        ? "text-amber-500"
        : "text-brand";

  return (
    <section className="rounded-2xl border border-hairline bg-surface-2/30 p-4 sm:p-5">
      <h4 className={`mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] ${accentClass}`}>
        <Icon className="size-4" aria-hidden="true" />
        {title}
      </h4>
      <ul className="grid gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
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
  const terms = campaignTermsFor(campaign);

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
          {[
            { label: "KPI Rules", count: terms.kpiRules.length },
            { label: "Conversion Rules", count: terms.conversionRules.length },
            { label: "Traffic Guidelines", count: terms.trafficGuidelines.length },
            { label: "Prohibited Activities", count: terms.prohibitedActivities.length },
            { label: "Brand Guidelines", count: terms.brandGuidelines.length },
            { label: "Approval/Payment", count: terms.approvalPaymentRules.length },
          ].map((c) => (
            <div
              key={c.label}
              className="flex items-center justify-between rounded-2xl border border-hairline bg-surface-2/40 px-4 py-3"
            >
              <span className="text-[13px] font-semibold text-foreground">{c.label}</span>
              <span className="rounded-full bg-brand/12 px-2.5 py-1 text-[11px] font-bold text-brand">
                {c.count}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-hairline bg-brand/5 p-4">
          <p className="flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
            <span>
              <span className="font-semibold text-foreground">Publisher view-only:</span>{" "}
              these terms are set by the advertiser and cannot be edited. Violations may result in
              campaign suspension or account termination.
            </span>
          </p>
        </div>
      </Panel>

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
          <TermsSection
            icon={Gavel}
            title="KPI Rules"
            items={terms.kpiRules}
          />
          <TermsSection
            icon={FileText}
            title="Conversion Rules"
            items={terms.conversionRules}
          />
          <TermsSection
            icon={Shield}
            title="Traffic Guidelines"
            items={terms.trafficGuidelines}
          />
          <TermsSection
            icon={TriangleAlert}
            title="Prohibited Activities"
            items={terms.prohibitedActivities}
            accent="danger"
          />
          <TermsSection
            icon={FileText}
            title="Brand Guidelines"
            items={terms.brandGuidelines}
          />
          <TermsSection
            icon={Gavel}
            title="Approval / Payment Rules"
            items={terms.approvalPaymentRules}
          />
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
