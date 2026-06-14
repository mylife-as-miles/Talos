"use client";

import { Play, RadioTower, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui";

export function DemoActions() {
  const [eventId, setEventId] = useState<string>();
  const [incidentId, setIncidentId] = useState<string>();
  const [busy, setBusy] = useState<string>();

  async function triggerCrash() {
    setBusy("crash");
    const response = await fetch("/api/simulate-crash", { method: "POST" });
    const json = await response.json();
    setEventId(json.event.eventId);
    setBusy(undefined);
  }

  async function runResolver() {
    setBusy("agent");
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId })
    });
    const json = await response.json();
    setIncidentId(json.report.incidentId);
    setBusy(undefined);
  }

  async function notifyLatest() {
    setBusy("notify");
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incidentId })
    });
    setBusy(undefined);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={triggerCrash} disabled={busy === "crash"}>
        <Play size={15} /> Trigger Demo Crash
      </Button>
      <Button onClick={runResolver} disabled={busy === "agent"}>
        <RadioTower size={15} /> Run Headless Resolver
      </Button>
      <Button onClick={notifyLatest} disabled={!incidentId || busy === "notify"}>
        <Send size={15} /> Send Discord Notification
      </Button>
      <div className="text-xs leading-9 text-talos-muted">
        {eventId ? `Event ${eventId.slice(0, 8)} captured` : "No demo event yet"}
        {incidentId ? ` · Report ${incidentId}` : ""}
      </div>
    </div>
  );
}
