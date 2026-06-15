"use client";

import { Loader2, Play, RadioTower, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { readBrowserByokSettings, readBrowserSplunkSettings, readBrowserWebhookSettings } from "./byok-settings";
import { Button } from "./ui";

export function DemoActions() {
  const router = useRouter();
  const [eventId, setEventId] = useState<string>();
  const [incidentId, setIncidentId] = useState<string>();
  const [busy, setBusy] = useState<string>();
  const [message, setMessage] = useState<string>("No simulation event yet");

  async function triggerCrash() {
    setBusy("crash");
    setMessage("Simulating crash, capturing payload...");
    try {
      const splunk = readBrowserSplunkSettings();
      const headers: Record<string, string> = {};
      if (splunk?.hecUrl) headers["x-talos-hec-url"] = splunk.hecUrl;
      if (splunk?.hecToken) headers["x-talos-hec-token"] = splunk.hecToken;
      if (splunk?.index) headers["x-talos-splunk-index"] = splunk.index;

      const response = await fetch("/api/simulate-crash", { 
        method: "POST",
        headers 
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Simulation failed");
      setEventId(json.event.eventId);
      setMessage(`Event ${json.event.eventId.slice(0, 8)} captured`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Simulation failed");
    } finally {
      setBusy(undefined);
    }
  }

  async function runResolver() {
    setBusy("agent");
    const byok = readBrowserByokSettings();
    const splunk = readBrowserSplunkSettings();
    const webhooks = readBrowserWebhookSettings();

    setMessage(byok ? "Running resolver with your BYOK Gemini key..." : "Running resolver with local analysis engine...");
    try {
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
        body: JSON.stringify({ eventId })
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Resolver failed");
      setIncidentId(json.report.incidentId);
      setMessage(`Report ${json.report.incidentId} generated`);
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
        body: JSON.stringify({ incidentId })
      });
      const json = await response.json();
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
        <Button onClick={triggerCrash} disabled={Boolean(busy)} className="talos-btn-glow">
          {busy === "crash" ? <Loader2 size={15} className="talos-spinner" /> : <Play size={15} />} Simulate Incident
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
