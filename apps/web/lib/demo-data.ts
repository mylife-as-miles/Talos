import type { SplunkInvestigationContext, TalosErrorEvent } from "./types";

/* ── Spotify Backstage–style simulation scenarios ────────────────────── */

const scenarios = [
  {
    service: "catalog-service",
    route: "/api/catalog/entities",
    error: { name: "TypeError", message: "Cannot read properties of undefined (reading 'metadata')" },
    stack: "TypeError: Cannot read properties of undefined (reading 'metadata')\n    at processCatalogEntity (packages/backend/src/plugins/catalog.ts:87:22)\n    at CatalogBuilder.build (packages/backend/src/catalog/CatalogBuilder.ts:142:9)",
    breadcrumbs: [
      { category: "discovery", message: "Entity provider refresh triggered" },
      { category: "catalog", message: "Processing 847 entities from GitHub discovery" },
      { category: "catalog", message: "Entity validation started for org component" },
      { category: "api", message: "Catalog handler failed reading entity metadata field" }
    ],
    splunkMessages: [
      "Catalog entity processor failed on undefined metadata block",
      "Repeated TypeError in entity validation pipeline after provider refresh",
      "Entity ingestion backpressure exceeded threshold"
    ],
    user: { id: "backstage-scheduler" },
    tags: { feature: "entity-processing", region: "us-east-1" },
    extra: { entityCount: 847, providerType: "github-discovery" }
  },
  {
    service: "scaffolder-backend",
    route: "/api/scaffolder/v2/tasks",
    error: { name: "ConnectionError", message: "ECONNREFUSED 127.0.0.1:5432 - PostgreSQL connection pool exhausted" },
    stack: "ConnectionError: ECONNREFUSED 127.0.0.1:5432 - PostgreSQL connection pool exhausted\n    at ScaffolderTaskBroker.dispatch (plugins/scaffolder-backend/src/scaffolder/tasks/TaskBroker.ts:63:11)\n    at executeTemplate (plugins/scaffolder-backend/src/scaffolder/actions/builtin/fetch/template.ts:28:5)",
    breadcrumbs: [
      { category: "ui", message: "Developer opened software template wizard" },
      { category: "scaffolder", message: "Template 'create-react-app' selected" },
      { category: "scaffolder", message: "Task dispatched to scaffolder broker" },
      { category: "db", message: "Connection pool timeout after 30s waiting for available connection" }
    ],
    splunkMessages: [
      "PostgreSQL connection pool exhausted during scaffolder task dispatch",
      "Scaffolder broker failed to persist task state",
      "Cascading timeout across 12 queued template tasks"
    ],
    user: { id: "dev-team-lead-42" },
    tags: { feature: "software-templates", region: "eu-west-1" },
    extra: { templateName: "create-react-app", queueDepth: 12 }
  },
  {
    service: "techdocs-publisher",
    route: "/api/techdocs/sync",
    error: { name: "TimeoutError", message: "TechDocs build timed out after 120000ms waiting for mkdocs subprocess" },
    stack: "TimeoutError: TechDocs build timed out after 120000ms waiting for mkdocs subprocess\n    at TechDocsGenerator.generate (plugins/techdocs-node/src/stages/generate/techdocs.ts:95:13)\n    at publishAndSync (plugins/techdocs-backend/src/DocsBuilder.ts:44:7)",
    breadcrumbs: [
      { category: "techdocs", message: "Docs sync triggered for component backstage/catalog" },
      { category: "techdocs", message: "mkdocs build started in container" },
      { category: "techdocs", message: "Build output exceeded 500MB memory limit" },
      { category: "system", message: "Subprocess watchdog killed mkdocs after 120s" }
    ],
    splunkMessages: [
      "TechDocs mkdocs subprocess exceeded 120s timeout",
      "Memory pressure detected in techdocs-publisher pod",
      "Docs build failure rate spiked to 34% in last 15 minutes"
    ],
    user: { id: "ci-pipeline-bot" },
    tags: { feature: "techdocs-generation", region: "us-west-2" },
    extra: { componentRef: "backstage/catalog", buildDuration: 120000 }
  },
  {
    service: "auth-resolver",
    route: "/api/auth/github/handler/frame",
    error: { name: "AuthenticationError", message: "GitHub OAuth token exchange failed: invalid_client_id" },
    stack: "AuthenticationError: GitHub OAuth token exchange failed: invalid_client_id\n    at GithubAuthProvider.handler (plugins/auth-backend/src/providers/github/provider.ts:112:15)\n    at OAuthAdapter.frameHandler (plugins/auth-backend/src/lib/oauth/OAuthAdapter.ts:67:22)",
    breadcrumbs: [
      { category: "auth", message: "User initiated GitHub OAuth sign-in flow" },
      { category: "auth", message: "Authorization code received from GitHub" },
      { category: "auth", message: "Token exchange POST to github.com/login/oauth/access_token" },
      { category: "api", message: "GitHub responded 401: invalid_client_id" }
    ],
    splunkMessages: [
      "GitHub OAuth token exchange returned invalid_client_id",
      "Auth provider github failed for 23 users in last 5 minutes",
      "Session creation rate dropped to zero after OAuth misconfiguration"
    ],
    user: { id: "oauth-callback" },
    tags: { feature: "github-auth", region: "us-east-1" },
    extra: { provider: "github", failedUsers: 23 }
  },
  {
    service: "search-indexer",
    route: "/api/search/query",
    error: { name: "ElasticsearchError", message: "search_phase_execution_exception: all shards failed [index: backstage_search]" },
    stack: "ElasticsearchError: search_phase_execution_exception: all shards failed [index: backstage_search]\n    at ElasticSearchSearchEngine.query (plugins/search-backend-module-elasticsearch/src/engines/ElasticSearchSearchEngine.ts:198:11)\n    at SearchRouter.handleQuery (plugins/search-backend/src/service/SearchEngine.ts:54:18)",
    breadcrumbs: [
      { category: "search", message: "Full-text search query received" },
      { category: "search", message: "Query routed to Elasticsearch engine" },
      { category: "elasticsearch", message: "Cluster health changed from green to red" },
      { category: "api", message: "All shards failed for index backstage_search" }
    ],
    splunkMessages: [
      "Elasticsearch cluster health degraded to red",
      "Search query execution failed across all shards",
      "Search availability dropped below SLO threshold"
    ],
    user: { id: "platform-user-789" },
    tags: { feature: "search-indexing", region: "eu-central-1" },
    extra: { indexName: "backstage_search", clusterHealth: "red" }
  }
] as const;

