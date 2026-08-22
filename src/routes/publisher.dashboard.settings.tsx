import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, KeyRound, Save, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, Panel, Segmented, TextField } from "@/components/dashboard/kit";
import { usePublisherMock } from "@/components/dashboard/mock-store";
import { NOTIFICATION_SETTINGS } from "@/lib/publisher-data";

export const Route = createFileRoute("/publisher/dashboard/settings")({
  component: Page,
  head: () =>
    dashboardHead(
      "Settings — CrosX Publisher",
      "Control your CrosX notification preferences, security and console display options.",
    ),
});

function Page() {
  const { prefs, togglePref } = usePublisherMock();
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [currency, setCurrency] = useState<"inr" | "usd">("inr");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Notification preferences, security and console display options for your publisher account."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel
          title="Notifications"
          description="Choose which updates CrosX should email you about."
        >
          <ul className="grid gap-2.5">
            {NOTIFICATION_SETTINGS.map((s) => (
              <li
                key={s.key}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-hairline bg-surface-2/40 px-3.5 py-3"
              >
                <Bell className="size-4 shrink-0 text-brand" aria-hidden="true" />
                <span className="min-w-0 truncate text-[13px] font-semibold">{s.label}</span>
                <label className="inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={prefs[s.key]}
                    onChange={() => togglePref(s.key)}
                    aria-label={s.label}
                    className="size-4 accent-[var(--brand)]"
                  />
                </label>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="grid gap-5">
          <Panel title="Console Display" description="Tune how dense and localised the panel feels.">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <SettingsIcon className="size-3.5" aria-hidden="true" />
                  Table density
                </p>
                <Segmented
                  options={[
                    { key: "comfortable", label: "Comfortable" },
                    { key: "compact", label: "Compact" },
                  ]}
                  value={density}
                  onChange={setDensity}
                />
              </div>
              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Reporting currency
                </p>
                <Segmented
                  options={[
                    { key: "inr", label: "₹ INR" },
                    { key: "usd", label: "$ USD" },
                  ]}
                  value={currency}
                  onChange={setCurrency}
                />
              </div>
            </div>
          </Panel>

          <Panel title="Security" description="Update the password used to access your console.">
            <div className="grid gap-4">
              <TextField
                label="Current Password"
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="••••••••"
              />
              <TextField
                label="New Password"
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="At least 8 characters"
              />
              <ActionButton
                variant="solid"
                icon={KeyRound}
                disabled={current.length < 4 || next.length < 8}
                onClick={() => {
                  setCurrent("");
                  setNext("");
                  toast.success("Password updated (demo)");
                }}
              >
                Update Password
              </ActionButton>
            </div>
          </Panel>
        </div>
      </div>

      <div className="mt-5">
        <Panel title="Preferences saved automatically" description="Demo settings are kept in memory for this session only.">
          <ActionButton icon={Save} onClick={() => toast.success("Settings saved (demo)")}>
            Save all settings
          </ActionButton>
        </Panel>
      </div>
    </>
  );
}
