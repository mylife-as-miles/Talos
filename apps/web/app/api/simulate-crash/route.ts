import { demoCheckoutEvent } from "@/lib/demo-data";
import { saveEvent } from "@/lib/store/events";
import { sendToSplunkHEC } from "@/lib/splunk/hec";
import { isMockMode } from "@/lib/config";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST() {
  const event = demoCheckoutEvent();
  await saveEvent(event);
  if (!isMockMode()) {
    await sendToSplunkHEC(event);
  }
  return Response.json({ ok: true, event });
}
