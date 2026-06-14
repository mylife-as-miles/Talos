"use client";

import { Loader2, Play, RadioTower, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui";

export function DemoActions() {
  const router = useRouter();
  const [eventId, setEventId] = useState<string>();
  const [incidentId, setIncidentId] = useState<string>();
  const [busy, setBusy] = useState<string>();
  const [message, setMessage] = useState<string>("No demo event yet");

  async function triggerCrash() {
    setBusy("crash");
    setMessage("Capturing structured crash payload...");
    try {
      const response = await fetch("/api/simulate-crash", { method: "POST" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Crash simulation failed");
      setEventId(json.event.eventId);
      setMessage(`Event ${json.event.eventId.slice(0, 8)} captured`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Crash simulation failed");
    } finally {
      setBusy(undefined);
    }
  }

  async function runResolver() {
    setBusy("agent");
    setMessage("Running headless Splunk MCP resolver...");
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          {busy === "crash" ? <Loader2 size={15} className="talos-spinner" /> : <Play size={15} />} Trigger Demo Crash
        </Button>
        <Button onClick={runResolver} disabled={Boolean(busy)}>
          {busy === "agent" ? <Loader2 size={15} className="talos-spinner" /> : <RadioTower size={15} />} Run Headless Resolver
        </Button>
        <Button onClick={notifyLatest} disabled={!incidentId || Boolean(busy)}>
          {busy === "notify" ? <Loader2 size={15} className="talos-spinner" /> : <Send size={15} />} Send Discord Notification
        </Button>
      </div>
      <div className="text-xs text-talos-muted transition-opacity duration-200">{message}</div>
    </div>
  );
}
