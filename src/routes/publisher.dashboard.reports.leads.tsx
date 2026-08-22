import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock, Download, Users, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  Chip,
  EmptyState,
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
import { LEAD_RECORDS, LEAD_TOTALS, inr } from "@/lib/publisher-data";

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
    </>
  );
}
