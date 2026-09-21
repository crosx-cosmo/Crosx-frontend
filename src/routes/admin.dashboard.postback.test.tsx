import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Send, Timer, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  InlineSpinner,
  KpiCard,
  Panel,
  Select,
  StatusBadge,
  TextField,
} from "@/components/dashboard/kit";
import { CAMPAIGNS, GLOBAL_POSTBACK_URL, PUBLISHERS } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/postback/test")({
  component: Page,
  head: () =>
    dashboardHead(
      "Test Postback — CrosX Admin",
      "Fire a simulated conversion postback and inspect the response, latency and payload.",
    ),
});

type Result = { ok: boolean; status: number; latency: number; body: string; at: string };

function Page() {
  const [campaign, setCampaign] = useState(CAMPAIGNS[0]?.name ?? "");
  const [publisher, setPublisher] = useState(PUBLISHERS[0]?.name ?? "");
  const [event, setEvent] = useState("Conversion");
  const [clickId, setClickId] = useState("CLK-8842190");
  const [payout, setPayout] = useState("420");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const url = GLOBAL_POSTBACK_URL.replace("{click_id}", clickId)
    .replace("{event}", event.toLowerCase())
    .replace("{payout}", payout)
    .replace("{status}", "approved")
    .replace("{sub1}", "test");

  const fire = () => {
    setBusy(true);
    const latency = Math.round(120 + Math.random() * 480);
    setTimeout(() => {
      const ok = Math.random() > 0.18;
      setResults((prev) =>
        [
          {
            ok,
            status: ok ? 200 : 502,
            latency,
            body: ok ? '{"received":true,"click_id":"' + clickId + '"}' : '{"error":"bad gateway"}',
            at: new Date().toLocaleTimeString("en-GB"),
          },
          ...prev,
        ].slice(0, 6),
      );
      setBusy(false);
      ok ? toast.success(`Test postback delivered in ${latency} ms`) : toast.error("Test postback failed — 502");
    }, 700);
  };

  const delivered = results.filter((r) => r.ok).length;
  const avg = results.length
    ? Math.round(results.reduce((s, r) => s + r.latency, 0) / results.length)
    : 0;

  return (
    <>
      <PageHeader
        eyebrow="Postback"
        title="Test Postback"
        description="Simulate a conversion end-to-end before a campaign goes live, then inspect the exact response."
        action={
          <ActionButton variant="solid" icon={Send} onClick={fire} disabled={busy}>
            {busy ? "Firing..." : "Fire Test"}
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Tests This Session" value={results.length} icon={Zap} trendTone="neutral" support="Simulated locally" delay={0} />
          <KpiCard label="Delivered" value={delivered} icon={Check} trendTone="neutral" support="2xx responses" delay={0.05} />
          <KpiCard label="Failed" value={results.length - delivered} icon={X} trendTone="neutral" support="Non-2xx responses" delay={0.1} />
          <KpiCard label="Avg Latency" value={avg} suffix="ms" icon={Timer} trendTone="neutral" support="Round trip" delay={0.15} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Panel title="Payload" description="Values are substituted into the global postback URL.">
            <div className="grid gap-4">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Campaign
                </span>
                <Select value={campaign} onChange={(e) => setCampaign(e.target.value)} aria-label="Campaign">
                  {CAMPAIGNS.slice(0, 12).map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Publisher
                </span>
                <Select value={publisher} onChange={(e) => setPublisher(e.target.value)} aria-label="Publisher">
                  {PUBLISHERS.slice(0, 12).map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Event
                </span>
                <Select value={event} onChange={(e) => setEvent(e.target.value)} aria-label="Event">
                  {["Conversion", "Approved", "Rejected", "Reversal"].map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </Select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Click ID" value={clickId} onChange={(e) => setClickId(e.target.value)} />
                <TextField label="Payout (₹)" value={payout} onChange={(e) => setPayout(e.target.value)} inputMode="numeric" />
              </div>
              <div className="rounded-2xl border border-dashed border-hairline bg-surface-2/35 p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Resolved request
                </p>
                <p className="mt-1.5 break-all font-mono text-[12.5px] text-brand">{url}</p>
              </div>
            </div>
          </Panel>

          <Panel title="Response" description="Latest six test results, newest first.">
            {busy && (
              <p className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <InlineSpinner /> Sending test postback...
              </p>
            )}
            {results.length === 0 && !busy ? (
              <p className="rounded-2xl border border-dashed border-hairline bg-surface-2/35 p-6 text-center text-sm text-muted-foreground">
                Fire a test to see the response here.
              </p>
            ) : (
              <ul className="grid gap-3">
                {results.map((r, i) => (
                  <li key={`${r.at}-${i}`} className="rounded-2xl border border-hairline bg-surface-2/35 p-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={r.ok ? "success" : "danger"} dot>
                        {r.status} {r.ok ? "OK" : "Bad Gateway"}
                      </StatusBadge>
                      <StatusBadge tone="neutral">{r.latency} ms</StatusBadge>
                      <span className="text-xs text-muted-foreground">{r.at}</span>
                    </div>
                    <pre className="mt-2.5 overflow-x-auto rounded-xl border border-hairline bg-surface/60 p-3 font-mono text-[12px]">
                      {r.body}
                    </pre>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
