import { useMemo, useState, type ReactNode } from "react";
import { Inbox, type LucideIcon } from "lucide-react";
import {
  EmptyState,
  Pagination,
  Panel,
  SearchField,
  Select,
  TableSkeleton,
  TableWrap,
  Td,
  Th,
  Tr,
  useMockLoad,
} from "@/components/dashboard/kit";

export type Column<T> = {
  key: string;
  label: string;
  align?: "left" | "right";
  className?: string;
  render: (row: T) => ReactNode;
};

export type Filter<T> = {
  key: string;
  options: string[];
  match: (row: T, value: string) => boolean;
};

/**
 * Self-contained admin data table: search + select filters + skeleton +
 * empty state + pagination, wrapped in the shared glass Panel.
 */
export function AdminTable<T>({
  title,
  description,
  rows,
  columns,
  search,
  searchPlaceholder = "Search records...",
  filters = [],
  minWidth = "68rem",
  pageSize = 10,
  label = "records",
  emptyIcon = Inbox,
  action,
  rowKey,
  onRowClick,
}: {
  title: string;
  description?: string;
  rows: T[];
  columns: Column<T>[];
  search?: (row: T, term: string) => boolean;
  searchPlaceholder?: string;
  filters?: Filter<T>[];
  minWidth?: string;
  pageSize?: number;
  label?: string;
  emptyIcon?: LucideIcon;
  action?: ReactNode;
  rowKey: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(filters.map((f) => [f.key, f.options[0] ?? "All"])),
  );
  const loading = useMockLoad([values, rows.length]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return rows.filter((row) => {
      for (const f of filters) {
        const v = values[f.key] ?? f.options[0]!;
        if (!v.startsWith("All") && !f.match(row, v)) return false;
      }
      if (term && search && !search(row, term)) return false;
      return true;
    });
  }, [rows, filters, values, query, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize);

  const clear = () => {
    setQuery("");
    setValues(Object.fromEntries(filters.map((f) => [f.key, f.options[0] ?? "All"])));
    setPage(1);
  };

  return (
    <Panel
      title={title}
      description={description}
      action={
        <>
          {search && (
            <SearchField
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full sm:w-56"
            />
          )}
          {filters.map((f) => (
            <Select
              key={f.key}
              aria-label={f.key}
              value={values[f.key] ?? f.options[0]}
              onChange={(e) => {
                setValues((prev) => ({ ...prev, [f.key]: e.target.value }));
                setPage(1);
              }}
            >
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          ))}
          {action}
        </>
      }
    >
      {loading ? (
        <TableSkeleton rows={8} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={emptyIcon}
          title={`No ${label} match your filters`}
          description="Adjust the filters or search another term."
          onClear={clear}
        />
      ) : (
        <>
          <TableWrap minWidth={minWidth}>
            <thead>
              <tr>
                {columns.map((c) => (
                  <Th key={c.key} align={c.align}>
                    {c.label}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <Tr
                  key={rowKey(row, i)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((c) => (
                    <Td
                      key={c.key}
                      className={`${c.align === "right" ? "text-right" : ""} ${c.className ?? ""}`}
                    >
                      {c.render(row)}
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
            pageSize={pageSize}
            onPage={setPage}
            label={label}
          />
        </>
      )}
    </Panel>
  );
}
