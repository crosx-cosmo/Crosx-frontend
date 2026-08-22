import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  CAMPAIGNS,
  INITIAL_IPS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROFILE,
  NOTIFICATION_SETTINGS,
  POSTBACK_LOGS,
  type Campaign,
  type Notification,
  type PostbackLog,
  type PublisherProfile,
  type WhitelistIp,
} from "@/lib/publisher-data";

type NotificationPrefs = Record<(typeof NOTIFICATION_SETTINGS)[number]["key"], boolean>;

type Store = {
  campaigns: Campaign[];
  joinedSlugs: string[];
  joinCampaign: (slug: string) => void;
  leaveCampaign: (slug: string) => void;
  activeCampaigns: Campaign[];
  ips: WhitelistIp[];
  addIp: (ip: string, label: string) => void;
  removeIp: (id: string) => void;
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  profile: PublisherProfile;
  updateProfile: (patch: Partial<PublisherProfile>) => void;
  logs: PostbackLog[];
  retryLog: (requestId: string) => void;
  postbackEnabled: boolean;
  setPostbackEnabled: (value: boolean) => void;
  prefs: NotificationPrefs;
  togglePref: (key: keyof NotificationPrefs) => void;
};

const PublisherMockContext = createContext<Store | null>(null);

const DEFAULT_PREFS = Object.fromEntries(
  NOTIFICATION_SETTINGS.map((s) => [s.key, true]),
) as NotificationPrefs;

/** All publisher-console interactions run against this in-memory demo store. */
export function PublisherMockProvider({ children }: { children: ReactNode }) {
  const [joinedSlugs, setJoinedSlugs] = useState<string[]>(() =>
    CAMPAIGNS.filter((c) => c.joined).map((c) => c.slug),
  );
  const [ips, setIps] = useState<WhitelistIp[]>(INITIAL_IPS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [profile, setProfile] = useState<PublisherProfile>(INITIAL_PROFILE);
  const [logs, setLogs] = useState<PostbackLog[]>(POSTBACK_LOGS);
  const [postbackEnabled, setPostbackEnabled] = useState(true);
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);

  const campaigns = useMemo(
    () => CAMPAIGNS.map((c) => ({ ...c, joined: joinedSlugs.includes(c.slug) })),
    [joinedSlugs],
  );

  const joinCampaign = useCallback((slug: string) => {
    setJoinedSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  }, []);

  const leaveCampaign = useCallback((slug: string) => {
    setJoinedSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const value = useMemo<Store>(
    () => ({
      campaigns,
      joinedSlugs,
      joinCampaign,
      leaveCampaign,
      activeCampaigns: campaigns.filter((c) => c.joined),
      ips,
      addIp: (ip, label) =>
        setIps((prev) => [{ id: `IP-${Date.now()}`, ip, label, active: true }, ...prev]),
      removeIp: (id) => setIps((prev) => prev.filter((i) => i.id !== id)),
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      markAllRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
      markRead: (id) =>
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))),
      profile,
      updateProfile: (patch) => setProfile((prev) => ({ ...prev, ...patch })),
      logs,
      retryLog: (requestId) =>
        setLogs((prev) =>
          prev.map((l) =>
            l.requestId === requestId ? { ...l, ok: true, status: 200, response: "OK" } : l,
          ),
        ),
      postbackEnabled,
      setPostbackEnabled,
      prefs,
      togglePref: (key) => setPrefs((prev) => ({ ...prev, [key]: !prev[key] })),
    }),
    [campaigns, joinedSlugs, joinCampaign, leaveCampaign, ips, notifications, profile, logs, postbackEnabled, prefs],
  );

  return <PublisherMockContext.Provider value={value}>{children}</PublisherMockContext.Provider>;
}

export function usePublisherMock() {
  const ctx = useContext(PublisherMockContext);
  if (!ctx) throw new Error("usePublisherMock must be used inside PublisherMockProvider");
  return ctx;
}
