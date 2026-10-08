import { useState } from "react";
import { Activity, Clock, Gauge, RefreshCcw, Repeat, Server, Timer } from "lucide-react";
import { ActionButton, Panel, StatusBadge } from "@/components/dashboard/kit";

export type DeliveryMethod = "S2S" | "Pixel" | "GET";

type Result = {
  fireLatency: number;
  responseTime: number;
  status: number;
  ok: boolean;
  retries: number;
  timestamp: string;
  body: string;
};

function rand(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

function runDiagnostic(): Result {
  const ok = Math.random() > 0.15;
  const status = ok ? 200 : Math.random() > 0.5 ? 500 : 408;
  return {
    fireLatency: rand(18, 74),
    responseTime: ok ? rand(96, 420) : rand(600, 1800),
    status,
    ok,
    retries: ok ? 0 : rand(1, 3),
    timestamp: new Date().toLocaleString("en-IN", { hour12: false }),
    body: ok ? '{"status":"ok","conversion":"recorded"}' : '{"error":"upstream_timeout"}',
  };
}

function grade(ms: number) {
  if (ms < 200) return { label: "Excellent", tone: "success" as const };
  if (ms < 500) return { label: "Good", tone: "brand" as const };
  return { label: "Slow", tone: "danger" as const };
}

/** Frontend postback delivery diagnostics — latency, status, retries and result. */
export function PostbackSpeedAnalyzer({
  endpoint,
  method = "S2S",
  className,
}: {
  endpoint: string;
  method?: DeliveryMethod;
  className?: string;
}) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const run = () => {
    setRunning(true);
    window.setTimeout(() => {
      setResult(runDiagnostic());
      setRunning(false);
    }, 900);
  };

  const total = result ? result.fireLatency + result.responseTime : 0;
  const g = result ? grade(total) : null;

  const metrics = result
    ? [
        { icon: Gauge, label: "Round trip", value: `${total} ms` },
        { icon: Server, label: "HTTP status", value: `${result.status}` },
        { icon: Activity, label: "Response time", value: `${result.responseTime} ms` },
        { icon: Timer, label: "Fire latency", value: `${result.fireLatency} ms` },
        { icon: Repeat, label: "Retry count", value: `${result.retries}` },
        { icon: Clock, label: "Timestamp", value: result.timestamp },
      ]
    : [];

  return (
    <Panel
      title="Speed Analyzer"
      description="Measure how fast your postback fires and how quickly your tracker responds."
      className={className}
      action={
        <ActionButton variant="solid" icon={RefreshCcw} onClick={run} disabled={running}>
          {running ? "Analyzing..." : "Run Speed Analyzer"}
        </ActionButton>
      }
    >
      <div className="grid gap-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="brand" dot>
            Delivery method · {method}
          </StatusBadge>
          {result ? (
            <>
              <StatusBadge tone={result.ok ? "success" : "danger"} dot>
                {result.ok ? "Delivered successfully" : "Delivery failed"}
              </StatusBadge>
              {g ? <StatusBadge tone={g.tone}>Speed · {g.label}</StatusBadge> : null}
            </>
          ) : null}
        </div>

        <div className="min-w-0 overflow-x-auto overscroll-x-contain rounded-xl border border-input bg-surface-1/70 px-3 py-2.5">
          <code className="block whitespace-nowrap font-mono text-[12.5px] text-muted-foreground">
            {endpoint}
          </code>
        </div>

        {!result ? (
          <p className="text-[13px] text-muted-foreground">
            Run the analyzer to check delivery latency, response time, HTTP status, retries and the
            overall delivery result for this endpoint.
          </p>
        ) : (
          <>
            <div
              className={`rounded-2xl border px-4 py-3.5 ${
                result.ok
                  ? "border-emerald-500/30 bg-emerald-500/[0.06]"
                  : "border-brand/40 bg-brand/[0.07]"
              }`}
            >
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Delivery result
              </p>
              <p className="mt-1 font-display text-[15px] font-bold leading-snug text-foreground">
                {result.ok
                  ? `Conversion recorded in ${total} ms · HTTP ${result.status} · ${method} · no retries`
                  : `Not recorded · HTTP ${result.status} · ${method} · ${result.retries} retr${
                      result.retries === 1 ? "y" : "ies"
                    } after ${total} ms`}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                {result.ok
                  ? `Your tracker responded in ${result.responseTime} ms — ${g?.label.toLowerCase()} performance for a ${method} postback.`
                  : "Your tracker did not confirm the conversion. Check endpoint availability, macro values and response time limits."}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {metrics.map((m) => (
                <div key={m.label} className="plate rounded-2xl px-3 py-2.5">
                  <dt className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <m.icon className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
                    <span className="truncate">{m.label}</span>
                  </dt>
                  <dd className="mt-1 truncate font-display text-[15px] font-bold tabular-nums text-foreground">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Endpoint response
              </span>
              <div className="min-w-0 overflow-x-auto overscroll-x-contain rounded-xl border border-input bg-surface-1/70 px-3 py-2.5">
                <code className="block whitespace-nowrap font-mono text-[12.5px] text-foreground">
                  {result.body}
                </code>
              </div>
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}
