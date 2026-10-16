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

export const crosxSupabase = createClient<Database>(
  CROSX_SUPABASE_URL,
  CROSX_SUPABASE_PUBLISHABLE_KEY,
  {
    global: { fetch: createCrosxFetch(CROSX_SUPABASE_PUBLISHABLE_KEY) },
    auth: { persistSession: true, autoRefreshToken: true },
  },
);
