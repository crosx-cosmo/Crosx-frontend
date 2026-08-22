import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, LayoutGrid, List, Plus, Target } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  CardsSkeleton,
  Chip,
  EmptyState,
  Pagination,
  Panel,
  SearchField,
  Select,
  StatusBadge,
  TableWrap,
  Td,
  Th,
  Tr,
  useMockLoad,
} from "@/components/dashboard/kit";
import { usePublisherMock } from "@/components/dashboard/mock-store";
import { CATEGORIES, inr, num, type Campaign } from "@/lib/publisher-data";

export const Route = createFileRoute("/publisher/dashboard/campaigns/all")({
  component: Page,
  head: () =>
    dashboardHead(
      "All Campaign — CrosX Publisher",
      "Browse every CrosX campaign available to your publisher account with payouts, EPC and tracking links.",
    ),
});

type SortKey = "payout" | "epc" | "cr" | "name";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "payout", label: "Highest Payout" },
  { key: "epc", label: "Highest EPC" },
  { key: "cr", label: "Best Conversion Rate" },
  { key: "name", label: "Name (A–Z)" },
];

const PAGE_SIZE = 6;

function JoinButton({ campaign }: { campaign: Campaign }) {
  const { joinCampaign } = usePublisherMock();
  if (campaign.joined) {
    return (
      <StatusBadge tone="success">
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
        Joined
      </StatusBadge>
    );
  }
  return (
    <ActionButton
      variant="solid"
      icon={Plus}
      onClick={() => {
        joinCampaign(campaign.slug);
        toast.success(`Joined ${campaign.name}`, {
          description: "Generate your tracking link to start promoting.",
        });
      }}
    >
      Join
    </ActionButton>
  );
}

function Page() {
  const { campaigns } = usePublisherMock();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("payout");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [page, setPage] = useState(1);
  const loading = useMockLoad([]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const rows = campaigns.filter(
      (c) =>
        (category === "All" || c.category === category) &&
        (term === "" ||
          c.name.toLowerCase().includes(term) ||
          c.tagline.toLowerCase().includes(term)),
    );
    return [...rows].sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : b[sort] - a[sort],
    );
  }, [campaigns, query, category, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const clear = () => {
    setQuery("");
    setCategory("All");
    setPage(1);
  };

  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="All Campaigns"
        description="Browse every CrosX campaign available to your publisher account with payouts, EPC and traffic rules."
        action={
          <div className="inline-flex rounded-xl border border-hairline bg-surface-2/50 p-1">
            {(
              [
                { key: "grid", label: "Grid", icon: LayoutGrid },
                { key: "table", label: "Table", icon: List },
              ] as const
            ).map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => setView(v.key)}
                aria-pressed={view === v.key}
                aria-label={`${v.label} view`}
                className={
                  view === v.key
                    ? "grid size-8 place-items-center rounded-lg bg-brand/18 text-foreground"
                    : "grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
                }
              >
                <v.icon className="size-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        }
      />

      <Panel
        title={`${filtered.length} campaigns`}
        description="Filter by category, search by name and sort by the metric that matters."
        action={
          <>
            <SearchField
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder="Search campaigns..."
              className="w-full sm:w-56"
            />
            <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </Select>
          </>
        }
      >
        <div className="mb-5 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              active={category === c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
            >
              {c}
            </Chip>
          ))}
        </div>

        {loading ? (
          <CardsSkeleton count={6} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No campaigns match your filters"
            description="Try another category or clear your search to see all live offers."
            onClear={clear}
          />
        ) : view === "grid" ? (
          <ul className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {rows.map((c) => (
              <li
                key={c.slug}
                className="glass grid gap-4 rounded-2xl p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand/45 hover:shadow-lux sm:p-5"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <Link
                    to="/publisher/dashboard/campaigns/$slug"
                    params={{ slug: c.slug }}
                    className="min-w-0"
                  >
                    <p className="truncate font-display text-base font-bold tracking-tight">
                      {c.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{c.tagline}</p>
                  </Link>
                  <StatusBadge tone={c.status === "Active" ? "success" : "warn"} dot>
                    {c.status}
                  </StatusBadge>
                </div>

                <dl className="grid grid-cols-3 gap-2 rounded-xl border border-hairline bg-surface-2/40 p-3">
                  {[
                    { label: "Payout", value: `₹${c.payout}` },
                    { label: "EPC", value: `₹${c.epc.toFixed(2)}` },
                    { label: "CR", value: `${c.cr.toFixed(2)}%` },
                  ].map((s) => (
                    <div key={s.label}>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {s.label}
                      </dt>
                      <dd className="mt-0.5 text-[13px] font-bold tabular-nums">{s.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone="neutral">{c.category}</StatusBadge>
                  <StatusBadge tone="neutral">{c.geo}</StatusBadge>
                  <StatusBadge tone="neutral">{c.devices}</StatusBadge>
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <Link
                    to="/publisher/dashboard/campaigns/$slug"
                    params={{ slug: c.slug }}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-hairline bg-surface-2/50 px-3.5 text-[13px] font-semibold transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/50"
                  >
                    View Details
                  </Link>
                  <JoinButton campaign={c} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Campaign</Th>
                <Th>Category</Th>
                <Th align="right">Payout</Th>
                <Th align="right">EPC</Th>
                <Th align="right">CR</Th>
                <Th>Status</Th>
                <Th align="right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <Tr key={c.slug}>
                  <Td>
                    <Link
                      to="/publisher/dashboard/campaigns/$slug"
                      params={{ slug: c.slug }}
                      className="font-semibold hover:text-brand"
                    >
                      {c.name}
                    </Link>
                    <span className="block text-xs text-muted-foreground">{c.tagline}</span>
                  </Td>
                  <Td>{c.category}</Td>
                  <Td className="text-right tabular-nums">{inr(c.payout)}</Td>
                  <Td className="text-right tabular-nums">₹{c.epc.toFixed(2)}</Td>
                  <Td className="text-right tabular-nums">{c.cr.toFixed(2)}%</Td>
                  <Td>
                    <StatusBadge tone={c.status === "Active" ? "success" : "warn"} dot>
                      {c.status}
                    </StatusBadge>
                  </Td>
                  <Td className="text-right">
                    <span className="inline-flex justify-end">
                      <JoinButton campaign={c} />
                    </span>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        )}

        {!loading && rows.length > 0 && (
          <Pagination
            page={current}
            pageCount={pageCount}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPage={setPage}
            label="campaigns"
          />
        )}
      </Panel>

      <p className="mt-4 text-xs text-muted-foreground">
        Showing demo inventory — {num(filtered.length)} of 48 total CrosX campaigns.
      </p>
    </>
  );
}
