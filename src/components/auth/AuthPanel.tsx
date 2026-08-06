import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EASE_LUX } from "@/lib/motion-presets";

/** Glass card wrapper for every auth form. */
export function AuthPanel({ children }: { children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE_LUX }}
      className="glass grain relative w-full overflow-hidden rounded-3xl p-5 shadow-lux sm:p-7 lg:p-9"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-brand/12 blur-[90px]"
      />
      <div className="relative flex flex-col gap-6">{children}</div>
    </motion.section>
  );
}

/** Primary brand submit button with a premium loading state. */
export function AuthSubmit({
  loading,
  label,
  loadingLabel,
  icon: Icon,
  iconTrailing,
  className,
  ...props
}: {
  loading?: boolean;
  label: string;
  loadingLabel?: string;
  icon?: React.ElementType;
  iconTrailing?: boolean;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      aria-busy={loading}
      className={cn(
        "group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-brand text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-14px_var(--brand)] transition-[transform,background-color,box-shadow,opacity] duration-300 will-change-transform sheen hover:-translate-y-0.5 hover:bg-brand-soft hover:shadow-[0_18px_44px_-16px_var(--brand)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {loadingLabel ?? "Please wait…"}
        </>
      ) : (
        <>
          {Icon && !iconTrailing && <Icon className="size-4" aria-hidden="true" />}
          {label}
          {Icon && iconTrailing && (
            <Icon
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </button>
  );
}

/** Confirmation screen for email verification / reset link states. */
export function SentState({
  icon: Icon,
  title,
  email,
  description,
  actions,
}: {
  icon: React.ElementType;
  title: string;
  email: string;
  description: string;
  actions: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <span className="relative grid size-16 place-items-center rounded-2xl bg-brand/10 text-brand">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl border border-brand/30 pulse-ring"
        />
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        {email && (
          <p className="mx-auto w-fit rounded-full bg-surface-2 px-3 py-1 text-[13px] font-semibold">
            {email}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col items-center gap-2">{actions}</div>
      <p className="text-xs text-muted-foreground">
        Didn&apos;t receive it? Check your spam folder or resend the email.
      </p>
    </div>
  );
}
