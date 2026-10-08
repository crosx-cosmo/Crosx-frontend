import { createMiddleware } from "@tanstack/react-start";
import { crosxSupabase } from "./crosx-supabase";

export const attachCrosxAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const { data } = await crosxSupabase.auth.getSession();
  const token = data.session?.access_token;
  return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});
