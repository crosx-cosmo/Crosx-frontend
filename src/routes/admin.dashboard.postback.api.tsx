import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Braces, Check, Copy, Eye, EyeOff, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, Panel, StatusBadge } from "@/components/dashboard/kit";
import { API_ENDPOINTS, API_KEYS } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/postback/api")({
  component: Page,
  head: () =>
    dashboardHead(
      "Admin API — CrosX Admin",
      "Manage CrosX admin API keys and browse the available REST endpoints.",
    ),
});

const METHOD_TONE: Record<string, "success" | "brand" | "warn" | "neutral"> = {
  GET: "success",
  POST: "brand",
  PATCH: "warn",
  DELETE: "neutral",
};

function KeyRow({ label, value, secret }: { label: string; value: string; secret?: boolean }) {
  const [shown, setShown] = useState(!secret);
  const [copied, setCopied] = useState(false);

  return (
    <div className="rounded-2xl border border-hairline bg-surface-2/35 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 break-all font-mono text-[13px] font-semibold">
        {shown ? value : "•".repeat(28)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {secret && (
          <ActionButton icon={shown ? EyeOff : Eye} onClick={() => setShown((v) => !v)}>
            {shown ? "Hide" : "Reveal"}
          </ActionButton>
        )}
        <ActionButton
          icon={copied ? Check : Copy}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
              setCopied(true);
              toast.success(`${label} copied`);
              setTimeout(() => setCopied(false), 1600);
            } catch {
              toast.error("Copy failed");
            }
          }}
        >
          {copied ? "Copied" : "Copy"}
        </ActionButton>
      </div>
    </div>
  );
}

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Postback"
        title="API Access"
        description="Server-to-server keys and the REST endpoints powering campaign, publisher and conversion automation."
        action={
          <ActionButton variant="solid" icon={RefreshCw} onClick={() => toast.success("Keys rotated (demo)")}>
            Rotate Keys
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Active Keys" value={2} icon={KeyRound} trendTone="neutral" support="1 public, 1 secret" delay={0} />
          <KpiCard label="Endpoints" value={API_ENDPOINTS.length} icon={Braces} trendTone="neutral" support="REST v1" delay={0.05} />
          <KpiCard label="Requests (30d)" value={184_620} icon={Braces} trend="↑ 7.8%" support="Rate limit 600/min" delay={0.1} />
          <KpiCard label="Auth Failures" value={38} icon={ShieldCheck} trendTone="neutral" support="Blocked automatically" delay={0.15} />
        </div>

        <Panel title="API Keys" description={`Last rotated ${API_KEYS.rotatedAt}. Never expose the secret key in client code.`}>
          <div className="grid gap-3 lg:grid-cols-3">
            <KeyRow label="Public key" value={API_KEYS.publicKey} />
            <KeyRow label="Secret key" value={API_KEYS.secretKey} secret />
            <KeyRow label="Webhook signing secret" value={API_KEYS.webhookSecret} secret />
          </div>
        </Panel>

        <Panel title="Endpoints" description="All requests use Bearer authentication and return JSON.">
          <ul className="grid gap-3">
            {API_ENDPOINTS.map((e) => (
              <li
                key={`${e.method}${e.path}`}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-hairline bg-surface-2/35 p-3.5 transition-[border-color] duration-300 hover:border-brand/45"
              >
                <StatusBadge tone={METHOD_TONE[e.method] ?? "neutral"}>{e.method}</StatusBadge>
                <code className="font-mono text-[13px] font-semibold">{e.path}</code>
                <span className="text-xs text-muted-foreground">{e.description}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
