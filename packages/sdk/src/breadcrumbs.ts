import type { TalosBreadcrumb } from "./types.js";

const MAX_BREADCRUMBS = 25;
type StoredBreadcrumb = {
  timestamp: string;
  category: string;
  message: string;
  data?: Record<string, unknown>;
};

let breadcrumbs: StoredBreadcrumb[] = [];

/**
 * Adds a new breadcrumb to the stored log.
 * Limits the total breadcrumbs stored to MAX_BREADCRUMBS.
 * 
 * @param input Breadcrumb data containing category, message, and optional extra metadata.
 */
export function addBreadcrumb(input: TalosBreadcrumb) {
  const breadcrumb = {
    ...input,
    timestamp: input.timestamp ?? new Date().toISOString()
  };
  breadcrumbs = [...breadcrumbs, breadcrumb].slice(-MAX_BREADCRUMBS);
}

/**
 * Retrieves a copy of the current breadcrumb stack.
 * 
 * @returns An array of stored breadcrumbs.
 */
export function getBreadcrumbs() {
  return breadcrumbs.map((breadcrumb) => ({ ...breadcrumb }));
}

/**
 * Resets the breadcrumb history to an empty stack.
 */
export function clearBreadcrumbs() {
  breadcrumbs = [];
}
