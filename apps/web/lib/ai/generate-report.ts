import { buildResolverPrompt } from "./prompt";
import type { AnomalyScore, SdkBreadcrumb, SplunkInvestigationContext, TalosErrorEvent, TalosTriageReport } from "../types";

function incidentId(eventId: string) {
  return `INC-${eventId.slice(0, 8).toUpperCase()}`;
}

function backstageDiagnosis(event: TalosErrorEvent) {
  if (event.service.includes("catalog")) {
    return {
      rootCause: "The catalog processor received an entity without a complete metadata block during provider refresh, so validation crashed before the entity could be rejected safely.",
      explanation: "Add a defensive metadata guard in the catalog entity processor and route invalid entities to a rejected-entity queue with enough context for the owning team.",
      code: `if (!entity?.metadata?.name || !entity?.kind) {\n  logger.warn({ entityRef, provider }, "Skipping invalid catalog entity");\n  return { status: "rejected", reason: "missing metadata" };\n}\n\nawait catalogProcessor.process(entity);`,
      steps: [
        "Guard catalog entity metadata before processor access.",
        "Record rejected entity refs with provider and location metadata.",
        "Replay the affected provider refresh after deploying the guard."
      ]
    };
  }

  if (event.service.includes("scaffolder")) {
    return {
      rootCause: "The scaffolder task broker exhausted its persistence connection pool while dispatching template tasks, leaving queued task state unavailable.",
      explanation: "Bound scaffolder task concurrency and fail fast when the persistence pool is saturated instead of letting template dispatches pile up.",
      code: `if (taskQueue.depth > MAX_SCAFFOLDER_QUEUE_DEPTH) {\n  throw new Error("Scaffolder queue is saturated; retry after backpressure clears");\n}\n\nawait taskBroker.dispatch(task, { timeoutMs: 10_000 });`,
      steps: [
        "Add queue-depth backpressure before dispatching template tasks.",
        "Increase database pool telemetry around task broker writes.",
        "Add a regression test for saturated scaffolder persistence."
      ]
    };
  }

  if (event.service.includes("techdocs")) {
    return {
      rootCause: "The TechDocs build process exceeded the generation timeout and memory envelope while running the mkdocs subprocess.",
      explanation: "Enforce preflight limits for docs input size and move long-running generation into a bounded worker with explicit timeout handling.",
      code: `const result = await techdocsGenerator.generate(entity, {\n  timeoutMs: 120_000,\n  maxOutputBytes: 500 * 1024 * 1024,\n});\n\nif (result.status === "timeout") {\n  await markDocsBuildFailed(entityRef, "generation timeout");\n}`,
      steps: [
        "Add preflight checks for large TechDocs builds.",
        "Record timeout and output-size metrics for each entity ref.",
        "Retry failed builds after adjusting worker limits."
      ]
    };
  }

  if (event.service.includes("auth")) {
    return {
      rootCause: "The GitHub auth provider rejected OAuth token exchange because the configured client id did not match the active callback flow.",
      explanation: "Validate provider credentials at startup and block deploys when GitHub OAuth configuration is missing or mismatched.",
      code: `if (!config.getOptionalString("auth.providers.github.production.clientId")) {\n  throw new Error("GitHub auth clientId is required for production");\n}\n\nawait githubAuthProvider.verifyConfiguration();`,
      steps: [
        "Validate GitHub auth provider credentials during backend startup.",
        "Rotate or correct the OAuth client id and secret in deployment config.",
        "Add an auth smoke test for the production callback route."
      ]
    };
  }

  if (event.service.includes("search")) {
    return {
      rootCause: "The search backend routed queries to an unhealthy Elasticsearch index where all shards failed.",
      explanation: "Check Elasticsearch cluster health before query fanout and serve a degraded response while the index recovers.",
      code: `const health = await searchEngine.health("backstage_search");\nif (health.status === "red") {\n  return { results: [], degraded: true, reason: "search index unavailable" };\n}\n\nreturn searchEngine.query(request);`,
      steps: [
        "Add a search index health check before query execution.",
        "Alert on shard failures before the search route crosses its SLO.",
        "Reindex the affected Backstage search documents."
      ]
    };
  }

  return {
    rootCause: "The resolver found a runtime exception correlated with structured SDK breadcrumbs and Splunk telemetry.",
    explanation: "Add a guard around the failing backend boundary and emit structured telemetry before retrying or rejecting the operation.",
    code: undefined,
    steps: [
      "Guard the failing Backstage backend boundary.",
      "Add a regression test for the captured route and error shape.",
      "Deploy with release metadata so Talos can correlate future regressions."
    ]
  };
}

function synthesizeReport(input: {
  event: TalosErrorEvent;
  splunkContext: SplunkInvestigationContext;
  anomaly: AnomalyScore;
}): TalosTriageReport {
  const { event, splunkContext, anomaly } = input;
  const priority = anomaly.level === "critical" ? "critical" : anomaly.level === "high" ? "high" : anomaly.level === "warning" ? "medium" : "low";
  const diagnosis = backstageDiagnosis(event);
  return {
    incidentId: incidentId(event.eventId),
    eventId: event.eventId,
    priority,
    status: "triaged",
    trigger: `${event.error.name}: ${event.error.message}`,
    summary: `${event.service} crashed on ${event.route || "an unknown route"} after the SDK captured ${event.error.name}. Splunk context shows ${splunkContext.stats.matchingErrors} matching errors.`,
    rootCause: diagnosis.rootCause,
    timeSinceEvent: "just now",
    affectedService: event.service,
    affectedRoute: event.route,
    anomaly,
    evidence: [
      { message: `SDK captured ${event.error.name}: ${event.error.message}`, source: "sdk", timestamp: event.timestamp },
      ...event.breadcrumbs.slice(-2).map((breadcrumb: SdkBreadcrumb) => ({ message: breadcrumb.message, source: "sdk" as const, timestamp: breadcrumb.timestamp })),
      ...splunkContext.events.slice(0, 2).map((row) => ({ message: row.message, source: "splunk" as const, timestamp: row.timestamp }))
    ],
    timeline: [
      ...event.breadcrumbs.map((breadcrumb: SdkBreadcrumb) => ({ timestamp: breadcrumb.timestamp, title: breadcrumb.category, detail: breadcrumb.message })),
      ...splunkContext.timeline.map((row) => ({ timestamp: row.timestamp, title: row.source, detail: row.message }))
    ].slice(0, 8),
    proposedFix: {
      explanation: diagnosis.explanation,
      code: diagnosis.code,
      steps: diagnosis.steps
    },
    splunk: {
      mode: splunkContext.mode,
      queryUsed: splunkContext.queryUsed,
      eventCount: splunkContext.stats.totalEvents
    },
    confidence: splunkContext.mode === "simulation" ? 88 : 91,
    createdAt: new Date().toISOString()
  };
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
    return synthesizeReport(input);
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: buildResolverPrompt(input) }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      return synthesizeReport(input);
    }

    const json = await response.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(text) as TalosTriageReport;
  } catch {
    return synthesizeReport(input);
  }
}
