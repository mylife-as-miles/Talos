export type { SplunkEvent, SplunkInvestigationContext } from "../types";

export interface SplunkInvestigator {
  investigateError(input: {
    eventId: string;
    service: string;
    route?: string;
    errorMessage: string;
    timeWindow: string;
  }): Promise<import("../types").SplunkInvestigationContext>;
}
