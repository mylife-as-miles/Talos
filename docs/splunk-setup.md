# Splunk Setup

## Create a HEC Token

1. In Splunk, open Settings.
2. Go to Data Inputs.
3. Select HTTP Event Collector.
4. Create a token named `talos-sdk`.
5. Set the target index, usually `main` for demos.
6. Enable the token and copy it into `SPLUNK_HEC_TOKEN`.

## Configure Source Metadata

Use these defaults:

```env
SPLUNK_INDEX=main
SPLUNK_SOURCE=talos-sdk
SPLUNK_SOURCETYPE=talos:error
```

Talos sends HEC payloads shaped as:

```json
{
  "event": {},
  "sourcetype": "talos:error",
  "source": "talos-sdk",
  "index": "main",
  "host": "catalog-service"
}
```

## Run Splunk MCP Server

The official server is cloned into:

```text
infra/splunk-mcp-server
```

Follow the upstream README in that directory, then set:

```env
SPLUNK_MCP_MODE=enabled
SPLUNK_MCP_SERVER_URL=http://localhost:8000
```

## Configure REST Fallback

```env
SPLUNK_BASE_URL=https://localhost:8089
SPLUNK_TOKEN=replace_with_token
```

REST is used only when MCP is unavailable and live Splunk search credentials are configured.

## Test Ingestion

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d @real-talos-event.json
```

When live Splunk ingestion is configured, verify events with:

```spl
index=main sourcetype=talos:error service=catalog-service
```

## Test Resolver

```bash
curl -X POST http://localhost:3000/api/agent ^
  -H "Content-Type: application/json" ^
  -d "{\"eventId\":\"YOUR_EVENT_ID\"}"
```

The response includes `report.splunk.mode`, `queryUsed`, and the generated triage report.
