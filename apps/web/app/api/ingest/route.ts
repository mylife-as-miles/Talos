import { sendToSplunkHEC } from "@/lib/splunk/hec";
import { saveEvent } from "@/lib/store/events";
import { validateTalosEvent } from "@/lib/ingest/validate";
import { isMockMode } from "@/lib/config";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const event = await req.json();
    validateTalosEvent(event);
    await saveEvent(event);

    const hecUrl = req.headers.get("x-talos-hec-url") || undefined;
    const hecToken = req.headers.get("x-talos-hec-token") || undefined;
    const index = req.headers.get("x-talos-splunk-index") || undefined;

    const hasHecOverride = Boolean(hecUrl && hecToken);

    if (!isMockMode() || hasHecOverride) {
      await sendToSplunkHEC(event, { hecUrl, hecToken, index });
    }

    return Response.json({ ok: true, eventId: event.eventId });
  } catch (error) {
    return Response.json({ ok: false, error: error instanceof Error ? error.message : "Ingest failed" }, { status: 400 });
  }
}
