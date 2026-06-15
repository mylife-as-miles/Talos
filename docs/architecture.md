# Talos Architecture

Talos closes the loop from runtime crash capture to fix-ready triage.

```mermaid
flowchart TD
    A[Developer App] --> B[@mylife-as-miles/talos-sdk]
    B --> C[Next.js Ingest API]
    C --> D[Splunk HEC]
    D --> E[Splunk Index]
    E --> F[Splunk Alert or Manual Resolver Trigger]
    F --> G[Talos Headless Resolver]
    G --> H[Splunk MCP Server]
    H --> E
    G --> I[AI RCA Engine]
    I --> J[Triage Report]
    J --> K[Talos Dashboard]
    J --> L[Discord or Slack]
```

## Components

- `packages/sdk`: captures structured runtime errors and sends them to the ingest relay.
- `apps/web/app/api/ingest`: validates project key, stores events, forwards to HEC when live telemetry credentials are configured.
- `apps/web/app/api/agent`: fetches an event, investigates Splunk context, scores anomaly severity, generates a report, and notifies chat.
- `apps/web/lib/splunk`: MCP-first investigation with REST fallback.
- `apps/web/lib/ai`: strict BYOK/provider-backed report generation.
- `apps/web/lib/client/indexed-db`: browser IndexedDB persistence for real ingested events and reports.
- `apps/web/lib/store`: server relay cache for API routes that cannot access browser IndexedDB.

## Data Policy

Talos does not generate incident records for the dashboard. The Live Data Console syncs real SDK intake and resolver output into browser IndexedDB.
