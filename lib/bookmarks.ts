import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { BookmarkModel } from "@/lib/models/bookmark";
import { ExperienceModel } from "@/lib/models/experience";
import type { ExperienceCardData } from "@/lib/experience-card";

type BookmarkedExperienceDoc = {
  _id: unknown;
  companyName: string;
  roleTitle: string;
  collegeName: string;
  interviewYear: number;
  opportunityType: ExperienceCardData["opportunityType"];
  roundCount: number;
  advice?: string | null;
};

export async function getBookmarkStatus(userId: string, experienceId: string) {
  if (!Types.ObjectId.isValid(experienceId)) {
    return false;
  }

  await connectDB();
  const bookmark = await BookmarkModel.exists({ userId, experienceId });
  return Boolean(bookmark);
}

export async function setBookmark(userId: string, experienceId: string, saved: boolean) {
  if (!Types.ObjectId.isValid(experienceId)) {
    return { ok: false as const, kind: "not_found" as const };
  }

  await connectDB();
  const experienceExists = await ExperienceModel.exists({ _id: experienceId });
  if (!experienceExists) {
    return { ok: false as const, kind: "not_found" as const };
  }

  if (saved) {
    await BookmarkModel.updateOne(
      { userId, experienceId },
      { $setOnInsert: { userId, experienceId } },
      { upsert: true },
    );
  } else {
    await BookmarkModel.deleteOne({ userId, experienceId });
  }

  return { ok: true as const, saved };
}

export async function listBookmarkedExperiences(userId: string): Promise<ExperienceCardData[]> {
  await connectDB();
  const documents = await BookmarkModel.aggregate<BookmarkedExperienceDoc>([
    { $match: { userId } },
    {
      $lookup: {
        from: "experiences",
        localField: "experienceId",
        foreignField: "_id",
        as: "experience",
      },
    },
    { $unwind: "$experience" },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: "$experience._id",
        companyName: "$experience.companyName",
        roleTitle: "$experience.roleTitle",
        collegeName: "$experience.collegeName",
        interviewYear: "$experience.interviewYear",
        opportunityType: "$experience.opportunityType",
        advice: "$experience.advice",
        roundCount: { $size: { $ifNull: ["$experience.rounds", []] } },
      },
    },
  ]);

  return documents.map((document) => ({
    id: String(document._id),
    companyName: document.companyName,
    roleTitle: document.roleTitle,
    collegeName: document.collegeName,
    interviewYear: document.interviewYear,
    opportunityType: document.opportunityType,
    roundCount: document.roundCount,
    advice: document.advice?.trim() ? document.advice : null,
  }));
}
