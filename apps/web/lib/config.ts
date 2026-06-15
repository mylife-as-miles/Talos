export function hasSplunkHecConfig(overrides?: { hecUrl?: string; hecToken?: string }) {
  const hecUrl = overrides?.hecUrl || process.env.SPLUNK_HEC_URL;
  const hecToken = overrides?.hecToken || process.env.SPLUNK_HEC_TOKEN;
  return Boolean(hecUrl && hecToken && hecToken !== "replace_with_hec_token");
}

export function hasAiConfig(overrides?: { provider?: string; apiKey?: string }) {
  const provider = overrides?.provider || process.env.AI_PROVIDER;
  const apiKey = overrides?.apiKey || process.env.GEMINI_API_KEY;
  return Boolean(provider === "gemini" && apiKey && apiKey !== "replace_with_key");
}
