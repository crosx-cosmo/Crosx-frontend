import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSupabaseSession } from "@/lib/supabase-auth";
import { FALLBACK_DASHBOARD, resolveDashboardPath } from "@/lib/role-redirect";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { AuthExperience, type AuthMode } from "@/components/auth/AuthExperience";

const TITLE = "Sign In or Create Your CrosX Account";
const DESCRIPTION =
  "Access your CrosX account to manage campaigns, track live performance and unlock premium advertising inventory. Secure sign in, sign up and password recovery.";

const MODES: AuthMode[] = ["login", "signup", "forgot"];

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode: AuthMode } => {
    const raw = typeof search.mode === "string" ? search.mode : "login";
    return { mode: (MODES as string[]).includes(raw) ? (raw as AuthMode) : "login" };
  },
  component: AuthPage,
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
    ],
  }),
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useSupabaseSession();

  // Signed-in users never see the login page again — send them to their dashboard.
  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;
    void resolveDashboardPath(user.id)
      .catch(() => FALLBACK_DASHBOARD)
      .then((target) => {
        if (!cancelled) void navigate({ to: target, replace: true });
      });
    return () => {
      cancelled = true;
    };
  }, [loading, user, navigate]);

  return (
    <AuthShell>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] xl:gap-20">
        <div className="order-2 lg:order-1 lg:sticky lg:top-10 lg:self-start">
          <AuthShowcase />
        </div>
        <div className="order-1 lg:order-2">
          <AuthExperience initialMode={mode} />
        </div>
      </div>
    </AuthShell>
  );
}
