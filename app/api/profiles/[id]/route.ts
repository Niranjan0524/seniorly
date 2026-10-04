import { NextResponse } from "next/server";
import { getPublicProfile } from "@/lib/profile";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getPublicProfile(id);

  if (!profile) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Profile not found" } },
      { status: 404 },
    );
  }

  return NextResponse.json({ profile });
}
