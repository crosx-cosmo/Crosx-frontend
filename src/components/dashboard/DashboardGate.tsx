import { Link } from "@tanstack/react-router";
import { MailCheck, Loader2, LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { useSupabaseSession } from "@/lib/supabase-auth";
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
    return (
      <Gatecard
        icon={LockKeyhole}
        title="Publisher access only"
        description="Sign in to your CrosX publisher account to open the dashboard."
      >
        <Link
          to="/auth"
          search={{ mode: "login" }}
          className="inline-flex h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-primary-foreground transition-colors duration-300 hover:bg-brand-soft"
        >
          Sign in
        </Link>
        <Link
          to="/register/publisher"
          className="glass inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold transition-colors duration-300 hover:border-brand/50"
        >
          Register
        </Link>
      </Gatecard>
    );
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
