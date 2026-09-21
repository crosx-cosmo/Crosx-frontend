import { getSupabase } from "./supabase-external";

export type DashboardPath = "/admin/dashboard" | "/publisher/dashboard" | "/coming-soon";

export const FALLBACK_DASHBOARD: DashboardPath = "/publisher/dashboard";

/**
 * Advertiser and influencer workspaces are not built yet, so those accounts land
 * on the Coming Soon page instead of a dead route.
 */
function pathFromRole(role?: string | null, accountType?: string | null): DashboardPath {
  const r = (role ?? "").toLowerCase().replace(/[\s_-]+/g, "");
  if (r === "superadmin" || r === "admin" || r === "owner") return "/admin/dashboard";

  const t = (accountType ?? "").toLowerCase();
  if (t === "advertiser" || t === "influencer") return "/coming-soon";
  if (t === "publisher") return "/publisher/dashboard";

  if (r === "advertiser" || r === "influencer") return "/coming-soon";
  if (r === "publisher") return "/publisher/dashboard";

  return FALLBACK_DASHBOARD;
}

/**
 * Resolve the dashboard route for a signed-in user from their profile role.
 * Never throws — falls back to /dashboard when no role can be read.
 */
export async function resolveDashboardPath(userId: string): Promise<DashboardPath> {
  try {
    const { data, error } = await getSupabase()
      .from("profiles")
      .select("role, account_type")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return FALLBACK_DASHBOARD;
    return pathFromRole(data.role, data.account_type);
  } catch {
    return FALLBACK_DASHBOARD;
  }
}
