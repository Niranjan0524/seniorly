import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userRoles = ["student", "admin"] as const;

const userSchema = new Schema({
  _id: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  name: { type: String, trim: true },
  image: { type: String, trim: true },
  role: { type: String, enum: userRoles, required: true, default: "student" },
  collegeId: { type: Schema.Types.ObjectId, ref: "College" },
  branch: { type: String, trim: true },
  graduationYear: { type: Number },
});

export type UserProfile = InferSchemaType<typeof userSchema>;

export const UserModel: Model<UserProfile> =
  (mongoose.models.User as Model<UserProfile> | undefined) ??
  mongoose.model<UserProfile>("User", userSchema);
