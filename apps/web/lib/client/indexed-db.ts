"use client";

import type { TalosErrorEvent, TalosTriageReport } from "@/lib/types";

const DB_NAME = "talos-real-data";
const DB_VERSION = 1;
const EVENTS_STORE = "events";
const REPORTS_STORE = "reports";

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(EVENTS_STORE)) {
        const events = db.createObjectStore(EVENTS_STORE, { keyPath: "eventId" });
        events.createIndex("timestamp", "timestamp");
        events.createIndex("service", "service");
      }
      if (!db.objectStoreNames.contains(REPORTS_STORE)) {
        const reports = db.createObjectStore(REPORTS_STORE, { keyPath: "incidentId" });
        reports.createIndex("createdAt", "createdAt");
        reports.createIndex("eventId", "eventId");
      }
    };

    request.onerror = () => reject(request.error || new Error("Failed to open Talos IndexedDB."));
    request.onsuccess = () => resolve(request.result);
  });
}

async function withStore<T>(
  storeName: typeof EVENTS_STORE | typeof REPORTS_STORE,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T> | void
) {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const request = callback(store);

    transaction.onerror = () => reject(transaction.error || new Error(`IndexedDB ${storeName} transaction failed.`));
    transaction.oncomplete = () => {
      db.close();
      resolve(request ? request.result : (undefined as T));
    };
  });
}

async function getAll<T>(storeName: typeof EVENTS_STORE | typeof REPORTS_STORE) {
  const rows = await withStore<T[]>(storeName, "readonly", (store) => store.getAll() as IDBRequest<T[]>);
  return rows || [];
}

export async function putIndexedEvent(event: TalosErrorEvent) {
  await withStore(EVENTS_STORE, "readwrite", (store) => store.put(event));
  return event;
}

export async function putIndexedEvents(events: TalosErrorEvent[]) {
  await withStore(EVENTS_STORE, "readwrite", (store) => {
    for (const event of events) store.put(event);
  });
  return events;
}

export async function listIndexedEvents() {
  const events = await getAll<TalosErrorEvent>(EVENTS_STORE);
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function putIndexedReport(report: TalosTriageReport) {
  await withStore(REPORTS_STORE, "readwrite", (store) => store.put(report));
  return report;
}

export async function putIndexedReports(reports: TalosTriageReport[]) {
  await withStore(REPORTS_STORE, "readwrite", (store) => {
    for (const report of reports) store.put(report);
  });
  return reports;
}

export async function listIndexedReports() {
  const reports = await getAll<TalosTriageReport>(REPORTS_STORE);
  return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getLatestIndexedEvent() {
  const [event] = await listIndexedEvents();
  return event;
}

export async function getLatestIndexedReport() {
  const [report] = await listIndexedReports();
  return report;
}
