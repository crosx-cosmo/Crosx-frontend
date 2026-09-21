import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RefreshCw, ScrollText } from "lucide-react";
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
import { usePublisherMock } from "@/components/dashboard/mock-store";
import { POSTBACK_TOTALS } from "@/lib/publisher-data";

export const Route = createFileRoute("/publisher/dashboard/postback/logs")({
  component: Page,
  head: () =>
    dashboardHead(
      "Postback Logs — CrosX Publisher",
      "Inspect every postback CrosX fired to your tracker, with response codes and retry controls.",
    ),
});

const PAGE_SIZE = 10;
const FILTERS = ["All", "Success", "Failed"] as const;

function Page() {
  const { logs, retryLog } = usePublisherMock();
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const loading = useMockLoad([filter]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return logs.filter(
      (l) =>
        (filter === "All" || (filter === "Success" ? l.ok : !l.ok)) &&
        (term === "" ||
          l.requestId.toLowerCase().includes(term) ||
          l.campaign.toLowerCase().includes(term)),
    );
  }, [logs, filter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const failed = logs.filter((l) => !l.ok).length;

  return (
    <>
      <PageHeader
        eyebrow="Postback"
        title="Postback Logs"
        description="Every postback CrosX fired to your tracker, with response codes and one-click retry."
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard
            label="Logged Today"
            value={logs.length}
            icon={ScrollText}
            support="Most recent requests"
            delay={0}
          />
          <KpiCard
            label="Successful"
            value={logs.length - failed}
            icon={ScrollText}
            trend="HTTP 200"
            support="Delivered to your tracker"
            delay={0.05}
          />
          <KpiCard
            label="Failed"
            value={failed}
            icon={ScrollText}
            trend={failed > 0 ? "Needs retry" : "All clear"}
            trendTone={failed > 0 ? "down" : "up"}
            support="Retry available"
            delay={0.1}
          />
          <KpiCard
            label="Success Rate"
            value={POSTBACK_TOTALS.successRate}
            suffix="%"
            decimals={1}
            icon={ScrollText}
            trendTone="neutral"
            support="Rolling 30 days"
            delay={0.15}
          />
        </div>

        <Panel
          title="Request Log"
          description="Filter by delivery outcome or search a request ID."
          action={
            <SearchField
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder="Request ID or campaign..."
              className="w-full sm:w-56"
            />
          }
        >
          <div className="mb-5 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Chip
                key={f}
                active={filter === f}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
              >
                {f}
              </Chip>
            ))}
          </div>

          {loading ? (
            <TableSkeleton rows={8} />
          ) : rows.length === 0 ? (
            <EmptyState
              icon={ScrollText}
              title="No postback logs found"
              description="Try a different outcome filter or clear your search."
              onClear={() => {
                setQuery("");
                setFilter("All");
              }}
            />
          ) : (
            <>
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Request ID</Th>
                    <Th>Time</Th>
                    <Th>Campaign</Th>
                    <Th>Event</Th>
                    <Th>Response</Th>
                    <Th align="right">Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((l) => (
                    <Tr key={l.id}>
                      <Td className="font-mono text-[12.5px]">{l.requestId}</Td>
                      <Td className="tabular-nums">{l.time}</Td>
                      <Td className="font-semibold">{l.campaign}</Td>
                      <Td className="capitalize text-muted-foreground">{l.event}</Td>
                      <Td>
                        <StatusBadge tone={l.ok ? "success" : "danger"} dot>
                          {l.status} {l.response}
                        </StatusBadge>
                      </Td>
                      <Td className="text-right">
                        <span className="inline-flex justify-end">
                          {l.ok ? (
                            <span className="text-xs text-muted-foreground">—</span>
                          ) : (
                            <ActionButton
                              icon={RefreshCw}
                              onClick={() => {
                                retryLog(l.requestId);
                                toast.success(`${l.requestId} retried successfully`);
                              }}
                            >
                              Retry
                            </ActionButton>
                          )}
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
                label="requests"
              />
            </>
          )}
        </Panel>
      </div>
    </>
  );
}
