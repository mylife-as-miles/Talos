import { scoreAnomaly } from "@/lib/anomaly/score";
import { generateTriageReport } from "@/lib/ai/generate-report";
import { notify } from "@/lib/notify";
import { getSplunkContext } from "@/lib/splunk";
import { getEvent, saveEvent } from "@/lib/store/events";
import { saveReport } from "@/lib/store/reports";
import { validateTalosEvent } from "@/lib/ingest/validate";
import type { TalosErrorEvent } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { eventId?: string; event?: TalosErrorEvent };
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

    let event = body.event;
    if (event) {
      validateTalosEvent(event);
      await saveEvent(event);
    } else {
      event = await getEvent(body.eventId);
    }

    if (!event) {
      return Response.json({ ok: false, error: "No Talos event found. Send a real SDK event to /api/ingest first." }, { status: 404 });
    }

    const splunkContext = await getSplunkContext(
      { event },
      {
        hecUrl,
        hecToken,
        index: splunkIndex,
        mcpMode,
        mcpUrl
      }
    );
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
    const notification = await notify(report, { discordWebhook, slackWebhook });

    return Response.json({ ok: true, report, notification });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Resolver failed." },
      { status: 500 }
    );
  }
}
