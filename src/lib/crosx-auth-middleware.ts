import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { CROSX_SUPABASE_PUBLISHABLE_KEY, CROSX_SUPABASE_URL } from "./crosx-config";

function createCrosxFetch(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) new Headers(init.headers).forEach((value, name) => headers.set(name, value));
    if (headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

export const requireCrosxAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();
    const authorization = request?.headers.get("authorization") ?? "";
    if (!authorization.startsWith("Bearer ")) throw new Error("Unauthorized");

    const token = authorization.slice("Bearer ".length);
    if (!token || token.split(".").length !== 3) throw new Error("Unauthorized");

    const supabase = createClient<Database>(CROSX_SUPABASE_URL, CROSX_SUPABASE_PUBLISHABLE_KEY, {
      global: {
        fetch: createCrosxFetch(CROSX_SUPABASE_PUBLISHABLE_KEY),
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.getClaims(token);
    if (error || !data?.claims?.sub) throw new Error("Unauthorized");

    return next({
      context: { supabase, userId: data.claims.sub, claims: data.claims },
    });
  },
);
