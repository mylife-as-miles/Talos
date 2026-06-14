import { demoCheckoutEvent } from "@/lib/demo-data";
import { saveEvent } from "@/lib/store/events";
import { sendToSplunkHEC } from "@/lib/splunk/hec";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST() {
  const event = demoCheckoutEvent();
  await saveEvent(event);
  if (process.env.TALOS_MOCK_MODE !== "true") {
    await sendToSplunkHEC(event);
  }
  return Response.json({ ok: true, event });
}
