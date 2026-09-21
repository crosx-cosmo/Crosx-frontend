import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  MailCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EASE_LUX } from "@/lib/motion-presets";
import { resendVerificationEmail, sendPasswordReset, signInWithEmail } from "@/lib/supabase-auth";
import { EMAIL_PATTERN, authErrorMessage } from "@/lib/auth-errors";
import { FALLBACK_DASHBOARD, resolveDashboardPath } from "@/lib/role-redirect";
import { AuthAlert, AuthInput, RevealToggle, type FieldState } from "./AuthField";
import { AuthPanel, AuthSubmit, SentState } from "./AuthPanel";
import { Turnstile } from "@/components/ui-kit/Turnstile";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile";

export type AuthMode = "login" | "forgot";
type Screen = AuthMode | "verify-sent" | "reset-sent";

const COPY: Record<AuthMode, { title: string; subtitle: string }> = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to your CrosX account to continue where you left off.",
  },
  forgot: {
    title: "Reset your password",
    subtitle: "Enter your account email and we'll send you a secure reset link.",
  },
};

export function AuthExperience({ initialMode = "login" }: { initialMode?: AuthMode }) {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>(initialMode);
  const [status, setStatus] = useState<"idle" | "loading" | "resending">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sentTo, setSentTo] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  const resetCaptcha = () => {
    setCaptchaToken("");
    setCaptchaKey((k) => k + 1);
  };

  const liveRef = useRef<HTMLParagraphElement>(null);
  const mode: AuthMode = screen === "verify-sent" || screen === "reset-sent" ? "login" : screen;

  useEffect(() => {
    setScreen(initialMode);
  }, [initialMode]);

  const goto = (next: AuthMode) => {
    setScreen(next);
    setFormError(null);
    setCaptchaError(null);
    setTouched({});
    void navigate({ to: "/auth", search: { mode: next }, replace: true });
  };

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) e.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(trimmedEmail)) e.email = "Enter a valid email address.";

    if (screen === "login" && !password) e.password = "Password is required.";
    if (!captchaToken) e.captcha = "Please complete the security check.";
    return e;
  }, [screen, email, password, captchaToken]);

  const stateOf = (key: string, value: string): FieldState => {
    if (errors[key] && touched[key]) return "error";
    if (!errors[key] && value.length > 0) return "valid";
    return "idle";
  };
  const messageOf = (key: string) => (touched[key] ? errors[key] : undefined);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status !== "idle") return;

    const keys = Object.keys(errors);
    if (keys.length > 0) {
      setTouched((prev) => ({
        ...prev,
        ...keys.reduce((acc, k) => ({ ...acc, [k]: true }), {}),
      }));
      setFormError(null);
      setCaptchaError(errors.captcha ?? null);
      toast.error(
        errors.captcha
          ? "Please complete the security check"
          : "Please check the highlighted fields",
      );
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    setStatus("loading");
    setFormError(null);

    try {
      if (screen === "login") {
        const { data, error } = await signInWithEmail(cleanEmail, password, captchaToken);
        if (error) throw error;
        if (!data.session) {
          setSentTo(cleanEmail);
          setScreen("verify-sent");
          return;
        }
        toast.success("Signed in", { description: "Welcome back to CrosX." });
        const target = await resolveDashboardPath(data.session.user.id).catch(
          () => FALLBACK_DASHBOARD,
        );
        void navigate({ to: target, replace: true });
        return;
      }

      const { error } = await sendPasswordReset(cleanEmail, captchaToken);
      if (error) throw error;
      setSentTo(cleanEmail);
      setScreen("reset-sent");
      toast.success("Reset link sent", { description: `Check ${cleanEmail} for the link.` });
    } catch (err) {
      const message = authErrorMessage(err);
      setFormError(message);
      resetCaptcha();
      toast.error("Request failed", { description: message });
    } finally {
      setStatus((s) => (s === "loading" ? "idle" : s));
    }
  };

  const handleResend = async () => {
    if (status !== "idle" || !sentTo) return;
    setStatus("resending");
    try {
      if (screen === "verify-sent") {
        const { error } = await resendVerificationEmail(sentTo);
        if (error) throw error;
      } else {
        const { error } = await sendPasswordReset(sentTo);
        if (error) throw error;
      }
      toast.success("Email sent again", { description: `Check ${sentTo}.` });
    } catch (err) {
      toast.error("Could not resend", { description: authErrorMessage(err) });
    } finally {
      setStatus("idle");
    }
  };

  return (
    <AuthPanel>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE_LUX }}
          className="flex flex-col gap-6"
        >
          {screen === "verify-sent" || screen === "reset-sent" ? (
            <SentState
              icon={screen === "verify-sent" ? MailCheck : ShieldCheck}
              title={screen === "verify-sent" ? "Verify your email" : "Check your inbox"}
              email={sentTo}
              description={
                screen === "verify-sent"
                  ? "We sent a confirmation link to your inbox. Click it to activate your CrosX account."
                  : "We sent a secure password reset link. It expires in 60 minutes for your safety."
              }
              actions={
                <>
                  <AuthSubmit
                    type="button"
                    onClick={handleResend}
                    loading={status === "resending"}
                    icon={RefreshCw}
                    label="Resend email"
                    loadingLabel="Sending…"
                  />
                  <button
                    type="button"
                    onClick={() => goto("login")}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-muted-foreground transition-colors duration-300 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Back to sign in
                  </button>
                </>
              }
            />
          ) : (
            <>
              <header className="flex flex-col gap-1.5">
                <h2 className="font-display text-2xl font-bold tracking-tight sm:text-[1.75rem]">
                  {COPY[mode].title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {COPY[mode].subtitle}
                </p>
              </header>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <AuthInput
                  id="auth-email"
                  label="Business Email"
                  icon={Mail}
                  required
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onValueChange={setEmail}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  state={stateOf("email", email)}
                  message={messageOf("email")}
                />

                {screen !== "forgot" && (
                  <AuthInput
                    id="auth-password"
                    label="Password"
                    icon={Lock}
                    required
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onValueChange={setPassword}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    state={stateOf("password", password)}
                    message={messageOf("password")}
                    trailing={
                      <RevealToggle
                        shown={showPassword}
                        onToggle={() => setShowPassword((v) => !v)}
                        label="password"
                      />
                    }
                  />
                )}

                {screen === "login" && (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="inline-flex cursor-pointer select-none items-center gap-2 text-[13px] font-medium text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid size-4 place-items-center rounded border transition-colors duration-200",
                          remember ? "border-brand bg-brand" : "border-input bg-surface/60",
                        )}
                      >
                        {remember && (
                          <CheckCircle2
                            className="size-3 text-primary-foreground"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      Keep me signed in
                    </label>
                    <button
                      type="button"
                      onClick={() => goto("forgot")}
                      className="text-[13px] font-semibold text-brand underline-sweep transition-opacity duration-200 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <ShieldCheck className="size-3.5 text-brand" aria-hidden="true" />
                    Security check
                  </p>
                  <Turnstile
                    key={`${screen}-${captchaKey}`}
                    siteKey={TURNSTILE_SITE_KEY}
                    onVerify={(token) => {
                      setCaptchaToken(token);
                      setCaptchaError(null);
                      setTouched((t) => ({ ...t, captcha: false }));
                    }}
                    onExpire={() => setCaptchaToken("")}
                    onError={(message) => setCaptchaError(message)}
                    className="min-h-[65px] w-full overflow-hidden rounded-xl"
                  />
                </div>

                <AnimatePresence initial={false}>
                  {captchaError && <AuthAlert>{captchaError}</AuthAlert>}
                  {formError && <AuthAlert>{formError}</AuthAlert>}
                </AnimatePresence>

                <AuthSubmit
                  type="submit"
                  loading={status === "loading"}
                  icon={ArrowRight}
                  iconTrailing
                  label={screen === "login" ? "Sign In" : "Send Reset Link"}
                  loadingLabel={screen === "login" ? "Signing you in…" : "Sending link…"}
                />

                <p ref={liveRef} aria-live="polite" className="sr-only">
                  {status === "loading" ? "Submitting, please wait" : ""}
                </p>

                <div className="flex flex-col gap-2 border-t border-hairline pt-4 text-center text-[13px] text-muted-foreground">
                  {screen === "forgot" ? (
                    <button
                      type="button"
                      onClick={() => goto("login")}
                      className="mx-auto inline-flex items-center gap-2 font-semibold text-brand underline-sweep"
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      Back to sign in
                    </button>
                  ) : (
                    <p>
                      New to CrosX?{" "}
                      <Link
                        to="/register/publisher"
                        className="font-semibold text-brand underline-sweep"
                      >
                        Create an account
                      </Link>
                    </p>
                  )}
                </div>
              </form>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </AuthPanel>
  );
}
