# @talos/sdk

Local TypeScript SDK for Talos runtime error capture.

```ts
import { Talos } from "@talos/sdk";

Talos.init({
  projectKey: "demo_project_key",
  environment: "production",
  release: "v1.0.0",
  service: "checkout-service",
  ingestUrl: "/api/ingest"
});

Talos.addBreadcrumb({
  category: "ui",
  message: "User opened checkout page"
});

await Talos.captureException(new TypeError("Cannot read properties of undefined (reading 'email')"), {
  route: "/api/checkout",
  userId: "demo-user-123",
  tags: {
    feature: "checkout",
    region: "demo"
  }
});
```

The browser SDK sends only to the Talos ingest relay. It never sends directly to Splunk HEC.
