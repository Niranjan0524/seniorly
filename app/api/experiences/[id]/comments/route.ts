import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createComment, listComments } from "@/lib/comments";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({ comments: await listComments(id) });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  if (!body || typeof body !== "object" || !("body" in body) || typeof body.body !== "string") {
    return NextResponse.json(
      { error: { code: "invalid_input", message: "Comment body must be text" } },
      { status: 400 },
    );
  }

  const { id } = await params;
  const result = await createComment(user.id, id, body.body);
  if (!result.ok && result.kind === "validation") {
    return NextResponse.json(
      { error: { code: "validation_error", message: "Comments must be between 1 and 2,000 characters" } },
      { status: 400 },
    );
  }
  if (!result.ok) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Experience not found" } },
      { status: 404 },
    );
  }

  return NextResponse.json({ comment: result.comment }, { status: 201 });
}
