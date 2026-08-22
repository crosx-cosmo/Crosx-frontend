import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ui-kit/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";

/** Page chrome shared by every authentication screen. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-lines opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 size-[32rem] rounded-full bg-brand/15 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 size-[26rem] rounded-full bg-brand/10 blur-[150px]"
      />

      <header className="relative z-10 mx-auto grid h-16 w-full max-w-[100rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:h-20 lg:px-10">
        <Link to="/" aria-label="CrosX home" className="min-w-0">
          <Logo />
        </Link>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            to="/"
            className="glass inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-brand/50"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[100rem] px-4 pb-20 pt-6 sm:px-6 lg:px-10 lg:pb-28 lg:pt-10">
        {children}
      </main>

      <footer className="relative z-10 border-t border-hairline">
        <div className="mx-auto flex w-full max-w-[100rem] flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-10">
          <p>© {new Date().getFullYear()} CrosX. All rights reserved.</p>
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            <a
              href="/privacy"
              className="font-medium transition-colors duration-200 hover:text-brand"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="font-medium transition-colors duration-200 hover:text-brand"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="mailto:support@crosx.in"
              className="font-medium transition-colors duration-200 hover:text-brand"
            >
              Support
            </a>
          </nav>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
