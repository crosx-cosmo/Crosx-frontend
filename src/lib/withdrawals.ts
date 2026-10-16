import { useCallback, useEffect, useMemo, useState } from "react";

import { getSupabase } from "./supabase-external";
import { ACCOUNT_TOTALS } from "./publisher-data";

/** Minimum amount a publisher may request in a single withdrawal. */
export const MIN_WITHDRAWAL = 1000;
/** Hard cap for the optional invoice upload (matches the storage bucket limit). */
export const MAX_INVOICE_BYTES = 5 * 1024 * 1024;
export const INVOICE_ACCEPT = "application/pdf,image/jpeg,image/png";
const INVOICE_BUCKET = "withdrawal-invoices";

export const PAYOUT_METHODS = [
  "Bank Transfer — HDFC ••4821",
  "UPI — crosx@okhdfcbank",
  "PayPal — payouts@crosx.in",
] as const;

export type WithdrawalStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "processing"
  | "paid"
  | "rejected";

export type WithdrawalRequest = {
  id: string;
  requestRef: string;
  amount: number;
  paymentMethod: string;
  invoicePath: string | null;
  invoiceName: string | null;
  status: WithdrawalStatus;
  rejectionReason: string | null;
  createdAt: string;
};

export const STATUS_FLOW: WithdrawalStatus[] = [
  "pending",
  "under_review",
  "approved",
  "processing",
  "paid",
];

export const STATUS_LABEL: Record<WithdrawalStatus, string> = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  processing: "Processing",
  paid: "Paid",
  rejected: "Rejected",
};

export const STATUS_TONE: Record<WithdrawalStatus, "warn" | "brand" | "success" | "danger"> = {
  pending: "warn",
  under_review: "warn",
  approved: "brand",
  processing: "brand",
  paid: "success",
  rejected: "danger",
};

/** Requests that still hold (reserve) funds from the available balance. */
const RESERVING: WithdrawalStatus[] = ["pending", "under_review", "approved", "processing"];

type Row = {
  id: string;
  request_ref: string;
  amount: number | string;
  payment_method: string;
  invoice_path: string | null;
  invoice_name: string | null;
  status: WithdrawalStatus;
  rejection_reason: string | null;
  created_at: string;
};

const SELECT =
  "id,request_ref,amount,payment_method,invoice_path,invoice_name,status,rejection_reason,created_at";

function toRequest(row: Row): WithdrawalRequest {
  return {
    id: row.id,
    requestRef: row.request_ref,
    amount: Number(row.amount),
    paymentMethod: row.payment_method,
    invoicePath: row.invoice_path,
    invoiceName: row.invoice_name,
    status: row.status,
    rejectionReason: row.rejection_reason,
    createdAt: row.created_at,
  };
}

export function validateAmount(amount: number, available: number) {
  if (!Number.isFinite(amount) || amount <= 0) return "Enter a withdrawal amount.";
  if (amount < MIN_WITHDRAWAL)
    return `Minimum withdrawal is ₹${MIN_WITHDRAWAL.toLocaleString("en-IN")}.`;
  if (amount > available) return "Amount exceeds your available balance.";
  return null;
}

export function validateInvoice(file: File | null) {
  if (!file) return null;
  if (!INVOICE_ACCEPT.split(",").includes(file.type)) return "Upload a PDF, JPG or PNG file.";
  if (file.size > MAX_INVOICE_BYTES) return "File is larger than 5 MB.";
  return null;
}

/**
 * Withdrawal requests for the signed-in publisher, backed by the
 * `withdrawal_requests` table (RLS scopes rows to the owner). Balance is derived
 * from the account's settled + pending earnings minus funds already reserved by
 * open requests, so the same money can't be requested twice.
 */
export function useWithdrawals(userId: string | null | undefined) {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setRequests([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: err } = await getSupabase()
      .from("withdrawal_requests")
      .select(SELECT)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else {
      setError(null);
      setRequests(((data ?? []) as Row[]).map(toRequest));
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const reserved = useMemo(
    () =>
      requests.filter((r) => RESERVING.includes(r.status)).reduce((sum, r) => sum + r.amount, 0),
    [requests],
  );

  const withdrawable = ACCOUNT_TOTALS.pendingPayout + ACCOUNT_TOTALS.earnings;
  const available = Math.max(0, withdrawable - reserved);

  const submit = useCallback(
    async ({
      amount,
      paymentMethod,
      invoice,
    }: {
      amount: number;
      paymentMethod: string;
      invoice: File | null;
    }) => {
      if (!userId) throw new Error("You need to be signed in to request a withdrawal.");
      const supabase = getSupabase();

      let invoicePath: string | null = null;
      if (invoice) {
        const ext = invoice.name.split(".").pop() ?? "pdf";
        invoicePath = `${userId}/${Date.now()}-invoice.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(INVOICE_BUCKET)
          .upload(invoicePath, invoice, { upsert: false, contentType: invoice.type });
        if (upErr) throw upErr;
      }

      const { data, error: insErr } = await supabase
        .from("withdrawal_requests")
        .insert({
          user_id: userId,
          amount,
          payment_method: paymentMethod,
          invoice_path: invoicePath,
          invoice_name: invoice?.name ?? null,
        })
        .select(SELECT)
        .single();
      if (insErr) throw insErr;

      const created = toRequest(data as Row);
      setRequests((prev) => [created, ...prev]);
      return created;
    },
    [userId],
  );

  return { requests, loading, error, reload: load, reserved, available, withdrawable, submit };
}

/** Time-limited signed URL for a stored invoice (private bucket). */
export async function invoiceUrl(path: string) {
  const { data, error } = await getSupabase()
    .storage.from(INVOICE_BUCKET)
    .createSignedUrl(path, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
}
