import type { AnomalyScore, TalosErrorEvent } from "../types";

export type AnomalyInput = {
  currentErrorCount: number;
  baselineAverage: number;
  baselineStdDev: number;
  matchingErrors: number;
  uniqueRoutesAffected: number;
  event?: TalosErrorEvent;
};

export function scoreAnomaly(input: AnomalyInput): AnomalyScore {
  let score = 20;
  const reasons: string[] = [];
  const criticalRoute = Boolean(input.event?.route?.match(/checkout|payment|auth|user/i));

  if (input.currentErrorCount > input.baselineAverage + 3 * input.baselineStdDev) {
    score += 45;
    reasons.push("Current error volume is more than three standard deviations above baseline.");
  } else if (input.currentErrorCount > input.baselineAverage + 2 * input.baselineStdDev) {
    score += 32;
    reasons.push("Current error volume is more than two standard deviations above baseline.");
  } else if (input.currentErrorCount > input.baselineAverage + input.baselineStdDev) {
    score += 18;
    reasons.push("Current error volume is above normal baseline.");
  }

  if (input.matchingErrors >= 5) {
    score += 18;
    reasons.push("Splunk found repeated matching errors.");
  }
  if (criticalRoute) {
    score += 15;
    reasons.push("Failure affects checkout, payment, auth, or user data flow.");
  }
  if (input.event?.environment === "production") {
    score += 10;
    reasons.push("Event occurred in production.");
  }
  if (!input.event?.release) {
    score += 5;
    reasons.push("No release marker was present to narrow regression scope.");
  }

  const bounded = Math.min(100, score);
  const level = bounded >= 85 ? "critical" : bounded >= 70 ? "high" : bounded >= 45 ? "warning" : "normal";
  return { score: bounded, level, reasons };
}
