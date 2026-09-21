import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock, Download, Eye, Users, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  Chip,
  EmptyState,
  Modal,
  KpiCard,
  Pagination,
  Panel,
  SearchField,
  StatusBadge,
  TableSkeleton,
  TableWrap,
  Td,
  Th,
  Tr,
  useMockLoad,
} from "@/components/dashboard/kit";
import { LEAD_RECORDS, LEAD_TOTALS, inr, type LeadRecord } from "@/lib/publisher-data";

export const Route = createFileRoute("/publisher/dashboard/reports/leads")({
  component: Page,
  head: () =>
    dashboardHead(
      "Leads Report — CrosX Publisher",
      "Review every lead you generated on CrosX with qualification status and payout value.",
    ),
});

const PAGE_SIZE = 10;
const STATUSES = ["All", "Qualified", "Pending", "Rejected"] as const;

function Page() {
  const [status, setStatus] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<LeadRecord | null>(null);
  const loading = useMockLoad([status]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return LEAD_RECORDS.filter(
      (r) =>
        (status === "All" || r.status === status) &&
        (term === "" ||
          r.id.toLowerCase().includes(term) ||
          r.campaign.toLowerCase().includes(term)),
    );
  }, [status, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Leads Report"
        description="Every lead you generated with qualification status, campaign source and payout value."
        action={
          <ActionButton
            icon={Download}
            onClick={() => toast.success("Leads report export started (demo)")}
          >
            Export CSV
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard
            label="Total Leads"
            value={LEAD_TOTALS.total}
            icon={Users}
            trend="↑ 11.2%"
            support="This month"
            delay={0}
          />
          <KpiCard
            label="Qualified"
            value={LEAD_TOTALS.qualified}
            icon={CheckCircle2}
            trend="76.5%"
            support="Qualification rate"
            delay={0.05}
          />
          <KpiCard
            label="Pending"
            value={LEAD_TOTALS.pending}
            icon={Clock}
            trend="In review"
            trendTone="neutral"
            support="Advertiser verification"
            delay={0.1}
          />
          <KpiCard
            label="Rejected"
            value={LEAD_TOTALS.rejected}
            icon={XCircle}
            trend="9.3%"
            trendTone="down"
            support="Invalid contact details"
            delay={0.15}
          />
        </div>

        <Panel
          title="Lead Log"
          description="Filter by qualification status or search a lead ID."
          action={
            <SearchField
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder="Lead ID or campaign..."
              className="w-full sm:w-60"
            />
          }
        >
          <div className="mb-5 flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Chip
                key={s}
                active={status === s}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
              >
                {s}
              </Chip>
            ))}
          </div>

          {loading ? (
            <TableSkeleton rows={8} />
          ) : rows.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No leads found"
              description="Try another status filter or clear your search."
              onClear={() => {
                setQuery("");
                setStatus("All");
              }}
            />
          ) : (
            <>
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Lead ID</Th>
                    <Th>Campaign</Th>
                    <Th>Date</Th>
                    <Th align="right">Payout</Th>
                    <Th>Status</Th>
                    <Th align="right">Preview</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <Tr key={r.id}>
                      <Td className="font-mono text-[12.5px]">{r.id}</Td>
                      <Td className="font-semibold">{r.campaign}</Td>
                      <Td>{r.date}</Td>
                      <Td className="text-right font-semibold tabular-nums">{inr(r.payout)}</Td>
                      <Td>
                        <StatusBadge
                          tone={
                            r.status === "Qualified"
                              ? "success"
                              : r.status === "Pending"
                                ? "warn"
                                : "danger"
                          }
                          dot
                        >
                          {r.status}
                        </StatusBadge>
                      </Td>
                      <Td className="text-right">
                        <span className="inline-flex justify-end">
                          <ActionButton variant="subtle" icon={Eye} onClick={() => setPreview(r)}>
                            View
                          </ActionButton>
                        </span>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </TableWrap>
              <Pagination
                page={current}
                pageCount={pageCount}
                total={filtered.length}
                pageSize={PAGE_SIZE}
                onPage={setPage}
                label="leads"
              />
            </>
          )}
        </Panel>
      </div>

      <LeadPreviewModal lead={preview} onClose={() => setPreview(null)} />
    </>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid gap-0.5 rounded-xl border border-hairline bg-surface-2/40 px-3.5 py-2.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <span
        className={`text-[13px] font-semibold text-foreground ${mono ? "font-mono text-[12.5px]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function LeadPreviewModal({ lead, onClose }: { lead: LeadRecord | null; onClose: () => void }) {
  return (
    <Modal
      open={lead !== null}
      onClose={onClose}
      title={lead ? `Lead ${lead.id}` : ""}
      description={lead ? `${lead.campaign} — read-only lead details` : undefined}
      footer={
        <ActionButton variant="solid" onClick={onClose}>
          Close
        </ActionButton>
      }
    >
      {lead ? (
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              tone={
                lead.status === "Qualified"
                  ? "success"
                  : lead.status === "Pending"
                    ? "warn"
                    : "danger"
              }
              dot
            >
              {lead.status}
            </StatusBadge>
            <span className="rounded-full bg-brand/12 px-2.5 py-1 text-[11px] font-bold text-brand">
              {inr(lead.payout)} payout
            </span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <Row label="Lead ID" value={lead.id} mono />
            <Row label="Campaign" value={lead.campaign} />
            <Row label="Lead Date" value={lead.date} />
            <Row label="Conversion Event" value={lead.event} />
            <Row label="Click ID" value={lead.clickId} mono />
            <Row label="Transaction ID" value={lead.transactionId} mono />
            <Row label="Device" value={`${lead.device} · ${lead.os}`} />
            <Row label="Geo" value={`${lead.city}, ${lead.geo}`} />
            <Row label="Traffic Source" value={lead.trafficSource} />
            <Row label="Payout" value={inr(lead.payout)} />
          </div>

          <section className="grid gap-2.5">
            <h4 className="text-xs font-black uppercase tracking-[0.14em] text-brand">
              Sub ID parameters
            </h4>
            <ul className="flex flex-wrap gap-1.5">
              {Object.entries(lead.subIds).map(([k, v]) => (
                <li
                  key={k}
                  className="rounded-full border border-hairline bg-surface-1/70 px-2.5 py-1 font-mono text-[11.5px] font-semibold text-brand"
                >
                  {k}={v}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-2.5 sm:grid-cols-3">
            <Row label="Clicked At" value={lead.clickedAt} mono />
            <Row label="Lead At" value={lead.leadAt} mono />
            <Row label="Reviewed At" value={lead.reviewedAt ?? "Pending review"} mono />
          </section>

          <div className="rounded-2xl border border-hairline bg-brand/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Qualification
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              {lead.qualification}
            </p>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
