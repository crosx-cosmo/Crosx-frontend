import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { Turnstile } from "@/components/ui-kit/Turnstile";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile";
import { adminSignIn, adminSignOut, getAdminSession } from "@/lib/admin-auth.functions";
import { fadeUp, stagger, EASE_LUX } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import { AdminShell } from "./AdminShell";

const containerVariants = stagger(0, 0.08);

const CONTROL =
  "h-12 w-full rounded-xl border bg-white pl-10 pr-11 text-sm text-[oklch(0.2_0.005_285)] placeholder:text-[oklch(0.62_0.008_285)] transition-[border-color,box-shadow] duration-300 focus:outline-none";

/**
 * Admin Login Console — a standalone, admin-only entrance for /admin/*.
 * It does not touch the publisher authentication system; credentials are
 * verified entirely on the server against project secrets.
 */
function AdminLoginConsole({ onSignedIn }: { onSignedIn: () => void }) {
  const signIn = useServerFn(adminSignIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (vars: { email: string; password: string; token: string }) =>
      signIn({ data: vars }),
    onSuccess: (result) => {
      if (result.ok) {
        toast.success("Welcome back, administrator.");
        onSignedIn();
      } else {
        setError(result.error);
        setToken("");
      }
    },
    onError: () => setError("Something went wrong. Please try again."),
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your admin email and password.");
      return;
    }
    if (!token) {
      setError("Please complete the security check.");
      return;
    }
    mutation.mutate({ email: email.trim(), password, token });
  }

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-[oklch(0.985_0_0)] px-4 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.17 0.005 285 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.17 0.005 285 / 0.08) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="size-[34rem] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, oklch(0.58 0.235 27.6 / 0.14) 0%, oklch(0.58 0.235 27.6 / 0.05) 45%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="relative z-10 w-full max-w-[26rem]"
      >
        <motion.div
          variants={fadeUp}
          className="rounded-[2rem] border border-[oklch(0.17_0.005_285/8%)] bg-white p-8 shadow-[0_0_0_1px_oklch(0.58_0.235_27.6/0.06),0_24px_80px_-24px_oklch(0.58_0.235_27.6/0.16),0_40px_100px_-40px_oklch(0_0_0/0.07)] sm:p-10"
        >
          <motion.div variants={fadeUp} className="flex flex-col items-center text-center">
            <Logo className="text-foreground" />
            <span className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[oklch(0.55_0.01_285)]">
              Restricted Access
            </span>
            <motion.div
              variants={fadeUp}
              className="mt-6 inline-flex size-16 items-center justify-center rounded-full bg-[oklch(0.58_0.235_27.6/0.07)] text-brand"
            >
              <ShieldCheck className="size-7" strokeWidth={1.5} aria-hidden="true" />
            </motion.div>
            <h1 className="mt-6 font-display text-[1.75rem] font-bold leading-[1.1] tracking-tight text-[oklch(0.18_0.005_285)] sm:text-[2rem]">
              Admin Console
            </h1>
            <p className="mt-3 max-w-[18rem] text-[0.9375rem] leading-relaxed text-[oklch(0.48_0.008_285)]">
              Sign in with your CrosX administrator credentials to manage campaigns, publishers and
              payouts.
            </p>
          </motion.div>

          <motion.form variants={fadeUp} onSubmit={submit} className="mt-8 flex flex-col gap-3.5">
            <label className="relative block">
              <span className="sr-only">Administrator email</span>
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[oklch(0.6_0.008_285)]"
              />
              <input
                type="email"
                name="admin-email"
                autoComplete="username"
                spellCheck={false}
                placeholder="Administrator email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  CONTROL,
                  "border-[oklch(0.17_0.005_285/12%)] focus:border-brand/60 focus:ring-2 focus:ring-brand/20",
                )}
              />
            </label>

            <label className="relative block">
              <span className="sr-only">Password</span>
              <Lock
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[oklch(0.6_0.008_285)]"
              />
              <input
                type={reveal ? "text" : "password"}
                name="admin-password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  CONTROL,
                  "border-[oklch(0.17_0.005_285/12%)] focus:border-brand/60 focus:ring-2 focus:ring-brand/20",
                )}
              />
              <button
                type="button"
                onClick={() => setReveal((v) => !v)}
                aria-label={reveal ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.6_0.008_285)] transition-colors duration-300 hover:text-brand"
              >
                {reveal ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </label>

            <Turnstile
              siteKey={TURNSTILE_SITE_KEY}
              onVerify={(t) => {
                setToken(t);
                setError(null);
              }}
              onExpire={() => setToken("")}
              onError={(message) => setError(message)}
              className="min-h-[65px]"
            />

            <AnimatePresence initial={false}>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.24, ease: EASE_LUX }}
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-[13px] font-medium text-destructive"
                >
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="group mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-primary-foreground shadow-[0_10px_28px_-10px_oklch(0.58_0.235_27.6/0.45)] transition-all duration-300 hover:bg-brand-soft active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Verifying
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>

            <Link
              to="/"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[oklch(0.17_0.005_285/10%)] px-6 text-sm font-semibold text-[oklch(0.32_0.008_285)] transition-colors duration-300 hover:bg-[oklch(0.97_0_0)]"
            >
              Back to CrosX
            </Link>
          </motion.form>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-center text-[11px] leading-relaxed text-[oklch(0.6_0.008_285)]"
          >
            This console is restricted to CrosX administrators. Publisher accounts cannot sign in
            here.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function AdminGate({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const fetchSession = useServerFn(getAdminSession);
  const signOut = useServerFn(adminSignOut);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-session"],
    queryFn: () => fetchSession(),
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-brand" aria-label="Loading admin console" />
      </div>
    );
  }

  if (!data?.admin) {
    return (
      <AdminLoginConsole
        onSignedIn={() => queryClient.invalidateQueries({ queryKey: ["admin-session"] })}
      />
    );
  }

  return (
    <AdminShell
      email={data.email}
      onSignOut={async () => {
        await signOut({ data: undefined });
        await queryClient.cancelQueries();
        queryClient.clear();
        toast.success("Signed out of the admin console.");
      }}
    >
      {children}
    </AdminShell>
  );
}
