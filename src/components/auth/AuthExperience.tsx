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
  User,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EASE_LUX } from "@/lib/motion-presets";
import { Turnstile } from "@/components/ui-kit/Turnstile";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile";
import {
  resendVerificationEmail,
  sendPasswordReset,
  signInWithEmail,
  signUpWithEmail,
} from "@/lib/supabase-auth";
import { EMAIL_PATTERN, authErrorMessage } from "@/lib/auth-errors";
import {
  AuthAlert,
  AuthInput,
  PasswordStrength,
  RevealToggle,
  passwordScore,
  type FieldState,
} from "./AuthField";
import { AuthPanel, AuthSubmit, SentState } from "./AuthPanel";

export type AuthMode = "login" | "signup" | "forgot";
type Screen = AuthMode | "verify-sent" | "reset-sent";

const TABS: { id: AuthMode; label: string }[] = [{ id: "login", label: "Sign In" }];

const COPY: Record<AuthMode, { title: string; subtitle: string }> = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to your CrosX account to continue where you left off.",
  },
  signup: {
    title: "Create your account",
    subtitle: "Join CrosX and unlock premium campaigns, live analytics and fast payouts.",
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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sentTo, setSentTo] = useState("");

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const liveRef = useRef<HTMLParagraphElement>(null);
  const mode: AuthMode = screen === "verify-sent" || screen === "reset-sent" ? "login" : screen;
  const isForm = screen === "login" || screen === "signup" || screen === "forgot";

  useEffect(() => {
    setScreen(initialMode);
  }, [initialMode]);

  const goto = (next: AuthMode) => {
    setScreen(next);
    setFormError(null);
    setTouched({});
    setCaptchaToken(null);
    setCaptchaError(null);
    void navigate({ to: "/auth", search: { mode: next }, replace: true });
  };

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) e.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(trimmedEmail)) e.email = "Enter a valid email address.";

    if (screen === "signup") {
      if (!fullName.trim()) e.fullName = "Full name is required.";
      else if (fullName.trim().length < 3) e.fullName = "Please enter your full name.";
      if (!password) e.password = "Password is required.";
      else if (password.length < 8) e.password = "Use at least 8 characters.";
      else if (passwordScore(password) < 2) e.password = "Add numbers or symbols for strength.";
      if (!confirm) e.confirm = "Please confirm your password.";
      else if (confirm !== password) e.confirm = "Passwords do not match.";
      if (!accepted) e.accepted = "Please accept the Terms & Conditions.";
    }

    if (screen === "login" && !password) e.password = "Password is required.";
    return e;
  }, [screen, email, fullName, password, confirm, accepted]);

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
      toast.error("Please check the highlighted fields");
      return;
    }

    if (!captchaToken) {
      setCaptchaError("Please complete the security check to continue.");
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
        void navigate({ to: "/" });
        return;
      }

      if (screen === "signup") {
        const { data, error } = await signUpWithEmail(
          cleanEmail,
          password,
          { full_name: fullName.trim(), email: cleanEmail },
          captchaToken,
        );
        if (error) throw error;
        setSentTo(cleanEmail);
        if (data.session) {
          toast.success("Account created", { description: "Welcome to CrosX." });
          void navigate({ to: "/" });
          return;
        }
        setScreen("verify-sent");
        toast.success("Verify your email", {
          description: `We sent a confirmation link to ${cleanEmail}.`,
        });
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
      toast.error("Request failed", { description: message });
      setCaptchaToken(null);
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
      {/* Sign In tab */}
      {isForm && (
        <div className="relative rounded-full border border-hairline bg-surface/60 p-1 shadow-plate">
          {TABS.map((tab) => {
            const active = isForm;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => goto(tab.id)}
                aria-pressed={active}
                className={cn(
                  "relative z-10 h-10 w-full rounded-full text-sm font-semibold transition-colors duration-300",
                  active
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="auth-tab"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 -z-10 rounded-full bg-brand shadow-[0_10px_30px_-14px_var(--brand)]"
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

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
                {screen === "signup" && (
                  <AuthInput
                    id="auth-name"
                    label="Full Name"
                    icon={User}
                    required
                    autoComplete="name"
                    placeholder="Aarav Sharma"
                    value={fullName}
                    onValueChange={setFullName}
                    onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                    state={stateOf("fullName", fullName)}
                    message={messageOf("fullName")}
                  />
                )}

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
                  <div className="flex flex-col gap-2">
                    <AuthInput
                      id="auth-password"
                      label="Password"
                      icon={Lock}
                      required
                      type={showPassword ? "text" : "password"}
                      autoComplete={screen === "signup" ? "new-password" : "current-password"}
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
                    {screen === "signup" && <PasswordStrength password={password} />}
                  </div>
                )}

                {screen === "signup" && (
                  <AuthInput
                    id="auth-confirm"
                    label="Confirm Password"
                    icon={Lock}
                    required
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirm}
                    onValueChange={setConfirm}
                    onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                    state={stateOf("confirm", confirm)}
                    message={messageOf("confirm")}
                    trailing={
                      <RevealToggle
                        shown={showConfirm}
                        onToggle={() => setShowConfirm((v) => !v)}
                        label="confirmation password"
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

                {screen === "signup" && (
                  <label
                    className={cn(
                      "flex cursor-pointer select-none items-start gap-3 rounded-xl border p-3 text-[13px] leading-relaxed transition-colors duration-300",
                      touched.accepted && errors.accepted
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-hairline bg-surface/50 hover:border-brand/40",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => {
                        setAccepted(e.target.checked);
                        setTouched((t) => ({ ...t, accepted: true }));
                      }}
                      className="peer sr-only"
                      aria-describedby="auth-terms-error"
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 grid size-4 shrink-0 place-items-center rounded border transition-colors duration-200",
                        accepted ? "border-brand bg-brand" : "border-input bg-surface",
                      )}
                    >
                      {accepted && (
                        <CheckCircle2
                          className="size-3 text-primary-foreground"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      I agree to the{" "}
                      <a href="/terms" className="font-semibold text-brand underline-sweep">
                        Terms &amp; Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="font-semibold text-brand underline-sweep">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                )}

                {/* Security check */}
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <ShieldCheck className="size-3.5 text-brand" aria-hidden="true" />
                    Security check
                  </span>
                  <Turnstile
                    key={screen}
                    siteKey={TURNSTILE_SITE_KEY}
                    className="min-h-[65px] overflow-hidden rounded-xl"
                    onVerify={(token) => {
                      setCaptchaToken(token);
                      setCaptchaError(null);
                    }}
                    onExpire={() => setCaptchaToken(null)}
                    onError={(m) => setCaptchaError(m)}
                  />
                  <AnimatePresence initial={false}>
                    {captchaError && <AuthAlert>{captchaError}</AuthAlert>}
                  </AnimatePresence>
                </div>

                <AnimatePresence initial={false}>
                  {formError && <AuthAlert>{formError}</AuthAlert>}
                </AnimatePresence>

                <AuthSubmit
                  type="submit"
                  loading={status === "loading"}
                  icon={ArrowRight}
                  iconTrailing
                  label={
                    screen === "login"
                      ? "Sign In"
                      : screen === "signup"
                        ? "Create Account"
                        : "Send Reset Link"
                  }
                  loadingLabel={
                    screen === "login"
                      ? "Signing you in…"
                      : screen === "signup"
                        ? "Creating your account…"
                        : "Sending link…"
                  }
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
                  ) : screen === "login" ? (
                    <p>
                      New to CrosX?{" "}
                      <button
                        type="button"
                        onClick={() => goto("signup")}
                        className="font-semibold text-brand underline-sweep"
                      >
                        Create an account
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => goto("login")}
                        className="font-semibold text-brand underline-sweep"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                  <p>
                    Publisher?{" "}
                    <Link
                      to="/register/publisher"
                      className="font-semibold text-foreground underline-sweep"
                    >
                      Complete the full publisher registration
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </AuthPanel>
  );
}
