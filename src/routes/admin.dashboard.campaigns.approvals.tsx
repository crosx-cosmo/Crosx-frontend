import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCheck, Check, Clock, X, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, EmptyState, KpiCard, Panel, StatusBadge } from "@/components/dashboard/kit";
import { APPROVAL_REQUESTS } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/campaigns/approvals")({
  component: Page,
  head: () =>
    dashboardHead(
      "Approval Requests — CrosX Admin",
      "Review publisher requests to join CrosX campaigns and approve or decline them.",
    ),
});

function Page() {
  const [decided, setDecided] = useState<Record<string, "approved" | "declined">>({});
  const open = APPROVAL_REQUESTS.filter((r) => !decided[r.id]);
  const approved = Object.values(decided).filter((v) => v === "approved").length;
  const declined = Object.values(decided).filter((v) => v === "declined").length;

  const decide = (id: string, publisher: string, action: "approved" | "declined") => {
    setDecided((p) => ({ ...p, [id]: action }));
    toast.success(`${publisher} ${action} (demo)`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Campaign"
        title="Approval Requests"
        description="Publishers waiting for access to campaigns — review traffic quality before approving."
        action={
          <ActionButton
            variant="solid"
            icon={CheckCheck}
            onClick={() => {
              setDecided(Object.fromEntries(APPROVAL_REQUESTS.map((r) => [r.id, "approved"])));
              toast.success("All requests approved (demo)");
            }}
          >
            Approve All
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Waiting Review" value={open.length} icon={Clock} trendTone="neutral" support="Oldest is 2 days old" delay={0} />
          <KpiCard label="Approved Today" value={approved} icon={Check} trend="Session" trendTone="neutral" support="This session" delay={0.05} />
          <KpiCard label="Declined Today" value={declined} icon={X} trendTone="neutral" support="This session" delay={0.1} />
          <KpiCard label="Requesting Publishers" value={APPROVAL_REQUESTS.length} icon={Users} trendTone="neutral" support="Unique accounts" delay={0.15} />
        </div>

        <Panel title="Pending Requests" description="Each card shows the publisher's traffic profile and note.">
          {open.length === 0 ? (
            <EmptyState
              icon={CheckCheck}
              title="Approval queue is clear"
              description="Every publisher request has been reviewed."
            />
          ) : (
            <ul className="grid gap-4 lg:grid-cols-2">
              {open.map((r) => (
                <li
                  key={r.id}
                  className="rounded-2xl border border-hairline bg-surface-2/35 p-4 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/45"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-[15px] font-bold">{r.publisher}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.publisherId} • requested {r.requestedAt}
                      </p>
                    </div>
                    <StatusBadge tone="warn" dot>
                      Pending
                    </StatusBadge>
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-2.5">
                    {[
                      { label: "Campaign", value: r.campaign },
                      { label: "Traffic", value: r.traffic },
                      { label: "Geo", value: r.geo },
                      { label: "Volume", value: r.monthlyVolume },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-hairline bg-surface/60 p-2.5">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {s.label}
                        </dt>
                        <dd className="mt-0.5 truncate text-[13px] font-semibold">{s.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-3 rounded-xl border border-dashed border-hairline bg-surface/40 p-3 text-xs text-muted-foreground">
                    “{r.note}”
                  </p>

                  <div className="mt-3.5 flex flex-wrap gap-2">
                    <ActionButton
                      variant="solid"
                      icon={Check}
                      onClick={() => decide(r.id, r.publisher, "approved")}
                    >
                      Approve
                    </ActionButton>
                    <ActionButton icon={X} onClick={() => decide(r.id, r.publisher, "declined")}>
                      Decline
                    </ActionButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
