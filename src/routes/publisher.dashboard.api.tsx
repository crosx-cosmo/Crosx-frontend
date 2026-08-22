import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Braces, Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  KpiCard,
  Panel,
  StatusBadge,
  TableWrap,
  Td,
  Th,
  Tr,
  copyText,
} from "@/components/dashboard/kit";
import { API_DOCS, API_KEYS } from "@/lib/publisher-data";

export const Route = createFileRoute("/publisher/dashboard/api")({
  component: Page,
  head: () =>
    dashboardHead(
      "API — CrosX Publisher",
      "Manage your CrosX API credentials and integrate campaign, conversion and stats endpoints.",
    ),
});

function KeyRow({ label, value, secret }: { label: string; value: string; secret?: boolean }) {
  const [shown, setShown] = useState(!secret);
  return (
    <div className="rounded-2xl border border-hairline bg-surface-2/40 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <p className="truncate font-mono text-[12.5px]">
          {shown ? value : "•".repeat(Math.min(28, value.length))}
        </p>
        <span className="flex shrink-0 gap-1.5">
          {secret && (
            <ActionButton
              variant="subtle"
              icon={shown ? EyeOff : Eye}
              onClick={() => setShown((v) => !v)}
            >
              {shown ? "Hide" : "Show"}
            </ActionButton>
          )}
          <ActionButton
            variant="subtle"
            icon={Copy}
            onClick={async () => {
              const ok = await copyText(value);
              if (ok) toast.success(`${label} copied`);
              else toast.error("Unable to complete action");
            }}
          >
            Copy
          </ActionButton>
        </span>
      </div>
    </div>
  );
}

function Page() {
  const usage = Math.round((API_KEYS.requestsToday / API_KEYS.rateLimit) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Developers"
        title="API Credentials"
        description="Generate keys and pull CrosX campaigns, conversions and statistics into your own stack."
        action={
          <ActionButton
            icon={RefreshCw}
            onClick={() => toast.success("New secret key generated (demo)")}
          >
            Regenerate Secret
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <KpiCard
            label="Requests Today"
            value={API_KEYS.requestsToday}
            icon={Braces}
            trend={`${usage}% of limit`}
            trendTone="neutral"
            support={`Daily limit ${API_KEYS.rateLimit.toLocaleString("en-US")}`}
            delay={0}
          />
          <KpiCard
            label="Rate Limit"
            value={120}
            suffix="/min"
            icon={Braces}
            trendTone="neutral"
            trend="Standard"
            support="Burst up to 240/min"
            delay={0.05}
          />
          <KpiCard
            label="Uptime"
            value={99.98}
            suffix="%"
            decimals={2}
            icon={Braces}
            trend="Healthy"
            support="Last 30 days"
            delay={0.1}
          />
        </div>

        <Panel title="Your Keys" description="Never share your secret key or expose it client-side.">
          <div className="grid gap-3">
            <KeyRow label="Public Key" value={API_KEYS.publicKey} />
            <KeyRow label="Secret Key" value={API_KEYS.secretKey} secret />
          </div>
        </Panel>

        <Panel title="Endpoints" description="Base URL: https://api.crosx.in">
          <TableWrap>
            <thead>
              <tr>
                <Th>Endpoint</Th>
                <Th>Description</Th>
                <Th>Path</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {API_DOCS.map((d) => (
                <Tr key={d.title}>
                  <Td className="font-semibold">{d.title}</Td>
                  <Td className="text-muted-foreground">{d.desc}</Td>
                  <Td className="font-mono text-[12.5px] text-brand">{d.path}</Td>
                  <Td>
                    <StatusBadge tone="success" dot>
                      Live
                    </StatusBadge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>
      </div>
    </>
  );
}
