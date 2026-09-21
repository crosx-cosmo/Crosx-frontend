import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Check, Copy, Radio, Save, Timer } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, Panel, StatusBadge, TextField } from "@/components/dashboard/kit";
import { GLOBAL_POSTBACK_URL, POSTBACK_MACROS, POSTBACK_TOTALS } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/postback/global")({
  component: Page,
  head: () =>
    dashboardHead(
      "Global Postback — CrosX Admin",
      "Configure the network-wide postback URL, macros and retry policy for CrosX conversions.",
    ),
});

function Page() {
  const [url, setUrl] = useState(GLOBAL_POSTBACK_URL);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(null), 1600);
    } catch {
      toast.error("Copy failed — select the text manually");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Postback"
        title="Global Postback"
        description="One endpoint that receives every conversion across the network, with macro substitution and automatic retries."
        action={
          <ActionButton variant="solid" icon={Save} onClick={() => toast.success("Global postback saved (demo)")}>
            Save Changes
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Postbacks Fired" value={POSTBACK_TOTALS.fired} icon={Radio} trend="↑ 9.6%" support="This month" delay={0} />
          <KpiCard label="Delivered" value={POSTBACK_TOTALS.delivered} icon={Check} trend={`${POSTBACK_TOTALS.successRate}%`} support="Success rate" delay={0.05} />
          <KpiCard label="Failed" value={POSTBACK_TOTALS.failed} icon={Activity} trendTone="neutral" support="Auto-retried 3×" delay={0.1} />
          <KpiCard label="Avg Latency" value={POSTBACK_TOTALS.avgLatency} suffix="ms" icon={Timer} trendTone="neutral" support="Edge relayed" delay={0.15} />
        </div>

        <Panel
          title="Postback URL"
          description="Applies to every campaign unless a campaign-level override exists."
        >
          <div className="grid gap-4">
            <TextField
              label="Global postback URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="font-mono text-[12.5px]"
            />
            <div className="flex flex-wrap gap-2">
              <ActionButton icon={copied === url ? Check : Copy} onClick={() => copy(url)}>
                {copied === url ? "Copied" : "Copy URL"}
              </ActionButton>
              <ActionButton onClick={() => setUrl(GLOBAL_POSTBACK_URL)}>Reset to default</ActionButton>
            </div>
            <div className="rounded-2xl border border-hairline bg-surface-2/35 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Retry policy
              </p>
              <ul className="mt-2 grid gap-1.5 text-sm text-muted-foreground">
                <li>3 automatic retries with exponential backoff (5s, 30s, 5m).</li>
                <li>Non-2xx responses are logged and surfaced in Postback Logs.</li>
                <li>HTTPS required; requests time out after 10 seconds.</li>
              </ul>
            </div>
          </div>
        </Panel>

        <Panel title="Supported Macros" description="Tap a macro to copy it into your endpoint.">
          <ul className="grid gap-3 sm:grid-cols-2">
            {POSTBACK_MACROS.map((m) => (
              <li
                key={m.macro}
                className="flex items-start justify-between gap-3 rounded-2xl border border-hairline bg-surface-2/35 p-3.5 transition-[border-color] duration-300 hover:border-brand/45"
              >
                <div className="min-w-0">
                  <p className="font-mono text-[13px] font-semibold text-brand">{m.macro}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
                </div>
                <ActionButton
                  variant="subtle"
                  icon={copied === m.macro ? Check : Copy}
                  onClick={() => copy(m.macro)}
                >
                  {copied === m.macro ? "Copied" : "Copy"}
                </ActionButton>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusBadge tone="success" dot>
              Endpoint reachable
            </StatusBadge>
            <StatusBadge tone="neutral">Last verified 12 min ago</StatusBadge>
          </div>
        </Panel>
      </div>
    </>
  );
}
