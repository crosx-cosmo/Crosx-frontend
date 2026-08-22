import { useState } from "react";
import { BadgeIndianRupee, List, Lock, Plus, Zap } from "lucide-react";
import { toast } from "sonner";
import { ActionButton, Panel, StatusBadge } from "@/components/dashboard/kit";
import { EventPostbacksModal } from "@/components/dashboard/EventPostbacksModal";
import { PostbackFormModal } from "@/components/dashboard/PostbackFormModal";
import { conversionEventsFor, type ConversionEvent } from "@/lib/campaign-postback-data";
import { useCampaignPostbacks } from "@/lib/campaign-postback-store";
import { inr, type Campaign } from "@/lib/publisher-data";

/** Advertiser-defined conversion events with per-event postback controls. */
export function ConversionEventsPanel({ campaign }: { campaign: Campaign }) {
  const events = conversionEventsFor(campaign);
  const { activeForEvent, isOverridden, testPostback } = useCampaignPostbacks();

  const [addFor, setAddFor] = useState<ConversionEvent | null>(null);
  const [viewFor, setViewFor] = useState<ConversionEvent | null>(null);
  const [testingSlug, setTestingSlug] = useState<string | null>(null);

  const testEvent = async (event: ConversionEvent) => {
    const active = activeForEvent(event.slug);
    if (active.length === 0) {
      toast.error(`No event-specific postback for ${event.name}`, {
        description: "Add one first — this event currently uses the Global Postback.",
      });
      return;
    }
    setTestingSlug(event.slug);
    const results = await Promise.all(active.map((pb) => testPostback(pb.id)));
    setTestingSlug(null);
    const failed = results.filter((r) => !r.ok).length;
    if (failed === 0)
      toast.success(`Test fired — ${event.name}`, {
        description: `${results.length} event-specific postback${results.length === 1 ? "" : "s"} responded 200 OK.`,
      });
    else
      toast.error(`Test failed — ${event.name}`, {
        description: `${failed} of ${results.length} postbacks did not respond 200.`,
      });
  };

  return (
    <Panel
      title="Conversion Events"
      description="Events the advertiser tracks on this campaign, with the payout credited for each."
      action={
        <StatusBadge tone="neutral" className="h-8 px-3">
          <Lock className="size-3" aria-hidden="true" />
          Payouts view only
        </StatusBadge>
      }
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {events.map((event) => {
          const count = activeForEvent(event.slug).length;
          return (
            <li
              key={event.id}
              className="rounded-2xl border border-hairline bg-surface-2/40 p-4 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold tracking-tight">
                    {event.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{event.slug}</p>
                </div>
                <StatusBadge tone={event.status === "Active" ? "success" : "warn"} dot>
                  {event.status}
                </StatusBadge>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {event.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <p className="inline-flex items-center gap-1.5 text-sm font-bold tabular-nums">
                  <BadgeIndianRupee className="size-4 text-brand" aria-hidden="true" />
                  {inr(event.payout)}
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    per event
                  </span>
                </p>
                <StatusBadge tone={isOverridden(event.slug) ? "success" : "neutral"}>
                  {isOverridden(event.slug)
                    ? `Event postback · ${count}`
                    : "Global fallback"}
                </StatusBadge>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 border-t border-hairline pt-3">
                <ActionButton
                  icon={Plus}
                  onClick={() => setAddFor(event)}
                  className="h-8 px-2.5 text-[12px]"
                >
                  Add Postback
                </ActionButton>
                <ActionButton
                  icon={List}
                  onClick={() => setViewFor(event)}
                  className="h-8 px-2.5 text-[12px]"
                >
                  View Postbacks
                </ActionButton>
                <ActionButton
                  icon={Zap}
                  onClick={() => testEvent(event)}
                  disabled={testingSlug === event.slug}
                  className="h-8 px-2.5 text-[12px]"
                >
                  {testingSlug === event.slug ? "Testing..." : "Test Postback"}
                </ActionButton>
              </div>
            </li>
          );
        })}
      </ul>

      {addFor && (
        <PostbackFormModal
          open={!!addFor}
          onClose={() => setAddFor(null)}
          scope={{ kind: "event", slug: addFor.slug, name: addFor.name }}
        />
      )}
      {viewFor && (
        <EventPostbacksModal
          open={!!viewFor}
          onClose={() => setViewFor(null)}
          event={viewFor}
        />
      )}
    </Panel>
  );
}
