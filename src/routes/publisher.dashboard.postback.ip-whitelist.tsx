import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  EmptyState,
  Panel,
  StatusBadge,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/dashboard/kit";
import { usePublisherMock } from "@/components/dashboard/mock-store";

export const Route = createFileRoute("/publisher/dashboard/postback/ip-whitelist")({
  component: Page,
  head: () =>
    dashboardHead(
      "IP Whitelist — CrosX Publisher",
      "Whitelist the server IPs allowed to send postbacks to your CrosX publisher account.",
    ),
});

const IP_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$/;

function Page() {
  const { ips, addIp, removeIp } = usePublisherMock();
  const [ip, setIp] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!IP_PATTERN.test(ip.trim())) {
      setError("Enter a valid IPv4 address, for example 103.21.244.18.");
      return;
    }
    if (ips.some((i) => i.ip === ip.trim())) {
      setError("This IP address is already whitelisted.");
      return;
    }
    setError(null);
    addIp(ip.trim(), label.trim() || "Untitled server");
    setIp("");
    setLabel("");
    toast.success("IP address whitelisted");
  };

  return (
    <>
      <PageHeader
        eyebrow="Postback"
        title="IP Whitelist"
        description="Only whitelisted server IPs can send postbacks to your CrosX account — a hard requirement for secure S2S tracking."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Panel title="Add IP Address" description="Add the server that will fire your postbacks.">
          <div className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                IPv4 Address <span className="text-brand">*</span>
              </span>
              <input
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="103.21.244.18"
                className="h-11 w-full rounded-xl border border-input bg-surface-2/50 px-3 font-mono text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Label
              </span>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Office network"
                className="h-11 w-full rounded-xl border border-input bg-surface-2/50 px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
              />
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-500/35 bg-red-500/10 px-3.5 py-2.5 text-[13px] font-semibold text-red-500"
              >
                {error}
              </p>
            )}

            <ActionButton variant="solid" icon={Plus} onClick={submit} className="w-full">
              Whitelist IP
            </ActionButton>
          </div>
        </Panel>

        <Panel
          title={`${ips.length} whitelisted IPs`}
          description="Remove any server that no longer needs postback access."
        >
          {ips.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No IPs whitelisted"
              description="Add your tracker's server IP to start receiving postbacks."
            />
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>IP Address</Th>
                  <Th>Label</Th>
                  <Th>Status</Th>
                  <Th align="right">Action</Th>
                </tr>
              </thead>
              <tbody>
                {ips.map((i) => (
                  <Tr key={i.id}>
                    <Td className="font-mono text-[12.5px]">{i.ip}</Td>
                    <Td className="font-semibold">{i.label}</Td>
                    <Td>
                      <StatusBadge tone="success" dot>
                        Active
                      </StatusBadge>
                    </Td>
                    <Td className="text-right">
                      <span className="inline-flex justify-end">
                        <ActionButton
                          variant="subtle"
                          icon={Trash2}
                          onClick={() => {
                            removeIp(i.id);
                            toast.success(`${i.ip} removed from whitelist`);
                          }}
                        >
                          Remove
                        </ActionButton>
                      </span>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </Panel>
      </div>
    </>
  );
}
