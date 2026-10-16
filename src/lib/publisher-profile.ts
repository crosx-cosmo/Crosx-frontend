import { useCallback, useEffect, useState } from "react";

import { getSupabase } from "./supabase-external";
import { COUNTRIES } from "./geo-data";

/** Traffic sources offered during registration — reused on the profile page. */
export const TRAFFIC_SOURCES = [
  "Facebook",
  "Instagram",
  "Telegram",
  "WhatsApp",
  "YouTube",
  "Google Ads",
  "Native Ads",
  "SEO",
  "Website / Blog",
  "Email Marketing",
  "Influencer",
  "Others",
] as const;

export const PUBLISHER_TYPES = ["Agency Owner", "Employee", "Affiliate Employee"] as const;

/** Editable shape of the single `profiles` row backing registration + profile. */
export type PublisherAccount = {
  fullName: string;
  email: string;
  mobile: string;
  companyName: string;
  website: string;
  publisherType: string;
  gstNumber: string;
  trafficSources: string[];
  country: string;
  state: string;
  city: string;
  pincode: string;
  /* read-only / system controlled */
  accountType: string;
  publisherId: string;
  joined: string;
};

type ProfileRow = {
  full_name: string;
  email: string;
  mobile: string;
  company_name: string;
  website: string | null;
  role: string;
  gst_number: string | null;
  traffic_sources: string[] | null;
  country: string;
  state: string;
  city: string;
  pincode: string;
  account_type: string;
  created_at: string;
};

const SELECT_COLUMNS =
  "full_name,email,mobile,company_name,website,role,gst_number,traffic_sources,country,state,city,pincode,account_type,created_at";

/** Human country label for a stored ISO code (falls back to the raw value). */
export function countryLabel(value: string) {
  return COUNTRIES.find((c) => c.code === value)?.name ?? value;
}

/** Stable, non-sensitive publisher identifier derived from the account id. */
export function publisherIdFor(userId: string) {
  return `PUB-${userId
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase()}`;
}

function toAccount(row: ProfileRow, userId: string): PublisherAccount {
  return {
    fullName: row.full_name ?? "",
    email: row.email ?? "",
    mobile: row.mobile ?? "",
    companyName: row.company_name ?? "",
    website: row.website ?? "",
    publisherType: row.role ?? "",
    gstNumber: row.gst_number ?? "",
    trafficSources: row.traffic_sources ?? [],
    country: row.country ?? "",
    state: row.state ?? "",
    city: row.city ?? "",
    pincode: row.pincode ?? "",
    accountType: row.account_type ?? "publisher",
    publisherId: publisherIdFor(userId),
    joined: row.created_at
      ? new Date(row.created_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "—",
  };
}

/** Fields the publisher is allowed to change from the profile page. */
export type EditablePatch = Partial<
  Pick<
    PublisherAccount,
    | "fullName"
    | "mobile"
    | "companyName"
    | "website"
    | "publisherType"
    | "gstNumber"
    | "trafficSources"
    | "country"
    | "state"
    | "city"
    | "pincode"
  >
>;

type ProfileUpdate = import("@/integrations/supabase/types").TablesUpdate<"profiles">;

function toRowPatch(patch: EditablePatch) {
  const out: ProfileUpdate = {};
  if (patch.fullName !== undefined) out["full_name"] = patch.fullName.trim();
  if (patch.mobile !== undefined) out["mobile"] = patch.mobile.trim();
  if (patch.companyName !== undefined) out["company_name"] = patch.companyName.trim();
  if (patch.website !== undefined) out["website"] = patch.website.trim() || null;
  if (patch.publisherType !== undefined) out["role"] = patch.publisherType;
  if (patch.gstNumber !== undefined) out["gst_number"] = patch.gstNumber.trim() || null;
  if (patch.trafficSources !== undefined) out["traffic_sources"] = patch.trafficSources;
  if (patch.country !== undefined) out["country"] = patch.country;
  if (patch.state !== undefined) out["state"] = patch.state;
  if (patch.city !== undefined) out["city"] = patch.city;
  if (patch.pincode !== undefined) out["pincode"] = patch.pincode.trim();
  return out;
}

/** Realistic demo record shown when no live account row exists yet. */
export function demoAccount(userId?: string | null, email?: string | null): PublisherAccount {
  return {
    fullName: "Aman Kumar",
    email: email ?? "aman@crosxdemo.in",
    mobile: "+91 98210 44271",
    companyName: "Aman Finance Media",
    website: "https://amanfinance.in",
    publisherType: "Agency Owner",
    gstNumber: "27AABCU9603R1ZM",
    trafficSources: ["Instagram", "YouTube", "Telegram", "SEO"],
    country: "IN",
    state: "Maharashtra",
    city: "Mumbai",
    pincode: "400051",
    accountType: "publisher",
    publisherId: userId ? publisherIdFor(userId) : "PUB-10291",
    joined: "June 14, 2026",
  };
}

/**
 * Live publisher account record. Reads the same `profiles` row that publisher
 * registration writes, and saves edits back to it (RLS scopes it to the owner).
 * When no row exists (or it can't be read), a demo record is shown so the
 * console still renders a realistic profile.
 */
export function usePublisherAccount(userId: string | null | undefined, email?: string | null) {
  const [account, setAccount] = useState<PublisherAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    if (!userId) {
      setAccount(demoAccount(null, email));
      setIsDemo(true);
      setLoading(false);
      return;
    }
    const { data, error: err } = await getSupabase()
      .from("profiles")
      .select(SELECT_COLUMNS)
      .eq("id", userId)
      .maybeSingle();
    if (err) {
      setError(err.message);
      setAccount(demoAccount(userId, email));
      setIsDemo(true);
    } else {
      setError(null);
      if (data) {
        setAccount(toAccount(data as ProfileRow, userId));
        setIsDemo(false);
      } else {
        setAccount(demoAccount(userId, email));
        setIsDemo(true);
      }
    }
    setLoading(false);
  }, [userId, email]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(
    async (patch: EditablePatch) => {
      if (!userId || isDemo) {
        setAccount((prev) => (prev ? { ...prev, ...patch } : prev));
        return null;
      }
      const { data, error: err } = await getSupabase()
        .from("profiles")
        .update(toRowPatch(patch))
        .eq("id", userId)
        .select(SELECT_COLUMNS)
        .maybeSingle();
      if (err) throw err;
      if (data) setAccount(toAccount(data as ProfileRow, userId));
      return data;
    },
    [userId, isDemo],
  );

  return { account, loading, error, isDemo, reload: load, save };
}
