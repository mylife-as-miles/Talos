export type TalosLevel = "debug" | "info" | "warning" | "error" | "fatal";

export type TalosInitConfig = {
  projectKey: string;
  environment: string;
  service: string;
  release?: string;
  ingestUrl?: string;
  framework?: string;
};

export type TalosBreadcrumb = {
  timestamp?: string;
  category: string;
  message: string;
  data?: Record<string, unknown>;
};

export type TalosUser = {
  id?: string;
  email?: string;
};

export type TalosCaptureContext = {
  route?: string;
  userId?: string;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
};

export type TalosErrorEvent = {
  type: "talos.error";
  eventId: string;
  timestamp: string;
  projectKey: string;
  service: string;
  environment: string;
  release?: string;
  route?: string;
  runtime: {
    language: "typescript" | "javascript";
    framework?: string;
    nodeVersion?: string;
    userAgent?: string;
    url?: string;
  };
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  breadcrumbs: {
    timestamp: string;
    category: string;
    message: string;
    data?: Record<string, unknown>;
  }[];
  user?: TalosUser;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
};
