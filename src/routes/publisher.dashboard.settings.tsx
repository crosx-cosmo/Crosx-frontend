import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  KeyRound,
  Loader2,
  LogOut,
  Save,
  Settings as SettingsIcon,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, Panel, Segmented, TextField } from "@/components/dashboard/kit";
import { usePublisherMock } from "@/components/dashboard/mock-store";
import { NOTIFICATION_SETTINGS } from "@/lib/publisher-data";
import { signOut } from "@/lib/supabase-auth";
import { EASE_LUX } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

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
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    const { error } = await signOut();
    if (error) {
      setLoggingOut(false);
      toast.error("Could not sign out. Please try again.");
      return;
    }
    toast.success("Signed out successfully");
    void navigate({ to: "/auth", search: { mode: "login" }, replace: true });
  };

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
          <Panel
            title="Console Display"
            description="Tune how dense and localised the panel feels."
          >
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
        <Panel
          title="Session"
          description="Sign out of your CrosX Publisher account on this device."
          action={
            <ActionButton
              icon={LogOut}
              variant="ghost"
              className="border-brand/30 text-brand hover:bg-brand/10 hover:text-brand"
              onClick={() => setLogoutOpen(true)}
            >
              Log Out
            </ActionButton>
          }
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-hairline bg-surface-2/50 text-muted-foreground">
                <LogOut className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">End this session</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                  You can sign in again anytime with your email and password.
                </p>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-5">
        <Panel
          title="Preferences saved automatically"
          description="Demo settings are kept in memory for this session only."
        >
          <ActionButton icon={Save} onClick={() => toast.success("Settings saved (demo)")}>
            Save all settings
          </ActionButton>
        </Panel>
      </div>

      <AnimatePresence>
        {logoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_LUX }}
            className="fixed inset-0 z-[90] grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
            onClick={() => !loggingOut && setLogoutOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE_LUX }}
              onClick={(e) => e.stopPropagation()}
              className="glass w-full max-w-md overflow-hidden rounded-2xl border border-hairline shadow-lux"
            >
              <div className="grid gap-4 border-b border-hairline p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand/12 text-brand">
                  <AlertTriangle className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="logout-title" className="font-display text-lg font-bold tracking-tight">
                    Are you sure you want to log out?
                  </h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    Your current session will be ended on this device. You can sign in again
                    anytime.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => !loggingOut && setLogoutOpen(false)}
                  disabled={loggingOut}
                  aria-label="Close"
                  className="hidden size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-surface-2/70 hover:text-foreground disabled:opacity-50 sm:grid"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-col-reverse gap-3 p-5 sm:flex-row sm:justify-end">
                <ActionButton
                  variant="ghost"
                  disabled={loggingOut}
                  onClick={() => setLogoutOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  variant="solid"
                  icon={loggingOut ? Loader2 : LogOut}
                  disabled={loggingOut}
                  onClick={handleLogout}
                  className={cn("w-full sm:w-auto", loggingOut && "[&_svg]:animate-spin")}
                >
                  {loggingOut ? "Signing out..." : "Confirm Logout"}
                </ActionButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
