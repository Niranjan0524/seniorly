import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const upvoteSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    experienceId: { type: Schema.Types.ObjectId, ref: "Experience", required: true },
  },
  { timestamps: true },
);

upvoteSchema.index({ userId: 1, experienceId: 1 }, { unique: true });
upvoteSchema.index({ experienceId: 1 });

export type Upvote = InferSchemaType<typeof upvoteSchema>;

export const UpvoteModel: Model<Upvote> =
  (mongoose.models.Upvote as Model<Upvote> | undefined) ??
  mongoose.model<Upvote>("Upvote", upvoteSchema);
