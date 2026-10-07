import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { CommentModel } from "@/lib/models/comment";
import { ExperienceModel } from "@/lib/models/experience";
import { UserModel } from "@/lib/models/user";

export type ExperienceComment = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

type CommentDocument = {
  _id: Types.ObjectId;
  authorId: string;
  body: string;
  createdAt: Date;
  author?: { name?: string; email?: string };
};

function commentData(document: CommentDocument): ExperienceComment {
  return {
    id: document._id.toString(),
    authorId: document.authorId,
    authorName: document.author?.name?.trim() || document.author?.email || "Seniorly member",
    body: document.body,
    createdAt: document.createdAt.toISOString(),
  };
}

export async function listComments(experienceId: string): Promise<ExperienceComment[]> {
  if (!Types.ObjectId.isValid(experienceId)) {
    return [];
  }

  await connectDB();
  const comments = await CommentModel.aggregate<CommentDocument>([
    { $match: { experienceId: new Types.ObjectId(experienceId) } },
    { $sort: { createdAt: 1 } },
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
    { $project: { authorId: 1, body: 1, createdAt: 1, author: { name: 1, email: 1 } } },
  ]);

  return comments.map(commentData);
}

export async function createComment(userId: string, experienceId: string, body: string) {
  if (!Types.ObjectId.isValid(experienceId)) {
    return { ok: false as const, kind: "not_found" as const };
  }

  const trimmedBody = body.trim();
  if (!trimmedBody || trimmedBody.length > 2000) {
    return { ok: false as const, kind: "validation" as const };
  }

  await connectDB();
  const experience = await ExperienceModel.exists({ _id: experienceId });
  if (!experience) {
    return { ok: false as const, kind: "not_found" as const };
  }

  const comment = await CommentModel.create({
    experienceId,
    authorId: userId,
    body: trimmedBody,
  });
  const author = await UserModel.findById(userId).select("name email").lean();

  return {
    ok: true as const,
    comment: commentData({
      _id: comment._id,
      authorId: comment.authorId,
      body: comment.body,
      createdAt: comment.createdAt,
      author: author
        ? {
            name: author.name ?? undefined,
            email: author.email,
          }
        : undefined,
    }),
  };
}
