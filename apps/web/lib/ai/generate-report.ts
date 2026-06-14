import { buildResolverPrompt } from "./prompt";
import type { AnomalyScore, SplunkInvestigationContext, TalosErrorEvent, TalosTriageReport } from "../types";

function incidentId(eventId: string) {
  return `INC-${eventId.slice(0, 8).toUpperCase()}`;
}

function fallbackReport(input: {
  event: TalosErrorEvent;
  splunkContext: SplunkInvestigationContext;
  anomaly: AnomalyScore;
}): TalosTriageReport {
  const { event, splunkContext, anomaly } = input;
  const priority = anomaly.level === "critical" ? "critical" : anomaly.level === "high" ? "high" : anomaly.level === "warning" ? "medium" : "low";
  const missingEmail = event.error.message.includes("email");
  return {
    incidentId: incidentId(event.eventId),
    eventId: event.eventId,
    priority,
    status: "triaged",
    trigger: `${event.error.name}: ${event.error.message}`,
    summary: `${event.service} crashed on ${event.route || "an unknown route"} after the SDK captured ${event.error.name}. Splunk context shows ${splunkContext.stats.matchingErrors} matching errors.`,
    rootCause: missingEmail
      ? "Checkout code assumes a user object exists before accessing user.email during payment execution."
      : "The resolver found a runtime exception correlated with recent structured SDK breadcrumbs and Splunk events.",
    timeSinceEvent: "just now",
    affectedService: event.service,
    affectedRoute: event.route,
    anomaly,
    evidence: [
      { message: `SDK captured ${event.error.name}: ${event.error.message}`, source: "sdk", timestamp: event.timestamp },
      ...event.breadcrumbs.slice(-2).map((breadcrumb) => ({ message: breadcrumb.message, source: "sdk" as const, timestamp: breadcrumb.timestamp })),
      ...splunkContext.events.slice(0, 2).map((row) => ({ message: row.message, source: "splunk" as const, timestamp: row.timestamp }))
    ],
    timeline: [
      ...event.breadcrumbs.map((breadcrumb) => ({ timestamp: breadcrumb.timestamp, title: breadcrumb.category, detail: breadcrumb.message })),
      ...splunkContext.timeline.map((row) => ({ timestamp: row.timestamp, title: row.source, detail: row.message }))
    ].slice(0, 8),
    proposedFix: {
      explanation: "Guard the authenticated user before payment execution and return a typed 401 response when user context is absent.",
      code: `if (!user?.email) {\n  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n}\n\nawait processPayment({ userEmail: user.email, cart });`,
      steps: [
        "Add a user guard before reading user.email.",
        "Add a regression test for anonymous checkout submission.",
        "Deploy with release metadata so Talos can correlate future regressions."
      ]
    },
    splunk: {
      mode: splunkContext.mode,
      queryUsed: splunkContext.queryUsed,
      eventCount: splunkContext.stats.totalEvents
    },
    confidence: missingEmail ? 91 : 78,
    createdAt: new Date().toISOString()
  };
}

export async function generateTriageReport(input: {
  event: TalosErrorEvent;
  splunkContext: SplunkInvestigationContext;
  anomaly: AnomalyScore;
}): Promise<TalosTriageReport> {
  if (process.env.AI_PROVIDER !== "gemini" || !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "replace_with_key") {
    return fallbackReport(input);
  }

  try {
    const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: buildResolverPrompt(input) }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      return fallbackReport(input);
    }

    const json = await response.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(text) as TalosTriageReport;
  } catch {
    return fallbackReport(input);
  }
}
