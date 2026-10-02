import type { ZodError } from "zod";
import type { RoundDraft } from "@/components/form/rounds-editor";

const fieldCopy: Record<string, string> = {
  companyName: "Add the company",
  roleTitle: "Add the role",
  opportunityType: "Choose internship or full-time",
  collegeId: "Choose a college",
  branch: "Add your branch",
  graduationYear: "Add a graduation year from 2018 on",
  interviewYear: "Add an interview year from 2018 on",
  preparation: "Keep preparation under 4,000 characters",
  focusTopics: "Keep focus topics under 500 characters",
  resources: "Keep resources under 2,000 characters",
  advice: "Keep advice under 4,000 characters",
  rounds: "Add at least one round",
};

function copyFor(path: string) {
  if (fieldCopy[path]) {
    return fieldCopy[path];
  }
  if (path.endsWith(".roundType")) {
    return "Choose a round type";
  }
  if (path.endsWith(".prompt")) {
    return "Add what they asked";
  }
  if (path.endsWith(".durationMinutes")) {
    return "Use a duration in minutes";
  }
  if (path.endsWith(".title")) {
    return "Keep the title under 120 characters";
  }
  if (path.endsWith(".notes")) {
    return "Keep notes under 4,000 characters";
  }
  if (path.endsWith(".questions")) {
    return "Add at least one question";
  }
  if (path.endsWith(".topics")) {
    return "Use at most 12 topics";
  }
  return "Check this field";
}

export function fieldErrorsFromZod(error: ZodError) {
  return messagesFor(error.issues.map((issue) => issue.path.join(".")));
}

export function fieldErrorsFromApi(fields: Record<string, string[]>) {
  return messagesFor(Object.keys(fields));
}

function messagesFor(paths: string[]) {
  const fields: Record<string, string> = {};
  for (const path of paths) {
    if (!path || fields[path]) {
      continue;
    }
    fields[path] = copyFor(path);
  }
  return fields;
}

function emptyToUndefined(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function buildExperienceInput({
  companyName,
  roleTitle,
  opportunityType,
  collegeId,
  branch,
  graduationYear,
  interviewYear,
  selectionStatus,
  preparation,
  focusTopics,
  resources,
  advice,
  rounds,
}: {
  companyName: string;
  roleTitle: string;
  opportunityType: string;
  collegeId: string;
  branch: string;
  graduationYear: string;
  interviewYear: string;
  selectionStatus: string;
  preparation: string;
  focusTopics: string;
  resources: string;
  advice: string;
  rounds: RoundDraft[];
}) {
  return {
    companyName,
    roleTitle,
    opportunityType: emptyToUndefined(opportunityType),
    collegeId,
    branch,
    graduationYear: graduationYear.trim() ? Number(graduationYear) : undefined,
    interviewYear: interviewYear.trim() ? Number(interviewYear) : undefined,
    selectionStatus: emptyToUndefined(selectionStatus),
    preparation,
    focusTopics,
    resources,
    advice,
    rounds: rounds.map((round) => ({
      roundType: emptyToUndefined(round.roundType),
      title: round.title,
      durationMinutes: round.durationMinutes.trim() ? Number(round.durationMinutes) : undefined,
      difficulty: emptyToUndefined(round.difficulty),
      notes: round.notes,
      topics: round.topics,
      questions: round.questions.map((question) => ({ prompt: question.prompt })),
    })),
  };
}
