import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeIndianRupee,
  CheckCircle2,
  Download,
  Eye,
  FileUp,
  Info,
  Lock,
  Paperclip,
  Trash2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import {
  ActionButton,
  InlineSpinner,
  Modal,
  Panel,
  Select,
  StatusBadge,
  TableWrap,
  Td,
  Th,
  Tr,
  EmptyState,
} from "@/components/dashboard/kit";
import { inr } from "@/lib/publisher-data";
import {
  INVOICE_ACCEPT,
  MIN_WITHDRAWAL,
  PAYOUT_METHODS,
  STATUS_FLOW,
  STATUS_LABEL,
  STATUS_TONE,
  invoiceUrl,
  useWithdrawals,
  validateAmount,
  validateInvoice,
  type WithdrawalRequest,
} from "@/lib/withdrawals";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Withdraw funds form + withdrawal history, both driven by one live dataset. */
export function WithdrawalSuite({ userId }: { userId: string | null | undefined }) {
  const { requests, loading, available, reserved, submit } = useWithdrawals(userId);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<string>(PAYOUT_METHODS[0]);
  const [invoice, setInvoice] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastRef, setLastRef] = useState<string | null>(null);
  const [details, setDetails] = useState<WithdrawalRequest | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const parsed = useMemo(() => Number(amount.replace(/[^0-9.]/g, "")), [amount]);

  function openConfirm() {
    const amountError = validateAmount(parsed, available);
    const fileError = validateInvoice(invoice);
    setError(amountError ?? fileError);
    if (amountError ?? fileError) return;
    setConfirmOpen(true);
  }

  async function confirm() {
    setSubmitting(true);
    try {
      const created = await submit({ amount: parsed, paymentMethod: method, invoice });
      setLastRef(created.requestRef);
      setAmount("");
      setInvoice(null);
      if (fileRef.current) fileRef.current.value = "";
      setConfirmOpen(false);
      toast.success(`Withdrawal request ${created.requestRef} submitted`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not submit your request.";
      setError(message);
      setConfirmOpen(false);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function openInvoice(request: WithdrawalRequest) {
    if (!request.invoicePath) return;
    try {
      const url = await invoiceUrl(request.invoicePath);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Could not open that invoice.");
    }
  }

  return (
    <>
      <Panel
        title="Withdraw Funds"
        description="Request a payout from your available balance. Requests are reviewed before settlement."
        action={
          <StatusBadge tone="brand" dot>
            Min {inr(MIN_WITHDRAWAL)}
          </StatusBadge>
        }
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="grid gap-3">
            <div className="rounded-2xl border border-brand/30 bg-brand/8 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Available Balance
              </p>
              <p className="mt-1 font-display text-2xl font-black tracking-tight tabular-nums sm:text-3xl">
                {inr(available)}
              </p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                {reserved > 0
                  ? `${inr(reserved)} reserved by open withdrawal requests`
                  : "No funds currently reserved"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-hairline bg-surface-2/50 p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Minimum
                </p>
                <p className="mt-1 font-semibold tabular-nums">{inr(MIN_WITHDRAWAL)}</p>
              </div>
              <div className="rounded-2xl border border-hairline bg-surface-2/50 p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Open Requests
                </p>
                <p className="mt-1 font-semibold tabular-nums">
                  {requests.filter((r) => r.status !== "paid" && r.status !== "rejected").length}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Withdrawal Amount
              </span>
              <div className="relative">
                <BadgeIndianRupee
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(null);
                  }}
                  placeholder={`Enter amount (max ${available})`}
                  className="h-11 w-full rounded-xl border border-input bg-surface-2/50 pl-9 pr-20 text-sm tabular-nums text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAmount(String(available));
                    setError(null);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-hairline bg-surface px-2.5 py-1 text-[11px] font-bold text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  MAX
                </button>
              </div>
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Payment Method
              </span>
              <Select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                aria-label="Payment method"
              >
                {PAYOUT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </label>

            <div className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Invoice / Supporting Document{" "}
                <span className="text-muted-foreground/70">— Optional</span>
              </span>
              <input
                ref={fileRef}
                type="file"
                accept={INVOICE_ACCEPT}
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  const fileError = validateInvoice(file);
                  setError(fileError);
                  setInvoice(fileError ? null : file);
                }}
              />
              {invoice ? (
                <div className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-2/50 p-3">
                  <Paperclip className="size-4 shrink-0 text-brand" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                    {invoice.name}
                  </span>
                  <button
                    type="button"
                    aria-label="Remove file"
                    onClick={() => {
                      setInvoice(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="text-muted-foreground transition-colors duration-300 hover:text-brand"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-3 rounded-xl border border-dashed border-hairline bg-surface-2/40 p-3.5 text-left transition-colors duration-300 hover:border-brand/50"
                >
                  <FileUp className="size-4 shrink-0 text-brand" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold">Upload invoice</span>
                    <span className="block text-[12px] text-muted-foreground">
                      PDF, JPG or PNG · max 5 MB · not required
                    </span>
                  </span>
                </button>
              )}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-xl border border-brand/40 bg-brand/10 p-3 text-[13px] font-semibold text-brand"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {error}
              </motion.p>
            )}

            {lastRef && !error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-[13px] font-semibold text-emerald-500"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Request {lastRef} submitted — track it in Withdrawal History below.
              </motion.p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <ActionButton
                variant="solid"
                icon={Wallet}
                onClick={openConfirm}
                disabled={submitting || !userId}
              >
                Request Withdrawal
              </ActionButton>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Lock className="size-3.5" aria-hidden="true" />
                Settled to your saved payout account
              </span>
            </div>
            {!userId && (
              <p className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Info className="size-3.5" aria-hidden="true" />
                Sign in to submit a withdrawal request.
              </p>
            )}
          </div>
        </div>
      </Panel>

      <Panel
        title="Withdrawal History"
        description="Every withdrawal request you have raised, with live status and invoice access."
      >
        {loading ? (
          <div className="flex items-center gap-2 p-2 text-[13px] text-muted-foreground">
            <InlineSpinner /> Loading withdrawal requests…
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            title="No withdrawal requests yet"
            description="Requests you raise from the Withdraw Funds card will appear here."
          />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Request ID</Th>
                <Th>Date</Th>
                <Th align="right">Amount</Th>
                <Th>Invoice</Th>
                <Th>Payment Method</Th>
                <Th>Status</Th>
                <Th align="right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <Tr key={r.id}>
                  <Td className="font-mono text-[12.5px]">{r.requestRef}</Td>
                  <Td>{fmtDate(r.createdAt)}</Td>
                  <Td className="text-right font-semibold tabular-nums">{inr(r.amount)}</Td>
                  <Td>
                    {r.invoicePath ? (
                      <button
                        type="button"
                        onClick={() => void openInvoice(r)}
                        className="inline-flex items-center gap-1.5 font-semibold text-brand"
                      >
                        <Download className="size-3.5" aria-hidden="true" />
                        View
                      </button>
                    ) : (
                      <span className="text-muted-foreground/60">—</span>
                    )}
                  </Td>
                  <Td>{r.paymentMethod}</Td>
                  <Td>
                    <StatusBadge tone={STATUS_TONE[r.status]} dot>
                      {STATUS_LABEL[r.status]}
                    </StatusBadge>
                  </Td>
                  <Td className="text-right">
                    <button
                      type="button"
                      onClick={() => setDetails(r)}
                      className="inline-flex items-center gap-1 font-semibold text-brand"
                    >
                      Details
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Panel>

      <Modal
        open={confirmOpen}
        onClose={() => !submitting && setConfirmOpen(false)}
        title="Confirm Withdrawal"
        description={`You are requesting a withdrawal of ${inr(parsed || 0)}. Please confirm the details before submitting your request.`}
        footer={
          <>
            <ActionButton onClick={() => setConfirmOpen(false)} disabled={submitting}>
              Cancel
            </ActionButton>
            <ActionButton variant="solid" onClick={() => void confirm()} disabled={submitting}>
              {submitting ? "Submitting…" : "Confirm Withdrawal"}
            </ActionButton>
          </>
        }
      >
        <dl className="grid gap-2 rounded-2xl border border-hairline bg-surface-2/50 p-4 text-[13px]">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="font-semibold tabular-nums">{inr(parsed || 0)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Payment method</dt>
            <dd className="min-w-0 truncate font-semibold">{method}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Invoice</dt>
            <dd className="min-w-0 truncate font-semibold">{invoice?.name ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Balance after request</dt>
            <dd className="font-semibold tabular-nums">
              {inr(Math.max(0, available - (parsed || 0)))}
            </dd>
          </div>
        </dl>
      </Modal>

      <Modal
        open={Boolean(details)}
        onClose={() => setDetails(null)}
        title={details ? `Request ${details.requestRef}` : "Request"}
        description={details ? `Raised on ${fmtDate(details.createdAt)}` : undefined}
        footer={
          details?.invoicePath ? (
            <ActionButton icon={Eye} onClick={() => details && void openInvoice(details)}>
              View Invoice
            </ActionButton>
          ) : null
        }
      >
        {details && (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-hairline bg-surface-2/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Amount
              </p>
              <p className="mt-1 font-display text-2xl font-black tabular-nums">
                {inr(details.amount)}
              </p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">{details.paymentMethod}</p>
            </div>

            {details.status === "rejected" ? (
              <p className="flex items-start gap-2 rounded-xl border border-brand/40 bg-brand/10 p-3 text-[13px] font-semibold text-brand">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {details.rejectionReason ?? "This request was rejected by the payouts team."}
              </p>
            ) : (
              <ol className="grid gap-2">
                {STATUS_FLOW.map((step) => {
                  const index = STATUS_FLOW.indexOf(details.status);
                  const done = STATUS_FLOW.indexOf(step) <= index;
                  return (
                    <li key={step} className="flex items-center gap-2.5 text-[13px]">
                      <span
                        aria-hidden="true"
                        className={
                          done
                            ? "size-2.5 rounded-full bg-brand"
                            : "size-2.5 rounded-full border border-hairline bg-surface-2"
                        }
                      />
                      <span className={done ? "font-semibold" : "text-muted-foreground"}>
                        {STATUS_LABEL[step]}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
