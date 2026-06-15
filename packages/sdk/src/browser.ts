import { addBreadcrumb } from "./breadcrumbs.js";
import { captureExceptionWithConfig, captureMessageWithConfig } from "./captureException.js";
import type { TalosBreadcrumb, TalosCaptureContext, TalosInitConfig, TalosLevel, TalosUser } from "./types.js";

let config: TalosInitConfig | undefined;
let user: TalosUser | undefined;

/**
 * Browser-facing client SDK for Talos error tracking.
 * Provides APIs to initialize the SDK, manage user context, log breadcrumbs,
 * and report errors or custom log messages.
 */
export const Talos = {
  /**
   * Initializes the Talos SDK with global configuration options.
   * 
   * @param input Configuration options including ingestion URL, environment, etc.
   */
  init(input: TalosInitConfig) {
    config = input;
  },
  /**
   * Records a manual breadcrumb event to help reconstruct execution flow leading to a crash.
   * 
   * @param input Breadcrumb data containing category, message, level, and optional metadata.
   */
  addBreadcrumb(input: TalosBreadcrumb) {
    addBreadcrumb(input);
  },
  /**
   * Sets the current logged-in user context to be attached to all subsequent reports.
   * 
   * @param input User information such as ID, email, username, and custom tags.
   */
  setUser(input: TalosUser) {
    user = input;
  },
  /**
   * Clears the current user context. Useful on user logout.
   */
  clearUser() {
    user = undefined;
  },
  /**
   * Captures and reports an exception to the Talos ingestion server.
   * 
   * @param error The error object or exception value to capture.
   * @param context Additional capture context including extra tags, metadata, and level override.
   * @returns A promise resolving to the generated event payload or null if config is missing.
   */
  captureException(error: unknown, context?: TalosCaptureContext) {
    return captureExceptionWithConfig({ config, error, context, user });
  },
  /**
   * Captures and reports a custom message or log statement.
   * 
   * @param message The message string to log.
   * @param level Severity level of the log message (defaults to "info").
   * @returns A promise resolving to the generated event payload or null if config is missing.
   */
  captureMessage(message: string, level: TalosLevel = "info") {
    return captureMessageWithConfig({ config, message, level, user });
  }
};

export type * from "./types.js";
