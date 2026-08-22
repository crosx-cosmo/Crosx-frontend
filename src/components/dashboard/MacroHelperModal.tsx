import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Terminal, X } from "lucide-react";
import { toast } from "sonner";
import { copyText } from "@/components/dashboard/kit";
import { CAMPAIGN_MACROS } from "@/lib/campaign-postback-data";
import { cn } from "@/lib/utils";

function CodeLine({ example }: { example: string }) {
  return (
    <div className="min-w-0 overflow-x-auto overscroll-x-contain rounded-lg bg-black/5 dark:bg-white/5">
      <code className="block whitespace-nowrap px-2.5 py-1.5 font-mono text-[11.5px] leading-relaxed text-muted-foreground">
        {example.split(/(\{[^}]+\})/g).map((part, i) =>
          part.startsWith("{") && part.endsWith("}") ? (
            <span key={i} className="font-bold text-brand">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </code>
    </div>
  );
}

function CopyPill({
  label,
  copied,
  onClick,
  className,
}: {
  label: string;
  copied: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Copy ${label}`}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-hairline bg-surface-2/70 px-2.5 font-mono text-[12px] font-bold text-brand transition-[color,border-color,background-color] duration-200 hover:border-brand/50",
        copied && "border-emerald-500/60 text-emerald-500",
        className,
      )}
    >
      {copied ? (
        <Check className="size-3 shrink-0" aria-hidden="true" />
      ) : (
        <Copy className="size-3 shrink-0" aria-hidden="true" />
      )}
      {label}
    </button>
  );
}

function MacroCard({
  macro,
  desc,
  example,
  copied,
  onCopy,
}: {
  macro: string;
  desc: string;
  example: string;
  copied: string | null;
  onCopy: (text: string, label: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface-2/40 p-3 transition-colors duration-200 hover:border-brand/40">
      <div className="flex items-center justify-between gap-2">
        <CopyPill label={macro} copied={copied === macro} onClick={() => onCopy(macro, macro)} />
        <button
          type="button"
          onClick={() => onCopy(example, `${macro} example`)}
          aria-label={`Copy ${macro} example URL`}
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-lg border border-hairline bg-surface-2/50 text-muted-foreground transition-colors duration-200 hover:text-foreground",
            copied === `${macro} example` && "border-emerald-500/60 text-emerald-500",
          )}
        >
          {copied === `${macro} example` ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
      <p className="mt-2 text-[13px] font-semibold leading-snug text-foreground">{desc}</p>
      <div className="mt-2">
        <CodeLine example={example} />
      </div>
    </div>
  );
}

const FULL_PAYLOAD = `https://your-tracker.com/postback?click_id={click_id}&sub_id={sub_id}&event={event}&payout={payout}&offer_id={offer_id}&ip={ip}&ts={timestamp}&sub1={x1}&sub2={x2}`;

export function MacroHelperModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const handleCopy = async (text: string, label: string) => {
    const ok = await copyText(text);
    if (ok) {
      toast.success(`${label} copied`);
      setCopied(label);
      setTimeout(() => setCopied((c) => (c === label ? null : c)), 1500);
    } else {
      toast.error("Unable to copy");
    }
  };

  const standardMacros = CAMPAIGN_MACROS.filter((m) => !m.macro.startsWith("{x"));
  const subMacros = CAMPAIGN_MACROS.filter((m) => m.macro.startsWith("{x"));

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Postback Macro Helper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.18 }}
            className="glass relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl sm:max-w-2xl sm:rounded-3xl"
          >
            <div className="sticky top-0 z-10 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-hairline bg-surface/80 px-4 py-3.5 backdrop-blur-xl sm:px-6 sm:py-4">
              <div className="min-w-0">
                <h3 className="font-display text-base font-black tracking-tight sm:text-lg">
                  Postback Macro Helper
                </h3>
                <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">
                  Tap a macro or its example URL to copy.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-9 shrink-0 place-items-center rounded-xl border border-hairline bg-surface-2/50 text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
              <div className="grid gap-5">
                <section>
                  <h4 className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-brand">
                    Standard Macros
                  </h4>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {standardMacros.map((m) => (
                      <MacroCard
                        key={m.macro}
                        macro={m.macro}
                        desc={m.desc}
                        example={m.example}
                        copied={copied}
                        onCopy={handleCopy}
                      />
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="mb-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand">
                    Sub ID Macros ({"{x1}"}–{"{x10}"})
                  </h4>
                  <p className="mb-2.5 text-[12.5px] leading-snug text-muted-foreground">
                    Pass unique sub parameters (sub1–sub10) back to your tracker.
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                    {subMacros.map((m) => (
                      <button
                        key={m.macro}
                        type="button"
                        title={m.desc}
                        onClick={() => handleCopy(m.macro, m.macro)}
                        className={cn(
                          "flex h-11 items-center justify-center gap-1.5 rounded-xl border border-hairline bg-surface-2/40 font-mono text-[12.5px] font-bold text-brand transition-colors duration-200 hover:border-brand/50",
                          copied === m.macro && "border-emerald-500/60 text-emerald-500",
                        )}
                      >
                        {copied === m.macro ? (
                          <Check className="size-3" aria-hidden="true" />
                        ) : (
                          <Copy className="size-3" aria-hidden="true" />
                        )}
                        {m.macro}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="rounded-2xl border border-hairline bg-brand/5 p-3.5">
                  <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                    <span className="font-bold text-foreground">Tip:</span> Most trackers expect
                    either{" "}
                    <code className="rounded bg-surface-2/70 px-1 font-mono text-[11.5px] text-brand">
                      click_id
                    </code>{" "}
                    or{" "}
                    <code className="rounded bg-surface-2/70 px-1 font-mono text-[11.5px] text-brand">
                      sub_id
                    </code>{" "}
                    plus sub IDs. Always test your postback before going live.
                  </p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 z-10 border-t border-hairline bg-surface/80 px-4 py-3 backdrop-blur-xl sm:px-6">
              <div className="grid gap-2">
                <CodeLine example={FULL_PAYLOAD} />
                <button
                  type="button"
                  onClick={() => handleCopy(FULL_PAYLOAD, "Full payload template")}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand/50 bg-brand/15 px-4 text-[13px] font-extrabold text-brand transition-[background-color,border-color] duration-200 hover:bg-brand/25 sm:w-auto sm:justify-self-end"
                >
                  {copied === "Full payload template" ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    <Terminal className="size-4" aria-hidden="true" />
                  )}
                  {copied === "Full payload template" ? "Copied" : "Copy Full Payload Template"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
