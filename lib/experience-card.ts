import type { OpportunityType } from "@/lib/models/enums";

export type ExperienceCardData = {
  id: string;
  companyName: string;
  roleTitle: string;
  collegeName: string;
  interviewYear: number;
  opportunityType: OpportunityType;
  roundCount: number;
  advice: string | null;
};

export const opportunityLabels: Record<OpportunityType, string> = {
  internship: "Internship",
  full_time: "Full-time",
};
