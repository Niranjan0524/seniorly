import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const bookmarkSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    experienceId: { type: Schema.Types.ObjectId, ref: "Experience", required: true },
  },
  { timestamps: true },
);

bookmarkSchema.index({ userId: 1, experienceId: 1 }, { unique: true });

export type Bookmark = InferSchemaType<typeof bookmarkSchema>;

export const BookmarkModel: Model<Bookmark> =
  (mongoose.models.Bookmark as Model<Bookmark> | undefined) ??
  mongoose.model<Bookmark>("Bookmark", bookmarkSchema);
