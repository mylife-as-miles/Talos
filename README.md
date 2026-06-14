# Talos

Talos is a self-healing AI developer operations system for Splunk.

It captures runtime crashes through `@talos/sdk`, sends structured events into Splunk through HEC, investigates them through Splunk MCP, and generates fix-ready triage reports for engineering teams.

## Why Splunk?

Splunk is the operational source of truth for production logs, alerts, and incident history. Talos keeps that center of gravity: SDK events flow into Splunk HEC, while the resolver uses Splunk MCP first for agentic investigation. REST search is available as a fallback, and mock mode keeps the hackathon demo reliable without a live Splunk instance.

## Architecture

```text
Developer app -> @talos/sdk -> Next.js ingest API -> Splunk HEC
Splunk -> Splunk MCP Server -> Talos Resolver -> AI RCA report
Report -> Talos Dashboard -> Discord/Slack
```

## Features

- Local npm-style SDK package: `@talos/sdk`
- Browser-safe ingest relay that never exposes Splunk HEC tokens
- Next.js App Router dashboard
- File-backed local MVP store
- Splunk HEC sender
- MCP-first Splunk investigation adapter with REST and mock fallback
- Headless AI resolver with strict report schema and deterministic mock fallback
- Discord notification output and optional Slack webhook
- Devpost-ready demo flow

## Tech Stack

TypeScript, pnpm workspaces, Next.js App Router, Tailwind CSS, lucide-react, Splunk HEC, Splunk MCP Server, Gemini-compatible report generation, and local JSON storage.

## Quickstart

```bash
corepack pnpm install
copy .env.example apps\web\.env.local
corepack pnpm dev
```

Open `http://localhost:3000/dashboard`.

## Environment Variables

Copy `.env.example` into `apps/web/.env.local`. Mock mode is enabled by default:

```env
TALOS_MOCK_MODE=true
TALOS_PROJECT_KEY=demo_project_key
```

No secrets are required for the default demo path.

## Running Locally

```bash
corepack pnpm install
corepack pnpm --filter @talos/sdk build
corepack pnpm --filter @talos/web build
corepack pnpm dev
```

## Running With Mock Mode

Keep `TALOS_MOCK_MODE=true`. Use `/demo` or `/dashboard`:

1. Trigger Demo Crash
2. Run Headless Resolver
3. Open the generated incident report
4. Send Discord notification if a webhook is configured

## Running With Splunk HEC

Set:

```env
TALOS_MOCK_MODE=false
SPLUNK_HEC_URL=https://localhost:8088
SPLUNK_HEC_TOKEN=...
SPLUNK_INDEX=main
SPLUNK_SOURCE=talos-sdk
SPLUNK_SOURCETYPE=talos:error
```

`/api/ingest` stores the event locally, then forwards it to `/services/collector/event`.

## Running With Splunk MCP

Clone is included under `infra/splunk-mcp-server`. Start the MCP server using its upstream instructions, then set:

```env
SPLUNK_MCP_MODE=enabled
SPLUNK_MCP_SERVER_URL=http://localhost:8000
```

Talos tries MCP first, REST second, and mock context only when mock mode is enabled.

## SDK Usage

```ts
import { Talos } from "@talos/sdk";

Talos.init({
  projectKey: "demo_project_key",
  environment: "production",
  release: "v1.0.0",
  service: "checkout-service",
  ingestUrl: "/api/ingest"
});

Talos.addBreadcrumb({
  category: "ui",
  message: "User opened checkout page"
});

await Talos.captureException(error, {
  route: "/api/checkout",
  userId: "demo-user-123",
  tags: {
    feature: "checkout",
    region: "demo"
  }
});
```

## Demo Flow

The demo simulates a checkout crash:

```text
TypeError: Cannot read properties of undefined (reading 'email')
Cause: missing user guard before payment execution
```

Talos stores the event, investigates mock Splunk context, scores anomaly severity, generates a report, and displays it in the dashboard.

## Screenshots

Add screenshots after recording the Devpost walkthrough:

- Dashboard
- Incident detail
- Demo flow
- Discord notification

## Production TODO

- Replace JSON file store with Supabase or Postgres.
- Add auth and project scoping.
- Add real MCP tool-call protocol support for the selected Splunk MCP deployment mode.
- Add workflow engine primitives for remediation approvals.

## Attribution

Reference repositories live under `references/` for architecture inspiration only. The official Splunk MCP Server is cloned under `infra/splunk-mcp-server` as the integration layer reference. Talos code in this repository is reimplemented in TypeScript.

## License

MIT.
