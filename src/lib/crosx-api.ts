import { getSupabase } from "./supabase-external";

const API_BASE_URL =
  import.meta.env.VITE_CROSX_API_URL ||
  "http://localhost:4000/api/v1";

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function crosxApi<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const supabase = getSupabase();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error("Authentication session not found");
  }

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${accessToken}`);

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(
    `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
    {
      ...options,
      headers,
      body:
        options.body === undefined
          ? undefined
          : JSON.stringify(options.body),
    },
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `CrosX API request failed with status ${response.status}`;

    throw new Error(message);
  }

  return payload as T;
}

export type PublisherApiResponse<T = unknown> = {
  success: boolean;
  publisher?: T;
  publishers?: T[];
  message?: string;
};

export function getMyPublisher<T = unknown>() {
  return crosxApi<PublisherApiResponse<T>>("/publishers/me");
}