import { notify } from "@/lib/notify";
import { getReport } from "@/lib/store/reports";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { incidentId?: string };
  const report = await getReport(body.incidentId);
  if (!report) {
    return Response.json({ ok: false, error: "No report found." }, { status: 404 });
  }
  return Response.json({ ok: true, result: await notify(report) });
}
