/** Sample data until the real API is connected (Step 6). */
import { addDays, startOfDay } from "@/utils/date";

import { Application, PendingAck } from "./types";

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000);
const daysAgo = (d: number) => new Date(now - d * 86_400_000);
const today = startOfDay(new Date());

/** New maintenance jobs assigned to me, waiting for me to acknowledge */
export const PENDING_ACKS: PendingAck[] = [
  {
    id: "WO-1031",
    title: "Kitchen exhaust fan not working",
    facility: "mess",
    location: "Mess Hall A · Kitchen",
    assignedBy: "Hendra Wijaya",
    assignedAt: hoursAgo(1),
    dueAt: today,
    priority: "urgent",
  },
  {
    id: "WO-1029",
    title: "AC not cooling in bedroom",
    facility: "house",
    location: "House B-12",
    assignedBy: "Dewi Anggraini",
    assignedAt: hoursAgo(5),
    dueAt: addDays(today, 1),
    priority: "high",
  },
  {
    id: "WO-1027",
    title: "Leaking tap in bathroom",
    facility: "house",
    location: "House C-04",
    assignedBy: "Dewi Anggraini",
    assignedAt: daysAgo(1),
    dueAt: addDays(today, 2),
    priority: "medium",
  },
  {
    id: "WO-1024",
    title: "Replace dining area lights",
    facility: "mess",
    location: "Mess Hall B · Dining area",
    assignedBy: "Hendra Wijaya",
    assignedAt: daysAgo(2),
    dueAt: addDays(today, 5),
    priority: "low",
  },
];

/** Requests I sent that are still waiting for approval */
export const APPLICATIONS: Application[] = [
  {
    id: "APP-221",
    type: "Material request",
    title: "AC refrigerant R32, 1 can",
    submittedAt: hoursAgo(20),
    step: 1,
    waitingFor: "Housing supervisor",
  },
  {
    id: "APP-218",
    type: "Contractor access",
    title: "Pest control at Mess Hall A",
    submittedAt: daysAgo(4),
    step: 1,
    waitingFor: "Mess manager",
  },
  {
    id: "APP-215",
    type: "Key replacement",
    title: "Front door key, House A-07",
    submittedAt: hoursAgo(2),
    step: 0,
    waitingFor: "Housing supervisor",
  },
];
