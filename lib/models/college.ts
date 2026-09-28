import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const collegeSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  shortName: { type: String, required: true, trim: true },
  emailDomain: { type: String, trim: true, lowercase: true },
});

export type College = InferSchemaType<typeof collegeSchema>;

export const CollegeModel: Model<College> =
  (mongoose.models.College as Model<College> | undefined) ??
  mongoose.model<College>("College", collegeSchema);
