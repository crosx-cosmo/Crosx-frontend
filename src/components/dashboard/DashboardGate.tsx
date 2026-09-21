import { Link } from "@tanstack/react-router";
import { MailCheck, Loader2, Shield, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { useSupabaseSession } from "@/lib/supabase-auth";
import { EASE_LUX, fadeUp, stagger } from "@/lib/motion-presets";
import { DashboardShell } from "./DashboardShell";

function Gatecard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof MailCheck;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative grid min-h-dvh place-items-center bg-background px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-lines opacity-30"
      />
      <div className="glass relative z-10 w-full max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto w-fit">
          <Logo />
        </div>
        <span className="mt-6 inline-grid size-12 place-items-center rounded-2xl bg-brand/12 text-brand">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-xl font-black tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>
      </div>
    </div>
  );
}

const containerVariants = stagger(0, 0.08);

/**
 * Premium private-workspace entrance for unauthenticated publishers.
 * White/off-white surface, subtle grid, soft brand glow, restrained motion.
 */
function PrivateWorkspaceEntrance() {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-[oklch(0.985_0_0)] px-4 py-10">
      {/* Subtle light grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.17 0.005 285 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.17 0.005 285 / 0.08) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Soft red/pink ambient glow */}
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
              Private Workspace
            </span>

            <motion.div
              variants={fadeUp}
              className="mt-6 inline-flex size-16 items-center justify-center rounded-full bg-[oklch(0.58_0.235_27.6/0.07)] text-brand"
            >
              <Shield className="size-7" strokeWidth={1.5} aria-hidden="true" />
            </motion.div>

            <h1 className="mt-6 font-display text-[1.75rem] font-bold leading-[1.1] tracking-tight text-[oklch(0.18_0.005_285)] sm:text-[2rem]">
              Publisher Workspace
            </h1>

            <p className="mt-3 max-w-[18rem] text-[0.9375rem] leading-relaxed text-[oklch(0.48_0.008_285)]">
              Sign in to your CrosX publisher account to access your private workspace.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3">
            <Link
              to="/auth"
              search={{ mode: "login" }}
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-primary-foreground shadow-[0_10px_28px_-10px_oklch(0.58_0.235_27.6/0.45)] transition-all duration-300 hover:bg-brand-soft hover:shadow-[0_14px_34px_-12px_oklch(0.58_0.235_27.6/0.55)] active:scale-[0.98]"
            >
              Sign In
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>

            <Link
              to="/register/publisher"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[oklch(0.17_0.005_285/10%)] bg-white px-6 text-sm font-semibold text-[oklch(0.18_0.005_285)] transition-all duration-300 hover:border-[oklch(0.58_0.235_27.6/0.35)] hover:bg-[oklch(0.58_0.235_27.6/0.03)] active:scale-[0.98]"
            >
              Create Publisher Account
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center justify-center gap-2 text-[11px] font-medium text-[oklch(0.58_0.01_285)]"
          >
            <span>CrosX Publisher Network</span>
            <span className="text-[oklch(0.58_0.235_27.6/0.5)]">•</span>
            <span>Secure Workspace</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * Read-only access gate: the dashboard is only rendered for a signed-in user
 * with a verified email. Existing auth flows are untouched.
 */
export function DashboardGate({ children }: { children: ReactNode }) {
  const { user, loading } = useSupabaseSession();

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-brand" aria-label="Loading dashboard" />
      </div>
    );
  }

  if (!user) {
    return <PrivateWorkspaceEntrance />;
  }

  if (!user.email_confirmed_at) {
    return (
      <Gatecard
        icon={MailCheck}
        title="Verify your email"
        description={`We sent a verification link to ${user.email ?? "your inbox"}. Confirm it to unlock the publisher dashboard.`}
      >
        <Link
          to="/auth"
          search={{ mode: "login" }}
          className="glass inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold transition-colors duration-300 hover:border-brand/50"
        >
          Resend verification
        </Link>
      </Gatecard>
    );
  }

  return <DashboardShell email={user.email}>{children}</DashboardShell>;
}
