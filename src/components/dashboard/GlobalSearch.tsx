import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Search, Target, CheckCircle2, Radio, FileText, CornerDownLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { EASE_LUX } from "@/lib/motion-presets";
import { CONVERSION_RECORDS, INVOICES, POSTBACK_LOGS } from "@/lib/publisher-data";
import { usePublisherMock } from "./mock-store";

type Result = {
  group: string;
  label: string;
  meta: string;
  to: string;
  icon: typeof Target;
  params?: Record<string, string>;
};

export function GlobalSearch() {
  const { campaigns } = usePublisherMock();
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

    for (const c of campaigns) {
      if (c.name.toLowerCase().includes(term) || c.category.toLowerCase().includes(term)) {
        out.push({
          group: "Campaigns",
          label: c.name,
          meta: `${c.category} • ₹${c.payout} / conversion`,
          to: "/publisher/dashboard/campaigns/$slug",
          params: { slug: c.slug },
          icon: Target,
        });
      }
    }

    for (const cv of CONVERSION_RECORDS) {
      if (cv.id.toLowerCase().includes(term) || cv.campaign.toLowerCase().includes(term)) {
        out.push({
          group: "Conversions",
          label: cv.id,
          meta: `${cv.campaign} • ${cv.status}`,
          to: "/publisher/dashboard/reports/conversions",
          icon: CheckCircle2,
        });
      }
    }

    for (const log of POSTBACK_LOGS) {
      if (log.requestId.toLowerCase().includes(term) || log.campaign.toLowerCase().includes(term)) {
        out.push({
          group: "Postback",
          label: log.requestId,
          meta: `${log.event} • HTTP ${log.status}`,
          to: "/publisher/dashboard/postback/logs",
          icon: Radio,
        });
      }
    }

    for (const inv of INVOICES) {
      if (inv.id.toLowerCase().includes(term) || inv.period.toLowerCase().includes(term)) {
        out.push({
          group: "Invoices",
          label: inv.id,
          meta: `${inv.period} • ${inv.status}`,
          to: "/publisher/dashboard/payment/invoice",
          icon: FileText,
        });
      }
    }

    const seen = new Set<string>();
    return out
      .filter((r) => {
        const key = `${r.group}-${r.label}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 8);
  }, [q, campaigns]);

  const groups = useMemo(() => {
    const map = new Map<string, Result[]>();
    for (const r of results) map.set(r.group, [...(map.get(r.group) ?? []), r]);
    return [...map.entries()];
  }, [results]);

  return (
    <div ref={ref} className="relative min-w-0 flex-1 sm:max-w-sm">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        value={q}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        placeholder="Search campaigns, conversions, click IDs..."
        aria-label="Global search"
        className="h-10 w-full rounded-xl border border-input bg-surface-2/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
      />

      <AnimatePresence>
        {open && q.trim().length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE_LUX }}
            className="glass absolute left-0 right-0 z-50 mt-2 max-h-[60dvh] overflow-y-auto rounded-2xl p-2 shadow-lux"
          >
            {groups.length === 0 ? (
              <p className="px-3 py-4 text-sm text-muted-foreground">
                No matches for “{q}”. Try a campaign name or record ID.
              </p>
            ) : (
              groups.map(([group, items]) => (
                <div key={group} className="mb-1">
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {group}
                  </p>
                  {items.map((r) => (
                    <Link
                      key={`${group}-${r.label}`}
                      to={r.to}
                      params={r.params as never}
                      onClick={() => {
                        setOpen(false);
                        setQ("");
                      }}
                      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-300 hover:bg-surface-2/70"
                    >
                      <span className="grid size-8 place-items-center rounded-lg bg-brand/12 text-brand">
                        <r.icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold">{r.label}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {r.meta}
                        </span>
                      </span>
                      <CornerDownLeft
                        className="size-3.5 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
