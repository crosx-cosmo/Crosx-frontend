import { useState } from "react";
import { CheckCircle2, Eye, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ActionButton, Modal, StatusBadge } from "@/components/dashboard/kit";
import { inr, num, type AdminPublisher, type PublisherStatus } from "@/lib/admin-data";
import { kycForStatus, patchPublisher } from "@/lib/admin-status-store";
import { adminSetPublisherStatus } from "@/lib/admin-management.functions";
import { toneFor } from "./tones";

type Pending = { row: AdminPublisher; status: PublisherStatus } | null;

const COPY: Record<string, { title: string; body: string; cta: string }> = {
  Suspended: {
    title: "Suspend publisher?",
    body: "The publisher keeps their account but stops receiving traffic approvals and payouts until reactivated.",
    cta: "Suspend Publisher",
  },
  Terminated: {
    title: "Terminate publisher?",
    body: "Termination permanently closes the partnership. Pending payouts move to manual finance review.",
    cta: "Terminate Publisher",
  },
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface-2/40 p-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

/** Approve / Suspend / Terminate / View controls for one publisher row. */
export function PublisherActions({ row }: { row: AdminPublisher }) {
  const [pending, setPending] = useState<Pending>(null);
  const [view, setView] = useState(false);
  const [busy, setBusy] = useState(false);

  async function apply(target: AdminPublisher, status: PublisherStatus) {
    setBusy(true);
    patchPublisher(target.id, { status, kyc: kycForStatus(status) });
    try {
      const result = await adminSetPublisherStatus({
        data: {
          publisherId: target.id,
          email: target.email,
          status: status.toLowerCase() as "active" | "pending" | "suspended" | "terminated",
        },
      });
      if (result.persisted) toast.success(`${target.name} is now ${status.toLowerCase()}.`);
      else toast.warning(result.message ?? `${target.name} marked ${status.toLowerCase()} in the console.`);
    } catch {
      toast.error("We could not reach the account service. Please retry.");
    } finally {
      setBusy(false);
      setPending(null);
    }
  }

  const copy = pending ? COPY[pending.status] : undefined;

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <ActionButton
          variant="subtle"
          icon={Eye}
          className="h-9 px-2.5"
          onClick={() => setView(true)}
        >
          View
        </ActionButton>
        {row.status !== "Active" && row.status !== "Terminated" && (
          <ActionButton
            variant="ghost"
            icon={CheckCircle2}
            className="h-9 px-2.5"
            disabled={busy}
            onClick={() => apply(row, "Active")}
          >
            Approve
          </ActionButton>
        )}
        {row.status !== "Suspended" && row.status !== "Terminated" && (
          <ActionButton
            variant="ghost"
            icon={ShieldAlert}
            className="h-9 px-2.5"
            disabled={busy}
            onClick={() => setPending({ row, status: "Suspended" })}
          >
            Suspend
          </ActionButton>
        )}
        {row.status !== "Terminated" && (
          <ActionButton
            variant="ghost"
            icon={Trash2}
            className="h-9 px-2.5 hover:border-brand"
            disabled={busy}
            onClick={() => setPending({ row, status: "Terminated" })}
          >
            Terminate
          </ActionButton>
        )}
      </div>

      <Modal
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        title={copy?.title ?? "Confirm action"}
        description={copy?.body}
        footer={
          <>
            <ActionButton variant="ghost" onClick={() => setPending(null)}>
              Keep as is
            </ActionButton>
            <ActionButton
              variant="solid"
              disabled={busy}
              onClick={() => pending && apply(pending.row, pending.status)}
            >
              {copy?.cta ?? "Confirm"}
            </ActionButton>
          </>
        }
      >
        {pending && (
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Publisher" value={pending.row.name} />
            <Field label="Publisher ID" value={pending.row.id} />
            <Field label="Company" value={pending.row.company} />
            <Field label="Payout Due" value={inr(pending.row.payoutDue)} />
          </div>
        )}
      </Modal>

      <Modal
        open={view}
        onClose={() => setView(false)}
        title={row.name}
        description={`${row.company} — ${row.email}`}
        footer={
          <ActionButton variant="ghost" onClick={() => setView(false)}>
            Close
          </ActionButton>
        }
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label="Publisher ID" value={row.id} />
          <Field
            label="Status"
            value={
              <StatusBadge tone={toneFor(row.status)} dot>
                {row.status}
              </StatusBadge>
            }
          />
          <Field label="Tier" value={row.tier} />
          <Field label="KYC" value={row.kyc} />
          <Field label="Traffic Source" value={row.traffic} />
          <Field label="Geo" value={row.geo} />
          <Field label="Campaigns" value={num(row.campaigns)} />
          <Field label="Approval Rate" value={`${row.approvalRate}%`} />
          <Field label="Clicks" value={num(row.clicks)} />
          <Field label="Conversions" value={num(row.conversions)} />
          <Field label="Revenue" value={inr(row.revenue)} />
          <Field label="Payout Due" value={inr(row.payoutDue)} />
          <Field label="Joined" value={row.joined} />
          <Field label="Last Active" value={row.lastActive} />
        </div>
      </Modal>
    </>
  );
}
