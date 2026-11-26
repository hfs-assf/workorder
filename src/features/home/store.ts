/**
 * Shared Home data: the pending acknowledgements and outstanding applications.
 * Home (counts) and the two list screens read the SAME data, so acknowledging
 * on the list screen updates the count on Home immediately.
 * (Same small-store pattern as toast and theme-mode. The API replaces the mock data in Step 6.)
 */
import { useSyncExternalStore } from "react";

import { APPLICATIONS, PENDING_ACKS } from "./mock-data";
import { Application, PendingAck } from "./types";

let pending: PendingAck[] = PENDING_ACKS;
let applications: Application[] = APPLICATIONS;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Remove from the list. Returns the item so it can be restored (Undo). */
export function acknowledge(id: string) {
  const item = pending.find((p) => p.id === id);
  pending = pending.filter((p) => p.id !== id);
  emit();
  return item;
}

/** Put an acknowledged item back (Undo), in its original position. */
export function restorePending(item: PendingAck) {
  const order = PENDING_ACKS.map((p) => p.id);
  pending = [...pending, item].sort(
    (a, b) => order.indexOf(a.id) - order.indexOf(b.id),
  );
  emit();
}

export const usePendingAcks = () =>
  useSyncExternalStore(
    subscribe,
    () => pending,
    () => pending,
  );
export const useApplications = () =>
  useSyncExternalStore(
    subscribe,
    () => applications,
    () => applications,
  );
