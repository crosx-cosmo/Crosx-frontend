/** Human-friendly copy for Supabase auth errors, with a safe fallback. */
export function authErrorMessage(error: unknown): string {
  const raw =
    typeof error === "object" && error && "message" in error
      ? String((error as { message: unknown }).message)
      : typeof error === "string"
        ? error
        : "";
  const msg = raw.toLowerCase();

  if (!msg) return "Something went wrong. Please try again.";
  if (msg.includes("invalid login credentials"))
    return "Incorrect email or password. Please try again.";
  if (msg.includes("email not confirmed"))
    return "Please confirm your email first — check your inbox for the verification link.";
  if (msg.includes("user already registered") || msg.includes("already been registered"))
    return "An account with this email already exists. Try signing in instead.";
  if (msg.includes("password should be at least"))
    return "Your password is too short. Use at least 8 characters.";
  if (msg.includes("pwned") || msg.includes("compromised") || msg.includes("weak password"))
    return "This password appeared in a known data breach. Please choose a stronger one.";
  if (msg.includes("captcha")) return "Security check failed. Please complete the challenge again.";
  if (msg.includes("rate limit") || msg.includes("too many"))
    return "Too many attempts. Please wait a minute and try again.";
  if (msg.includes("same password"))
    return "Your new password must be different from the previous one.";
  if (msg.includes("session") && msg.includes("missing"))
    return "This reset link has expired. Request a new one to continue.";
  if (msg.includes("expired")) return "This link has expired. Please request a new one.";
  if (msg.includes("failed to fetch") || msg.includes("network"))
    return "Network error. Check your connection and try again.";

  return raw;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
