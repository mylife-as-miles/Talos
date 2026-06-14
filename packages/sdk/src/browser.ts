import { addBreadcrumb } from "./breadcrumbs.js";
import { captureExceptionWithConfig, captureMessageWithConfig } from "./captureException.js";
import type { TalosBreadcrumb, TalosCaptureContext, TalosInitConfig, TalosLevel, TalosUser } from "./types.js";

let config: TalosInitConfig | undefined;
let user: TalosUser | undefined;

export const Talos = {
  init(input: TalosInitConfig) {
    config = input;
  },
  addBreadcrumb(input: TalosBreadcrumb) {
    addBreadcrumb(input);
  },
  setUser(input: TalosUser) {
    user = input;
  },
  clearUser() {
    user = undefined;
  },
  captureException(error: unknown, context?: TalosCaptureContext) {
    return captureExceptionWithConfig({ config, error, context, user });
  },
  captureMessage(message: string, level: TalosLevel = "info") {
    return captureMessageWithConfig({ config, message, level, user });
  }
};

export type * from "./types.js";
