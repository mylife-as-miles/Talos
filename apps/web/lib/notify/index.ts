import type { TalosTriageReport } from "../types";
import { sendDiscordNotification } from "./discord";
import { sendSlackNotification } from "./slack";

export async function notify(report: TalosTriageReport) {
  const [discord, slack] = await Promise.all([sendDiscordNotification(report), sendSlackNotification(report)]);
  return { discord, slack };
}
