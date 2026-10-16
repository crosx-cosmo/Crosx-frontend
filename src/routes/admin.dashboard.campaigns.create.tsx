import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeIndianRupee,
  CheckCircle2,
  Plus,
  Rocket,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ListEditor, TagsField, Toggle } from "@/components/admin/CampaignFormKit";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  Panel,
  Segmented,
  Select,
  StatusBadge,
  TextField,
} from "@/components/dashboard/kit";
import {
  DEMO_DRAFT,
  DEVICE_OPTIONS,
  newDraftEvent,
  TRACKING_TYPES,
  type CampaignDraft,
  type DraftEvent,
} from "@/lib/admin-campaign-draft";
import { CATEGORIES, GEOS, MODELS } from "@/lib/admin-data";
import type { CampaignCategory } from "@/lib/publisher-data";

export const Route = createFileRoute("/admin/dashboard/campaigns/create")({
  component: Page,
  head: () =>
    dashboardHead(
      "Create Campaign — CrosX Admin",
      "Configure every publisher-facing campaign detail: payouts, events, caps, targeting, rules and tracking.",
    ),
});

const STEPS = [
  { key: "basics" as const, label: "Basics" },
  { key: "payout" as const, label: "Payout" },
  { key: "targeting" as const, label: "Targeting" },
  { key: "tracking" as const, label: "Tracking" },
];

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
    {children}
  </span>
);

