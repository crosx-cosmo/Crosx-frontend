import { Plus, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/dashboard/kit";
import { cn } from "@/lib/utils";

/** Small premium toggle matching the CrosX panel language. */
export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-2/40 px-3 py-2.5 text-left transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
    >
      <span className="text-[12px] font-semibold text-foreground">{label}</span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300",
          checked ? "bg-brand" : "bg-surface-2 ring-1 ring-inset ring-hairline",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-white transition-[left] duration-300",
            checked ? "left-[18px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

/** Editable list of rule/bullet lines used by every terms section. */
export function ListEditor({
  label,
  hint,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const update = (i: number, value: string) =>
    onChange(items.map((it, idx) => (idx === i ? value : it)));

  return (
    <section className="rounded-2xl border border-hairline bg-surface-2/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-xs font-black uppercase tracking-[0.14em] text-brand">{label}</h4>
          {hint && <p className="mt-1 text-[12px] text-muted-foreground">{hint}</p>}
        </div>
        <ActionButton
          icon={Plus}
          onClick={() => onChange([...items, ""])}
          className="h-8 px-2.5 text-[12px]"
        >
          Add Line
        </ActionButton>
      </div>

      <ul className="mt-3 grid gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="size-1 shrink-0 rounded-full bg-brand" aria-hidden="true" />
            <input
              value={item}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
              aria-label={`${label} line ${i + 1}`}
              className="h-10 w-full rounded-xl border border-input bg-surface/60 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              aria-label={`Remove ${label} line ${i + 1}`}
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-hairline bg-surface-2/50 text-muted-foreground transition-colors duration-300 hover:border-red-500/50 hover:text-red-500"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-[12.5px] text-muted-foreground">
            No lines yet — publishers will not see this section.
          </li>
        )}
      </ul>
    </section>
  );
}

/** Comma-separated chip input for tags such as traffic sources and parameters. */
export function TagsField({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <input
        value={values.join(", ")}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean),
          )
        }
        className="h-11 w-full rounded-xl border border-input bg-surface-2/50 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
      />
      <span className="text-[11px] text-muted-foreground">Separate values with commas.</span>
    </label>
  );
}
