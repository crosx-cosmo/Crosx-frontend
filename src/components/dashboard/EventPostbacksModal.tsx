import { useState } from "react";
import { Pencil, Plus, Target, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { ActionButton, Modal, StatusBadge } from "@/components/dashboard/kit";
import { PostbackFormModal } from "@/components/dashboard/PostbackFormModal";
import {
  useCampaignPostbacks,
  type PostbackConfig,
} from "@/lib/campaign-postback-store";
import type { ConversionEvent } from "@/lib/campaign-postback-data";

/** Lists only the postbacks configured for one conversion event. */
export function EventPostbacksModal({
  open,
  onClose,
  event,
}: {
  open: boolean;
  onClose: () => void;
  event: ConversionEvent;
}) {
  const { forEvent, global, removePostback, toggleActive, testPostback } =
    useCampaignPostbacks();
  const items = forEvent(event.slug);
  const overridden = items.some((i) => i.active);
  const [editing, setEditing] = useState<PostbackConfig | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  const test = async (pb: PostbackConfig) => {
    setTestingId(pb.id);
    const res = await testPostback(pb.id);
    setTestingId(null);
    if (res.ok)
      toast.success(`Test fired — ${event.name}`, { description: "Tracker responded 200 OK." });
    else
      toast.error(`Test failed — ${event.name}`, {
        description: `Tracker responded ${res.status}.`,
      });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={`${event.name} — Postbacks`}
        description={
          overridden
            ? "This event overrides the Global Postback. Conversions go only to the active postbacks below."
            : "No active postback for this event, so its conversions use the Global Postback."
        }
        footer={
          <ActionButton
            variant="solid"
            icon={Plus}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Add Postback
          </ActionButton>
        }
      >
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="neutral" className="h-8 px-3">
              <Target className="size-3.5 text-brand" aria-hidden="true" />
              {event.slug}
            </StatusBadge>
            <StatusBadge tone={overridden ? "success" : "warn"} dot>
              {overridden ? "Event-specific override" : "Using global fallback"}
            </StatusBadge>
          </div>

          {items.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-hairline bg-surface-2/30 p-4 text-[13px] text-muted-foreground">
              No postbacks yet for this event. Conversions fall back to the Global Postback:{" "}
              <span className="break-all font-mono text-[12px] text-foreground">{global.url}</span>
            </p>
          ) : (
            <ul className="grid gap-3">
              {items.map((pb) => (
                <li
                  key={pb.id}
                  className="rounded-2xl border border-hairline bg-surface-2/40 p-3.5"
                >
                  <p className="break-all font-mono text-[12px] leading-relaxed text-foreground">
                    {pb.url}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => toggleActive(pb.id)}>
                      <StatusBadge tone={pb.active ? "success" : "neutral"} dot>
                        {pb.active ? "Active" : "Inactive"}
                      </StatusBadge>
                    </button>
                    {pb.lastTest && (
                      <StatusBadge tone={pb.lastTest.ok ? "success" : "danger"}>
                        Last test {pb.lastTest.status} · {pb.lastTest.at}
                      </StatusBadge>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ActionButton
                      icon={Zap}
                      onClick={() => test(pb)}
                      disabled={testingId === pb.id}
                      className="h-8 px-2.5 text-[12px]"
                    >
                      {testingId === pb.id ? "Testing..." : "Test"}
                    </ActionButton>
                    <ActionButton
                      icon={Pencil}
                      onClick={() => {
                        setEditing(pb);
                        setFormOpen(true);
                      }}
                      className="h-8 px-2.5 text-[12px]"
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      icon={Trash2}
                      onClick={() => {
                        removePostback(pb.id);
                        toast.success("Postback deleted", {
                          description: `${event.name} postback removed.`,
                        });
                      }}
                      className="h-8 px-2.5 text-[12px]"
                    >
                      Delete
                    </ActionButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>

      <PostbackFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        scope={{ kind: "event", slug: event.slug, name: event.name }}
        editing={editing}
      />
    </>
  );
}