function Page() {
  const [step, setStep] = useState<(typeof STEPS)[number]["key"]>("basics");
  const [form, setForm] = useState<CampaignDraft>(DEMO_DRAFT);

  const set = (patch: Partial<CampaignDraft>) => setForm((p) => ({ ...p, ...patch }));
  const setEvent = (id: string, patch: Partial<DraftEvent>) =>
    setForm((p) => ({
      ...p,
      events: p.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));

  const margin =
    form.revenue && form.payout && Number(form.revenue) > 0
      ? `${Math.max(0, Math.round(((Number(form.revenue) - Number(form.payout)) / Number(form.revenue)) * 100))}%`
      : "—";

  const liveEvents = form.events.filter((e) => e.enabled);

  return (
    <>
      <PageHeader
        eyebrow="Campaign"
        title="Create Campaign"
        description="Every field here maps 1:1 to what publishers see in the Campaign Marketplace — offer details, events, rules and tracking."
        action={
          <>
            <ActionButton icon={Save} onClick={() => toast.success("Draft saved (demo)")}>
              Save Draft
            </ActionButton>
            <ActionButton
              variant="solid"
              icon={Rocket}
              onClick={() => toast.success("Campaign published to marketplace (demo)")}
            >
              Publish Campaign
            </ActionButton>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="grid gap-5">
          <Panel
            title="Campaign Setup"
            description="Configure the offer across four steps. Nothing is hidden from publishers except internal revenue."
            action={<Segmented options={STEPS} value={step} onChange={setStep} />}
          >
            {step === "basics" && (
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Campaign Name"
                    placeholder="Angel One Demat Account"
                    value={form.name}
                    onChange={(e) => set({ name: e.target.value })}
                  />
                  <TextField
                    label="Advertiser / Client Name"
                    placeholder="Enter advertiser name"
                    value={form.advertiser}
                    onChange={(e) => set({ advertiser: e.target.value })}
                  />
                  <TextField
                    label="Tagline"
                    placeholder="Trading & Demat Account Opening"
                    value={form.tagline}
                    onChange={(e) => set({ tagline: e.target.value })}
                  />
                  <TextField
                    label="Offer ID"
                    placeholder="CMP-1042"
                    value={form.offerId}
                    onChange={(e) => set({ offerId: e.target.value })}
                  />
                  <label className="grid gap-1.5">
                    <FieldLabel>Category</FieldLabel>
                    <Select
                      value={form.category}
                      onChange={(e) => set({ category: e.target.value as CampaignCategory })}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="grid gap-1.5">
                    <FieldLabel>Campaign Status</FieldLabel>
                    <Select
                      value={form.status}
                      onChange={(e) => set({ status: e.target.value as "Active" | "Paused" })}
                    >
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                    </Select>
                  </label>
                  <div className="sm:col-span-2">
                    <TextField
                      label="Campaign Logo URL"
                      placeholder="https://.../logo.png"
                      value={form.logoUrl}
                      onChange={(e) => set({ logoUrl: e.target.value })}
                    />
                  </div>
                  <label className="grid gap-1.5 sm:col-span-2">
                    <FieldLabel>KPI</FieldLabel>
                    <textarea
                      rows={2}
                      value={form.kpi}
                      onChange={(e) => set({ kpi: e.target.value })}
                      placeholder="Verified account activation with completed KYC"
                      className="w-full rounded-xl border border-input bg-surface-2/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
                    />
                  </label>
                  <label className="grid gap-1.5 sm:col-span-2">
                    <FieldLabel>Campaign Description</FieldLabel>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => set({ description: e.target.value })}
                      className="w-full rounded-xl border border-input bg-surface-2/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
                    />
                  </label>
                </div>
              </div>
            )}

            {step === "payout" && (
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <FieldLabel>Payout Model</FieldLabel>
                    <Select value={form.model} onChange={(e) => set({ model: e.target.value })}>
                      {MODELS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <TextField
                    label="Revenue per Conversion (₹)"
                    inputMode="numeric"
                    value={form.revenue}
                    onChange={(e) => set({ revenue: e.target.value })}
                  />
                  <TextField
                    label="Publisher Payout (₹)"
                    inputMode="numeric"
                    value={form.payout}
                    onChange={(e) => set({ payout: e.target.value })}
                  />
                  <TextField
                    label="Expected EPC (₹)"
                    inputMode="decimal"
                    value={form.epc}
                    onChange={(e) => set({ epc: e.target.value })}
                  />
                  <TextField
                    label="Daily Conversion Cap"
                    inputMode="numeric"
                    value={form.dailyCap}
                    onChange={(e) => set({ dailyCap: e.target.value })}
                  />
                  <TextField
                    label="Monthly Conversion Cap"
                    inputMode="numeric"
                    value={form.monthlyCap}
                    onChange={(e) => set({ monthlyCap: e.target.value })}
                  />
                  <TextField
                    label="Expected Approval Rate (%)"
                    inputMode="decimal"
                    value={form.approvalRate}
                    onChange={(e) => set({ approvalRate: e.target.value })}
                  />
                  <TextField
                    label="Avg Days to Confirm"
                    inputMode="decimal"
                    value={form.conversionDays}
                    onChange={(e) => set({ conversionDays: e.target.value })}
                  />
                  <div className="rounded-xl border border-hairline bg-surface-2/35 p-3.5 sm:col-span-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Platform margin
                    </p>
                    <p className="mt-1 font-display text-xl font-black text-brand">{margin}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Calculated live from revenue and publisher payout. Internal only — never shown
                      to publishers.
                    </p>
                  </div>
                </div>

                <section className="rounded-2xl border border-hairline bg-surface-2/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-[0.14em] text-brand">
                        Conversion Events
                      </h4>
                      <p className="mt-1 text-[12px] text-muted-foreground">
                        Each enabled event appears on the publisher campaign page with its payout and
                        postback controls.
                      </p>
                    </div>
                    <ActionButton
                      icon={Plus}
                      onClick={() => set({ events: [...form.events, newDraftEvent()] })}
                      className="h-8 px-2.5 text-[12px]"
                    >
                      Add Event
                    </ActionButton>
                  </div>

                  <ul className="mt-3 grid gap-3">
                    {form.events.map((ev, i) => (
                      <li
                        key={ev.id}
                        className="rounded-2xl border border-hairline bg-surface/60 p-4 transition-[border-color] duration-300 hover:border-brand/40"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-display text-sm font-bold tracking-tight">
                            Event {i + 1}
                            {ev.name ? ` — ${ev.name}` : ""}
                          </p>
                          <div className="flex items-center gap-2">
                            <StatusBadge tone={ev.enabled ? "success" : "warn"} dot>
                              {ev.enabled ? "Enabled" : "Disabled"}
                            </StatusBadge>
                            <button
                              type="button"
                              onClick={() =>
                                set({ events: form.events.filter((e) => e.id !== ev.id) })
                              }
                              aria-label={`Remove event ${i + 1}`}
                              className="grid size-9 place-items-center rounded-xl border border-hairline bg-surface-2/50 text-muted-foreground transition-colors duration-300 hover:border-red-500/50 hover:text-red-500"
                            >
                              <Trash2 className="size-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <TextField
                            label="Event Name"
                            placeholder="KYC Completed"
                            value={ev.name}
                            onChange={(e) => setEvent(ev.id, { name: e.target.value })}
                          />
                          <TextField
                            label="Event Slug"
                            placeholder="kyc_completed"
                            value={ev.slug}
                            onChange={(e) => setEvent(ev.id, { slug: e.target.value })}
                          />
                          <TextField
                            label="Advertiser Event"
                            placeholder="kyc_approved"
                            value={ev.advertiserEvent}
                            onChange={(e) => setEvent(ev.id, { advertiserEvent: e.target.value })}
                          />
                          <TextField
                            label="Event Payout (₹)"
                            inputMode="numeric"
                            value={ev.payout}
                            onChange={(e) => setEvent(ev.id, { payout: e.target.value })}
                          />
                          <TextField
                            label="Event Cap / Limit"
                            inputMode="numeric"
                            placeholder="Optional"
                            value={ev.cap}
                            onChange={(e) => setEvent(ev.id, { cap: e.target.value })}
                          />
                          <label className="grid gap-1.5">
                            <FieldLabel>Event Description</FieldLabel>
                            <input
                              value={ev.description}
                              onChange={(e) => setEvent(ev.id, { description: e.target.value })}
                              placeholder="What the user must complete"
                              className="h-11 w-full rounded-xl border border-input bg-surface-2/50 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
                            />
                          </label>
                        </div>

                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          <Toggle
                            label="Payable Event"
                            checked={ev.payable}
                            onChange={(v) => setEvent(ev.id, { payable: v })}
                          />
                          <Toggle
                            label="Event Alert"
                            checked={ev.alert}
                            onChange={(v) => setEvent(ev.id, { alert: v })}
                          />
                          <Toggle
                            label="Enabled"
                            checked={ev.enabled}
                            onChange={(v) => setEvent(ev.id, { enabled: v })}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}

            {step === "targeting" && (
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <FieldLabel>Primary Geo</FieldLabel>
                    <Select value={form.geo} onChange={(e) => set({ geo: e.target.value })}>
                      {GEOS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="grid gap-1.5">
                    <FieldLabel>Devices</FieldLabel>
                    <Select value={form.devices} onChange={(e) => set({ devices: e.target.value })}>
                      {DEVICE_OPTIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <TagsField
                    label="Allowed Traffic Sources"
                    values={form.allowed}
                    onChange={(allowed) => set({ allowed })}
                    placeholder="Search, Social, Display, Native"
                  />
                  <TagsField
                    label="Disallowed Traffic Sources"
                    values={form.disallowed}
                    onChange={(disallowed) => set({ disallowed })}
                    placeholder="Incentivized, Spam"
                  />
                </div>

                <ListEditor
                  label="KPI Rules"
                  hint="Performance benchmarks and billable actions."
                  items={form.kpiRules}
                  onChange={(kpiRules) => set({ kpiRules })}
                />
                <ListEditor
                  label="Traffic Rules"
                  hint="Compliance rules for publisher traffic."
                  items={form.trafficRules}
                  onChange={(trafficRules) => set({ trafficRules })}
                />
                <ListEditor
                  label="Conversion Rules"
                  hint="How a conversion is counted, attributed and reversed."
                  items={form.conversionRules}
                  onChange={(conversionRules) => set({ conversionRules })}
                />
                <ListEditor
                  label="Publisher Requirements"
                  hint="Who is eligible to run this campaign."
                  items={form.publisherRequirements}
                  onChange={(publisherRequirements) => set({ publisherRequirements })}
                />
                <ListEditor
                  label="KYC Requirements"
                  hint="Documents required before payouts release."
                  items={form.kycRequirements}
                  onChange={(kycRequirements) => set({ kycRequirements })}
                />
                <ListEditor
                  label="Brand Guidelines"
                  hint="Creative, messaging and disclosure rules."
                  items={form.brandGuidelines}
                  onChange={(brandGuidelines) => set({ brandGuidelines })}
                />
                <ListEditor
                  label="Terms & Conditions"
                  hint="Approval, payment and dispute terms shown before joining."
                  items={form.terms}
                  onChange={(terms) => set({ terms })}
                />
              </div>
            )}

            {step === "tracking" && (
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <FieldLabel>Tracking Type</FieldLabel>
                    <Select
                      value={form.trackingType}
                      onChange={(e) => set({ trackingType: e.target.value })}
                    >
                      {TRACKING_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <TextField
                    label="Advertiser Postback URL"
                    placeholder="https://advertiser.com/postback?cid={click_id}"
                    value={form.postbackUrl}
                    onChange={(e) => set({ postbackUrl: e.target.value })}
                  />
                  <div className="sm:col-span-2">
                    <TextField
                      label="Tracking URL"
                      value={form.trackingUrl}
                      onChange={(e) => set({ trackingUrl: e.target.value })}
                    />
                  </div>
                  <TagsField
                    label="Tracking Parameters"
                    values={form.trackingParams}
                    onChange={(trackingParams) => set({ trackingParams })}
                  />
                  <TagsField
                    label="Supported Parameters"
                    values={form.supportedParams}
                    onChange={(supportedParams) => set({ supportedParams })}
                  />
                </div>

                <ListEditor
                  label="Landing Pages"
                  hint="Shown on the publisher campaign page."
                  items={form.landingPages}
                  onChange={(landingPages) => set({ landingPages })}
                />

                <label className="grid gap-1.5">
                  <FieldLabel>Creative / Landing Information</FieldLabel>
                  <textarea
                    rows={3}
                    value={form.creativeNotes}
                    onChange={(e) => set({ creativeNotes: e.target.value })}
                    className="w-full rounded-xl border border-input bg-surface-2/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
                  />
                </label>
              </div>
            )}
          </Panel>
        </div>

        {/* ------------------------------------------------------- live preview */}
        <Panel
          title="Live Preview"
          description="Exactly how publishers will see this campaign in the Marketplace."
        >
          <div className="grid gap-3">
            <div className="rounded-2xl border border-hairline bg-surface-2/35 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {form.logoUrl ? (
                    <img
                      src={form.logoUrl}
                      alt={`${form.name || "Campaign"} logo`}
                      className="size-10 shrink-0 rounded-xl border border-hairline object-cover"
                    />
                  ) : (
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-hairline bg-brand/10 font-display text-sm font-black text-brand">
                      {(form.name || "C").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-bold">
                      {form.name || "Untitled Campaign"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {form.tagline || "Campaign tagline"}
                    </p>
                  </div>
                </div>
                <StatusBadge tone={form.status === "Active" ? "success" : "warn"} dot>
                  {form.status}
                </StatusBadge>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {form.description || "Campaign description shown to publishers."}
              </p>

              <dl className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: "Offer ID", value: form.offerId || "—" },
                  { label: "Advertiser", value: form.advertiser || "—" },
                  { label: "Category", value: form.category },
                  { label: "Model", value: form.model },
                  { label: "Payout", value: form.payout ? `₹${form.payout}` : "—" },
                  { label: "EPC", value: form.epc ? `₹${form.epc}` : "—" },
                  { label: "Geo", value: form.geo },
                  { label: "Devices", value: form.devices },
                  { label: "Daily Cap", value: form.dailyCap || "—" },
                  { label: "Monthly Cap", value: form.monthlyCap || "—" },
                  { label: "Approval Rate", value: form.approvalRate ? `${form.approvalRate}%` : "—" },
                  { label: "Confirm Time", value: `${form.conversionDays || "—"} days` },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-hairline bg-surface/60 p-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {s.label}
                    </dt>
                    <dd className="mt-1 truncate text-sm font-bold">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 rounded-xl border border-hairline bg-surface/60 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  KPI
                </p>
                <p className="mt-1 text-[13px] leading-relaxed">{form.kpi || "—"}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-hairline bg-surface-2/35 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Conversion Events ({liveEvents.length})
              </p>
              <ul className="mt-2 grid gap-2">
                {liveEvents.map((ev) => (
                  <li key={ev.id} className="rounded-xl border border-hairline bg-surface/60 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold">{ev.name || "Untitled event"}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {ev.slug || "event_slug"}
                        </p>
                      </div>
                      <p className="inline-flex shrink-0 items-center gap-1 text-[13px] font-bold tabular-nums">
                        <BadgeIndianRupee className="size-3.5 text-brand" aria-hidden="true" />
                        {ev.payout || "0"}
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <StatusBadge tone={ev.payable ? "success" : "neutral"}>
                        {ev.payable ? "Payable" : "Non-payable"}
                      </StatusBadge>
                      {ev.alert && <StatusBadge tone="brand">Alert on</StatusBadge>}
                      {ev.cap && <StatusBadge tone="neutral">Cap {ev.cap}</StatusBadge>}
                    </div>
                  </li>
                ))}
                {liveEvents.length === 0 && (
                  <li className="text-[12.5px] text-muted-foreground">No enabled events yet.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-hairline bg-surface-2/35 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Traffic Rules
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {form.allowed.map((a) => (
                  <li key={a}>
                    <StatusBadge tone="success">
                      <CheckCircle2 className="size-3" aria-hidden="true" />
                      {a}
                    </StatusBadge>
                  </li>
                ))}
                {form.disallowed.map((d) => (
                  <li key={d}>
                    <StatusBadge tone="danger">
                      <XCircle className="size-3" aria-hidden="true" />
                      {d}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-hairline bg-surface-2/35 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Terms sections
              </p>
              <ul className="mt-2 grid gap-1.5">
                {[
                  { label: "KPI Rules", n: form.kpiRules.length },
                  { label: "Traffic Rules", n: form.trafficRules.length },
                  { label: "Conversion Rules", n: form.conversionRules.length },
                  { label: "Publisher Requirements", n: form.publisherRequirements.length },
                  { label: "KYC Requirements", n: form.kycRequirements.length },
                  { label: "Brand Guidelines", n: form.brandGuidelines.length },
                  { label: "Terms & Conditions", n: form.terms.length },
                ].map((s) => (
                  <li
                    key={s.label}
                    className="flex items-center justify-between gap-2 text-[13px] text-muted-foreground"
                  >
                    <span>{s.label}</span>
                    <span className="rounded-full bg-brand/12 px-2 py-0.5 text-[11px] font-bold text-brand">
                      {s.n}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-hairline bg-surface-2/35 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Tracking · {form.trackingType}
              </p>
              <p className="mt-2 break-all font-mono text-[12px] text-brand">
                {form.trackingUrl || "https://track.crosx.in/click?cmp=campaign-slug"}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {form.supportedParams.map((p) => (
                  <StatusBadge key={p} tone="neutral">
                    {p}
                  </StatusBadge>
                ))}
              </div>
              <ul className="mt-3 grid gap-1.5 text-xs text-muted-foreground">
                {form.landingPages.map((lp) => (
                  <li key={lp} className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-brand" aria-hidden="true" />
                    {lp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
