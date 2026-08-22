import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, MousePointerClick, Monitor, Smartphone, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  EmptyState,
  KpiCard,
  Pagination,
  Panel,
  SearchField,
  Select,
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
import {
  ACCOUNT_TOTALS,
  CLICK_RECORDS,
  RANGE_OPTIONS,
  type RangeKey,
} from "@/lib/publisher-data";

export const Route = createFileRoute("/publisher/dashboard/reports/clicks")({
  component: Page,
  head: () =>
    dashboardHead(
      "Clicks Report — CrosX Publisher",
      "Analyse every click on your CrosX tracking links by campaign, device, geo and Sub ID.",
    ),
});

const PAGE_SIZE = 10;

function Page() {
  const [range, setRange] = useState<RangeKey>("7d");
  const [query, setQuery] = useState("");
  const [device, setDevice] = useState("All");
  const [page, setPage] = useState(1);
  const loading = useMockLoad([range, device]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return CLICK_RECORDS.filter(
      (r) =>
        (device === "All" || r.device === device) &&
        (term === "" ||
          r.id.toLowerCase().includes(term) ||
          r.campaign.toLowerCase().includes(term) ||
          r.sub1.toLowerCase().includes(term)),
    );
  }, [query, device]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Clicks Report"
        description="Every click on your CrosX tracking links, broken down by campaign, device, geo and Sub ID."
        action={
          <ActionButton
            icon={Download}
            onClick={() => toast.success("Clicks report export started (demo)")}
          >
            Export CSV
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard
            label="Total Clicks"
            value={ACCOUNT_TOTALS.monthlyClicks}
            icon={MousePointerClick}
            trend="↑ 12.4%"
            support="This month"
            delay={0}
          />
          <KpiCard
            label="Unique Clicks"
            value={ACCOUNT_TOTALS.uniqueClicks}
            icon={Users}
            trend="↑ 9.8%"
            support="77.2% unique rate"
            delay={0.05}
          />
          <KpiCard
            label="Mobile Traffic"
            value={ACCOUNT_TOTALS.mobileShare}
            suffix="%"
            icon={Smartphone}
            trendTone="neutral"
            support="Highest converting device"
            delay={0.1}
          />
          <KpiCard
            label="Desktop Traffic"
            value={ACCOUNT_TOTALS.desktopShare}
            suffix="%"
            icon={Monitor}
            trendTone="neutral"
            support="Steady share"
            delay={0.15}
          />
        </div>

        <Panel
          title="Click Log"
          description={`Live click stream — ${
            RANGE_OPTIONS.find((r) => r.key === range)?.caption ?? ""
          }`}
          action={
            <>
              <SearchField
                value={query}
                onChange={(v) => {
                  setQuery(v);
                  setPage(1);
                }}
                placeholder="Click ID, campaign, Sub ID..."
                className="w-full sm:w-56"
              />
              <Select value={device} onChange={(e) => setDevice(e.target.value)}>
                <option value="All">All Devices</option>
                <option value="Mobile">Mobile</option>
                <option value="Desktop">Desktop</option>
              </Select>
              <Select value={range} onChange={(e) => setRange(e.target.value as RangeKey)}>
                {RANGE_OPTIONS.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </>
          }
        >
          {loading ? (
            <TableSkeleton rows={8} />
          ) : rows.length === 0 ? (
            <EmptyState
              icon={MousePointerClick}
              title="No clicks match your filters"
              description="Adjust the device filter or search another campaign."
              onClear={() => {
                setQuery("");
                setDevice("All");
              }}
            />
          ) : (
            <>
              <TableWrap minWidth="120rem">
                <thead>
                  <tr>
                    <Th className={stickyHeadCell}>Click ID</Th>
                    <Th>IP</Th>
                    <Th>Sub ID</Th>
                    <Th>Campaign</Th>
                    <Th>Offer ID</Th>
                    <Th>Device</Th>
                    <Th>OS / Browser</Th>
                    <Th>Geo</Th>
                    <Th>Timestamp</Th>
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
                        <Val value={r.ip} />
                      </Td>
                      <Td className="text-muted-foreground">
                        <Val value={r.sub1} />
                      </Td>
                      <Td className="font-semibold whitespace-nowrap">
                        <Val value={r.campaign} width="w-36" />
                      </Td>
                      <Td className="font-mono text-[12.5px] whitespace-nowrap">
                        <Val value={r.offerId} />
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
                label="clicks"
              />
            </>
          )}
        </Panel>
      </div>
    </>
  );
}
