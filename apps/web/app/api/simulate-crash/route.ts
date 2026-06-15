import { simulatedBackstageEvent } from "@/lib/demo-data";
import { saveEvent } from "@/lib/store/events";
import { sendToSplunkHEC } from "@/lib/splunk/hec";
import { isSimulationMode } from "@/lib/config";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const event = simulatedBackstageEvent();
    await saveEvent(event);

    const hecUrl = req.headers.get("x-talos-hec-url") || undefined;
    const hecToken = req.headers.get("x-talos-hec-token") || undefined;
    const index = req.headers.get("x-talos-splunk-index") || undefined;

    const hasHecOverride = Boolean(hecUrl && hecToken);
    let hec: { sent: boolean; warning?: string } = { sent: false };

    if (!isSimulationMode() || hasHecOverride) {
      try {
        await sendToSplunkHEC(event, { hecUrl, hecToken, index });
        hec = { sent: true };
      } catch (error) {
        hec = {
          sent: false,
          warning: error instanceof Error ? error.message : "Splunk HEC forwarding failed."
        };
      }
    }

    return Response.json({ ok: true, event, hec });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Simulation failed." },
      { status: 500 }
    );
  }
}
