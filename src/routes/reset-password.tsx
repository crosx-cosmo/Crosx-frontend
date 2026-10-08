import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CheckCircle2, KeyRound, Lock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { AuthPanel, AuthSubmit, SentState } from "@/components/auth/AuthPanel";
import {
  AuthAlert,
  AuthInput,
  PasswordStrength,
  RevealToggle,
  passwordScore,
  type FieldState,
} from "@/components/auth/AuthField";
import { EASE_LUX } from "@/lib/motion-presets";
import { authErrorMessage } from "@/lib/auth-errors";
import { getSupabase } from "@/lib/supabase-external";
import { updatePassword } from "@/lib/supabase-auth";

const TITLE = "Set a New CrosX Password";
const DESCRIPTION =
  "Choose a new password for your CrosX account. Reset links are single-use and expire for your security.";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type LinkState = "checking" | "ready" | "invalid" | "done";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [linkState, setLinkState] = useState<LinkState>("checking");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Validate the recovery link: Supabase exchanges the URL fragment for a session.
  useEffect(() => {
    const supabase = getSupabase();

    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const hashError = params.get("error_description") ?? params.get("error");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        setLinkState("ready");
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setLinkState("ready");
        return;
      }
      setLinkState((s) => (s === "ready" ? s : "invalid"));
      setLinkError(
        hashError
          ? authErrorMessage(hashError.replace(/\+/g, " "))
          : "This reset link is invalid or has expired. Request a new one to continue.",
      );
    });

    return () => subscription.unsubscribe();
  }, []);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!password) e.password = "Password is required.";
    else if (password.length < 8) e.password = "Use at least 8 characters.";
    else if (passwordScore(password) < 2) e.password = "Add numbers or symbols for strength.";
    if (!confirm) e.confirm = "Please confirm your password.";
    else if (confirm !== password) e.confirm = "Passwords do not match.";
    return e;
  }, [password, confirm]);

  const stateOf = (key: string, value: string): FieldState => {
    if (errors[key] && touched[key]) return "error";
    if (!errors[key] && value.length > 0) return "valid";
    return "idle";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    const keys = Object.keys(errors);
    if (keys.length > 0) {
      setTouched((prev) => ({ ...prev, ...keys.reduce((a, k) => ({ ...a, [k]: true }), {}) }));
      toast.error("Please check the highlighted fields");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const { error } = await updatePassword(password);
      if (error) throw error;
      setLinkState("done");
      toast.success("Password updated", { description: "You can now sign in with it." });
    } catch (err) {
      const message = authErrorMessage(err);
      setFormError(message);
      toast.error("Could not update password", { description: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] xl:gap-20">
        <div className="order-2 lg:order-1 lg:sticky lg:top-10 lg:self-start">
          <AuthShowcase />
        </div>

        <div className="order-1 lg:order-2">
          <AuthPanel>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={linkState}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE_LUX }}
                className="flex flex-col gap-6"
              >
                {linkState === "checking" && (
                  <div className="flex flex-col items-center gap-4 py-10 text-center">
                    <span className="relative grid size-16 place-items-center rounded-2xl bg-brand/10 text-brand">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-2xl border border-brand/30 pulse-ring"
                      />
                      <KeyRound className="size-7" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-medium text-muted-foreground" aria-live="polite">
                      Verifying your reset link…
                    </p>
                  </div>
                )}

                {linkState === "invalid" && (
                  <SentState
                    icon={ShieldAlert}
                    title="Link no longer valid"
                    email=""
                    description={linkError ?? "This reset link has expired."}
                    actions={
                      <AuthSubmit
                        type="button"
                        label="Request a new link"
                        icon={ArrowRight}
                        iconTrailing
                        onClick={() =>
                          void navigate({ to: "/auth", search: { mode: "forgot" as const } })
                        }
                      />
                    }
                  />
                )}

                {linkState === "done" && (
                  <SentState
                    icon={CheckCircle2}
                    title="Password updated"
                    email=""
                    description="Your new password is active. Sign in to continue to your CrosX dashboard."
                    actions={
                      <AuthSubmit
                        type="button"
                        label="Continue to sign in"
                        icon={ArrowRight}
                        iconTrailing
                        onClick={() =>
                          void navigate({ to: "/auth", search: { mode: "login" as const } })
                        }
                      />
                    }
                  />
                )}

                {linkState === "ready" && (
                  <>
                    <header className="flex flex-col gap-1.5">
                      <h1 className="font-display text-2xl font-bold tracking-tight sm:text-[1.75rem]">
                        Set a new password
                      </h1>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Choose a strong password you haven&apos;t used before. You&apos;ll stay
                        signed in on this device.
                      </p>
                    </header>

                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <AuthInput
                          id="new-password"
                          label="New Password"
                          icon={Lock}
                          required
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          value={password}
                          onValueChange={setPassword}
                          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                          state={stateOf("password", password)}
                          message={touched.password ? errors.password : undefined}
                          trailing={
                            <RevealToggle
                              shown={showPassword}
                              onToggle={() => setShowPassword((v) => !v)}
                              label="password"
                            />
                          }
                        />
                        <PasswordStrength password={password} />
                      </div>

                      <AuthInput
                        id="confirm-password"
                        label="Confirm New Password"
                        icon={Lock}
                        required
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={confirm}
                        onValueChange={setConfirm}
                        onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                        state={stateOf("confirm", confirm)}
                        message={touched.confirm ? errors.confirm : undefined}
                        trailing={
                          <RevealToggle
                            shown={showConfirm}
                            onToggle={() => setShowConfirm((v) => !v)}
                            label="confirmation password"
                          />
                        }
                      />

                      <AnimatePresence initial={false}>
                        {formError && <AuthAlert>{formError}</AuthAlert>}
                      </AnimatePresence>

                      <AuthSubmit
                        type="submit"
                        loading={submitting}
                        icon={ArrowRight}
                        iconTrailing
                        label="Update Password"
                        loadingLabel="Updating password…"
                      />

                      <p className="border-t border-hairline pt-4 text-center text-[13px] text-muted-foreground">
                        Remembered it?{" "}
                        <Link
                          to="/auth"
                          search={{ mode: "login" as const }}
                          className="font-semibold text-brand underline-sweep"
                        >
                          Back to sign in
                        </Link>
                      </p>
                    </form>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </AuthPanel>
        </div>
      </div>
    </AuthShell>
  );
}
