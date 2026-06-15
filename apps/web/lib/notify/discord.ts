import type { TalosTriageReport } from "../types";

export async function sendDiscordNotification(report: TalosTriageReport, webhookOverride?: string) {
  const webhook = webhookOverride || process.env.DISCORD_WEBHOOK_URL;
  if (!webhook || webhook === "replace_with_discord_webhook") {
    return { skipped: true, reason: "Discord webhook not configured." };
  }

  const content = [
    `🚨 Talos ${report.priority[0]?.toUpperCase()}${report.priority.slice(1)} Incident`,
    "",
    `Service: ${report.affectedService}`,
    `Route: ${report.affectedRoute || "unknown"}`,
    `Trigger: ${report.trigger}`,
    `Priority: ${report.priority}`,
    `Confidence: ${report.confidence}%`,
    "",
    "Root Cause:",
    report.rootCause,
    "",
    "Evidence:",
    ...report.evidence.slice(0, 4).map((item) => `- ${item.message}`),
    "",
    "Proposed Fix:",
    report.proposedFix.explanation,
    report.proposedFix.code ? `\nCode:\n\`\`\`ts\n${report.proposedFix.code}\n\`\`\`` : ""
  ].join("\n");

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });

  return { skipped: false, ok: response.ok };
}
