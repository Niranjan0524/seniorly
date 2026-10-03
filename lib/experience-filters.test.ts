import { describe, expect, it } from "vitest";
import { experienceFiltersFromParams, experienceMongoFilter } from "@/lib/experience-filters";

describe("experience filters", () => {
  it("accepts supported URL filters and ignores invalid enum values", () => {
    expect(
      experienceFiltersFromParams({
        q: " distributed systems ",
        company: "hpe",
        type: "full_time",
        year: "2025",
        round: "technical",
      }),
    ).toEqual({
      q: "distributed systems",
      company: "hpe",
      role: undefined,
      type: "full_time",
      year: 2025,
      branch: undefined,
      college: undefined,
      round: "technical",
    });

    expect(experienceFiltersFromParams({ type: "not-a-type", round: "not-a-round", year: "20x5" })).toEqual({
      q: undefined,
      company: undefined,
      role: undefined,
      type: undefined,
      year: undefined,
      branch: undefined,
      college: undefined,
      round: undefined,
    });
  });

  it("maps filters to a safe Mongo query", () => {
    expect(
      experienceMongoFilter({
        q: "trees",
        company: "hpe",
        role: "C++",
        type: "internship",
        year: 2025,
        branch: "CSE",
        college: "iiit-kottayam",
        round: "technical",
      }),
    ).toEqual({
      $text: { $search: "trees" },
      companySlug: "hpe",
      roleTitle: { $regex: "C\\+\\+", $options: "i" },
      opportunityType: "internship",
      interviewYear: 2025,
      branch: { $regex: "CSE", $options: "i" },
      collegeSlug: "iiit-kottayam",
      roundTypes: "technical",
    });
  });
});
