import { AnimatePresence, motion } from "motion/react";
import { Bell, BadgeIndianRupee, Megaphone, CheckCircle2, Braces, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { EASE_LUX } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import { usePublisherMock } from "./mock-store";
import type { Notification } from "@/lib/publisher-data";

const ICONS = {
  payout: BadgeIndianRupee,
  campaign: Megaphone,
  conversion: CheckCircle2,
  api: Braces,
} as const;

function Row({ n, onRead }: { n: Notification; onRead: () => void }) {
  const Icon = ICONS[n.kind];
  return (
    <button
      type="button"
      onClick={onRead}
      className={cn(
        "grid w-full grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-300 hover:bg-surface-2/70",
        !n.read && "bg-brand/[0.07]",
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl",
          n.read ? "bg-surface-2 text-muted-foreground" : "bg-brand/15 text-brand",
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            "block text-[13px] leading-snug",
            n.read ? "text-muted-foreground" : "font-semibold text-foreground",
          )}
        >
          {n.title}
        </span>
        <span className="mt-0.5 block text-[11px] text-muted-foreground">{n.time}</span>
      </span>
    </button>
  );
}

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markRead } = usePublisherMock();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        className="glass relative grid size-10 place-items-center rounded-xl text-muted-foreground transition-colors duration-300 hover:border-brand/50 hover:text-foreground"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid min-w-[1.15rem] place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-primary-foreground">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: EASE_LUX }}
            className="glass absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl p-2 shadow-lux"
          >
            <div className="flex items-center justify-between gap-2 px-2 py-1.5">
              <p className="font-display text-sm font-bold">Notifications</p>
              <button
                type="button"
                onClick={() => {
                  markAllRead();
                  toast.success("All notifications marked as read");
                }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand transition-opacity duration-300 hover:opacity-80"
              >
                <CheckCheck className="size-3.5" aria-hidden="true" />
                Mark all as read
              </button>
            </div>
            <div className="mt-1 grid max-h-[60dvh] gap-1 overflow-y-auto">
              {notifications.map((n) => (
                <Row key={n.id} n={n} onRead={() => markRead(n.id)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
