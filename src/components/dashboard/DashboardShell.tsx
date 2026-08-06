import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ThemeToggle } from "@/components/ui-kit/ThemeToggle";
import { DesktopSidebar, MobileSidebar } from "./DashboardSidebar";

export function DashboardShell({
  email,
  children,
}: {
  email?: string | null;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-dvh bg-background">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 grid-lines opacity-30" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-32 top-0 size-[30rem] rounded-full bg-brand/10 blur-[160px]"
      />

      <div className="relative z-10 flex">
        <DesktopSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-hairline bg-background/70 px-4 py-3 backdrop-blur-xl sm:px-6 lg:h-20 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                className="glass grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground lg:hidden"
              >
                <Menu className="size-4" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Publisher Console
                </p>
                <p className="truncate text-sm font-semibold">{email ?? "CrosX Publisher"}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link
                to="/"
                className="glass hidden h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors duration-300 hover:border-brand/50 sm:inline-flex"
              >
                Back to site
              </Link>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:mb-8">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
