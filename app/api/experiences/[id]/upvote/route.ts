import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { readSession } from "@/lib/supabase/session";
import { getUpvoteStatus, setUpvote } from "@/lib/upvotes";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await readSession();
  return NextResponse.json(await getUpvoteStatus(session.user?.id ?? "", id));
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

  if (!body || typeof body !== "object" || !("voted" in body) || typeof body.voted !== "boolean") {
    return NextResponse.json(
      { error: { code: "invalid_input", message: "voted must be a boolean" } },
      { status: 400 },
    );
  }

  const { id } = await params;
  const result = await setUpvote(user.id, id, body.voted);
  if (!result.ok) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Experience not found" } },
      { status: 404 },
    );
  }

  return NextResponse.json({ count: result.count, voted: result.voted });
}
