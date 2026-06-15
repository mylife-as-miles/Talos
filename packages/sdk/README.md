# @mylife-as-miles/talos-sdk

Local TypeScript SDK for Talos runtime error capture.

```ts
import { Talos } from "@mylife-as-miles/talos-sdk";

Talos.init({
  projectKey: "demo_project_key",
  environment: "production",
  release: "v1.0.0",
  service: "catalog-service",
  ingestUrl: "/api/ingest"
});

Talos.addBreadcrumb({
  category: "ui",
  message: "Catalog provider refresh started"
});

await Talos.captureException(new TypeError("Cannot read properties of undefined (reading 'email')"), {
  route: "/api/catalog/entities",
  userId: "demo-user-123",
  tags: {
    feature: "entity-processing",
    region: "demo"
  }
});
```

The browser SDK sends only to the Talos ingest relay. It never sends directly to Splunk HEC.
