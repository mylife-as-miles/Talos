# 3-Minute Devpost Demo Script

## 0:00 Problem

Developers already capture logs, but incident response still stalls at manual investigation. Runtime errors land in observability tools, then engineers still need to connect stack traces, logs, user actions, and a concrete fix.

## 0:20 Show SDK

Show `@mylife-as-miles/talos-sdk` initialization and breadcrumbs. Explain that Talos captures AI-readable operational events with service, route, release, user, tags, stack trace, and runtime context.

## 0:45 Send Real SDK Event

Run a real app with the SDK installed and trigger/capture an exception:

```text
await Talos.captureException(error, { route: "/api/catalog/entities" })
```

## 1:10 Show Splunk Event and IndexedDB Sync

Open the dashboard. Show the runtime intake timeline and click Sync Real Data so the browser stores the ingested event in IndexedDB.

## 1:35 Run Headless Resolver

Click Run Resolver. Talos queries Splunk MCP first, uses REST fallback when needed, and sends the real context to the BYOK Gemini provider.

## 2:05 Show AI Report

Open the incident detail. Show priority, root cause, evidence, timeline, Splunk query, anomaly score, and code-level proposed fix.

## 2:35 Show Discord or Slack Notification

Click Send Discord Notification. Show the concise incident report in the team channel.

## 2:50 Close With Impact

Talos turns Splunk from observability into agentic developer operations: crash capture to investigation to fix-ready triage in one loop.
