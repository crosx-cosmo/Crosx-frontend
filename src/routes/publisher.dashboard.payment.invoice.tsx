import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  Modal,
  Panel,
  StatusBadge,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/dashboard/kit";
import { INVOICES, INITIAL_PROFILE, inr, type Invoice } from "@/lib/publisher-data";

export const Route = createFileRoute("/publisher/dashboard/payment/invoice")({
  component: Page,
  head: () =>
    dashboardHead(
      "Invoice — CrosX Publisher",
      "View and download GST-ready invoices for every settled CrosX payout.",
    ),
});

function Page() {
  const [open, setOpen] = useState<Invoice | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Payments"
        title="Invoices"
        description="GST-ready invoices for every payout cycle, ready to view or download."
      />

      <Panel title={`${INVOICES.length} invoices`} description="Generated automatically each cycle.">
        <TableWrap>
          <thead>
            <tr>
              <Th>Invoice</Th>
              <Th>Period</Th>
              <Th align="right">Amount</Th>
              <Th>Status</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((i) => (
              <Tr key={i.id}>
                <Td className="font-mono text-[12.5px]">{i.id}</Td>
                <Td className="font-semibold">{i.period}</Td>
                <Td className="text-right font-semibold tabular-nums">{inr(i.amount)}</Td>
                <Td>
                  <StatusBadge tone={i.status === "Paid" ? "success" : "warn"} dot>
                    {i.status}
                  </StatusBadge>
                </Td>
                <Td className="text-right">
                  <span className="inline-flex justify-end gap-1.5">
                    <ActionButton variant="subtle" icon={Eye} onClick={() => setOpen(i)}>
                      View
                    </ActionButton>
                    <ActionButton
                      variant="subtle"
                      icon={Download}
                      onClick={() => toast.success(`${i.id} download started (demo)`)}
                    >
                      PDF
                    </ActionButton>
                  </span>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>

      <Modal
        open={open !== null}
        onClose={() => setOpen(null)}
        title={open ? `Invoice ${open.id}` : "Invoice"}
        description={open ? `${open.period} payout cycle` : undefined}
        footer={
          <ActionButton
            variant="solid"
            icon={Download}
            className="w-full sm:w-auto"
            onClick={() => toast.success("Invoice download started (demo)")}
          >
            Download PDF
          </ActionButton>
        }
      >
        {open && (
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-surface-2/40 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Billed To
                </p>
                <p className="mt-1.5 text-sm font-bold">{INITIAL_PROFILE.fullName}</p>
                <p className="text-xs text-muted-foreground">{INITIAL_PROFILE.publisherId}</p>
                <p className="text-xs text-muted-foreground">{INITIAL_PROFILE.email}</p>
              </div>
              <div className="rounded-2xl border border-hairline bg-surface-2/40 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Issued By
                </p>
                <p className="mt-1.5 text-sm font-bold">CrosX Media Network</p>
                <p className="text-xs text-muted-foreground">GSTIN 07AABCC1234D1Z5</p>
                <p className="text-xs text-muted-foreground">New Delhi, India</p>
              </div>
            </div>

            <div className="rounded-2xl border border-hairline bg-surface-2/40 p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-semibold">
                  <FileText className="size-4 text-brand" aria-hidden="true" />
                  Performance marketing payout
                </span>
                <span className="font-semibold tabular-nums">{inr(open.amount)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-hairline pt-3 text-sm">
                <span className="font-display font-bold">Total</span>
                <span className="font-display text-lg font-black tabular-nums text-brand">
                  {inr(open.amount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