function pickScenario() {
  return scenarios[Math.floor(Math.random() * scenarios.length)];
}

export function simulatedBackstageEvent(): TalosErrorEvent {
  const timestamp = new Date().toISOString();
  const s = pickScenario();
  return {
    type: "talos.error",
    eventId: crypto.randomUUID(),
    timestamp,
    projectKey: process.env.TALOS_PROJECT_KEY || "demo_project_key",
    service: s.service,
    environment: "production",
    release: "v2.4.1",
    route: s.route,
    runtime: {
      language: "typescript",
      framework: "Backstage",
      nodeVersion: process.version,
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`
    },
    error: {
      name: s.error.name,
      message: s.error.message,
      stack: s.stack
    },
    breadcrumbs: s.breadcrumbs.map((b) => ({
      timestamp,
      category: b.category,
      message: b.message
    })),
    user: s.user,
    tags: s.tags,
    extra: s.extra
  };
}

export function simulateSplunkContext(event: TalosErrorEvent): SplunkInvestigationContext {
  const s = scenarios.find((sc) => sc.service === event.service) || scenarios[0];
  const query = `index=${process.env.SPLUNK_INDEX || "main"} sourcetype=${process.env.SPLUNK_SOURCETYPE || "talos:error"} service=${event.service} route=${event.route || "*"} "${event.error.message}" earliest=-15m`;
  return {
    mode: "simulation",
    queryUsed: query,
    events: [
      { timestamp: event.timestamp, service: event.service, route: event.route, message: event.error.message, severity: "error" },
      { timestamp: new Date(Date.now() - 80_000).toISOString(), service: event.service, route: event.route, message: s.splunkMessages[1], severity: "error" },
      { timestamp: new Date(Date.now() - 140_000).toISOString(), service: event.service, route: event.route, message: s.splunkMessages[2], severity: "error" }
    ],
    timeline: [
      { timestamp: new Date(Date.now() - 150_000).toISOString(), message: `First matching ${event.service} error detected in Splunk`, source: "splunk" },
      { timestamp: new Date(Date.now() - 85_000).toISOString(), message: "Correlated failures exceeded automated alert threshold", source: "splunk" },
      { timestamp: event.timestamp, message: "SDK captured structured crash payload", source: "sdk" }
    ],
    stats: {
      totalEvents: 14 + Math.floor(Math.random() * 20),
      matchingErrors: 6 + Math.floor(Math.random() * 12),
      affectedRoutes: [event.route || "/api/unknown"],
      affectedServices: [event.service]
    }
  };
}
