import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireUser } from "@/lib/auth";
import { createExperience } from "@/lib/experiences";

function fieldErrors(error: ZodError) {
  const fields: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".") || "form";
    fields[path] ??= [];
    fields[path].push(issue.message);
  }

  return fields;
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (user instanceof NextResponse) {
    return user;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_json", message: "Request body must be JSON" } },
      { status: 400 },
    );
  }

  const result = await createExperience(user.id, body);
  if (!result.ok && result.kind === "validation") {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "Check the highlighted fields",
          fieldErrors: fieldErrors(result.error),
        },
      },
      { status: 400 },
    );
  }

  if (!result.ok) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "Choose a college from the list",
          fieldErrors: { collegeId: ["Choose a college from the list"] },
        },
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ id: result.id }, { status: 201 });
}
