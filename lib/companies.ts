import { connectDB } from "@/lib/db";
import { CompanyModel } from "@/lib/models/company";
import { uniqueSlug } from "@/lib/slug";

export async function findOrCreateCompany(name: string) {
  await connectDB();

  const trimmed = name.trim();
  const normalizedName = trimmed.toLowerCase();
  const existing = await CompanyModel.findOne({ normalizedName });
  if (existing) {
    return existing;
  }

  const takenSlugs = await CompanyModel.distinct("slug");
  const slug = uniqueSlug(trimmed, takenSlugs);

  try {
    return await CompanyModel.create({
      name: trimmed,
      normalizedName,
      slug,
    });
  } catch (error) {
    const created = await CompanyModel.findOne({ normalizedName });
    if (created) {
      return created;
    }

    throw error;
  }
}
