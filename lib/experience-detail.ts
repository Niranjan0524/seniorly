import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { ExperienceModel } from "@/lib/models/experience";
import type { Difficulty, OpportunityType, RoundType, SelectionStatus } from "@/lib/models/enums";

export type ExperienceDetailRound = {
  position: number;
  roundType: RoundType;
  title?: string;
  durationMinutes?: number;
  difficulty?: Difficulty;
  notes?: string;
  topics: string[];
  questions: Array<{ position: number; prompt: string }>;
};

export type ExperienceDetail = {
  id: string;
  authorId: string;
  companyName: string;
  companySlug: string;
  roleTitle: string;
  collegeName: string;
  branch: string;
  graduationYear: number;
  interviewYear: number;
  opportunityType: OpportunityType;
  selectionStatus?: SelectionStatus;
  preparation?: string;
  focusTopics?: string;
  resources?: string;
  advice?: string;
  rounds: ExperienceDetailRound[];
};

type ExperienceDetailDocument = Omit<ExperienceDetail, "id"> & {
  _id: Types.ObjectId;
};

export async function getExperience(id: string): Promise<ExperienceDetail | null> {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectDB();
  const document = await ExperienceModel.findById(id)
    .select(
      "authorId companyName companySlug roleTitle collegeName branch graduationYear interviewYear opportunityType selectionStatus preparation focusTopics resources advice rounds",
    )
    .lean<ExperienceDetailDocument>();

  if (!document) {
    return null;
  }

  return {
    ...document,
    id: document._id.toString(),
  };
}
