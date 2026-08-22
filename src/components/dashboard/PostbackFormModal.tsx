import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Globe2, HelpCircle, Save, Target, Zap } from "lucide-react";
import { toast } from "sonner";
import {
  ActionButton,
  Modal,
  StatusBadge,
  copyText,
} from "@/components/dashboard/kit";
import { MacroHelperModal } from "@/components/dashboard/MacroHelperModal";
import { CAMPAIGN_MACROS } from "@/lib/campaign-postback-data";
import {
  isValidPostbackUrl,
  useCampaignPostbacks,
  type PostbackConfig,
  type PostbackScope,
} from "@/lib/campaign-postback-store";
import { cn } from "@/lib/utils";

/** Shared configuration modal for both the Global fallback and event-specific postbacks. */
export function PostbackFormModal({
  open,
  onClose,
  scope,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  scope: PostbackScope;
  editing?: PostbackConfig | null;
}) {
  const { savePostback, testPostback } = useCampaignPostbacks();
  const [url, setUrl] = useState(editing?.url ?? "");
  const [active, setActive] = useState(editing?.active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [macroHelp, setMacroHelp] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setUrl(editing?.url ?? "");
    setActive(editing?.active ?? true);
    setError(null);
  }, [open, editing]);

  const isGlobal = scope.kind === "global";
  const scopeLabel = isGlobal ? "Global fallback" : scope.name;

  const insert = async (macro: string) => {
    const el = inputRef.current;
    if (!el) {
      setUrl((v) => v + macro);
      return;
    }
    const start = el.selectionStart ?? url.length;
    const end = el.selectionEnd ?? url.length;
    const next = url.slice(0, start) + macro + url.slice(end);
    setUrl(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + macro.length, start + macro.length);
    });
    await copyText(macro);
  };

  const validate = () => {
    if (!isValidPostbackUrl(url)) {
      setError("Enter a valid postback URL starting with http:// or https://");
      return false;
    }
    if (!/\{click_id\}/.test(url)) {
      setError("Include the {click_id} macro so conversions can be matched.");
      return false;
    }
    setError(null);
    return true;
  };

  const onSave = () => {
    if (!validate()) return;
    savePostback({
      id: editing?.id,
      eventSlug: isGlobal ? null : scope.slug,
      url: url.trim(),
      active,
    });
    toast.success(editing ? "Postback updated" : "Postback added", {
      description: isGlobal
        ? "Global fallback saved for this campaign."
        : `Saved for ${scope.name}. This event now overrides the Global Postback.`,
    });
    onClose();
  };

  const onTest = async () => {
    if (!validate()) return;
    if (!editing) {
      setTesting(true);
      setTimeout(() => {
        setTesting(false);
        toast.success(`Test postback fired — ${scopeLabel}`, {
          description: "Your tracker responded 200 OK.",
        });
      }, 450);
      return;
    }
    setTesting(true);
    const res = await testPostback(editing.id);
    setTesting(false);
    if (res.ok)
      toast.success(`Test postback fired — ${scopeLabel}`, {
        description: "Your tracker responded 200 OK.",
      });
    else
      toast.error(`Test failed — ${scopeLabel}`, {
        description: `Tracker responded ${res.status}.`,
      });
  };

  const macros = useMemo(() => CAMPAIGN_MACROS, []);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={
          editing
            ? isGlobal
              ? "Manage Global Postback"
              : `Edit ${scope.name} Postback`
            : isGlobal
              ? "Manage Global Postback"
              : `Add ${scope.name} Postback`
        }
        description={
          isGlobal
            ? "Campaign-level fallback. Used only for events without an active event-specific postback."
            : "This postback applies to this conversion event only and overrides the Global Postback for it."
        }
        footer={
          <>
            <ActionButton icon={Zap} onClick={onTest} disabled={testing}>
              {testing ? "Testing..." : "Test Postback"}
            </ActionButton>
            <ActionButton variant="solid" icon={Save} onClick={onSave}>
              Save Postback
            </ActionButton>
          </>
        }
      >
        <div className="grid gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              tone={isGlobal ? "brand" : "success"}
              className={cn("h-8 px-3", isGlobal && "shadow-[0_0_18px_-4px_var(--color-brand)]")}
            >
              {isGlobal ? (
                <Globe2 className="size-3.5" aria-hidden="true" />
              ) : (
                <Target className="size-3.5" aria-hidden="true" />
              )}
              {isGlobal ? "Global" : scope.name}
            </StatusBadge>
            <button
              type="button"
              onClick={() => setActive((v) => !v)}
              aria-pressed={active}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-full border px-3 text-[12px] font-bold transition-colors duration-200",
                active
                  ? "border-emerald-500/40 bg-emerald-500/12 text-emerald-500"
                  : "border-hairline bg-surface-2/60 text-muted-foreground",
              )}
            >
              <i
                aria-hidden="true"
                className={cn("size-1.5 rounded-full", active ? "bg-emerald-500" : "bg-current")}
              />
              {active ? "Enabled" : "Disabled"}
            </button>
          </div>

          <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Postback URL
            </span>
            <input
              ref={inputRef}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="https://your-tracker.com/postback?click_id={click_id}"
              className="h-11 w-full rounded-xl border border-input bg-surface-2/50 px-3 font-mono text-[12.5px] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
            />
          </label>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-brand/40 bg-brand/8 p-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
              <p className="text-[13px] font-semibold text-foreground">{error}</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Tracking macros
              </p>
              <ActionButton
                icon={HelpCircle}
                onClick={() => setMacroHelp(true)}
                className="h-7 px-2 text-[12px]"
              >
                Macro Help
              </ActionButton>
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Tap a macro to insert it at the cursor.
            </p>
            <ul className="mt-2 flex max-h-32 flex-wrap gap-2 overflow-y-auto">
              {macros.map((m) => (
                <li key={m.macro}>
                  <button
                    type="button"
                    title={m.desc}
                    onClick={() => insert(m.macro)}
                    className="rounded-full border border-hairline bg-surface-2/50 px-3 py-1.5 font-mono text-[12px] font-semibold text-brand transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/50"
                  >
                    {m.macro}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>

      <MacroHelperModal open={macroHelp} onClose={() => setMacroHelp(false)} />
    </>
  );
}
