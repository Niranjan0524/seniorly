import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { difficulties, opportunityTypes, roundTypes, selectionStatuses } from "@/lib/models/enums";

const questionSchema = new Schema(
  {
    position: { type: Number, required: true },
    prompt: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const roundSchema = new Schema(
  {
    position: { type: Number, required: true },
    roundType: { type: String, enum: roundTypes, required: true },
    title: { type: String, trim: true },
    durationMinutes: { type: Number },
    difficulty: { type: String, enum: difficulties },
    notes: { type: String, trim: true },
    topics: { type: [String], default: [] },
    questions: { type: [questionSchema], default: [] },
  },
  { _id: false },
);

const experienceSchema = new Schema(
  {
    authorId: { type: String, required: true },
    collegeId: { type: Schema.Types.ObjectId, ref: "College", required: true },
    collegeSlug: { type: String, required: true, trim: true },
    collegeName: { type: String, required: true, trim: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    companySlug: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    roleTitle: { type: String, required: true, trim: true },
    opportunityType: { type: String, enum: opportunityTypes, required: true },
    branch: { type: String, required: true, trim: true },
    graduationYear: { type: Number, required: true },
    interviewYear: { type: Number, required: true },
    selectionStatus: { type: String, enum: selectionStatuses },
    preparation: { type: String, trim: true },
    focusTopics: { type: String, trim: true },
    resources: { type: String, trim: true },
    advice: { type: String, trim: true },
    rounds: { type: [roundSchema], required: true },
    roundTypes: { type: [{ type: String, enum: roundTypes }], default: [] },
  },
  { timestamps: true },
);

experienceSchema.index({ companySlug: 1 });
experienceSchema.index({ collegeSlug: 1 });
experienceSchema.index({ interviewYear: 1 });
experienceSchema.index({ opportunityType: 1 });
experienceSchema.index({ branch: 1 });
experienceSchema.index({ authorId: 1 });
experienceSchema.index({ roundTypes: 1 });
experienceSchema.index({
  roleTitle: "text",
  "rounds.questions.prompt": "text",
  advice: "text",
  preparation: "text",
});

export type Experience = InferSchemaType<typeof experienceSchema>;

export const ExperienceModel: Model<Experience> =
  (mongoose.models.Experience as Model<Experience> | undefined) ??
  mongoose.model<Experience>("Experience", experienceSchema);
