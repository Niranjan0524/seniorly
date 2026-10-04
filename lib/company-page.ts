import { connectDB } from "@/lib/db";
import type { ExperienceCardData } from "@/lib/experience-card";
import { ExperienceModel } from "@/lib/models/experience";
import { CompanyModel } from "@/lib/models/company";

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

export type CompanyPageData = {
  name: string;
  slug: string;
  website?: string;
  experiences: ExperienceCardData[];
};

export async function getCompanyPage(slug: string): Promise<CompanyPageData | null> {
  await connectDB();
  const company = await CompanyModel.findOne({ slug }).select("name slug website").lean();

  if (!company) {
    return null;
  }

  const documents = await ExperienceModel.aggregate<ExperienceCardDoc>([
    { $match: { companySlug: company.slug } },
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
    name: company.name,
    slug: company.slug,
    website: company.website ?? undefined,
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
