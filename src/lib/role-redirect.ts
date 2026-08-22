import { getSupabase } from "./supabase-external";

export type DashboardPath =
  | "/admin/dashboard"
  | "/advertiser/dashboard"
  | "/publisher/dashboard"
  | "/influencer/dashboard";

export const FALLBACK_DASHBOARD: DashboardPath = "/publisher/dashboard";

function pathFromRole(role?: string | null, accountType?: string | null): DashboardPath {
  const r = (role ?? "").toLowerCase().replace(/[\s_-]+/g, "");
  if (r === "superadmin" || r === "admin" || r === "owner") return "/admin/dashboard";

  const t = (accountType ?? "").toLowerCase();
  if (t === "advertiser") return "/advertiser/dashboard";
  if (t === "publisher") return "/publisher/dashboard";
  if (t === "influencer") return "/influencer/dashboard";

  if (r === "advertiser") return "/advertiser/dashboard";
  if (r === "publisher") return "/publisher/dashboard";
  if (r === "influencer") return "/influencer/dashboard";

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
