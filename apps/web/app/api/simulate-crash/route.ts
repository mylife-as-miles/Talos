import { simulatedBackstageEvent } from "@/lib/demo-data";
import { saveEvent } from "@/lib/store/events";
import { sendToSplunkHEC } from "@/lib/splunk/hec";
import { isSimulationMode } from "@/lib/config";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const event = simulatedBackstageEvent();
  await saveEvent(event);

  const hecUrl = req.headers.get("x-talos-hec-url") || undefined;
  const hecToken = req.headers.get("x-talos-hec-token") || undefined;
  const index = req.headers.get("x-talos-splunk-index") || undefined;

  const hasHecOverride = Boolean(hecUrl && hecToken);

  if (!isSimulationMode() || hasHecOverride) {
    await sendToSplunkHEC(event, { hecUrl, hecToken, index });
  }

  return Response.json({ ok: true, event });
}
