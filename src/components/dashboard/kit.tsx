import { AnimatePresence, motion } from "motion/react";
import {
  Loader2,
  Search,
  X,
  Inbox,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  useEffect,
  useState,
  useMemo,
  useRef,
  Children,
  isValidElement,
  type ReactNode,
  type SelectHTMLAttributes,
  type InputHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { Counter } from "@/components/ui-kit/Counter";
import { EASE_LUX } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ layout */

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE_LUX }}
      className={cn("glass min-w-0 overflow-hidden rounded-2xl", className)}
    >
      {(title || action) && (
        <div className="grid gap-3 border-b border-hairline p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:p-5">
          <div className="min-w-0">
            {title && (
              <h2 className="font-display text-base font-bold tracking-tight sm:text-lg">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
          {action ? <div className="flex flex-wrap gap-2 sm:justify-end">{action}</div> : null}
        </div>
      )}
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </motion.section>
  );
}

/* --------------------------------------------------------------- kpi cards */

export function KpiCard({
  label,
  value,
  prefix,
  suffix,
  decimals,
  icon: Icon,
  trend,
  trendTone = "up",
  support,
  caption,
  delay = 0,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
  trend?: string;
  trendTone?: "up" | "down" | "neutral";
  support?: string;
  caption?: string;
  delay?: number;
}) {

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: delay * 0.3, ease: EASE_LUX }}
      className="glass group relative overflow-hidden rounded-2xl p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand/45 hover:shadow-lux sm:p-5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-brand/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="flex items-start justify-between gap-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        {trend ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full border border-hairline bg-surface-2/60 px-2 py-0.5 text-[11px] font-semibold",
              trendTone === "up" && "text-brand",
              trendTone === "down" && "text-muted-foreground",
              trendTone === "neutral" && "text-muted-foreground",
            )}
          >
            {trend}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-black tracking-tight sm:text-[1.75rem]">
        {decimals !== undefined ? (
          <>
            {prefix}
            {value.toLocaleString("en-US", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
            {suffix}
          </>
        ) : (
          <Counter value={value} prefix={prefix} suffix={suffix} />
        )}
      </p>

      {support && <p className="mt-1.5 text-[13px] font-semibold text-foreground/90">{support}</p>}
      {caption && <p className="mt-0.5 text-xs text-muted-foreground">{caption}</p>}
    </motion.article>
  );
}

/* ------------------------------------------------------------------ badges */

export type BadgeTone = "success" | "warn" | "danger" | "brand" | "neutral";

const TONES: Record<BadgeTone, string> = {
  success: "border-emerald-500/35 bg-emerald-500/12 text-emerald-500",
  warn: "border-amber-500/35 bg-amber-500/12 text-amber-500",
  danger: "border-brand/40 bg-brand/12 text-brand",
  brand: "border-brand/45 bg-brand/15 text-brand",
  neutral: "border-hairline bg-surface-2/70 text-muted-foreground",
};

