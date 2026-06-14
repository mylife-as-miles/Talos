import { sendToSplunkHEC } from "@/lib/splunk/hec";
import { saveEvent } from "@/lib/store/events";
import { validateTalosEvent } from "@/lib/ingest/validate";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const event = await req.json();
    validateTalosEvent(event);
    await saveEvent(event);

    if (process.env.TALOS_MOCK_MODE !== "true") {
      await sendToSplunkHEC(event);
    }

    return Response.json({ ok: true, eventId: event.eventId });
  } catch (error) {
    return Response.json({ ok: false, error: error instanceof Error ? error.message : "Ingest failed" }, { status: 400 });
  }
}
