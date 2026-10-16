/**
 * AI X configuration contract (frontend only).
 * No provider is connected yet. When Gemini is integrated, implement
 * `saveAiConfig` / `testAiConnection` as server functions and keep this shape.
 */
export type AiProviderId = "gemini";

export type AiProvider = {
  id: AiProviderId;
  label: string;
  vendor: string;
  models: { id: string; label: string }[];
  defaultBaseUrl: string;
};

export const AI_PROVIDERS: AiProvider[] = [
  {
    id: "gemini",
    label: "Google Gemini",
    vendor: "Google",
    models: [
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
    ],
    defaultBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
  },
];

export type AiConnectionStatus = "not_connected" | "connected" | "error";

export type AiConfig = {
  enabled: boolean;
  provider: AiProviderId;
  model: string;
  baseUrl: string;
  timeoutMs: number;
  temperature: number;
  maxOutputTokens: number;
  /** Never persisted client-side; only sent to a future server function. */
  apiKeyConfigured: boolean;
  status: AiConnectionStatus;
};

export const DEFAULT_AI_CONFIG: AiConfig = {
  enabled: false,
  provider: "gemini",
  model: "gemini-2.5-flash",
  baseUrl: AI_PROVIDERS[0].defaultBaseUrl,
  timeoutMs: 30000,
  temperature: 0.7,
  maxOutputTokens: 2048,
  apiKeyConfigured: false,
  status: "not_connected",
};

/** True once a backend integration exists. Flip when Gemini is wired up. */
export const AI_BACKEND_AVAILABLE = false;
