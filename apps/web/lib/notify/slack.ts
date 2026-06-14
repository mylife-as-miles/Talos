import type { TalosTriageReport } from "../types";

export async function sendSlackNotification(report: TalosTriageReport) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    return { skipped: true, reason: "Slack webhook not configured." };
  }

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `Talos ${report.priority} incident in ${report.affectedService}: ${report.summary}`
    })
  });

  return { skipped: false, ok: response.ok };
}
