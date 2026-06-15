import type { TalosTriageReport } from "../types";
import { sendDiscordNotification } from "./discord";
import { sendSlackNotification } from "./slack";

export async function notify(
  report: TalosTriageReport,
  overrides?: { discordWebhook?: string; slackWebhook?: string }
) {
  const [discord, slack] = await Promise.all([
    sendDiscordNotification(report, overrides?.discordWebhook),
    sendSlackNotification(report, overrides?.slackWebhook)
  ]);
  return { discord, slack };
}
