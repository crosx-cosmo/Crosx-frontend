import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/ui-kit/ThemeToggle";
import { DesktopSidebar, MobileSidebar } from "./DashboardSidebar";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationBell } from "./NotificationBell";
import { PublisherMockProvider } from "./mock-store";

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
    <PublisherMockProvider>
      <div className="relative min-h-dvh bg-background">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 grid-lines opacity-30"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed -left-32 top-0 size-[30rem] rounded-full bg-brand/10 blur-[160px]"
        />

        <div className="relative z-10 flex">
          <DesktopSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
          <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 border-b border-hairline bg-background/75 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open navigation"
                    className="glass grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground lg:hidden"
                  >
                    <Menu className="size-4" aria-hidden="true" />
                  </button>
                  <div className="hidden min-w-0 lg:block">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Publisher Console
                    </p>
                    <p className="truncate text-sm font-semibold">{email ?? "CrosX Publisher"}</p>
                  </div>
                  <div className="hidden min-w-0 flex-1 md:flex">
                    <GlobalSearch />
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                  <NotificationBell />
                  <ThemeToggle />
                  <Link
                    to="/"
                    className="glass hidden h-10 items-center rounded-xl px-4 text-sm font-semibold transition-colors duration-300 hover:border-brand/50 xl:inline-flex"
                  >
                    Back to site
                  </Link>
                </div>
              </div>
              <div className="mt-3 md:hidden">
                <GlobalSearch />
              </div>
            </header>

            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-9">{children}</main>
          </div>
        </div>

        <Toaster />
      </div>
    </PublisherMockProvider>
  );
}

export function PageHeader({
  title,
  eyebrow,
  description,
  action,
}: {
  title: string;
  eyebrow?: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 grid gap-4 sm:mb-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {action ? <div className="flex flex-wrap gap-2 sm:justify-end">{action}</div> : null}
    </div>
  );
}
