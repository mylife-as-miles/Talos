import type { TalosErrorEvent } from "@mylife-as-miles/talos-sdk";

export type { TalosErrorEvent };

export type SdkBreadcrumb = {
  timestamp: string;
  category: string;
  message: string;
  data?: Record<string, unknown>;
};

export type SplunkEvent = {
  timestamp: string;
  service: string;
  route?: string;
  message: string;
  severity?: string;
  raw?: Record<string, unknown>;
};

export type SplunkInvestigationContext = {
  mode: "mcp" | "rest" | "mock";
  queryUsed: string;
  events: SplunkEvent[];
  timeline: {
    timestamp: string;
    message: string;
    source: string;
  }[];
  stats: {
    totalEvents: number;
    matchingErrors: number;
    affectedRoutes: string[];
    affectedServices: string[];
  };
};

export type AnomalyScore = {
  score: number;
  level: "normal" | "warning" | "high" | "critical";
  reasons: string[];
};

export type TalosTriageReport = {
  incidentId: string;
  eventId: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "open" | "triaged" | "resolved";
  trigger: string;
  summary: string;
  rootCause: string;
  timeSinceEvent: string;
  affectedService: string;
  affectedRoute?: string;
  anomaly: {
    score: number;
    level: string;
    reasons: string[];
  };
  evidence: {
    message: string;
    source: "sdk" | "splunk" | "agent";
    timestamp?: string;
  }[];
  timeline: {
    timestamp: string;
    title: string;
    detail: string;
  }[];
  proposedFix: {
    explanation: string;
    code?: string;
    steps: string[];
  };
  splunk: {
    mode: "mcp" | "rest" | "mock";
    queryUsed: string;
    eventCount: number;
  };
  confidence: number;
  createdAt: string;
};
