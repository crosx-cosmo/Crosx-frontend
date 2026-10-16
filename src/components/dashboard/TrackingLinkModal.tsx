import { useMemo, useState } from "react";
import { Copy, QrCode, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { ActionButton, Modal, Select, TextField, copyText } from "./kit";
import { usePublisherMock } from "./mock-store";

function QrPattern({ value }: { value: string }) {
  // Deterministic decorative pattern derived from the link — demo visual only.
  const cells = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < value.length; i += 1) seed = (seed * 31 + value.charCodeAt(i)) % 99991;
    return Array.from({ length: 441 }, (_, i) => {
      seed = (seed * 1103515245 + 12345 + i) % 2147483647;
      return (seed >> 7) % 3 === 0;
    });
  }, [value]);

  return (
    <div className="mx-auto grid w-fit grid-cols-[repeat(21,minmax(0,1fr))] gap-[2px] rounded-2xl border border-hairline bg-surface-2/60 p-4">
      {cells.map((on, i) => (
        <span
          key={i}
          className={on ? "size-[7px] rounded-[1px] bg-foreground" : "size-[7px] rounded-[1px]"}
        />
      ))}
    </div>
  );
}

export function TrackingLinkModal({
  open,
  onClose,
  campaignSlug,
}: {
  open: boolean;
  onClose: () => void;
  campaignSlug?: string;
}) {
  const { activeCampaigns, campaigns } = usePublisherMock();
  const pool = activeCampaigns.length > 0 ? activeCampaigns : campaigns;
  const [slug, setSlug] = useState(campaignSlug ?? pool[0]?.slug ?? "");
  const [landing, setLanding] = useState("");
  const [sub1, setSub1] = useState("instagram");
  const [sub2, setSub2] = useState("reel_01");
  const [sub3, setSub3] = useState("creator_aman");
  const [showQr, setShowQr] = useState(false);

  const campaign = pool.find((c) => c.slug === (campaignSlug ?? slug)) ?? pool[0];
  const landingPages = campaign?.landingPages ?? [];
  const activeLanding = landing || landingPages[0] || "Landing Page";

  const link = campaign
    ? `https://crosx.in/go/${campaign.linkCode}?lp=${encodeURIComponent(
        activeLanding.toLowerCase().replace(/\s+/g, "_"),
      )}&sub1=${sub1}&sub2=${sub2}&sub3=${sub3}`
    : "";

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Generate Tracking Link"
        description="Build a trackable CrosX link with your own Sub ID structure."
        footer={
          <>
            <ActionButton
              icon={QrCode}
              onClick={() => setShowQr(true)}
              className="w-full sm:w-auto"
            >
              QR Code
            </ActionButton>
            <ActionButton
              variant="solid"
              icon={Copy}
              className="w-full sm:w-auto"
              onClick={async () => {
                const ok = await copyText(link);
                if (ok) toast.success("Tracking link copied");
                else toast.error("Unable to complete action");
              }}
            >
              Copy Link
            </ActionButton>
          </>
        }
      >
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Campaign
            </span>
            <Select
              value={campaignSlug ?? slug}
              disabled={Boolean(campaignSlug)}
              onChange={(e) => {
                setSlug(e.target.value);
                setLanding("");
              }}
              className="h-11 w-full"
            >
              {pool.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Landing Page
            </span>
            <Select
              value={activeLanding}
              onChange={(e) => setLanding(e.target.value)}
              className="h-11 w-full"
            >
              {landingPages.map((lp) => (
                <option key={lp} value={lp}>
                  {lp}
                </option>
              ))}
            </Select>
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <TextField label="Sub ID 1" value={sub1} onChange={(e) => setSub1(e.target.value)} />
            <TextField label="Sub ID 2" value={sub2} onChange={(e) => setSub2(e.target.value)} />
            <TextField label="Sub ID 3" value={sub3} onChange={(e) => setSub3(e.target.value)} />
          </div>

          <div className="rounded-2xl border border-hairline bg-surface-2/50 p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <LinkIcon className="size-3.5" aria-hidden="true" />
              Generated Link
            </p>
            <p className="mt-2 break-all font-mono text-[12.5px] leading-relaxed text-foreground">
              {link}
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        open={showQr}
        onClose={() => setShowQr(false)}
        title="Tracking QR Code"
        description="Demo QR visual for the generated tracking link."
      >
        <QrPattern value={link} />
        <p className="mt-4 break-all text-center font-mono text-[11.5px] text-muted-foreground">
          {link}
        </p>
      </Modal>
    </>
  );
}
