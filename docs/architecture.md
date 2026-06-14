# Talos Architecture

Talos closes the loop from runtime crash capture to fix-ready triage.

```mermaid
flowchart TD
    A[Developer App] --> B[@talos/sdk]
    B --> C[Next.js Ingest API]
    C --> D[Splunk HEC]
    D --> E[Splunk Index]
    E --> F[Splunk Alert or Demo Trigger]
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
- `apps/web/app/api/ingest`: validates project key, stores events, forwards to HEC outside mock mode.
- `apps/web/app/api/agent`: fetches an event, investigates Splunk context, scores anomaly severity, generates a report, and notifies chat.
- `apps/web/lib/splunk`: MCP-first investigation with REST fallback and mock demo context.
- `apps/web/lib/ai`: strict report generation with deterministic fallback when no provider key is configured.
- `apps/web/lib/store`: JSON file-backed MVP storage.

## Demo Reliability

Mock mode is a first-class local demo mode. It preserves the product flow while clearly labeling `Mode: MOCK` in reports and dashboard surfaces.
