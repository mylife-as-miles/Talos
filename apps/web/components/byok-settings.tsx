"use client";

import { CheckCircle2, KeyRound, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, Button, Card, CardHeader } from "./ui";

const STORAGE = {
  provider: "talos:ai-provider",
  geminiKey: "talos:gemini-api-key",
  geminiModel: "talos:gemini-model"
};

export type BrowserByokSettings = {
  provider: "gemini";
  apiKey: string;
  model: string;
};

export function readBrowserByokSettings(): BrowserByokSettings | null {
  if (typeof window === "undefined") return null;

  const provider = window.localStorage.getItem(STORAGE.provider) || "gemini";
  const apiKey = window.localStorage.getItem(STORAGE.geminiKey) || "";
  const model = window.localStorage.getItem(STORAGE.geminiModel) || "gemini-3-flash-preview";

  if (provider !== "gemini" || !apiKey.trim()) return null;
  return { provider, apiKey: apiKey.trim(), model: model.trim() || "gemini-3-flash-preview" };
}

export function ByokSettings({ envConfigured }: { envConfigured: boolean }) {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gemini-3-flash-preview");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = readBrowserByokSettings();
    if (settings) {
      setApiKey(settings.apiKey);
      setModel(settings.model);
      setSaved(true);
    }
  }, []);

  function save() {
    window.localStorage.setItem(STORAGE.provider, "gemini");
    window.localStorage.setItem(STORAGE.geminiKey, apiKey.trim());
    window.localStorage.setItem(STORAGE.geminiModel, model.trim() || "gemini-3-flash-preview");
    setSaved(Boolean(apiKey.trim()));
  }

  function clear() {
    window.localStorage.removeItem(STORAGE.provider);
    window.localStorage.removeItem(STORAGE.geminiKey);
    window.localStorage.removeItem(STORAGE.geminiModel);
    setApiKey("");
    setModel("gemini-3-flash-preview");
    setSaved(false);
  }

  return (
    <Card className="talos-fade-up talos-stagger-2 mt-5 overflow-hidden">
      <CardHeader
        title="BYOK AI Resolver"
        detail="Bring your own Gemini key for live AI reports. Stored only in this browser for the demo."
        action={<Badge tone={saved || envConfigured ? "ok" : "warn"}>{saved ? "Browser key saved" : envConfigured ? "Env key configured" : "Key required"}</Badge>}
      />
      <div className="grid gap-5 p-5 lg:grid-cols-[1.05fr_.95fr]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[.08em] text-black">Provider</span>
            <div className="border-[3px] border-black bg-[#d8ff2f] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000]">Gemini</div>
          </label>
          <label className="block">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[.08em] text-black">Gemini API Key</span>
            <input
              value={apiKey}
              onChange={(event) => {
                setApiKey(event.target.value);
                setSaved(false);
              }}
              type="password"
              placeholder="Paste your Gemini API key"
              className="w-full border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-[4px_4px_0_#000] outline-none focus:bg-[#fffce2] focus:ring-4 focus:ring-[#ff00d7]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[.08em] text-black">Model</span>
            <input
              value={model}
              onChange={(event) => {
                setModel(event.target.value);
                setSaved(false);
              }}
              className="w-full border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-[4px_4px_0_#000] outline-none focus:bg-[#fffce2] focus:ring-4 focus:ring-[#00c2c8]"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={save} disabled={!apiKey.trim()}>
              <KeyRound size={16} /> Save Browser Key
            </Button>
            <Button type="button" onClick={clear} className="bg-[#ff4d5a]">
              <Trash2 size={16} /> Clear Key
            </Button>
          </div>
        </div>
        <div className="border-[3px] border-black bg-[#ffe100] p-4 text-sm font-bold leading-6 shadow-[6px_6px_0_#000]">
          <div className="mb-3 inline-flex items-center gap-2 border-2 border-black bg-black px-2 py-1 text-xs font-black uppercase text-white">
            <CheckCircle2 size={14} /> Demo behavior
          </div>
          <p>
            When you run the resolver, Talos sends this key directly to the Node API route for that request only. If no browser key or env key exists, Talos uses the deterministic mock report so the demo still works.
          </p>
          <p className="mt-3">
            Do not put this key in the SDK. Browser apps should send errors to Talos ingest only; server routes handle AI and Splunk calls.
          </p>
        </div>
      </div>
    </Card>
  );
}
