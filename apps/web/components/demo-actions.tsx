"use client";

import { Database, Loader2, RadioTower, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { readBrowserByokSettings, readBrowserSplunkSettings, readBrowserWebhookSettings } from "./byok-settings";
import { Button } from "./ui";
import {
  getLatestIndexedEvent,
  getLatestIndexedReport,
  putIndexedEvent,
  putIndexedEvents,
  putIndexedReport,
  putIndexedReports
} from "@/lib/client/indexed-db";
import type { TalosErrorEvent, TalosTriageReport } from "@/lib/types";

async function readJsonResponse(response: Response) {
  const text = await response.text();
  if (!text.trim()) {
    return { ok: false, error: `Talos API returned an empty response (${response.status}).` };
  }

  try {
    return JSON.parse(text) as Record<string, any>;
  } catch {
    return { ok: false, error: text.slice(0, 240) || `Talos API returned a non-JSON response (${response.status}).` };
  }
}

export function DemoActions() {
  const router = useRouter();
  const [eventId, setEventId] = useState<string>();
  const [incidentId, setIncidentId] = useState<string>();
  const [busy, setBusy] = useState<string>();
  const [message, setMessage] = useState<string>("No real SDK event synced yet");

  async function syncRealData() {
    setBusy("sync");
    setMessage("Syncing real Talos intake into IndexedDB...");
    try {
      const [eventsResponse, reportsResponse] = await Promise.all([fetch("/api/events"), fetch("/api/reports")]);
      const eventsJson = await readJsonResponse(eventsResponse);
      const reportsJson = await readJsonResponse(reportsResponse);
      if (!eventsResponse.ok) throw new Error(eventsJson.error || "Event sync failed");
      if (!reportsResponse.ok) throw new Error(reportsJson.error || "Report sync failed");

      const events = (eventsJson.events || []) as TalosErrorEvent[];
      const reports = (reportsJson.reports || []) as TalosTriageReport[];
      await putIndexedEvents(events);
      await putIndexedReports(reports);

      const latestEvent = events[0] || (await getLatestIndexedEvent());
      const latestReport = reports[0] || (await getLatestIndexedReport());
      setEventId(latestEvent?.eventId);
      setIncidentId(latestReport?.incidentId);
      setMessage(`IndexedDB synced ${events.length} events and ${reports.length} reports`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "IndexedDB sync failed");
    } finally {
      setBusy(undefined);
    }
  }

  async function runResolver() {
    setBusy("agent");
    const byok = readBrowserByokSettings();
    const splunk = readBrowserSplunkSettings();
    const webhooks = readBrowserWebhookSettings();

    setMessage(byok ? "Running resolver with your BYOK Gemini key..." : "Add your Gemini BYOK key in Settings before resolving real data.");
    try {
      const event = eventId ? undefined : await getLatestIndexedEvent();
      if (!eventId && !event) {
        throw new Error("No real SDK event found. Send an event to /api/ingest, then sync real data.");
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };

      if (byok) {
        headers["x-talos-ai-provider"] = byok.provider;
        headers["x-talos-ai-key"] = byok.apiKey;
        headers["x-talos-ai-model"] = byok.model;
      }
      if (splunk) {
        if (splunk.hecUrl) headers["x-talos-hec-url"] = splunk.hecUrl;
        if (splunk.hecToken) headers["x-talos-hec-token"] = splunk.hecToken;
        if (splunk.mcpMode) headers["x-talos-mcp-mode"] = splunk.mcpMode;
        if (splunk.mcpUrl) headers["x-talos-mcp-url"] = splunk.mcpUrl;
      }
      if (webhooks) {
        if (webhooks.discordWebhook) headers["x-talos-discord-webhook"] = webhooks.discordWebhook;
        if (webhooks.slackWebhook) headers["x-talos-slack-webhook"] = webhooks.slackWebhook;
      }

      const response = await fetch("/api/agent", {
        method: "POST",
        headers,
        body: JSON.stringify(eventId ? { eventId } : { event })
      });
      const json = await readJsonResponse(response);
      if (!response.ok) throw new Error(json.error || "Resolver failed");
      const report = json.report as TalosTriageReport;
      await putIndexedReport(report);
      if (event) await putIndexedEvent(event);
      setIncidentId(report.incidentId);
      setMessage(`Report ${report.incidentId} generated`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Resolver failed");
    } finally {
      setBusy(undefined);
    }
  }

  async function notifyLatest() {
    setBusy("notify");
    setMessage("Sending Discord notification...");
    try {
      const report = incidentId ? undefined : await getLatestIndexedReport();
      if (!incidentId && !report) {
        throw new Error("No report found in IndexedDB. Run the resolver first.");
      }

      const webhooks = readBrowserWebhookSettings();
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (webhooks) {
        if (webhooks.discordWebhook) headers["x-talos-discord-webhook"] = webhooks.discordWebhook;
        if (webhooks.slackWebhook) headers["x-talos-slack-webhook"] = webhooks.slackWebhook;
      }

      const response = await fetch("/api/notify", {
        method: "POST",
        headers,
        body: JSON.stringify(incidentId ? { incidentId } : { report })
      });
      const json = await readJsonResponse(response);
      if (!response.ok) throw new Error(json.error || "Notification failed");
      setMessage(`Notification sent for ${incidentId}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Notification failed");
    } finally {
      setBusy(undefined);
    }
  }

  return (
    <div className="talos-fade-up talos-stagger-2 flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Button onClick={syncRealData} disabled={Boolean(busy)} className="talos-btn-glow">
          {busy === "sync" ? <Loader2 size={15} className="talos-spinner" /> : <Database size={15} />} Sync Real Data
        </Button>
        <Button onClick={runResolver} disabled={Boolean(busy)}>
          {busy === "agent" ? <Loader2 size={15} className="talos-spinner" /> : <RadioTower size={15} />} Run Resolver
        </Button>
        <Button onClick={notifyLatest} disabled={!incidentId || Boolean(busy)}>
          {busy === "notify" ? <Loader2 size={15} className="talos-spinner" /> : <Send size={15} />} Send Notification
        </Button>
      </div>
      <div className="text-xs text-talos-muted transition-opacity duration-200">{message}</div>
    </div>
  );
}
