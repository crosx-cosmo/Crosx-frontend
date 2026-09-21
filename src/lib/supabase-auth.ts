import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { getSupabase } from "./supabase-external";
import { getAuthRedirectUrl } from "./site-url";

/** Sign up with email + password on the external Supabase project. */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: Record<string, unknown>,
  captchaToken?: string,
) {
  return getSupabase().auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthRedirectUrl("/"),
      ...(metadata ? { data: metadata } : {}),
      ...(captchaToken ? { captchaToken } : {}),
    },
  });
}

export async function signInWithEmail(email: string, password: string, captchaToken?: string) {
  return getSupabase().auth.signInWithPassword({
    email,
    password,
    ...(captchaToken ? { options: { captchaToken } } : {}),
  });
}

export async function sendPasswordReset(email: string, captchaToken?: string) {
  return getSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: getAuthRedirectUrl("/reset-password"),
    ...(captchaToken ? { captchaToken } : {}),
  });
}

/** Re-send the signup confirmation email. */
export async function resendVerificationEmail(email: string) {
  return getSupabase().auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: getAuthRedirectUrl("/") },
  });
}

/** Set a new password for the currently recovered / signed-in user. */
export async function updatePassword(password: string) {
  return getSupabase().auth.updateUser({ password });
}

export async function signOut() {
  return getSupabase().auth.signOut();
}

/**
 * Live session state from the external Supabase project.
 * Registers the auth listener first, then validates the current user.
 */
export function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    void supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, user, loading, isAuthenticated: Boolean(user) };
}
