/** Turn a list into the one-line "what matters most" text shown on the Home cards. */
import { daysFromToday } from "@/utils/date";

import { Application, PendingAck } from "./types";

export function pendingDetail(items: PendingAck[]) {
  if (items.length === 0) return "You're all caught up";
  const urgent = items.filter((i) => i.priority === "urgent").length;
  const dueToday = items.filter((i) => daysFromToday(i.dueAt) <= 0).length;
  const parts = [
    urgent && `${urgent} urgent`,
    dueToday && `${dueToday} due today`,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "New work assigned to you";
}

export function applicationsDetail(items: Application[]) {
  if (items.length === 0) return "Nothing waiting for approval";
  const slow = items.filter((i) => -daysFromToday(i.submittedAt) >= 3).length;
  return slow ? `${slow} waiting over 3 days` : "Waiting for approval";
}
