export const opportunityTypes = ["internship", "full_time"] as const;
export type OpportunityType = (typeof opportunityTypes)[number];

export const roundTypes = [
  "online_assessment",
  "technical",
  "managerial",
  "hr",
  "other",
] as const;
export type RoundType = (typeof roundTypes)[number];

export const difficulties = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof difficulties)[number];

export const selectionStatuses = [
  "selected",
  "rejected",
  "in_progress",
  "offer_declined",
] as const;
export type SelectionStatus = (typeof selectionStatuses)[number];
