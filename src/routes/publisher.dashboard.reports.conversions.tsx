import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock, Download, Gauge, XCircle } from "lucide-react";
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
  SUB_KEYS,
  stickyCell,
  stickyHeadCell,
  TableSkeleton,
  TableWrap,
  Td,
  Th,
  Tr,
  useMockLoad,
  Val,
} from "@/components/dashboard/kit";
import { CONVERSION_RECORDS, CONVERSION_TOTALS, inr } from "@/lib/publisher-data";

export const Route = createFileRoute("/publisher/dashboard/reports/conversions")({
  component: Page,
  head: () =>
    dashboardHead(
      "Conversion Report — CrosX Publisher",
      "Track approved, pending and rejected conversions with payouts across every CrosX campaign.",
    ),
});

const PAGE_SIZE = 10;
const STATUSES = ["All", "Approved", "Pending", "Rejected"] as const;

function Page() {
  const [status, setStatus] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const loading = useMockLoad([status]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return CONVERSION_RECORDS.filter(
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
        title="Conversion Report"
        description="Full conversion history with approval status, payout value and campaign attribution."
        action={
          <ActionButton
            icon={Download}
            onClick={() => toast.success("Conversion report export started (demo)")}
          >
            Export CSV
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard
            label="Total Conversions"
            value={CONVERSION_TOTALS.total}
            icon={Gauge}
            trend="↑ 8.1%"
            support="This month"
            delay={0}
          />
          <KpiCard
            label="Approved"
            value={CONVERSION_TOTALS.approved}
            icon={CheckCircle2}
            trend="87.4%"
            support="Approval rate"
            delay={0.05}
          />
          <KpiCard
            label="Pending"
            value={CONVERSION_TOTALS.pending}
            icon={Clock}
            trendTone="neutral"
            trend="In review"
            support="Avg 1.9 days to confirm"
            delay={0.1}
          />
          <KpiCard
            label="Rejected"
            value={CONVERSION_TOTALS.rejected}
            icon={XCircle}
            trendTone="down"
            trend="4.3%"
            support="Mostly duplicate leads"
            delay={0.15}
          />
        </div>

        <Panel
          title="Conversion Log"
          description="Filter by approval status or search a conversion ID."
          action={
            <SearchField
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder="Conversion ID or campaign..."
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
              icon={Gauge}
              title="No conversions found"
              description="Try a different status filter or clear your search."
              onClear={() => {
                setQuery("");
                setStatus("All");
              }}
            />
          ) : (
            <>
              <TableWrap minWidth="140rem">
                <thead>
                  <tr>
                    <Th className={stickyHeadCell}>Conversion ID</Th>
                    <Th>Click ID</Th>
                    <Th>Sub ID</Th>
                    <Th>IP Address</Th>
                    <Th>Offer ID</Th>
                    <Th>Event</Th>
                    <Th align="right">Payout</Th>
                    <Th>Campaign</Th>
                    <Th>Device</Th>
                    <Th>OS / Browser</Th>
                    <Th>Geo</Th>
                    <Th>Timestamp</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    {SUB_KEYS.map((k) => (
                      <Th key={k}>{k.toUpperCase()}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <Tr key={r.id}>
                      <Td className={`${stickyCell} font-mono text-[12.5px] whitespace-nowrap`}>
                        {r.id}
                      </Td>
                      <Td className="font-mono text-[12.5px] whitespace-nowrap">
                        <Val value={r.clickId} />
                      </Td>
                      <Td className="text-muted-foreground">
                        <Val value={r.sub1} />
                      </Td>
                      <Td className="font-mono text-[12.5px] whitespace-nowrap">
                        <Val value={r.ip} />
                      </Td>
                      <Td className="font-mono text-[12.5px] whitespace-nowrap">
                        <Val value={r.offerId} />
                      </Td>
                      <Td className="whitespace-nowrap">
                        <Val value={r.event} width="w-32" />
                      </Td>
                      <Td className="text-right font-semibold tabular-nums whitespace-nowrap">
                        {inr(r.payout)}
                      </Td>
                      <Td className="font-semibold whitespace-nowrap">
                        <Val value={r.campaign} width="w-36" />
                      </Td>
                      <Td>
                        <StatusBadge tone={r.device === "Mobile" ? "brand" : "neutral"}>
                          {r.device}
                        </StatusBadge>
                      </Td>
                      <Td className="whitespace-nowrap text-muted-foreground">
                        <Val value={`${r.os} · ${r.browser}`} width="w-40" />
                      </Td>
                      <Td className="whitespace-nowrap">
                        <Val value={r.geo} />
                      </Td>
                      <Td className="tabular-nums whitespace-nowrap text-muted-foreground">
                        <Val value={r.timestamp} width="w-40" />
                      </Td>
                      <Td className="whitespace-nowrap">
                        <Val value={r.date} width="w-28" />
                      </Td>
                      <Td>
                        <StatusBadge
                          tone={
                            r.status === "Approved"
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
                      {SUB_KEYS.map((k) => (
                        <Td key={k} className="text-muted-foreground">
                          <Val value={r[k]} />
                        </Td>
                      ))}
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
                label="conversions"
              />
            </>
          )}
        </Panel>
      </div>
    </>
  );
}
