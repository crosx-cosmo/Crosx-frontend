/**
 * Canonical, absolute site origin used for auth email redirects.
 *
 * Hardcoded to the production domain so Supabase verification links can never
 * point at a local dev server, regardless of where the build runs.
 */
const PRODUCTION_SITE_URL = "https://www.crosx.in";

function stripTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}

export function getSiteUrl(): string {
  return stripTrailingSlash(PRODUCTION_SITE_URL);
}

/** Absolute URL for an auth redirect path, e.g. `/`. */
export function getAuthRedirectUrl(path = "/"): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${suffix === "/" ? "/" : suffix}`;
}
