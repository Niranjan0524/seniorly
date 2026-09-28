import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const companySchema = new Schema({
  name: { type: String, required: true, trim: true },
  normalizedName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  slug: { type: String, required: true, unique: true, trim: true },
  website: { type: String, trim: true },
});

export type Company = InferSchemaType<typeof companySchema>;

export const CompanyModel: Model<Company> =
  (mongoose.models.Company as Model<Company> | undefined) ??
  mongoose.model<Company>("Company", companySchema);
