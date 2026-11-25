/** Sample data until the real API is connected (Step 6). */
import { addDays, startOfDay } from "@/utils/date";

import { Application, PendingAck } from "./types";

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000);
const daysAgo = (d: number) => new Date(now - d * 86_400_000);
const today = startOfDay(new Date());

export const PENDING_ACKS: PendingAck[] = [
  {
    id: "WO-1031",
    title: "Replace hydraulic hose",
    location: "Press Line 2",
    assignedBy: "Hendra Wijaya",
    assignedAt: hoursAgo(1),
    dueAt: today,
    priority: "urgent",
  },
  {
    id: "WO-1029",
    title: "Lubricate conveyor bearings",
    location: "Workshop Bay 3",
    assignedBy: "Dewi Anggraini",
    assignedAt: hoursAgo(5),
    dueAt: addDays(today, 1),
    priority: "high",
  },
  {
    id: "WO-1027",
    title: "Monthly fire extinguisher check",
    location: "Building A",
    assignedBy: "Hendra Wijaya",
    assignedAt: daysAgo(1),
    dueAt: addDays(today, 4),
    priority: "medium",
  },
];

export const APPLICATIONS: Application[] = [
  {
    id: "APP-221",
    type: "Spare part request",
    title: "V-belt B-52 × 4",
    submittedAt: hoursAgo(20),
    step: 1,
    waitingFor: "Supervisor",
  },
  {
    id: "APP-218",
    type: "Work permit",
    title: "Hot work: welding at Bay 5",
    submittedAt: daysAgo(4),
    step: 1,
    waitingFor: "Safety officer",
  },
  {
    id: "APP-215",
    type: "Overtime",
    title: "Saturday, 4 hours",
    submittedAt: hoursAgo(2),
    step: 0,
    waitingFor: "Supervisor",
  },
];
