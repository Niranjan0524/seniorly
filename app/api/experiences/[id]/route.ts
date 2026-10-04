import { NextResponse } from "next/server";
import { getExperience } from "@/lib/experience-detail";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experience = await getExperience(id);

  if (!experience) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Experience not found" } },
      { status: 404 },
    );
  }

  return NextResponse.json({ experience });
}
