export type Priority = "low" | "medium" | "high" | "urgent";

/** Which kind of building the job is in */
export type Facility = "house" | "mess";

/** A work order assigned to me that I haven't confirmed yet */
export type PendingAck = {
  id: string; // WO-1031
  title: string;
  facility: Facility;
  location: string; // "House B-12", "Mess Hall A · Kitchen"
  assignedBy: string;
  assignedAt: Date;
  dueAt: Date;
  priority: Priority;
};

/** Something I submitted that is still waiting for approval */
export type Application = {
  id: string; // APP-221
  type: string; // "Spare part request", "Work permit"…
  title: string;
  submittedAt: Date;
  /** 0 = Submitted, 1 = In review, 2 = Approved */
  step: number;
  waitingFor: string; // who has to act next
};

export const APPLICATION_STEPS = ["Submitted", "In review", "Approved"];
