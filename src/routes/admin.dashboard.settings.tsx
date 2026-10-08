import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, Panel, Select, StatusBadge, TextField } from "@/components/dashboard/kit";
import { ADMIN_SETTINGS_GROUPS } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/dashboard/settings")({
  component: Page,
  head: () =>
    dashboardHead(
      "Admin Settings — CrosX Admin",
      "Platform, payout and notification controls for the CrosX admin console.",
    ),
});

function Toggle({
  on,
  label,
  onToggle,
}: {
  on: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`Toggle ${label}`}
      onClick={onToggle}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300",
        on ? "border-brand/60 bg-brand/70" : "border-hairline bg-surface-2",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0.5 size-4.5 rounded-full bg-background transition-[left] duration-300",
          on ? "left-[1.55rem]" : "left-0.5",
        )}
      />
    </button>
  );
}

function Page() {
  const [values, setValues] = useState<Record<string, boolean>>(
    Object.fromEntries(
      ADMIN_SETTINGS_GROUPS.flatMap((g) => g.items.map((i) => [i.key, i.value])),
    ),
  );

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Network-wide controls for approvals, payouts and alerting. Changes apply to every publisher."
        action={
          <ActionButton variant="solid" icon={Save} onClick={() => toast.success("Settings saved (demo)")}>
            Save Settings
          </ActionButton>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="grid gap-5">
          {ADMIN_SETTINGS_GROUPS.map((group) => (
            <Panel key={group.title} title={group.title} description={`${group.title} level controls.`}>
              <ul className="grid gap-3">
                {group.items.map((item) => (
                  <li
                    key={item.key}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-2/35 p-3.5"
                  >
                    <p className="min-w-0 text-[13px] font-semibold">{item.label}</p>
                    <div className="flex shrink-0 items-center gap-2.5">
                      <StatusBadge tone={values[item.key] ? "success" : "neutral"}>
                        {values[item.key] ? "On" : "Off"}
                      </StatusBadge>
                      <Toggle
                        on={Boolean(values[item.key])}
                        label={item.label}
                        onToggle={() => {
                          setValues((p) => ({ ...p, [item.key]: !p[item.key] }));
                          toast.success(`${item.label} updated (demo)`);
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>

        <div className="grid gap-5">
          <Panel title="Payout Policy" description="Defaults applied to every publisher withdrawal.">
            <div className="grid gap-4">
              <TextField label="Minimum withdrawal (₹)" defaultValue="5000" inputMode="numeric" />
              <TextField label="Manual review threshold (₹)" defaultValue="200000" inputMode="numeric" />
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Payout cycle
                </span>
                <Select defaultValue="Twice a month (1st & 15th)" aria-label="Payout cycle">
                  {["Weekly", "Twice a month (1st & 15th)", "Monthly (1st)", "Net 30"].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Default currency
                </span>
                <Select defaultValue="INR (₹)" aria-label="Default currency">
                  {["INR (₹)", "USD ($)", "AED (د.إ)"].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
          </Panel>

          <Panel title="Console" description="How the admin console behaves for your account.">
            <div className="grid gap-4">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Default report range
                </span>
                <Select defaultValue="Last 7 days" aria-label="Default report range">
                  {["Today", "Last 7 days", "This month", "Last month"].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Table rows per page
                </span>
                <Select defaultValue="10" aria-label="Table rows per page">
                  {["10", "20", "50"].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </label>
              <p className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-hairline bg-surface-2/35 p-3.5 text-xs text-muted-foreground">
                <SettingsIcon className="size-4 shrink-0 text-brand" aria-hidden="true" />
                Console preferences apply to your admin account only.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
