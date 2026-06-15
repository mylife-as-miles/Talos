import { createErrorEvent, createMessageEvent } from "./payload.js";
import { sendEvent } from "./transport.js";
import type { TalosCaptureContext, TalosInitConfig, TalosLevel, TalosUser } from "./types.js";

/**
 * Prepares and sends an error event payload using the provided configuration and runtime user/context.
 * Throws an error if the Talos configuration is undefined.
 * 
 * @param input Destructured inputs including config, the error itself, custom context overrides, and current user.
 * @returns The constructed and sent TalosEvent payload.
 */
export async function captureExceptionWithConfig(input: {
  config?: TalosInitConfig;
  error: unknown;
  context?: TalosCaptureContext;
  user?: TalosUser;
}) {
  if (!input.config) {
    throw new Error("Talos.init must be called before captureException.");
  }

  const event = createErrorEvent(input as Required<typeof input>);
  await sendEvent(input.config.ingestUrl ?? "/api/ingest", event);
  return event;
}

/**
 * Prepares and sends a custom message event payload using the provided configuration and user context.
 * Throws an error if the Talos configuration is undefined.
 * 
 * @param input Destructured inputs including config, message text, severity level, and user.
 * @returns The constructed and sent TalosEvent payload.
 */
export async function captureMessageWithConfig(input: {
  config?: TalosInitConfig;
  message: string;
  level: TalosLevel;
  user?: TalosUser;
}) {
  if (!input.config) {
    throw new Error("Talos.init must be called before captureMessage.");
  }

  const event = createMessageEvent(input.message, input.level, input.config, input.user);
  await sendEvent(input.config.ingestUrl ?? "/api/ingest", event);
  return event;
}
