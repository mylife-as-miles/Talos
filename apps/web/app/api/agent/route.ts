import { scoreAnomaly } from "@/lib/anomaly/score";
import { generateTriageReport } from "@/lib/ai/generate-report";
import { notify } from "@/lib/notify";
import { getSplunkContext } from "@/lib/splunk";
import { getEvent } from "@/lib/store/events";
import { saveReport } from "@/lib/store/reports";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { eventId?: string };
  const event = await getEvent(body.eventId);

  if (!event) {
    return Response.json({ ok: false, error: "No Talos event found. Trigger a demo crash first." }, { status: 404 });
  }

  const splunkContext = await getSplunkContext({ event });
  const anomaly = scoreAnomaly({
    currentErrorCount: splunkContext.stats.totalEvents,
    baselineAverage: 3,
    baselineStdDev: 2,
    matchingErrors: splunkContext.stats.matchingErrors,
    uniqueRoutesAffected: splunkContext.stats.affectedRoutes.length,
    event
  });
  const report = await generateTriageReport({ event, splunkContext, anomaly });
  await saveReport(report);
  await notify(report);

  return Response.json({ ok: true, report });
}
