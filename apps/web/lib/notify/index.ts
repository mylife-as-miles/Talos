import type { TalosTriageReport } from "../types";
import { sendDiscordNotification } from "./discord";
import { sendSlackNotification } from "./slack";

export async function notify(
  report: TalosTriageReport,
  overrides?: { discordWebhook?: string; slackWebhook?: string }
) {
  const [discord, slack] = await Promise.allSettled([
    sendDiscordNotification(report, overrides?.discordWebhook),
    sendSlackNotification(report, overrides?.slackWebhook)
  ]);
  return {
    discord: discord.status === "fulfilled" ? discord.value : { skipped: false, ok: false, error: discord.reason instanceof Error ? discord.reason.message : "Discord notification failed." },
    slack: slack.status === "fulfilled" ? slack.value : { skipped: false, ok: false, error: slack.reason instanceof Error ? slack.reason.message : "Slack notification failed." }
  };
}
