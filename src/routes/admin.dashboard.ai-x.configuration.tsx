import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Cpu, KeyRound, PlugZap, Save, ServerCog, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, Panel, Select, StatusBadge, TextField } from "@/components/dashboard/kit";
import { Toggle } from "@/components/admin/CampaignFormKit";
import {
  AI_BACKEND_AVAILABLE,
  AI_PROVIDERS,
  DEFAULT_AI_CONFIG,
  type AiConfig,
  type AiProviderId,
} from "@/lib/ai-config";

export const Route = createFileRoute("/admin/dashboard/ai-x/configuration")({
  component: Page,
  head: () =>
    dashboardHead(
      "AI Configuration — CrosX Admin",
      "Configure the AI provider, model and API access for CrosX AI X.",
    ),
});

const NOT_CONNECTED_MSG = "AI integration is not connected yet — backend setup pending.";

function Page() {
  const [cfg, setCfg] = useState<AiConfig>(DEFAULT_AI_CONFIG);
  const [apiKey, setApiKey] = useState("");
  const provider = AI_PROVIDERS.find((p) => p.id === cfg.provider) ?? AI_PROVIDERS[0];
  const set = <K extends keyof AiConfig>(k: K, v: AiConfig[K]) => setCfg((c) => ({ ...c, [k]: v }));

  const onSave = () => {
    if (!AI_BACKEND_AVAILABLE) return toast.warning(`Not saved. ${NOT_CONNECTED_MSG}`);
  };
  const onTest = () => {
    if (!AI_BACKEND_AVAILABLE) return toast.error(`Connection test unavailable. ${NOT_CONNECTED_MSG}`);
  };

  const statusRows: [string, string][] = [
    ["Provider", provider.label],
    ["Model", provider.models.find((m) => m.id === cfg.model)?.label ?? cfg.model],
    ["AI Enabled", cfg.enabled ? "Yes (pending connection)" : "No"],
    ["API Key", "Not configured"],
    ["Requests (30d)", "—"],
    ["Tokens used (30d)", "—"],
    ["Last test", "Never"],
  ];

  return (
    <>
      <PageHeader
        eyebrow="AI X"
        title="AI Configuration"
        description="Set up the AI provider that will power CrosX AI X. Integration is not connected yet."
        action={
          <>
            <ActionButton icon={PlugZap} onClick={onTest}>Test Connection</ActionButton>
            <ActionButton variant="solid" icon={Save} onClick={onSave}>Save Configuration</ActionButton>
          </>
        }
      />

      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4 text-sm">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden="true" />
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">Not connected.</span> No AI provider is
          integrated and no API key is stored. Values shown are demo defaults for setup only.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="grid gap-5">
          <Panel title="AI Provider" description="Choose the provider and enable AI features.">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Provider</span>
                <Select
                  aria-label="AI provider"
                  value={cfg.provider}
                  onChange={(e) => set("provider", e.target.value as AiProviderId)}
                >
                  {AI_PROVIDERS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </Select>
              </label>
              <div className="flex items-end">
                <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-2/35 p-3">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="size-4 text-brand" aria-hidden="true" /> Enable AI
                  </span>
                  <Toggle label="Enable AI" checked={cfg.enabled} onChange={(v) => set("enabled", v)} />
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Model" description="Default model and generation settings.">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-1.5 sm:col-span-3">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Model</span>
                <Select aria-label="Model" value={cfg.model} onChange={(e) => set("model", e.target.value)}>
                  {provider.models.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </Select>
              </label>
              <TextField label="Temperature" type="number" step="0.1" min={0} max={2}
                value={cfg.temperature} onChange={(e) => set("temperature", Number(e.target.value))} />
              <TextField label="Max Output Tokens" type="number" min={1}
                value={cfg.maxOutputTokens} onChange={(e) => set("maxOutputTokens", Number(e.target.value))} />
              <TextField label="Timeout (ms)" type="number" min={1000}
                value={cfg.timeoutMs} onChange={(e) => set("timeoutMs", Number(e.target.value))} />
            </div>
          </Panel>

          <Panel title="API Configuration" description="Endpoint used by the future server integration.">
            <TextField label="Base URL" value={cfg.baseUrl} onChange={(e) => set("baseUrl", e.target.value)} />
          </Panel>

          <Panel
            title="API Key"
            description="Will be stored securely on the server once integration is available."
            action={<StatusBadge tone="neutral"><KeyRound className="size-3" /> Not configured</StatusBadge>}
          >
            <TextField
              label={`${provider.vendor} API Key`}
              type="password"
              autoComplete="off"
              placeholder="Key storage unavailable until integration"
              value={apiKey}
              disabled={!AI_BACKEND_AVAILABLE}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Keys are never saved in the browser. This field activates when the backend is connected.
            </p>
          </Panel>
        </div>

        <div className="grid content-start gap-5">
          <Panel
            title="Connection Status"
            action={<StatusBadge tone="warn" dot>Not Connected</StatusBadge>}
          >
            <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-2/35 p-4">
              <span className="grid size-10 place-items-center rounded-xl border border-hairline bg-surface-2/70">
                <ServerCog className="size-4 text-muted-foreground" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">{provider.label}</p>
                <p className="text-xs text-muted-foreground">{NOT_CONNECTED_MSG}</p>
              </div>
            </div>
            <ActionButton className="mt-4 w-full" icon={PlugZap} onClick={onTest}>Test Connection</ActionButton>
          </Panel>

          <Panel
            title="AI Usage / Configuration Status"
            action={<StatusBadge tone="neutral">Demo</StatusBadge>}
          >
            <ul className="grid gap-2">
              {statusRows.map(([k, v]) => (
                <li key={k} className="flex items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-2/35 px-3.5 py-2.5 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    {k === "Model" ? <Cpu className="size-3.5" /> : <Activity className="size-3.5" />}
                    {k}
                  </span>
                  <span className="font-semibold">{v}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <ActionButton variant="solid" icon={Save} onClick={onSave} className="w-full">
            Save Configuration
          </ActionButton>
        </div>
      </div>
    </>
  );
}
