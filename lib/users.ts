import type { User } from "@supabase/supabase-js";
import { connectDB } from "@/lib/db";
import { CollegeModel } from "@/lib/models/college";
import { UserModel } from "@/lib/models/user";

function metadataString(user: User, key: string) {
  const value = user.user_metadata?.[key];
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

function emailDomain(email: string) {
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) {
    return null;
  }

  return email.slice(at + 1);
}

export async function upsertUserProfile(user: User) {
  const email = user.email?.trim().toLowerCase();
  if (!email) {
    throw new Error("Signed-in user has no email");
  }

  await connectDB();

  const domain = emailDomain(email);
  const college = domain ? await CollegeModel.findOne({ emailDomain: domain }) : null;
  const name = metadataString(user, "full_name") ?? metadataString(user, "name");
  const image = metadataString(user, "avatar_url") ?? metadataString(user, "picture");

  await UserModel.updateOne(
    { _id: user.id },
    {
      $set: {
        email,
        ...(name ? { name } : {}),
        ...(image ? { image } : {}),
        ...(college ? { collegeId: college._id } : {}),
      },
      $setOnInsert: {
        _id: user.id,
        role: "student",
      },
    },
    { upsert: true },
  );
}
