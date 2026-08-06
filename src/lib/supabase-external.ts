import { supabase } from "@/integrations/supabase/client";

/**
 * Single Supabase client for the app.
 *
 * Backed by the project's managed backend (schema, RLS, storage and auth are
 * provisioned automatically). Kept as a function so existing call sites
 * (`getSupabase()`) keep working.
 */
export function getSupabase() {
  return supabase;
}
