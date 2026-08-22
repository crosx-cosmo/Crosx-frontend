import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  Chip,
  Panel,
  StatusBadge,
  TextField,
  InlineSpinner,
} from "@/components/dashboard/kit";
import { usePublisherMock } from "@/components/dashboard/mock-store";
import { AvatarUploader } from "@/components/dashboard/AvatarUploader";


export const Route = createFileRoute("/publisher/dashboard/profile")({
  component: Page,
  head: () =>
    dashboardHead(
      "Profile — CrosX Publisher",
      "Manage your CrosX publisher profile, contact details and traffic sources.",
    ),
});

const SOURCES = ["Instagram", "YouTube", "Telegram", "Facebook", "Google Ads", "SEO", "WhatsApp"];

function Page() {
  const { profile, updateProfile } = usePublisherMock();
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);

  const toggleSource = (s: string) =>
    setForm((prev) => ({
      ...prev,
      trafficSources: prev.trafficSources.includes(s)
        ? prev.trafficSources.filter((x) => x !== s)
        : [...prev.trafficSources, s],
    }));

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      updateProfile(form);
      setSaving(false);
      toast.success("Profile updated", { description: "Your publisher details are saved." });
    }, 900);
  };

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Manage your publisher identity, contact details and the traffic sources you promote with."
        action={
          <ActionButton variant="solid" icon={Save} onClick={save} disabled={saving}>
            {saving ? <InlineSpinner /> : null}
            {saving ? "Saving..." : "Save Changes"}
          </ActionButton>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <Panel title="Publisher Identity" description="Your CrosX account summary.">
          <div className="grid gap-4">
            <div className="grid gap-3">
              <AvatarUploader
                initials={profile.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              />
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-bold tracking-tight">
                  {profile.fullName}
                </p>
                <p className="truncate text-xs text-muted-foreground">{profile.publisherId}</p>
              </div>
            </div>


            <dl className="grid gap-2.5 text-sm">
              {[
                { label: "Account Type", value: "Publisher" },
                { label: "Member Since", value: profile.joined },
                { label: "Country", value: profile.country },
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
                <StatusBadge tone="success" dot>
                  Email verified
                </StatusBadge>
                <StatusBadge tone="success" dot>
                  KYC approved
                </StatusBadge>
                <StatusBadge tone="warn" dot>
                  GST pending
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
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <TextField
              label="Website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
            <TextField
              label="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
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
              {SOURCES.map((s) => (
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
    </>
  );
}
