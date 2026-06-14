import type { SplunkInvestigationContext, TalosErrorEvent } from "./types";

export function demoCheckoutEvent(): TalosErrorEvent {
  const timestamp = new Date().toISOString();
  return {
    type: "talos.error",
    eventId: crypto.randomUUID(),
    timestamp,
    projectKey: process.env.TALOS_PROJECT_KEY || "demo_project_key",
    service: "checkout-service",
    environment: "production",
    release: "v1.0.0",
    route: "/api/checkout",
    runtime: {
      language: "typescript",
      framework: "Next.js",
      nodeVersion: process.version,
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/demo`
    },
    error: {
      name: "TypeError",
      message: "Cannot read properties of undefined (reading 'email')",
      stack: "TypeError: Cannot read properties of undefined (reading 'email')\n    at POST (apps/web/app/api/checkout/route.ts:42:29)\n    at processPayment (apps/web/lib/payments.ts:18:12)"
    },
    breadcrumbs: [
      { timestamp, category: "ui", message: "User opened checkout page" },
      { timestamp, category: "checkout", message: "Payment method selected", data: { method: "card" } },
      { timestamp, category: "checkout", message: "Submit checkout clicked" },
      { timestamp, category: "api", message: "Checkout handler attempted to access user.email" }
    ],
    user: { id: "demo-user-123" },
    tags: { feature: "checkout", region: "demo" },
    extra: { cartValue: 128.42, paymentIntentState: "created_without_user_guard" }
  };
}

export function mockSplunkContext(event: TalosErrorEvent): SplunkInvestigationContext {
  const query = `index=${process.env.SPLUNK_INDEX || "main"} sourcetype=${process.env.SPLUNK_SOURCETYPE || "talos:error"} service=${event.service} route=${event.route || "*"} "${event.error.message}" earliest=-15m`;
  return {
    mode: "mock",
    queryUsed: query,
    events: [
      { timestamp: event.timestamp, service: event.service, route: event.route, message: event.error.message, severity: "error" },
      { timestamp: new Date(Date.now() - 80_000).toISOString(), service: event.service, route: event.route, message: "Checkout handler attempted payment with missing user context", severity: "error" },
      { timestamp: new Date(Date.now() - 140_000).toISOString(), service: event.service, route: event.route, message: "Repeated TypeError reading user.email after submit", severity: "error" }
    ],
    timeline: [
      { timestamp: new Date(Date.now() - 150_000).toISOString(), message: "First matching checkout TypeError seen in Splunk", source: "splunk" },
      { timestamp: new Date(Date.now() - 85_000).toISOString(), message: "Repeated matching failures crossed demo threshold", source: "splunk" },
      { timestamp: event.timestamp, message: "SDK captured structured crash payload", source: "sdk" }
    ],
    stats: {
      totalEvents: 17,
      matchingErrors: 9,
      affectedRoutes: [event.route || "/api/checkout"],
      affectedServices: [event.service]
    }
  };
}
