import { useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Globe2, HelpCircle, Info, Link2, Radio, Zap } from "lucide-react";
import { toast } from "sonner";
import { MacroHelperModal } from "@/components/dashboard/MacroHelperModal";
import { PostbackFormModal } from "@/components/dashboard/PostbackFormModal";
import {
  ActionButton,
  Chip,
  Panel,
  StatusBadge,
  Select,
  TableWrap,
  Td,
  Th,
  Tr,
  copyText,
} from "@/components/dashboard/kit";
import { usePublisherMock } from "@/components/dashboard/mock-store";
import {
  CAMPAIGN_MACROS,
  campaignPostbackLogs,
  conversionEventsFor,
} from "@/lib/campaign-postback-data";
import { useCampaignPostbacks } from "@/lib/campaign-postback-store";
import type { Campaign } from "@/lib/publisher-data";

/** Campaign-level Global fallback postback configuration (frontend demo). */
export function CampaignPostbackPanel({ campaign }: { campaign: Campaign }) {
  const events = conversionEventsFor(campaign);
  const logs = campaignPostbackLogs(campaign);
  const { global, isOverridden, testPostback } = useCampaignPostbacks();

  const [selected, setSelected] = useState<string[]>(
    events.filter((e) => e.status === "Active").map((e) => e.slug),
  );
  const [testing, setTesting] = useState(false);
  const [macroHelpOpen, setMacroHelpOpen] = useState(false);
  const [globalFormOpen, setGlobalFormOpen] = useState(false);
  const { profile } = usePublisherMock();
  const landingPages = campaign.landingPages ?? [];
  const [landing, setLanding] = useState(landingPages[0] ?? "");
  const [linkCopied, setLinkCopied] = useState(false);

  const trackingUrl = useMemo(() => {
    const params = new URLSearchParams({
      offer_id: campaign.id,
      aff_id: profile.publisherId,
    });
    if (landing) params.set("lp", landing.toLowerCase().replace(/\s+/g, "_"));
    const macros = ["x1", "x2", "x3"].map((k) => `${k}={${k}}`).join("&");
    return `https://track.crosx.in/c/${campaign.linkCode}?${params.toString()}&${macros}`;
  }, [campaign.id, campaign.linkCode, landing, profile.publisherId]);

  const copyTrackingUrl = async () => {
    const ok = await copyText(trackingUrl);
    if (ok) {
      setLinkCopied(true);
      toast.success("Tracking URL copied");
      window.setTimeout(() => setLinkCopied(false), 1800);
    } else toast.error("Unable to complete action");
  };


  const toggle = (slug: string) =>
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

  const testGlobal = async () => {
    setTesting(true);
    const res = await testPostback(global.id);
    setTesting(false);
    if (res.ok)
      toast.success("Test postback fired — Global fallback", {
        description: "Your tracker responded 200 OK.",
      });
    else
      toast.error("Test failed — Global fallback", {
        description: `Tracker responded ${res.status}.`,
      });
  };

  const fallbackEvents = events.filter((e) => !isOverridden(e.slug));

  return (
    <Panel
      title="Postback & Tracking"
      description="Send server-to-server notifications for this campaign to your own tracker."
      action={
        <>
          <StatusBadge
            tone={global.active && global.lastTest?.ok !== false ? "success" : "danger"}
            dot
            className="h-8 px-3"
          >
            {global.active
              ? global.lastTest?.ok === false
                ? "Global Postback Failed"
                : "Global Postback Active"
              : "Global Postback Disabled"}
          </StatusBadge>
          <ActionButton icon={Zap} onClick={testGlobal} disabled={testing}>
            {testing ? "Testing..." : "Test Global"}
          </ActionButton>
          <ActionButton variant="solid" icon={Globe2} onClick={() => setGlobalFormOpen(true)}>
            Manage Global
          </ActionButton>
        </>
      }
    >
      <div className="grid gap-5">
        <div className="grid gap-2 rounded-2xl border border-hairline bg-surface-2/40 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <Link2 className="size-3.5 text-brand" aria-hidden="true" />
              Tracking URL
            </span>
            {landingPages.length > 1 ? (
              <Select
                aria-label="Landing page"
                value={landing}
                onChange={(e) => setLanding(e.target.value)}
                className="h-9 w-full sm:w-56"
              >
                {landingPages.map((lp) => (
                  <option key={lp} value={lp}>
                    {lp}
                  </option>
                ))}
              </Select>
            ) : null}
          </div>

          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0 overflow-x-auto overscroll-x-contain rounded-xl border border-input bg-surface-1/70 px-3 py-2.5">
              <code className="block whitespace-nowrap font-mono text-[12.5px] text-foreground">
                {trackingUrl}
              </code>
            </div>
            <div className="flex gap-2">
              <ActionButton
                icon={linkCopied ? Check : Copy}
                className="h-11 flex-1 sm:flex-none"
                onClick={copyTrackingUrl}
              >
                {linkCopied ? "Copied" : "Copy"}
              </ActionButton>
              <ActionButton
                icon={ExternalLink}
                className="h-11 flex-1 sm:flex-none"
                onClick={() => window.open(trackingUrl, "_blank", "noopener,noreferrer")}
              >
                Open
              </ActionButton>
            </div>
          </div>
          <p className="text-[12.5px] text-muted-foreground">
            Default tracking link for{" "}
            <span className="font-bold text-foreground">{campaign.name}</span> — sub ID macros{" "}
            {"{x1}"}–{"{x3}"} are preserved and replaced at click time.
          </p>
        </div>

        <div className="flex items-start gap-2.5 rounded-2xl border border-brand/35 bg-brand/8 p-3.5 shadow-[0_0_24px_-14px_var(--color-brand)]">
          <Info className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            <span className="font-bold text-foreground">Event-Specific Postback:</span> If a
            postback is configured for a specific Conversion Event, conversions for that event will
            be sent only to its configured event-specific postback(s). Global Postback and other
            event-specific postbacks will not be triggered. If no event-specific postback is
            configured, that event automatically uses the Global Postback.
          </p>
        </div>

        <div className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Your Postback URL
          </span>
          <div className="grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
            <button
              type="button"
              onClick={() => setGlobalFormOpen(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-brand/50 bg-brand/15 px-3.5 text-[13px] font-extrabold text-brand shadow-[0_0_22px_-6px_var(--color-brand)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:bg-brand/22 hover:shadow-[0_0_28px_-4px_var(--color-brand)]"
            >
              <Globe2 className="size-4" aria-hidden="true" />
              Global
            </button>
            <input
              value={global.url}
              readOnly
              onClick={() => setGlobalFormOpen(true)}
              placeholder="https://your-tracker.com/postback?click_id={click_id}"
              className="h-11 w-full cursor-pointer rounded-xl border border-input bg-surface-2/50 px-3 font-mono text-[12.5px] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
            />
            <ActionButton
              icon={Copy}
              className="h-11"
              onClick={async () => {
                const ok = await copyText(global.url);
                if (ok) toast.success("Global postback URL copied");
                else toast.error("Unable to complete action");
              }}
            >
              Copy
            </ActionButton>
          </div>
          <p className="text-[12.5px] text-muted-foreground">
            This is the <span className="font-bold text-foreground">global fallback postback</span>{" "}
            — used for{" "}
            {fallbackEvents.length === 0
              ? "no events right now (all events have their own postback)."
              : `${fallbackEvents.map((e) => e.name).join(", ")}.`}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Trigger events
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {events.map((e) => (
              <Chip key={e.slug} active={selected.includes(e.slug)} onClick={() => toggle(e.slug)}>
                {e.name}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Tracking macros
            </p>
            <ActionButton
              icon={HelpCircle}
              onClick={() => setMacroHelpOpen(true)}
              className="h-7 px-2 text-[12px]"
            >
              Macro Help
            </ActionButton>
          </div>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {"{x1}"}–{"{x10}"} map to your sub IDs 1–10. Tap a macro to copy it.
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {CAMPAIGN_MACROS.map((m) => (
              <li key={m.macro}>
                <button
                  type="button"
                  title={m.desc}
                  onClick={async () => {
                    const ok = await copyText(m.macro);
                    if (ok) toast.success(`${m.macro} copied`);
                    else toast.error("Unable to complete action");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-2/50 px-3 py-1.5 font-mono text-[12px] font-semibold text-brand transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/50"
                >
                  <Copy className="size-3" aria-hidden="true" />
                  {m.macro}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Radio className="size-3.5 text-brand" aria-hidden="true" />
            Recent postback logs
          </p>
          <div className="mt-2">
            <TableWrap>
              <thead>
                <tr>
                  <Th>Event</Th>
                  <Th>Destination</Th>
                  <Th>Click ID</Th>
                  <Th>Status</Th>
                  <Th align="right">Time</Th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const specific = isOverridden(log.event);
                  return (
                    <Tr key={log.id}>
                      <Td className="font-mono text-[12.5px]">{log.event}</Td>
                      <Td>
                        <StatusBadge tone={specific ? "success" : "brand"}>
                          {specific ? "Event-specific" : "Global fallback"}
                        </StatusBadge>
                      </Td>
                      <Td className="font-mono text-[12.5px] text-muted-foreground">
                        {log.clickId}
                      </Td>
                      <Td>
                        <StatusBadge tone={log.ok ? "success" : "danger"}>
                          {log.status} {log.ok ? "OK" : "Failed"}
                        </StatusBadge>
                      </Td>
                      <Td className="text-right tabular-nums text-muted-foreground">{log.time}</Td>
                    </Tr>
                  );
                })}
              </tbody>
            </TableWrap>
          </div>
        </div>
      </div>

      <MacroHelperModal open={macroHelpOpen} onClose={() => setMacroHelpOpen(false)} />
      <PostbackFormModal
        open={globalFormOpen}
        onClose={() => setGlobalFormOpen(false)}
        scope={{ kind: "global" }}
        editing={global}
      />
    </Panel>
  );
}
