import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { DASHBOARD_NAV, isGroup, type NavItem } from "./nav-config";
import { cn } from "@/lib/utils";
import { EASE_LUX } from "@/lib/motion-presets";

function useActivePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function groupContains(item: NavItem, path: string) {
  return isGroup(item) && item.children.some((c) => c.to === path);
}

function NavRow({
  icon: Icon,
  label,
  collapsed,
  active,
  nested,
}: {
  icon: NavItem["icon"];
  label: string;
  collapsed: boolean;
  active: boolean;
  nested?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-[color,background-color,transform] duration-300",
        nested && "py-2 text-[13px] font-medium",
        active
          ? "bg-brand/12 text-foreground ring-brand-soft"
          : "text-muted-foreground hover:bg-surface-2/70 hover:text-foreground",
      )}
    >
      {active && (
        <motion.i
          layoutId="dash-active-bar"
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand"
        />
      )}
      <Icon className={cn("size-4 shrink-0", active && "text-brand")} aria-hidden="true" />
      {!collapsed && <span className="truncate">{label}</span>}
    </span>
  );
}

function NavTree({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const path = useActivePath();
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DASHBOARD_NAV.filter(isGroup).map((g) => [g.label, groupContains(g, path)])),
  );

  useEffect(() => {
    setOpen((prev) => {
      const next = { ...prev };
      for (const item of DASHBOARD_NAV) {
        if (groupContains(item, path)) next[(item as { label: string }).label] = true;
      }
      return next;
    });
  }, [path]);

  return (
    <nav aria-label="Publisher dashboard" className="flex flex-col gap-1 px-2">
      {DASHBOARD_NAV.map((item) => {
        if (!isGroup(item)) {
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              activeOptions={{ exact: true }}
            >
              <NavRow
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                active={path === item.to}
              />
            </Link>
          );
        }

        const expanded = collapsed ? false : Boolean(open[item.label]);
        const hasActive = groupContains(item, path);

        return (
          <div key={item.label}>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen((p) => ({ ...p, [item.label]: !p[item.label] }))}
              title={collapsed ? item.label : undefined}
              className="w-full text-left"
            >
              <span
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-300",
                  hasActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-surface-2/70 hover:text-foreground",
                )}
              >
                <item.icon
                  className={cn("size-4 shrink-0", hasActive && "text-brand")}
                  aria-hidden="true"
                />
                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "size-4 shrink-0 transition-transform duration-300",
                        expanded && "rotate-180 text-brand",
                      )}
                    />
                  </>
                )}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="submenu"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: EASE_LUX }}
                  className="overflow-hidden"
                >
                  <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-hairline pl-2">
                    {item.children.map((child) => (
                      <Link key={child.to} to={child.to} onClick={onNavigate}>
                        <NavRow
                          icon={child.icon}
                          label={child.label}
                          collapsed={false}
                          active={path === child.to}
                          nested
                        />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}

export function DesktopSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-hairline bg-surface/40 backdrop-blur-xl transition-[width] duration-300 lg:flex",
        collapsed ? "w-[4.75rem]" : "w-[17rem]",
      )}
    >
      <div className="flex h-20 items-center justify-between gap-2 px-4">
        {!collapsed && (
          <Link to="/" aria-label="CrosX home" className="min-w-0">
            <Logo />
          </Link>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="glass mx-auto grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors duration-300 hover:border-brand/50 hover:text-foreground"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        <NavTree collapsed={collapsed} />
      </div>

      {!collapsed && (
        <div className="glass m-3 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Publisher tier
          </p>
          <p className="mt-1 font-display text-sm font-bold">Growth Partner</p>
          <p className="mt-1 text-xs text-muted-foreground">Payouts every 15 days</p>
        </div>
      )}
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="lg:hidden">
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
          />
          <motion.aside
            key="panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.32, ease: EASE_LUX }}
            className="fixed inset-y-0 left-0 z-50 flex w-[17rem] max-w-[85vw] flex-col border-r border-hairline bg-surface/95 backdrop-blur-xl"
          >
            <div className="flex h-16 items-center justify-between px-4">
              <Link to="/" aria-label="CrosX home" onClick={onClose} className="min-w-0">
                <Logo />
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="glass grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pb-8">
              <NavTree collapsed={false} onNavigate={onClose} />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
