import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { SiteHeaderBar } from "@/components/site-header-bar";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/lib/models/user";
import { readSession } from "@/lib/supabase/session";

function supabaseName(metadata: Record<string, unknown> | undefined) {
  const fullName = metadata?.full_name;
  const name = metadata?.name;
  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }
  if (typeof name === "string" && name.trim()) {
    return name.trim();
  }
  return null;
}

export async function SiteHeader() {
  const session = await readSession();
  const user = session.user;
  let label: string | null = null;

  if (user) {
    label = user.email ?? "Account";
    try {
      await connectDB();
      const profile = await UserModel.findById(user.id).lean();
      label = profile?.name || supabaseName(user.user_metadata) || label;
    } catch {
      label = supabaseName(user.user_metadata) || label;
    }
  }

  return (
    <SiteHeaderBar>
      {label ? (
        <div className="flex items-center gap-4">
          <span className="max-w-40 truncate text-sm text-muted">{label}</span>
          <SignOutButton compact />
        </div>
      ) : (
        <Link href="/signin" className="text-sm text-brass transition-colors duration-200 hover:text-brass-strong">
          Sign in
        </Link>
      )}
    </SiteHeaderBar>
  );
}
