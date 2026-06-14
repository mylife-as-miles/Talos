import type { TalosBreadcrumb } from "./types.js";

const MAX_BREADCRUMBS = 25;
type StoredBreadcrumb = {
  timestamp: string;
  category: string;
  message: string;
  data?: Record<string, unknown>;
};

let breadcrumbs: StoredBreadcrumb[] = [];

export function addBreadcrumb(input: TalosBreadcrumb) {
  const breadcrumb = {
    ...input,
    timestamp: input.timestamp ?? new Date().toISOString()
  };
  breadcrumbs = [...breadcrumbs, breadcrumb].slice(-MAX_BREADCRUMBS);
}

export function getBreadcrumbs() {
  return breadcrumbs.map((breadcrumb) => ({ ...breadcrumb }));
}

export function clearBreadcrumbs() {
  breadcrumbs = [];
}
