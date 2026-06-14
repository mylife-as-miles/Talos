import type { TalosErrorEvent } from "../types";
import { readJsonArray, writeJsonArray } from "./json-store";

const FILE = "events.json";

export async function saveEvent(event: TalosErrorEvent) {
  const events = await readJsonArray<TalosErrorEvent>(FILE);
  const next = [event, ...events.filter((row) => row.eventId !== event.eventId)].slice(0, 100);
  await writeJsonArray(FILE, next);
  return event;
}

export async function getEvent(eventId?: string) {
  const events = await listEvents();
  return eventId ? events.find((event) => event.eventId === eventId) : events[0];
}

export async function getLatestEvent() {
  return getEvent();
}

export async function listEvents() {
  return readJsonArray<TalosErrorEvent>(FILE);
}
