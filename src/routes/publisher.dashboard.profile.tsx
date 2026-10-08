import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  Chip,
  Panel,
  Select,
  StatusBadge,
  TextField,
  InlineSpinner,
} from "@/components/dashboard/kit";
import { AvatarUploader } from "@/components/dashboard/AvatarUploader";
import { useSupabaseSession } from "@/lib/supabase-auth";
import {
  PUBLISHER_TYPES,
  TRAFFIC_SOURCES,
  countryLabel,
  usePublisherAccount,
  type EditablePatch,
  type PublisherAccount,
} from "@/lib/publisher-profile";
import { COUNTRIES, citiesOf, statesOf } from "@/lib/geo-data";

export const Route = createFileRoute("/publisher/dashboard/profile")({
  component: Page,
  head: () =>
    dashboardHead(
      "Profile — CrosX Publisher",
      "Manage your CrosX publisher profile, contact details and traffic sources.",
    ),
});

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CX"
  );
}

function Page() {
  const { user } = useSupabaseSession();
  const { account, loading, isDemo, save } = usePublisherAccount(user?.id, user?.email);

  const [form, setForm] = useState<PublisherAccount | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (account) setForm(account);
  }, [account]);

  const set = <K extends keyof PublisherAccount>(key: K, value: PublisherAccount[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const toggleSource = (s: string) =>
    setForm((prev) =>
      prev
        ? {
            ...prev,
            trafficSources: prev.trafficSources.includes(s)
              ? prev.trafficSources.filter((x) => x !== s)
              : [...prev.trafficSources, s],
          }
        : prev,
    );

  const onSave = async () => {
    if (!form) return;
    setSaving(true);
    const patch: EditablePatch = {
      fullName: form.fullName,
      mobile: form.mobile,
      companyName: form.companyName,
      website: form.website,
      publisherType: form.publisherType,
      gstNumber: form.gstNumber,
      trafficSources: form.trafficSources,
      country: form.country,
      state: form.state,
      city: form.city,
      pincode: form.pincode,
    };
    try {
      await save(patch);
      toast.success(isDemo ? "Profile updated (demo data)" : "Profile updated", {
        description: isDemo
          ? "Showing sample data — changes stay in this session."
          : "Your publisher details are saved.",
      });
    } catch (err) {
      toast.error("Could not save profile", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const states = statesOf(form?.country);
  const cities = citiesOf(form?.country, form?.state);

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Manage your publisher identity, contact details and the traffic sources you promote with."
        action={
          <ActionButton
            variant="solid"
            icon={Save}
            onClick={() => void onSave()}
            disabled={saving || !form}
          >
            {saving ? <InlineSpinner /> : null}
            {saving ? "Saving..." : "Save Changes"}
          </ActionButton>
        }
      />

      {isDemo && form ? (
        <div className="mb-5 rounded-2xl border border-hairline bg-surface-2/40 px-4 py-3">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Demo data.</span> No saved account
            record was found for this login, so a sample publisher profile is shown. Edits stay in
            this session until your registration record is available.
          </p>
        </div>
      ) : null}

      {loading && !form ? (
        <Panel title="Loading profile">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <InlineSpinner /> Fetching your publisher account…
          </p>
        </Panel>
      ) : !form ? null : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <Panel title="Publisher Identity" description="Your CrosX account summary.">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <AvatarUploader initials={initialsOf(account?.fullName ?? form.fullName)} />
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold tracking-tight">
                    {account?.fullName ?? form.fullName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{form.publisherId}</p>
                </div>
              </div>

              <dl className="grid gap-2.5 text-sm">
                {[
                  {
                    label: "Account Type",
                    value: form.accountType.charAt(0).toUpperCase() + form.accountType.slice(1),
                  },
                  { label: "Member Since", value: form.joined },
                  { label: "Country", value: countryLabel(form.country) },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">{r.label}</dt>
                    <dd className="font-semibold">{r.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="grid gap-2 rounded-2xl border border-hairline bg-surface-2/40 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-brand" aria-hidden="true" />
                  Verification
                </p>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge tone={user?.email_confirmed_at ? "success" : "warn"} dot>
                    {user?.email_confirmed_at ? "Email verified" : "Email pending"}
                  </StatusBadge>
                  <StatusBadge tone="success" dot>
                    KYC approved
                  </StatusBadge>
                  <StatusBadge tone={form.gstNumber ? "success" : "warn"} dot>
                    {form.gstNumber ? "GST added" : "GST pending"}
                  </StatusBadge>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Account Details" description="Keep your contact information up to date.">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Full Name"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
              />
              <TextField
                label="Business Email"
                type="email"
                value={form.email}
                readOnly
                className="opacity-70"
              />
              <TextField
                label="Mobile Number"
                value={form.mobile}
                onChange={(e) => set("mobile", e.target.value)}
              />
              <TextField
                label="Company Name"
                value={form.companyName}
                onChange={(e) => set("companyName", e.target.value)}
              />
              <TextField
                label="Website"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
              />
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  I am
                </span>
                <Select
                  aria-label="Publisher type"
                  value={form.publisherType}
                  onChange={(e) => set("publisherType", e.target.value)}
                >
                  <option value="">Select</option>
                  {PUBLISHER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </label>
              <TextField
                label="GST Number"
                value={form.gstNumber}
                onChange={(e) => set("gstNumber", e.target.value)}
              />
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Country
                </span>
                <Select
                  aria-label="Country"
                  value={form.country}
                  onChange={(e) =>
                    setForm((prev) =>
                      prev ? { ...prev, country: e.target.value, state: "", city: "" } : prev,
                    )
                  }
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  State
                </span>
                <Select
                  aria-label="State"
                  value={form.state}
                  disabled={states.length === 0}
                  onChange={(e) =>
                    setForm((prev) => (prev ? { ...prev, state: e.target.value, city: "" } : prev))
                  }
                >
                  <option value="">Select state</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  City
                </span>
                <Select
                  aria-label="City"
                  value={form.city}
                  disabled={cities.length === 0}
                  onChange={(e) => set("city", e.target.value)}
                >
                  <option value="">Select city</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </label>
              <TextField
                label="Pincode"
                value={form.pincode}
                onChange={(e) => set("pincode", e.target.value)}
              />
              <TextField
                label="Publisher ID"
                value={form.publisherId}
                readOnly
                className="opacity-70"
              />
            </div>

            <div className="mt-5">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <UserRound className="size-3.5" aria-hidden="true" />
                Traffic Sources
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {TRAFFIC_SOURCES.map((s) => (
                  <Chip
                    key={s}
                    active={form.trafficSources.includes(s)}
                    onClick={() => toggleSource(s)}
                  >
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
          </Panel>
        </div>
      )}
    </>
  );
}
