import type { Types } from "mongoose";
import { connectDB } from "../lib/db";
import { CollegeModel } from "../lib/models/college";
import { CompanyModel } from "../lib/models/company";
import { ExperienceModel } from "../lib/models/experience";
import type { Difficulty, OpportunityType, RoundType, SelectionStatus } from "../lib/models/enums";
import { slugify, uniqueSlug } from "../lib/slug";

const collegeName = "IIIT Kottayam";
const sampleAuthorId = "seed";

type SeedCompany = {
  name: string;
  website: string;
};

type SeedQuestion = {
  position: number;
  prompt: string;
};

type SeedRound = {
  position: number;
  roundType: RoundType;
  title: string;
  durationMinutes?: number;
  difficulty?: Difficulty;
  notes?: string;
  topics: string[];
  questions: SeedQuestion[];
};

type SeedExperience = {
  companyName: string;
  roleTitle: string;
  opportunityType: OpportunityType;
  branch: string;
  graduationYear: number;
  interviewYear: number;
  selectionStatus?: SelectionStatus;
  preparation?: string;
  focusTopics?: string;
  resources?: string;
  advice?: string;
  rounds: SeedRound[];
};

const companies: SeedCompany[] = [
  { name: "HPE", website: "https://www.hpe.com" },
  { name: "Amazon", website: "https://www.amazon.jobs" },
  { name: "Microsoft", website: "https://careers.microsoft.com" },
];

const sampleExperiences: SeedExperience[] = [
  {
    companyName: "HPE",
    roleTitle: "Software Engineer",
    opportunityType: "full_time",
    branch: "CSE",
    graduationYear: 2026,
    interviewYear: 2025,
    selectionStatus: "selected",
    preparation: "Revised DSA for three weeks, then spent a week on OS, DBMS, and networks.",
    focusTopics: "Arrays, trees, OOP, and operating systems",
    resources: "LeetCode top interview questions and class notes for OS",
    advice: "Explain your approach before coding. The technical rounds cared more about clarity than a perfect solution.",
    rounds: [
      {
        position: 1,
        roundType: "online_assessment",
        title: "Online assessment",
        durationMinutes: 90,
        difficulty: "medium",
        topics: ["arrays", "strings", "dynamic programming"],
        questions: [
          { position: 1, prompt: "Given an array of integers, return two indices that add up to a target." },
          { position: 2, prompt: "Find the longest substring without repeating characters." },
        ],
      },
      {
        position: 2,
        roundType: "technical",
        title: "Technical interview",
        durationMinutes: 60,
        difficulty: "medium",
        notes: "The interviewer asked me to dry-run the code on a small example.",
        topics: ["trees", "OOP", "operating systems"],
        questions: [
          { position: 1, prompt: "Level-order traversal of a binary tree." },
          { position: 2, prompt: "Difference between a process and a thread." },
        ],
      },
      {
        position: 3,
        roundType: "hr",
        title: "HR interview",
        durationMinutes: 30,
        difficulty: "easy",
        topics: ["projects", "teamwork"],
        questions: [
          { position: 1, prompt: "Tell me about a project where you disagreed with a teammate." },
        ],
      },
    ],
  },
  {
    companyName: "Amazon",
    roleTitle: "SDE Intern",
    opportunityType: "internship",
    branch: "CSE",
    graduationYear: 2027,
    interviewYear: 2025,
    selectionStatus: "rejected",
    preparation: "Practiced medium array and graph problems, and wrote short stories for leadership principles.",
    focusTopics: "Graphs, hashing, and behavioral answers",
    resources: "NeetCode graph playlist",
    advice: "For the coding round, talk through edge cases before you start typing.",
    rounds: [
      {
        position: 1,
        roundType: "online_assessment",
        title: "Online assessment",
        durationMinutes: 70,
        difficulty: "hard",
        topics: ["graphs", "hashing"],
        questions: [
          { position: 1, prompt: "Number of islands in a grid." },
          { position: 2, prompt: "Group anagrams from a list of strings." },
        ],
      },
      {
        position: 2,
        roundType: "technical",
        title: "Technical interview",
        durationMinutes: 45,
        difficulty: "medium",
        topics: ["arrays", "complexity"],
        questions: [
          { position: 1, prompt: "Merge two sorted arrays in place and state the time complexity." },
        ],
      },
    ],
  },
  {
    companyName: "Microsoft",
    roleTitle: "Software Engineer",
    opportunityType: "full_time",
    branch: "ECE",
    graduationYear: 2026,
    interviewYear: 2024,
    selectionStatus: "in_progress",
    preparation: "Focused on CS fundamentals because the first round was more conceptual than LeetCode.",
    focusTopics: "DBMS, OOP, and one coding problem per day",
    resources: "GeeksforGeeks DBMS notes",
    advice: "Be ready to connect a project on your resume to a fundamentals question.",
    rounds: [
      {
        position: 1,
        roundType: "technical",
        title: "Technical interview",
        durationMinutes: 60,
        difficulty: "medium",
        topics: ["DBMS", "OOP"],
        questions: [
          { position: 1, prompt: "Explain indexing and when a query would not use an index." },
          { position: 2, prompt: "What is polymorphism? Give an example from a project." },
        ],
      },
      {
        position: 2,
        roundType: "managerial",
        title: "Managerial interview",
        durationMinutes: 40,
        difficulty: "easy",
        topics: ["projects", "ownership"],
        questions: [
          { position: 1, prompt: "Describe a time you owned a bug through to the fix." },
        ],
      },
    ],
  },
];

