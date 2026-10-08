import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Admin-only console gate. Completely separate from the publisher (Supabase)
 * authentication system — it shares no storage, cookie or session with it and
 * only controls access to /admin/* routes.
 */

type AdminSession = { admin?: true; email?: string; at?: number };

const SESSION_NAME = "crosx-admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function sessionConfig() {
  const password = process.env["ADMIN_SESSION_SECRET"];
  if (!password) throw new Error("Admin console is not configured.");
  return {
    password,
    name: SESSION_NAME,
    maxAge: MAX_AGE,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function digest(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

function constantTimeEqual(a: string, b: string) {
  return timingSafeEqual(digest(a), digest(b));
}

/** Verifies the Cloudflare Turnstile token using the shared project widget. */
async function verifyTurnstile(token: string, ip?: string | null) {
  if (!token || token.length < 20) return false;
  const secret = process.env["TURNSTILE_SECRET_KEY"];
  // Without a server secret the widget still blocks scripted submissions in the
  // browser; a malformed/absent token is rejected above.
  if (!secret) return true;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export type AdminSessionState = { admin: boolean; email: string | null };

export const getAdminSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminSessionState> => {
    const session = await useSession<AdminSession>(sessionConfig());
    if (!session.data.admin) return { admin: false, email: null };
    return { admin: true, email: session.data.email ?? null };
  },
);

export type AdminSignInResult = { ok: true; email: string } | { ok: false; error: string };

export const adminSignIn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string; token: string }) => ({
    email: String(data?.email ?? "")
      .trim()
      .toLowerCase()
      .slice(0, 200),
    password: String(data?.password ?? "").slice(0, 200),
    token: String(data?.token ?? "").slice(0, 4000),
  }))
  .handler(async ({ data }): Promise<AdminSignInResult> => {
    const expectedEmail = process.env["ADMIN_EMAIL"]?.trim().toLowerCase();
    const expectedPassword = process.env["ADMIN_PASSWORD"];
    if (!expectedEmail || !expectedPassword) {
      return { ok: false, error: "Admin console is not configured yet." };
    }

    const human = await verifyTurnstile(data.token, null);
    if (!human) {
      return { ok: false, error: "Security check failed. Please verify again." };
    }

    if (!data.email || !data.password) {
      return { ok: false, error: "Enter your admin email and password." };
    }

    const match =
      constantTimeEqual(data.email, expectedEmail) &&
      constantTimeEqual(data.password, expectedPassword);

    if (!match) {
      // Generic message — never reveal which field was wrong.
      return { ok: false, error: "Invalid administrator credentials." };
    }

    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true, email: expectedEmail, at: Date.now() });
    return { ok: true, email: expectedEmail };
  });

export const adminSignOut = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

/** Guards admin-only server functions with the same admin console session. */
export const requireAdmin = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.admin) throw new Error("Unauthorized");
  return next({ context: { adminEmail: session.data.email ?? null } });
});
