import { listEvents } from "@/lib/store/events";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function GET() {
  return Response.json({ ok: true, events: await listEvents() });
}
