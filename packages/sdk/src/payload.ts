import { getBreadcrumbs } from "./breadcrumbs.js";
import type { TalosCaptureContext, TalosErrorEvent, TalosInitConfig, TalosLevel, TalosUser } from "./types.js";

export function createEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

export function normalizeError(input: unknown) {
  if (input instanceof Error) {
    return {
      name: input.name || "Error",
      message: input.message || "Unknown error",
      stack: input.stack
    };
  }

  return {
    name: "Error",
    message: typeof input === "string" ? input : JSON.stringify(input)
  };
}

export function createRuntime(config: TalosInitConfig) {
  const isBrowser = typeof window !== "undefined";
  const nav = isBrowser ? window.navigator : undefined;
  const nodeVersion =
    typeof process !== "undefined" && "version" in process ? process.version : undefined;

  return {
    language: "typescript" as const,
    framework: config.framework,
    nodeVersion,
    userAgent: nav?.userAgent,
    url: isBrowser ? window.location.href : undefined
  };
}

export function createErrorEvent(input: {
  config: TalosInitConfig;
  error: unknown;
  context?: TalosCaptureContext;
  user?: TalosUser;
}): TalosErrorEvent {
  return {
    type: "talos.error",
    eventId: createEventId(),
    timestamp: new Date().toISOString(),
    projectKey: input.config.projectKey,
    service: input.config.service,
    environment: input.config.environment,
    release: input.config.release,
    route: input.context?.route,
    runtime: createRuntime(input.config),
    error: normalizeError(input.error),
    breadcrumbs: getBreadcrumbs(),
    user: input.user ?? (input.context?.userId ? { id: input.context.userId } : undefined),
    tags: input.context?.tags,
    extra: input.context?.extra
  };
}

export function createMessageEvent(message: string, level: TalosLevel, config: TalosInitConfig, user?: TalosUser) {
  return createErrorEvent({
    config,
    user,
    error: {
      name: `Talos${level[0]?.toUpperCase()}${level.slice(1)}Message`,
      message
    }
  });
}
