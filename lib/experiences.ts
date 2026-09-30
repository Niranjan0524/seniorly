import { ZodError } from "zod";
import { findOrCreateCompany } from "@/lib/companies";
import { connectDB } from "@/lib/db";
import { CollegeModel } from "@/lib/models/college";
import { ExperienceModel } from "@/lib/models/experience";
import { experienceSchema } from "@/lib/validators/experience";

type CreateFailure =
  | { ok: false; kind: "validation"; error: ZodError }
  | { ok: false; kind: "college" };

function withoutNulls<T extends Record<string, unknown>>(record: T) {
  return Object.fromEntries(Object.entries(record).filter((entry) => entry[1] !== null));
}

export async function createExperience(authorId: string, input: unknown) {
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, kind: "validation" as const, error: parsed.error };
  }

  await connectDB();
  const college = await CollegeModel.findById(parsed.data.collegeId);
  if (!college) {
    const failure: CreateFailure = { ok: false, kind: "college" };
    return failure;
  }

  const company = await findOrCreateCompany(parsed.data.companyName);
  const data = parsed.data;
  const experience = await ExperienceModel.create({
    authorId,
    collegeId: college._id,
    collegeSlug: college.slug,
    collegeName: college.name,
    companyId: company._id,
    companySlug: company.slug,
    companyName: company.name,
    ...withoutNulls({
      roleTitle: data.roleTitle,
      opportunityType: data.opportunityType,
      branch: data.branch,
      graduationYear: data.graduationYear,
      interviewYear: data.interviewYear,
      selectionStatus: data.selectionStatus,
      preparation: data.preparation,
      focusTopics: data.focusTopics,
      resources: data.resources,
      advice: data.advice,
    }),
    rounds: data.rounds.map((round) => ({
      ...withoutNulls(round),
      topics: round.topics,
      questions: round.questions,
    })),
    roundTypes: data.roundTypes,
  });

  return { ok: true as const, id: String(experience._id) };
}
