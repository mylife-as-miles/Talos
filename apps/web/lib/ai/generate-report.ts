import { buildResolverPrompt } from "./prompt";
import type { AnomalyScore, SplunkInvestigationContext, TalosErrorEvent, TalosTriageReport } from "../types";

function incidentId(eventId: string) {
  return `INC-${eventId.slice(0, 8).toUpperCase()}`;
}

function coercePriority(value: unknown): TalosTriageReport["priority"] {
  return value === "critical" || value === "high" || value === "medium" || value === "low" ? value : "medium";
}

function coerceStatus(value: unknown): TalosTriageReport["status"] {
  return value === "open" || value === "triaged" || value === "resolved" ? value : "triaged";
}

function coerceConfidence(value: unknown) {
  const confidence = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(confidence)) return 60;
  return Math.max(0, Math.min(100, Math.round(confidence)));
}

function coerceArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizeReport(input: {
  parsed: Partial<TalosTriageReport>;
  event: TalosErrorEvent;
  splunkContext: SplunkInvestigationContext;
  anomaly: AnomalyScore;
}): TalosTriageReport {
  const { parsed, event, splunkContext, anomaly } = input;
  return {
    incidentId: parsed.incidentId || incidentId(event.eventId),
    eventId: event.eventId,
    priority: coercePriority(parsed.priority),
    status: coerceStatus(parsed.status),
    trigger: parsed.trigger || `${event.error.name}: ${event.error.message}`,
    summary:
      parsed.summary ||
      `${event.service} emitted ${event.error.name} on ${event.route || "an unknown route"}; Splunk returned ${splunkContext.stats.matchingErrors} matching events.`,
    rootCause: parsed.rootCause || "Root cause was not determined by the AI provider from the supplied evidence.",
    timeSinceEvent: parsed.timeSinceEvent || "just now",
    affectedService: parsed.affectedService || event.service,
    affectedRoute: parsed.affectedRoute || event.route,
    anomaly: parsed.anomaly || anomaly,
    evidence: coerceArray<TalosTriageReport["evidence"][number]>(parsed.evidence),
    timeline: coerceArray<TalosTriageReport["timeline"][number]>(parsed.timeline),
    proposedFix: {
      explanation: parsed.proposedFix?.explanation || "No fix recommendation was returned by the AI provider.",
      code: parsed.proposedFix?.code,
      steps: coerceArray<string>(parsed.proposedFix?.steps)
    },
    splunk: {
      mode: splunkContext.mode,
      queryUsed: splunkContext.queryUsed,
      eventCount: splunkContext.stats.totalEvents
    },
    confidence: coerceConfidence(parsed.confidence),
    createdAt: parsed.createdAt || new Date().toISOString()
  };
}

function extractGeminiJson(json: any) {
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Gemini did not return a JSON report.");
  }
  return JSON.parse(text) as Partial<TalosTriageReport>;
}

export async function generateTriageReport(input: {
  event: TalosErrorEvent;
  splunkContext: SplunkInvestigationContext;
  anomaly: AnomalyScore;
  ai?: {
    provider?: string;
    apiKey?: string;
    model?: string;
  };
}): Promise<TalosTriageReport> {
  const provider = input.ai?.provider || process.env.AI_PROVIDER;
  const apiKey = input.ai?.apiKey || process.env.GEMINI_API_KEY;
  const model = input.ai?.model || process.env.GEMINI_MODEL || "gemini-3-flash-preview";

  if (provider !== "gemini" || !apiKey || apiKey === "replace_with_key") {
    throw new Error("A Gemini BYOK key is required to generate real AI triage reports.");
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildResolverPrompt(input) }] }],
      generationConfig: { responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini report generation failed with ${response.status}.`);
  }

  const parsed = extractGeminiJson(await response.json());
  return normalizeReport({ parsed, event: input.event, splunkContext: input.splunkContext, anomaly: input.anomaly });
}
