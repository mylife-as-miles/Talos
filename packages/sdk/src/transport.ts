import type { TalosErrorEvent } from "./types.js";

export async function sendEvent(ingestUrl: string, event: TalosErrorEvent) {
  const response = await fetch(ingestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(event),
    keepalive: typeof window !== "undefined"
  });

  if (!response.ok) {
    throw new Error(`Talos ingest failed with ${response.status}`);
  }

  return response.json() as Promise<{ ok: boolean; eventId: string }>;
}
