import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CompanyModel } from "@/lib/models/company";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim().slice(0, 80) ?? "";

  try {
    await connectDB();
  } catch {
    return NextResponse.json(
      { error: { code: "unavailable", message: "Companies are unavailable right now" } },
      { status: 503 },
    );
  }

  const filter = query
    ? { name: { $regex: escapeRegex(query), $options: "i" } }
    : {};
  const companies = await CompanyModel.find(filter).sort({ name: 1 }).limit(8).select("name slug");

  return NextResponse.json({
    companies: companies.map((company) => ({
      id: String(company._id),
      name: company.name,
      slug: company.slug,
    })),
  });
}
