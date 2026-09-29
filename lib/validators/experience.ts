import { z } from "zod";
import {
  difficulties,
  opportunityTypes,
  roundTypes,
  selectionStatuses,
} from "@/lib/models/enums";

const minYear = 2018;
const maxYear = new Date().getFullYear() + 1;

const yearSchema = z
  .number()
  .int()
  .min(minYear)
  .max(maxYear);

function optionalText(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .nullish()
    .transform((value) => (value ? value : null));
}

const questionSchema = z.object({
  prompt: z.string().trim().min(1).max(1000),
});

const roundSchema = z.object({
  roundType: z.enum(roundTypes),
  title: optionalText(120),
  durationMinutes: z
    .number()
    .int()
    .min(1)
    .max(1440)
    .nullish()
    .transform((value) => value ?? null),
  difficulty: z
    .enum(difficulties)
    .nullish()
    .transform((value) => value ?? null),
  notes: optionalText(4000),
  topics: z
    .array(z.string())
    .max(12)
    .optional()
    .transform((topics) =>
      (topics ?? []).map((topic) => topic.trim()).filter((topic) => topic.length > 0),
    )
    .pipe(z.array(z.string().max(40)).max(12)),
  questions: z.array(questionSchema).min(1).max(15),
});

export const experienceSchema = z
  .object({
    companyName: z.string().trim().min(1).max(120),
    roleTitle: z.string().trim().min(1).max(120),
    opportunityType: z.enum(opportunityTypes),
    collegeId: z.string().trim().regex(/^[a-f\d]{24}$/i),
    branch: z.string().trim().min(1).max(80),
    graduationYear: yearSchema,
    interviewYear: yearSchema,
    selectionStatus: z
      .enum(selectionStatuses)
      .nullish()
      .transform((value) => value ?? null),
    preparation: optionalText(4000),
    focusTopics: optionalText(500),
    resources: optionalText(2000),
    advice: optionalText(4000),
    rounds: z.array(roundSchema).min(1).max(8),
  })
  .transform((experience) => ({
    ...experience,
    rounds: experience.rounds.map((round, roundIndex) => ({
      ...round,
      position: roundIndex + 1,
      questions: round.questions.map((question, questionIndex) => ({
        prompt: question.prompt,
        position: questionIndex + 1,
      })),
    })),
    roundTypes: [...new Set(experience.rounds.map((round) => round.roundType))],
  }));

export type ExperienceInput = z.input<typeof experienceSchema>;
export type ExperienceData = z.output<typeof experienceSchema>;
