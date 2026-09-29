import { describe, expect, it } from "vitest";
import { experienceSchema } from "@/lib/validators/experience";

const collegeId = "64b7f3c2a1d4e5f678901234";

function minimalExperience() {
  return {
    companyName: " HPE ",
    roleTitle: " Software Engineer ",
    opportunityType: "full_time" as const,
    collegeId,
    branch: "CSE",
    graduationYear: 2026,
    interviewYear: 2025,
    rounds: [
      {
        roundType: "technical" as const,
        questions: [{ prompt: " What is a process? " }],
      },
    ],
  };
}

describe("experienceSchema", () => {
  it("rejects a round with no question", () => {
    const result = experienceSchema.safeParse({
      ...minimalExperience(),
      rounds: [{ roundType: "technical", questions: [] }],
    });

    expect(result.success).toBe(false);
  });

  it("accepts a minimal experience", () => {
    const result = experienceSchema.safeParse(minimalExperience());

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.companyName).toBe("HPE");
    expect(result.data.roleTitle).toBe("Software Engineer");
    expect(result.data.rounds).toHaveLength(1);
    expect(result.data.rounds[0]?.questions[0]?.prompt).toBe("What is a process?");
  });

  it("turns blank preparation into null", () => {
    const result = experienceSchema.safeParse({
      ...minimalExperience(),
      preparation: "   ",
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.preparation).toBeNull();
  });
});
