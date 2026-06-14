import type { TalosErrorEvent } from "../types";

export function validateTalosEvent(input: unknown): asserts input is TalosErrorEvent {
  const event = input as Partial<TalosErrorEvent>;
  if (event.type !== "talos.error" || !event.eventId || !event.projectKey || !event.service || !event.error?.message) {
    throw new Error("Invalid Talos event payload.");
  }

  const expected = process.env.TALOS_PROJECT_KEY || "demo_project_key";
  if (event.projectKey !== expected) {
    throw new Error("Invalid Talos project key.");
  }
}
