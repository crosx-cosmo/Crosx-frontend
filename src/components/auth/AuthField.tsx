import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_LUX } from "@/lib/motion-presets";

export type FieldState = "idle" | "valid" | "error";

export const CONTROL_BASE =
  "h-12 w-full rounded-xl border bg-surface/60 pl-10 pr-3 text-sm shadow-plate transition-[border-color,box-shadow,background-color] duration-300 focus:outline-none";

export function controlTone(state: FieldState) {
  if (state === "error")
    return "border-destructive/60 focus:border-destructive focus:ring-2 focus:ring-destructive/25";
  if (state === "valid")
    return "border-brand/45 focus:border-brand/70 focus:ring-2 focus:ring-brand/25";
  return "border-input hover:border-brand/40 focus:border-brand/60 focus:ring-2 focus:ring-brand/25";
}

function LeadIcon({ as: As, state }: { as: React.ElementType; state: FieldState }) {
  return (
    <As
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 transition-colors duration-300",
        state === "error"
          ? "text-destructive"
          : state === "valid"
            ? "text-brand"
            : "text-muted-foreground",
      )}
    />
  );
}

/** Floating-label text input matching the CrosX registration controls. */
export function AuthInput({
  id,
  label,
  icon,
  value,
  onValueChange,
  onBlur,
  state,
  message,
  required,
  trailing,
  className,
  ...rest
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  value: string;
  onValueChange: (v: string) => void;
  onBlur?: () => void;
  state: FieldState;
  message?: string;
  required?: boolean;
  trailing?: React.ReactNode;
  className?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "onBlur" | "className" | "id"
>) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const messageId = message ? `${id}-message` : undefined;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="relative">
        <LeadIcon as={icon} state={state} />
        <input
          {...rest}
          id={id}
          value={value}
          aria-invalid={state === "error"}
          aria-describedby={messageId}
          onChange={(e) => onValueChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          className={cn(
            CONTROL_BASE,
            controlTone(state),
            "text-foreground placeholder:text-muted-foreground/70",
            !floated && "placeholder:text-transparent",
            trailing && "pr-11",
          )}
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-9 z-10 origin-left px-1.5 font-medium transition-all duration-200 ease-out",
            floated
              ? "top-0 -translate-y-1/2 rounded bg-background text-[11px] tracking-wide"
              : "top-1/2 -translate-y-1/2 text-sm",
            state === "error"
              ? "text-destructive"
              : floated
                ? "text-brand"
                : "text-muted-foreground",
          )}
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-destructive">
              *
            </span>
          )}
        </label>
        {trailing}
        {state === "valid" && !trailing && (
          <Check
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand"
            aria-hidden="true"
          />
        )}
      </div>
      <AnimatePresence initial={false}>
        {message && (
          <motion.p
            id={messageId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: EASE_LUX }}
            className={cn(
              "flex items-center gap-1.5 px-1 text-[11px] font-medium",
              state === "error" ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {state === "error" && <AlertTriangle className="size-3" aria-hidden="true" />}
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Show / hide toggle button placed inside a password field. */
export function RevealToggle({
  shown,
  onToggle,
  label,
}: {
  shown: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? `Hide ${label}` : `Show ${label}`}
      className="absolute right-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
    >
      {shown ? (
        <EyeOff className="size-4" aria-hidden="true" />
      ) : (
        <Eye className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}

const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Strong", "Excellent"] as const;

export function passwordScore(password: string) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

export function PasswordStrength({ password }: { password: string }) {
  const score = passwordScore(password);
  if (!password) return null;

  return (
    <div className="flex flex-col gap-1.5 px-1" aria-live="polite">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
            <motion.span
              initial={false}
              animate={{ scaleX: i < score ? 1 : 0 }}
              transition={{ duration: 0.35, ease: EASE_LUX }}
              className={cn(
                "block h-full w-full origin-left rounded-full",
                score <= 1 ? "bg-destructive" : score === 2 ? "bg-brand-soft" : "bg-brand",
              )}
            />
          </span>
        ))}
      </div>
      <p className="text-[11px] font-medium text-muted-foreground">
        Password strength:{" "}
        <span className={cn(score <= 1 ? "text-destructive" : "text-brand")}>
          {STRENGTH_LABELS[score]}
        </span>
      </p>
    </div>
  );
}

/** Styled inline alert used for Turnstile and Supabase errors. */
export function AuthAlert({
  tone = "error",
  children,
}: {
  tone?: "error" | "info";
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: EASE_LUX }}
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-xl border p-3 text-[13px] font-medium",
        tone === "error"
          ? "border-destructive/35 bg-destructive/10 text-destructive"
          : "border-brand/30 bg-brand/5 text-foreground",
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </motion.div>
  );
}
