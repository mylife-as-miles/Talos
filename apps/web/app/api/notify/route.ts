import { notify } from "@/lib/notify";
import { getReport } from "@/lib/store/reports";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { incidentId?: string };
    const report = await getReport(body.incidentId);
    if (!report) {
      return Response.json({ ok: false, error: "No report found." }, { status: 404 });
    }

    const discordWebhook = req.headers.get("x-talos-discord-webhook") || undefined;
    const slackWebhook = req.headers.get("x-talos-slack-webhook") || undefined;

    return Response.json({
      ok: true,
      result: await notify(report, { discordWebhook, slackWebhook })
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Notification failed." },
      { status: 500 }
    );
  }
}
