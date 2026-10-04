import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getBookmarkStatus, setBookmark } from "@/lib/bookmarks";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (user instanceof NextResponse) {
    return user;
  }

  const { id } = await params;
  return NextResponse.json({ saved: await getBookmarkStatus(user.id, id) });
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

  if (!body || typeof body !== "object" || !("saved" in body) || typeof body.saved !== "boolean") {
    return NextResponse.json(
      { error: { code: "invalid_input", message: "saved must be a boolean" } },
      { status: 400 },
    );
  }

  const { id } = await params;
  const result = await setBookmark(user.id, id, body.saved);
  if (!result.ok) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Experience not found" } },
      { status: 404 },
    );
  }

  return NextResponse.json({ saved: result.saved });
}
