import type { TalosErrorEvent } from "../types";

export async function sendToSplunkHEC(event: TalosErrorEvent) {
  const baseUrl = process.env.SPLUNK_HEC_URL;
  const token = process.env.SPLUNK_HEC_TOKEN;

  if (!baseUrl || !token || token === "replace_with_hec_token") {
    throw new Error("Splunk HEC is not configured.");
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/services/collector/event`, {
    method: "POST",
    headers: {
      Authorization: `Splunk ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      event,
      sourcetype: process.env.SPLUNK_SOURCETYPE || "talos:error",
      source: process.env.SPLUNK_SOURCE || "talos-sdk",
      index: process.env.SPLUNK_INDEX || "main",
      host: event.service || "talos-demo"
    })
  });

  if (!response.ok) {
    throw new Error(`Splunk HEC rejected event with ${response.status}`);
  }
}