export function StatusBadge({
  tone = "neutral",
  children,
  dot,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        TONES[tone],
        className,
      )}
    >
      {dot && <i aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ inputs */

export function SearchField({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-input bg-surface-2/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
      />
    </div>
  );
}

export function Select({
  className,
  children,
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const options = useMemo(() => {
    const out: { value: string; label: string }[] = [];
    const walk = (nodes: ReactNode) => {
      Children.forEach(nodes as ReactNode[], (child: ReactNode) => {
        if (!isValidElement(child)) return;
        const props = child.props as { value?: string | number; children?: ReactNode };
        if (child.type === "option") {
          out.push({
            value: String(props.value ?? props.children ?? ""),
            label: String(props.children ?? props.value ?? ""),
          });
        } else if (props.children) {
          walk(props.children);
        }
      });
    };
    walk(children);
    return out;
  }, [children]);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number; maxHeight: number; up: boolean } | null>(
    null,
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => setMounted(true), []);

  const place = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = 8;
    const margin = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const below = vh - r.bottom - gap - margin;
    const above = r.top - gap - margin;
    const up = below < 180 && above > below;
    const maxHeight = Math.max(140, Math.min(288, up ? above : below));
    const width = Math.min(Math.max(r.width, 176), vw - margin * 2);
    let left = r.left + r.width - width;
    left = Math.min(Math.max(margin, left), vw - width - margin);
    setPos({
      top: up ? r.top - gap : r.bottom + gap,
      left,
      width,
      maxHeight,
      up,
    });
  };

  useEffect(() => {
    if (!open) return;
    place();
    const onDoc = (e: Event) => {
      const t = e.target as Node;
      if (!ref.current?.contains(t) && !menuRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onScroll = (e: Event) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      place();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc, { passive: true });
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const selected = options.find((o: { value: string; label: string }) => o.value === String(value ?? "")) ?? options[0];

  const pick = (v: string) => {
    setOpen(false);
    onChange?.({ target: { value: v } } as never);
  };

  const menu =
    open && pos ? (
      <motion.ul
        ref={menuRef}
        role="listbox"
        initial={{ opacity: 0, y: pos.up ? 4 : -4, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: pos.up ? 4 : -4, scale: 0.985 }}
        transition={{ duration: 0.13, ease: EASE_LUX }}
        style={{
          position: "fixed",
          top: pos.top,
          left: pos.left,
          width: pos.width,
          maxHeight: pos.maxHeight,
          transform: pos.up ? "translateY(-100%)" : undefined,
          transformOrigin: pos.up ? "bottom" : "top",
        }}
        className="glass z-[80] overflow-y-auto overscroll-contain rounded-xl border border-hairline p-1.5 shadow-lux [-webkit-overflow-scrolling:touch]"
      >
        {options.map((o: { value: string; label: string }) => {
          const active = o.value === selected?.value;
          return (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => pick(o.value)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors duration-100 sm:py-2 sm:text-[13px]",
                  active
                    ? "bg-brand/15 text-brand"
                    : "text-foreground/85 hover:bg-surface-2/80 hover:text-foreground",
                )}
              >
                <span className="truncate">{o.label}</span>
                {active && <Check className="size-3.5 shrink-0" aria-hidden="true" />}
              </button>
            </li>
          );
        })}
      </motion.ul>
    ) : null;

  return (
    <div ref={ref} className={cn("relative min-w-0", className)}>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-input bg-surface-2/50 px-3 text-sm font-bold text-foreground transition-[border-color,box-shadow] duration-150 hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft disabled:opacity-50"
      >
        <span className="truncate">{selected?.label ?? ""}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-150",
            open && "rotate-180 text-brand",
          )}
        />
      </button>

      {mounted
        ? createPortal(<AnimatePresence>{menu}</AnimatePresence>, document.body)
        : null}
    </div>
  );
}



export function TextField({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <input
        {...props}
        className={cn(
          "h-11 w-full rounded-xl border border-input bg-surface-2/50 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft",
          className,
        )}
      />
    </label>
  );
}

export function Chip({
  active,
  onClick,
  children,
  icon: Icon,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5",
        active
          ? "border-brand/60 bg-brand/15 text-foreground"
          : "border-hairline bg-surface-2/50 text-muted-foreground hover:text-foreground",
      )}
    >
      {Icon && <Icon className="size-3.5" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-hairline bg-surface-2/50 p-1">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          aria-pressed={value === o.key}
          className={cn(
            "relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-300 sm:text-[13px]",
            value === o.key ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {value === o.key && (
            <motion.span
              layoutId="seg-pill"
              className="absolute inset-0 rounded-full bg-brand/18 ring-brand-soft"
              transition={{ duration: 0.3, ease: EASE_LUX }}
            />
          )}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- buttons */

export function ActionButton({
  children,
  onClick,
  variant = "ghost",
  icon: Icon,
  className,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "solid" | "ghost" | "subtle";
  icon?: LucideIcon;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3.5 text-[13px] font-bold tracking-[0.01em] transition-[background-color,border-color,color,transform,box-shadow] duration-300 disabled:pointer-events-none disabled:opacity-50",
        variant === "solid" &&
          "bg-brand font-extrabold text-primary-foreground drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:bg-brand-soft hover:shadow-lux",
        variant === "ghost" &&
          "border border-hairline bg-surface-2/50 text-foreground hover:border-brand/50 hover:-translate-y-0.5",
        variant === "subtle" && "text-muted-foreground hover:bg-surface-2/70 hover:text-foreground",
        className,
      )}
    >
      {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ tables */

/** Sticky-first-column helpers for wide report tables. */
export const stickyHeadCell =
  "sticky left-0 z-20 bg-surface-1 shadow-[1px_0_0_0_hsl(var(--hairline,0_0%_50%)/0.25)]";
export const stickyCell =
  "sticky left-0 z-10 bg-surface-1 shadow-[1px_0_0_0_hsl(var(--hairline,0_0%_50%)/0.25)]";

export function TableWrap({
  children,
  minWidth = "42rem",
}: {
  children: ReactNode;
  minWidth?: string;
}) {
  return (
    <div className="max-w-full min-w-0 overflow-x-auto overscroll-x-contain">
      <table className="w-full border-collapse text-sm" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  className,
  align,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-hairline px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
        align === "right" && "text-right",
        className,
      )}
    >

      <Comp
        {...(onClick ? { type: "button" as const, onClick } : {})}
        className={cn(onClick && "transition-colors duration-300 hover:text-foreground")}
      >
        {children}
      </Comp>
    </th>
  );
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <td className={cn("border-b border-hairline/70 px-4 py-3 align-middle", className)}>
      {children}
    </td>
  );
}

export function Tr({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "transition-colors duration-200 hover:bg-surface-2/50",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </tr>
  );
}

/* ------------------------------------------------------- states + paging */

export function EmptyState({
  title = "No results found",
  description = "Try changing your search or filters.",
  onClear,
  icon: Icon = Inbox,
}: {
  title?: string;
  description?: string;
  onClear?: () => void;
  icon?: LucideIcon;
}) {
  return (
    <div className="grid place-items-center gap-3 rounded-2xl border border-dashed border-hairline bg-surface-2/30 px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-brand/12 text-brand">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-display text-base font-bold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {onClear && (
        <ActionButton onClick={onClear} icon={X}>
          Clear Filters
        </ActionButton>
      )}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid gap-2.5" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-11 animate-pulse rounded-xl bg-surface-2 [animation-duration:0.7s]"
          style={{ opacity: 1 - i * 0.08 }}
        />
      ))}
    </div>
  );
}

