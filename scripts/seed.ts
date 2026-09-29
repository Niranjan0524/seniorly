import { connectDB } from "../lib/db";
import { CollegeModel } from "../lib/models/college";
import { slugify, uniqueSlug } from "../lib/slug";

const collegeName = "IIIT Kottayam";

async function seedCollege() {
  const connection = await connectDB();

  const preferredSlug = slugify(collegeName);
  const takenSlugs = await CollegeModel.find({ slug: { $ne: preferredSlug } }).distinct(
    "slug",
  );
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

  console.log(`Upserted college ${slug}`);
  await connection.disconnect();
}

seedCollege().catch(async (error: unknown) => {
  const message = error instanceof Error ? error.message : "Seed failed";
  console.error(message);
  process.exit(1);
});
