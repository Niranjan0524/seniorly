import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { BookmarkModel } from "@/lib/models/bookmark";
import { ExperienceModel } from "@/lib/models/experience";

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
