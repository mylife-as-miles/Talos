# Devpost Submission Draft

## Project Name

Talos

## Tagline

Self-healing AI developer operations for Splunk.

## Problem

Production crashes are expensive because detection is only the first step. Developers still need to search logs, correlate user actions, estimate severity, and write a fix plan before work can begin.

## Solution

Talos gives developers an SDK that captures runtime failures as AI-readable operational events, sends them into Splunk through HEC, then uses a headless AI resolver connected to Splunk MCP to investigate context, diagnose root cause, and generate fix-ready triage reports.

## How It Uses Splunk

- Splunk HEC receives structured Talos SDK error events.
- Splunk MCP Server is the primary investigation interface.
- Splunk REST search is a fallback for local or constrained demos.
- The dashboard shows which investigation mode was used.

## How It Uses AI

Talos Resolver acts like a senior SRE and TypeScript backend engineer. It uses SDK context, Splunk context, runtime breadcrumbs, and anomaly scoring to produce strict JSON reports with priority, root cause, evidence, timeline, and proposed fix.

## Architecture

```text
SDK -> Next.js ingest -> Splunk HEC -> Splunk MCP -> AI Resolver -> Dashboard + Discord
```

## Impact

Talos moves teams beyond passive observability. Instead of stopping at alerts, it closes the loop from crash detection to resolution guidance.

## Challenges

The hardest part was designing an MVP that honors Splunk MCP as the primary architecture while staying reliable for a local hackathon demo. Mock mode keeps the video flow stable without hiding the intended production integration.

## What's Next

- Deeper Splunk MCP tool-call support
- Supabase/Postgres storage
- Pull request patch generation
- Remediation approval workflows
- Release regression correlation

## Best Track

Platform & Developer Experience.
