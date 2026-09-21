import { Link } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { inr } from "@/lib/publisher-data";
import { useSupabaseSession } from "@/lib/supabase-auth";
import { useWithdrawals } from "@/lib/withdrawals";

/**
 * Compact header wallet showing the publisher's real available withdrawal
 * balance (same source as the Total Payout withdrawal panel).
 */
export function WalletBalance() {
  const { user } = useSupabaseSession();
  const { available, loading } = useWithdrawals(user?.id ?? null);

  return (
    <Link
      to="/publisher/dashboard/payment/total-payout"
      aria-label="Available withdrawal balance"
      title="Total available balance"
      className="glass inline-flex h-10 shrink-0 items-center gap-2 rounded-xl px-2.5 transition-colors duration-300 hover:border-brand/50 sm:px-3"
    >
      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-brand/12 text-brand">
        <Wallet className="size-3.5" aria-hidden="true" />
      </span>
      <span className="grid leading-none">
        <span className="hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:block">
          Available
        </span>
        <span className="mt-0.5 text-[13px] font-black tabular-nums tracking-tight">
          {loading ? "—" : inr(available)}
        </span>
      </span>
    </Link>
  );
}
