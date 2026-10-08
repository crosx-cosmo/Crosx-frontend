import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { CROSX_SUPABASE_PUBLISHABLE_KEY, CROSX_SUPABASE_URL } from "./crosx-config";

function createCrosxFetch(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) new Headers(init.headers).forEach((value, name) => headers.set(name, value));
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

/**
 * Server-side client using only the public (publishable/anon) key.
 * Booking runs through SECURITY DEFINER RPCs, so no server secret is needed —
 * this works identically in the Lovable preview and the deployed production worker.
 */
export function getCrosxPublicServerClient() {
  return createClient<Database>(CROSX_SUPABASE_URL, CROSX_SUPABASE_PUBLISHABLE_KEY, {
    global: { fetch: createCrosxFetch(CROSX_SUPABASE_PUBLISHABLE_KEY) },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const CROSX_FUNCTIONS_URL = `${CROSX_SUPABASE_URL}/functions/v1`;
export { CROSX_SUPABASE_PUBLISHABLE_KEY };

type RpcResult = { data: unknown; error: { message?: string } | null };

/** Generated Database types don't include the CrosX booking RPCs, so call them loosely. */
export async function crosxRpc(
  name: string,
  args: Record<string, unknown>,
): Promise<RpcResult> {
  const client = getCrosxPublicServerClient() as unknown as {
    rpc: (fn: string, params: Record<string, unknown>) => Promise<RpcResult>;
  };
  return client.rpc(name, args);
}
