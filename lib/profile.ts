import { connectDB } from "@/lib/db";
import type { ExperienceCardData } from "@/lib/experience-card";
import { ExperienceModel } from "@/lib/models/experience";
import { CollegeModel } from "@/lib/models/college";
import { UserModel } from "@/lib/models/user";

type ExperienceCardDoc = {
  _id: unknown;
  companyName: string;
  roleTitle: string;
  collegeName: string;
  interviewYear: number;
  opportunityType: ExperienceCardData["opportunityType"];
  roundCount: number;
  advice?: string | null;
};

export type PublicProfile = {
  id: string;
  name: string;
  image?: string;
  collegeName?: string;
  branch?: string;
  graduationYear?: number;
  experiences: ExperienceCardData[];
};

export async function getPublicProfile(id: string): Promise<PublicProfile | null> {
  if (!id.trim()) {
    return null;
  }

  await connectDB();
  const user = await UserModel.findById(id)
    .select("name image collegeId branch graduationYear")
    .lean();

  if (!user) {
    return null;
  }

  const college = user.collegeId
    ? await CollegeModel.findById(user.collegeId).select("name").lean()
    : null;
  const documents = await ExperienceModel.aggregate<ExperienceCardDoc>([
    { $match: { authorId: id } },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        companyName: 1,
        roleTitle: 1,
        collegeName: 1,
        interviewYear: 1,
        opportunityType: 1,
        advice: 1,
        roundCount: { $size: { $ifNull: ["$rounds", []] } },
      },
    },
  ]);

  return {
    id,
    name: user.name?.trim() || "Seniorly member",
    image: user.image?.trim() || undefined,
    collegeName: college?.name,
    branch: user.branch?.trim() || undefined,
    graduationYear: user.graduationYear ?? undefined,
    experiences: documents.map((document) => ({
      id: String(document._id),
      companyName: document.companyName,
      roleTitle: document.roleTitle,
      collegeName: document.collegeName,
      interviewYear: document.interviewYear,
      opportunityType: document.opportunityType,
      roundCount: document.roundCount,
      advice: document.advice?.trim() ? document.advice : null,
    })),
  };
}
