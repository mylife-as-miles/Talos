import { getBreadcrumbs } from "./breadcrumbs.js";
import type { TalosCaptureContext, TalosErrorEvent, TalosInitConfig, TalosLevel, TalosUser } from "./types.js";

/**
 * Generates a unique event identifier.
 * Uses cryptographically secure randomUUID if available, falling back to a timestamp-based ID.
 * 
 * @returns A unique event ID string.
 */
export function createEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Normalizes an unknown error value into a standard error representation structure.
 * 
 * @param input The caught exception or error value to normalize.
 * @returns A structured object containing error name, message, and optional stack trace.
 */
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

/**
 * Creates details about the current execution runtime (e.g. browser context vs Node environment).
 * 
 * @param config The current Talos configuration.
 * @returns An object containing language, framework, Node version, user agent, and URL if applicable.
 */
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

/**
 * Constructs a structured TalosErrorEvent payload from caught error inputs and contexts.
 * 
 * @param input Config, caught error, custom context tags, and user context.
 * @returns A structured TalosErrorEvent object ready for transport ingestion.
 */
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

/**
 * Constructs a custom log message event by packaging it as a structured error event.
 * 
 * @param message The message content.
 * @param level Log severity level.
 * @param config Current Talos initialization config.
 * @param user Optional logged-in user context.
 * @returns A structured TalosErrorEvent containing the custom log message.
 */
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
