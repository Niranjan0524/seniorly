import { opportunityTypes, roundTypes, type OpportunityType, type RoundType } from "@/lib/models/enums";

export type ExperienceFilterParams = {
  q?: string;
  company?: string;
  role?: string;
  type?: OpportunityType;
  year?: number;
  branch?: string;
  college?: string;
  round?: RoundType;
};

export type ExperienceMongoFilter = Record<string, unknown>;

const opportunityTypeSet = new Set<string>(opportunityTypes);
const roundTypeSet = new Set<string>(roundTypes);

function clean(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : undefined;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function experienceFiltersFromParams(
  params: Record<string, string | string[] | undefined>,
): ExperienceFilterParams {
  const value = (key: string) => {
    const raw = params[key];
    return Array.isArray(raw) ? raw[0] : raw;
  };
  const type = clean(value("type"));
  const round = clean(value("round"));
  const yearValue = clean(value("year"));
  const year = yearValue && /^\d{4}$/.test(yearValue) ? Number(yearValue) : undefined;

  return {
    q: clean(value("q")),
    company: clean(value("company")),
    role: clean(value("role")),
    type: type && opportunityTypeSet.has(type) ? (type as OpportunityType) : undefined,
    year,
    branch: clean(value("branch")),
    college: clean(value("college")),
    round: round && roundTypeSet.has(round) ? (round as RoundType) : undefined,
  };
}

export function experienceMongoFilter(filters: ExperienceFilterParams): ExperienceMongoFilter {
  const query: ExperienceMongoFilter = {};

  if (filters.q) {
    query.$text = { $search: filters.q };
  }
  if (filters.company) {
    query.companySlug = filters.company;
  }
  if (filters.role) {
    query.roleTitle = { $regex: escapeRegex(filters.role), $options: "i" };
  }
  if (filters.type) {
    query.opportunityType = filters.type;
  }
  if (filters.year) {
    query.interviewYear = filters.year;
  }
  if (filters.branch) {
    query.branch = { $regex: escapeRegex(filters.branch), $options: "i" };
  }
  if (filters.college) {
    query.collegeSlug = filters.college;
  }
  if (filters.round) {
    query.roundTypes = filters.round;
  }

  return query;
}
