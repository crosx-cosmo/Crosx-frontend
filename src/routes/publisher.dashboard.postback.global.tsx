import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Radio, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  Chip,
  KpiCard,
  Panel,
  TableWrap,
  Td,
  Th,
  Tr,
  copyText,
} from "@/components/dashboard/kit";
import { usePublisherMock } from "@/components/dashboard/mock-store";
import {
  POSTBACK_EVENTS,
  POSTBACK_MACROS,
  POSTBACK_TOTALS,
  POSTBACK_URL,
} from "@/lib/publisher-data";

export const Route = createFileRoute("/publisher/dashboard/postback/global")({
  component: Page,
  head: () =>
    dashboardHead(
      "Global Postback — CrosX Publisher",
      "Configure your server-to-server postback URL, events and macros for CrosX conversions.",
    ),
});

function Page() {
  const { postbackEnabled, setPostbackEnabled } = usePublisherMock();
  const [url, setUrl] = useState(POSTBACK_URL);
  const [events, setEvents] = useState<string[]>(["Conversion", "Approved"]);
  const [saving, setSaving] = useState(false);

  const toggleEvent = (e: string) =>
    setEvents((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Global postback saved", { description: `${events.length} events enabled.` });
    }, 900);
  };

  return (
    <>
      <PageHeader
        eyebrow="Postback"
        title="Global Postback"
        description="Send server-to-server conversion notifications to your own tracker in real time."
        action={
          <ActionButton variant="solid" icon={Save} onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save Postback"}
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard
            label="Total Fired"
            value={POSTBACK_TOTALS.total}
            icon={Radio}
            support="Lifetime postbacks"
            delay={0}
          />
          <KpiCard
            label="Successful"
            value={POSTBACK_TOTALS.success}
            icon={Radio}
            trend="96.5%"
            support="HTTP 200 responses"
            delay={0.05}
          />
          <KpiCard
            label="Failed"
            value={POSTBACK_TOTALS.failed}
            icon={Radio}
            trend="3.5%"
            trendTone="down"
            support="Retried automatically"
            delay={0.1}
          />
          <KpiCard
            label="Success Rate"
            value={POSTBACK_TOTALS.successRate}
            suffix="%"
            decimals={1}
            icon={Radio}
            trendTone="neutral"
            support="Rolling 30 days"
            delay={0.15}
          />
        </div>

        <Panel
          title="Postback Configuration"
          description="Paste your tracker URL and pick the events CrosX should notify."
          action={
            <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-semibold">
              <input
                type="checkbox"
                checked={postbackEnabled}
                onChange={(e) => setPostbackEnabled(e.target.checked)}
                className="size-4 accent-[var(--brand)]"
              />
              Postback enabled
            </label>
          }
        >
          <div className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Postback URL
              </span>
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-surface-2/50 px-3 font-mono text-[12.5px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
                />
                <ActionButton
                  icon={Copy}
                  onClick={async () => {
                    const ok = await copyText(url);
                    if (ok) toast.success("Postback URL copied");
                    else toast.error("Unable to complete action");
                  }}
                >
                  Copy
                </ActionButton>
              </div>
            </label>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Trigger events
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {POSTBACK_EVENTS.map((e) => (
                  <Chip key={e} active={events.includes(e)} onClick={() => toggleEvent(e)}>
                    {e}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Panel
          title="Available Macros"
          description="Insert these tokens into your postback URL — CrosX replaces them at fire time."
        >
          <TableWrap>
            <thead>
              <tr>
                <Th>Macro</Th>
                <Th>Description</Th>
                <Th align="right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {POSTBACK_MACROS.map((m) => (
                <Tr key={m.macro}>
                  <Td className="font-mono text-[12.5px] text-brand">{m.macro}</Td>
                  <Td className="text-muted-foreground">{m.desc}</Td>
                  <Td className="text-right">
                    <span className="inline-flex justify-end">
                      <ActionButton
                        variant="subtle"
                        icon={Copy}
                        onClick={async () => {
                          const ok = await copyText(m.macro);
                          if (ok) toast.success(`${m.macro} copied`);
                          else toast.error("Unable to complete action");
                        }}
                      >
                        Copy
                      </ActionButton>
                    </span>
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