export function CardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass h-32 animate-pulse rounded-2xl bg-surface-2/40 [animation-duration:0.7s]" />
      ))}
    </div>
  );
}

/** Simulates a snappy 140–230ms fetch, then reveals demo data. */
export function useMockLoad(deps: unknown[] = []) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 140 + Math.random() * 90);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return loading;
}

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPage,
  label = "records",
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
  label?: string;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const windowSize = 5;
  const start = Math.max(1, Math.min(page - Math.floor(windowSize / 2), pageCount - windowSize + 1));
  const pages = Array.from(
    { length: Math.min(windowSize, pageCount) },
    (_, i) => Math.max(1, start) + i,
  );

  return (
    <div className="mt-4 grid gap-3 sm:flex sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        Showing {from}–{to} of {total} {label}
      </p>
      <div className="flex min-w-0 items-center gap-1.5">
        <ActionButton
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          icon={ChevronLeft}
          className="shrink-0 px-2.5"
        >
          <span className="sr-only sm:not-sr-only">Previous</span>
        </ActionButton>
        <div className="flex items-center gap-1.5" role="group" aria-label="Pages">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPage(p)}
              aria-current={p === page}
              className={cn(
                "size-9 shrink-0 rounded-xl border text-[13px] font-semibold transition-colors duration-300",
                p === page
                  ? "border-brand/60 bg-brand/15 text-foreground"
                  : "border-hairline bg-surface-2/50 text-muted-foreground hover:text-foreground",
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <ActionButton
          onClick={() => onPage(Math.min(pageCount, page + 1))}
          disabled={page === pageCount || pageCount === 0}
          icon={ChevronRight}
          className="px-2.5"
        >
          <span className="sr-only sm:not-sr-only">Next</span>
        </ActionButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ modal */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/75 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE_LUX }}
            className="glass relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl p-5 sm:m-4 sm:max-w-lg sm:rounded-3xl sm:p-6"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <h3 className="font-display text-lg font-black tracking-tight">{title}</h3>
                {description && (
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-9 shrink-0 place-items-center rounded-xl border border-hairline bg-surface-2/50 text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            {children ? <div className="mt-5">{children}</div> : null}
            {footer ? (
              <div className="mt-6 grid gap-2 sm:flex sm:justify-end sm:gap-3">{footer}</div>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function InlineSpinner() {
  return <Loader2 className="size-4 animate-spin text-brand" aria-hidden="true" />;
}

/** Clipboard helper that degrades gracefully in non-secure contexts. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------- wide-report table cells */

/** Sub-ID parameter keys available on click/conversion records. */
export const SUB_KEYS = ["x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10"] as const;

/** Truncated cell value with full-value tooltip; renders an em dash when empty. */
export function Val({
  value,
  width = "w-28",
}: {
  value?: string | null;
  width?: string;
}) {
  if (value === undefined || value === null || value === "") {
    return <span className="text-muted-foreground/60">—</span>;
  }
  return (
    <span className={cn("block max-w-full truncate", width)} title={value}>
      {value}
    </span>
  );
}
