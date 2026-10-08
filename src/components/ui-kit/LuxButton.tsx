import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const luxButton = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full text-sm font-bold tracking-[0.01em] transition-[transform,background-color,border-color,box-shadow,opacity] duration-300 will-change-transform active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        brand:
          "bg-brand font-extrabold text-primary-foreground drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] shadow-[0_10px_30px_-14px_var(--brand)] hover:bg-brand-soft hover:shadow-[0_18px_44px_-16px_var(--brand)] hover:-translate-y-0.5 sheen",
        ghostGlass:
          "glass text-foreground hover:border-brand/50 hover:-translate-y-0.5 hover:shadow-lux sheen",
        outline:
          "border border-border bg-transparent text-foreground hover:border-brand/60 hover:-translate-y-0.5",
        subtle: "bg-surface-2 text-foreground hover:bg-surface",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-[15px] sm:h-13 sm:px-8",
      },
    },
    defaultVariants: { variant: "brand", size: "md" },
  },
);

type LuxVariants = VariantProps<typeof luxButton>;

export function LuxButton({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & LuxVariants & { children: ReactNode }) {
  return (
    <button className={cn(luxButton({ variant, size }), className)} {...props}>
      {children}
    </button>
  );
}

export function LuxLink({
  className,
  variant,
  size,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & LuxVariants & { children: ReactNode }) {
  return (
    <a className={cn(luxButton({ variant, size }), className)} {...props}>
      {children}
    </a>
  );
}
