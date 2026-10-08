import { createFileRoute } from "@tanstack/react-router";
import { Building2, Clock, Mail, MapPin, Phone, Save, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, Panel, StatusBadge, TextField } from "@/components/dashboard/kit";
import { ADMIN_PROFILE, ADMIN_TEAM } from "@/lib/admin-data";
import { toneFor } from "@/components/admin/tones";

export const Route = createFileRoute("/admin/dashboard/profile")({
  component: Page,
  head: () =>
    dashboardHead(
      "Admin Profile — CrosX Admin",
      "Your CrosX admin account details, security status and internal team roster.",
    ),
});

const DETAILS = [
  { icon: Mail, label: "Email", value: ADMIN_PROFILE.email },
  { icon: Phone, label: "Phone", value: ADMIN_PROFILE.phone },
  { icon: Building2, label: "Company", value: ADMIN_PROFILE.company },
  { icon: MapPin, label: "Location", value: ADMIN_PROFILE.location },
  { icon: Clock, label: "Timezone", value: ADMIN_PROFILE.timezone },
  { icon: UserRound, label: "Member since", value: ADMIN_PROFILE.joined },
];

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Your admin identity, security posture and the team members who share this console."
        action={
          <ActionButton variant="solid" icon={Save} onClick={() => toast.success("Profile saved (demo)")}>
            Save Profile
          </ActionButton>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="grid gap-5">
          <Panel title="Account" description="Displayed across the admin console and outgoing notifications.">
            <div className="flex flex-wrap items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-brand/12 font-display text-xl font-black text-brand">
                {ADMIN_PROFILE.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div className="min-w-0">
                <p className="font-display text-lg font-black tracking-tight">{ADMIN_PROFILE.name}</p>
                <p className="text-sm text-muted-foreground">{ADMIN_PROFILE.role}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge tone="success" dot>
                    Active
                  </StatusBadge>
                  <StatusBadge tone="neutral">Last login {ADMIN_PROFILE.lastLogin}</StatusBadge>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <TextField label="Full name" defaultValue={ADMIN_PROFILE.name} />
              <TextField label="Email" defaultValue={ADMIN_PROFILE.email} type="email" />
              <TextField label="Phone" defaultValue={ADMIN_PROFILE.phone} />
              <TextField label="Location" defaultValue={ADMIN_PROFILE.location} />
            </div>
          </Panel>

          <Panel title="Details" description="Read-only account context.">
            <dl className="grid gap-3 sm:grid-cols-2">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex items-start gap-3 rounded-2xl border border-hairline bg-surface-2/35 p-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
                    <d.icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {d.label}
                    </dt>
                    <dd className="mt-0.5 truncate text-[13px] font-semibold">{d.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Panel>
        </div>

        <div className="grid gap-5">
          <Panel title="Security" description="Protect the console — admin access controls the whole network.">
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-2/35 p-3.5">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">Authenticator app · enforced for admins</p>
                </div>
                <StatusBadge tone={ADMIN_PROFILE.twoFactor ? "success" : "warn"} dot>
                  {ADMIN_PROFILE.twoFactor ? "Enabled" : "Off"}
                </StatusBadge>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-2/35 p-3.5">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold">Password</p>
                  <p className="text-xs text-muted-foreground">Last changed 24 Jul 2026</p>
                </div>
                <ActionButton icon={ShieldCheck} onClick={() => toast.success("Password reset email sent (demo)")}>
                  Change
                </ActionButton>
              </div>
            </div>
          </Panel>

          <Panel title="Team" description="Everyone with access to the CrosX admin console.">
            <ul className="grid gap-3">
              {ADMIN_TEAM.map((m) => (
                <li
                  key={m.email}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-2/35 p-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{m.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {m.role} · {m.email}
                    </p>
                  </div>
                  <StatusBadge tone={toneFor(m.status)} dot>
                    {m.status}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
