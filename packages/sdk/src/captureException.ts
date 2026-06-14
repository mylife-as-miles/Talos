import { createErrorEvent, createMessageEvent } from "./payload.js";
import { sendEvent } from "./transport.js";
import type { TalosCaptureContext, TalosInitConfig, TalosLevel, TalosUser } from "./types.js";

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
