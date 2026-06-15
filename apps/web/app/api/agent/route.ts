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
  const aiProvider = req.headers.get("x-talos-ai-provider") || undefined;
  const aiKey = req.headers.get("x-talos-ai-key") || undefined;
  const aiModel = req.headers.get("x-talos-ai-model") || undefined;

  const hecUrl = req.headers.get("x-talos-hec-url") || undefined;
  const hecToken = req.headers.get("x-talos-hec-token") || undefined;
  const splunkIndex = req.headers.get("x-talos-splunk-index") || undefined;
  const mcpMode = req.headers.get("x-talos-mcp-mode") || undefined;
  const mcpUrl = req.headers.get("x-talos-mcp-url") || undefined;

  const discordWebhook = req.headers.get("x-talos-discord-webhook") || undefined;
  const slackWebhook = req.headers.get("x-talos-slack-webhook") || undefined;

  const event = await getEvent(body.eventId);

  if (!event) {
    return Response.json({ ok: false, error: "No Talos event found. Trigger a demo crash first." }, { status: 404 });
  }

  const splunkContext = await getSplunkContext({ event }, {
    hecUrl,
    hecToken,
    index: splunkIndex,
    mcpMode,
    mcpUrl
  });
  const anomaly = scoreAnomaly({
    currentErrorCount: splunkContext.stats.totalEvents,
    baselineAverage: 3,
    baselineStdDev: 2,
    matchingErrors: splunkContext.stats.matchingErrors,
    uniqueRoutesAffected: splunkContext.stats.affectedRoutes.length,
    event
  });
  const report = await generateTriageReport({
    event,
    splunkContext,
    anomaly,
    ai:
      aiKey && aiProvider === "gemini"
        ? {
            provider: aiProvider,
            apiKey: aiKey,
            model: aiModel
          }
        : undefined
  });
  await saveReport(report);
  await notify(report, { discordWebhook, slackWebhook });

  return Response.json({ ok: true, report });
}