async function seedCollege() {
  const preferredSlug = slugify(collegeName);
  const takenSlugs = await CollegeModel.find({ slug: { $ne: preferredSlug } }).distinct("slug");
  const slug = uniqueSlug(collegeName, takenSlugs);

  await CollegeModel.updateOne(
    { slug },
    {
      $set: {
        name: collegeName,
        slug,
        shortName: "IIITK",
        emailDomain: "iiitkottayam.ac.in",
      },
    },
    { upsert: true },
  );

  const college = await CollegeModel.findOne({ slug });
  if (!college) {
    throw new Error("College seed failed");
  }

  console.log(`Upserted college ${slug}`);
  return college;
}

async function seedCompanies() {
  const seeded = [];

  for (const company of companies) {
    const normalizedName = company.name.trim().toLowerCase();
    const preferredSlug = slugify(company.name);
    const takenSlugs = await CompanyModel.find({ slug: { $ne: preferredSlug } }).distinct("slug");
    const slug = uniqueSlug(company.name, takenSlugs);

    await CompanyModel.updateOne(
      { normalizedName },
      {
        $set: {
          name: company.name,
          normalizedName,
          slug,
          website: company.website,
        },
      },
      { upsert: true },
    );

    const saved = await CompanyModel.findOne({ normalizedName });
    if (!saved) {
      throw new Error(`Company seed failed for ${company.name}`);
    }

    seeded.push(saved);
    console.log(`Upserted company ${slug}`);
  }

  return seeded;
}

async function seedSampleExperiences(
  college: { _id: Types.ObjectId; name: string; slug: string },
  seededCompanies: Array<{ _id: Types.ObjectId; name: string; slug: string; normalizedName: string }>,
) {
  if (process.env.SEED_SAMPLES !== "true") {
    console.log("Skipped sample experiences. Set SEED_SAMPLES=true to include them.");
    return;
  }

  for (const experience of sampleExperiences) {
    const company = seededCompanies.find(
      (entry) => entry.normalizedName === experience.companyName.trim().toLowerCase(),
    );
    if (!company) {
      throw new Error(`Missing company for sample experience: ${experience.companyName}`);
    }

    const roundTypes = experience.rounds.map((round) => round.roundType);

    await ExperienceModel.updateOne(
      {
        authorId: sampleAuthorId,
        companySlug: company.slug,
        roleTitle: experience.roleTitle,
        interviewYear: experience.interviewYear,
      },
      {
        $set: {
          authorId: sampleAuthorId,
          collegeId: college._id,
          collegeSlug: college.slug,
          collegeName: college.name,
          companyId: company._id,
          companySlug: company.slug,
          companyName: company.name,
          roleTitle: experience.roleTitle,
          opportunityType: experience.opportunityType,
          branch: experience.branch,
          graduationYear: experience.graduationYear,
          interviewYear: experience.interviewYear,
          selectionStatus: experience.selectionStatus,
          preparation: experience.preparation,
          focusTopics: experience.focusTopics,
          resources: experience.resources,
          advice: experience.advice,
          rounds: experience.rounds,
          roundTypes,
        },
      },
      { upsert: true },
    );

    console.log(`Upserted sample experience ${company.slug} ${experience.roleTitle}`);
  }
}

async function main() {
  const connection = await connectDB();

  try {
    const college = await seedCollege();
    const seededCompanies = await seedCompanies();
    await seedSampleExperiences(college, seededCompanies);
  } finally {
    await connection.disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Seed failed";
  console.error(message);
  process.exit(1);
});
