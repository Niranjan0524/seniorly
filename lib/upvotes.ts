import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { ExperienceModel } from "@/lib/models/experience";
import { UpvoteModel } from "@/lib/models/upvote";

export async function getUpvoteStatus(userId: string, experienceId: string) {
  if (!Types.ObjectId.isValid(experienceId)) {
    return { count: 0, voted: false };
  }

  await connectDB();
  const [count, vote] = await Promise.all([
    UpvoteModel.countDocuments({ experienceId }),
    UpvoteModel.exists({ userId, experienceId }),
  ]);

  return { count, voted: Boolean(vote) };
}

export async function setUpvote(userId: string, experienceId: string, voted: boolean) {
  if (!Types.ObjectId.isValid(experienceId)) {
    return { ok: false as const, kind: "not_found" as const };
  }

  await connectDB();
  const experienceExists = await ExperienceModel.exists({ _id: experienceId });
  if (!experienceExists) {
    return { ok: false as const, kind: "not_found" as const };
  }

  if (voted) {
    await UpvoteModel.updateOne(
      { userId, experienceId },
      { $setOnInsert: { userId, experienceId } },
      { upsert: true },
    );
  } else {
    await UpvoteModel.deleteOne({ userId, experienceId });
  }

  return {
    ok: true as const,
    voted,
    count: await UpvoteModel.countDocuments({ experienceId }),
  };
}
