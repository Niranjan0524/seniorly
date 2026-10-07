import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const commentSchema = new Schema(
  {
    experienceId: { type: Schema.Types.ObjectId, ref: "Experience", required: true },
    authorId: { type: String, required: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true },
);

commentSchema.index({ experienceId: 1, createdAt: -1 });

export type Comment = InferSchemaType<typeof commentSchema>;

export const CommentModel: Model<Comment> =
  (mongoose.models.Comment as Model<Comment> | undefined) ??
  mongoose.model<Comment>("Comment", commentSchema);
