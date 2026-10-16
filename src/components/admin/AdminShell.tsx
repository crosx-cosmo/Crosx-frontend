import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Menu, Search, Target, Users, Wallet, CornerDownLeft, LogOut } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/ui-kit/ThemeToggle";
import { DesktopSidebar, MobileSidebar } from "./AdminSidebar";
import { EASE_LUX } from "@/lib/motion-presets";
import {
  ADMIN_NOTIFICATIONS,
  ADMIN_TOTALS,
  CAMPAIGNS,
  PUBLISHERS,
  PENDING_PAYOUTS,
  inr,
} from "@/lib/admin-data";

/* ------------------------------------------------------------ global search */

type Result = { group: string; label: string; meta: string; to: string; icon: typeof Target };

function AdminSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  const results = useMemo<Result[]>(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const out: Result[] = [];

    for (const c of CAMPAIGNS) {
      if (c.name.toLowerCase().includes(term) || c.advertiser.toLowerCase().includes(term)) {
        out.push({
          group: "Campaigns",
          label: c.name,
          meta: `${c.advertiser} • ${c.model} ₹${c.revenuePerConv}`,
          to: "/admin/dashboard/campaigns/all",
          icon: Target,
        });
      }
    }
    for (const p of PUBLISHERS) {
      if (
        p.name.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        p.company.toLowerCase().includes(term)
      ) {
        out.push({
          group: "Publishers",
          label: `${p.name} — ${p.id}`,
          meta: `${p.company} • ${p.status}`,
          to: "/admin/dashboard/publishers/all",
          icon: Users,
        });
      }
    }
    for (const p of PENDING_PAYOUTS) {
      if (p.id.toLowerCase().includes(term) || p.publisher.toLowerCase().includes(term)) {
        out.push({
          group: "Payouts",
          label: p.id,
          meta: `${p.publisher} • ${inr(p.amount)}`,
          to: "/admin/dashboard/payment/pending",
          icon: Wallet,
        });
      }
    }
    return out.slice(0, 7);
  }, [q]);

  return (
    <div ref={ref} className="relative w-full max-w-xl">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search campaigns, publishers, payouts..."
        className="h-10 w-full rounded-xl border border-input bg-surface-2/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
      />
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: EASE_LUX }}
            className="glass absolute left-0 right-0 top-12 z-50 max-h-80 overflow-y-auto rounded-2xl p-2 shadow-lux"
          >
            {results.map((r, i) => (
              <li key={`${r.group}-${r.label}-${i}`}>
                <Link
                  to={r.to}
                  onClick={() => {
                    setOpen(false);
                    setQ("");
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-surface-2/70"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
                    <r.icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">{r.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{r.meta}</span>
                  </span>
                  <CornerDownLeft
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------ notifications */

function AdminBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(ADMIN_NOTIFICATIONS);
  const unread = items.filter((n) => !n.read).length;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        className="glass relative grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors duration-300 hover:border-brand/50 hover:text-foreground"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-brand text-[9px] font-bold text-primary-foreground">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE_LUX }}
            className="glass absolute right-0 top-12 z-50 w-[20rem] max-w-[calc(100vw-2rem)] rounded-2xl p-2 shadow-lux"
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Notifications
              </p>
              <button
                type="button"
                onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
                className="text-[11px] font-semibold text-brand"
              >
                Mark all read
              </button>
            </div>
            <ul className="grid gap-1">
              {items.map((n) => (
                <li
                  key={n.id}
                  className={`rounded-xl px-3 py-2.5 ${n.read ? "" : "bg-brand/8"} transition-colors duration-200 hover:bg-surface-2/70`}
                >
                  <p className="text-[13px] font-semibold">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --------------------------------------------------------- account avatar */

function AdminAvatarMenu({
  email,
  onSignOut,
}: {
  email?: string | null;
  onSignOut?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  const initials = (email ?? "CrosX Admin")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]!.toUpperCase())
    .join("") || "A";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Admin account menu"
        aria-expanded={open}
        className="glass grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300 hover:border-brand/50"
      >
        <span className="grid size-8 place-items-center rounded-full bg-brand text-[11px] font-bold tracking-wide text-primary-foreground">
          {initials}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE_LUX }}
            className="glass absolute right-0 top-12 z-50 w-60 max-w-[calc(100vw-2rem)] rounded-2xl p-2 shadow-lux"
          >
            <div className="px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Admin Console
              </p>
              <p className="mt-0.5 truncate text-[13px] font-semibold">
                {email ?? "CrosX Admin"}
              </p>
            </div>
            <div className="mx-2 border-t border-hairline" />
            <Link
              to="/admin/dashboard/profile"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors duration-200 hover:bg-surface-2/70"
            >
              <Users className="size-4 text-muted-foreground" aria-hidden="true" />
              Admin Profile
            </Link>
            {onSignOut ? (
              <button
                type="button"
                onClick={onSignOut}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-brand transition-colors duration-200 hover:bg-brand/10"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </button>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------- shell */

export function AdminShell({
  email,
  onSignOut,
  children,
}: {
  email?: string | null;
  onSignOut?: () => void;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
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
                    Admin Console
                  </p>
                  <p className="truncate text-sm font-semibold">{email ?? "CrosX Admin"}</p>
                </div>
                <div className="hidden min-w-0 flex-1 md:flex">
                  <AdminSearch />
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                <Link
                  to="/admin/dashboard/payment/pending"
                  title="Pending payouts"
                  aria-label="Pending payouts"
                  className="glass hidden h-10 shrink-0 items-center gap-2 rounded-xl px-2.5 text-sm font-semibold transition-colors duration-300 hover:border-brand/50 sm:inline-flex"
                >
                  <Wallet className="size-4 text-brand" aria-hidden="true" />
                  <span className="tabular-nums">{inr(ADMIN_TOTALS.pendingPayout)}</span>
                </Link>
                <AdminBell />
                <ThemeToggle />
                <Link
                  to="/"
                  className="glass hidden h-10 items-center rounded-xl px-4 text-sm font-semibold transition-colors duration-300 hover:border-brand/50 xl:inline-flex"
                >
                  Back to site
                </Link>
                <AdminAvatarMenu email={email} onSignOut={onSignOut} />
              </div>
            </div>
            <div className="mt-3 md:hidden">
              <AdminSearch />
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-9">{children}</main>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
