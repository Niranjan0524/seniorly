import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
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
    <header className="flex items-center justify-between gap-4 border-b border-line bg-ink px-6 py-3 text-paper">
      <Link href="/" className="text-sm tracking-wide text-brass">
        Seniorly
      </Link>
      {label ? (
        <div className="flex items-center gap-4">
          <span className="max-w-48 truncate text-sm text-muted">{label}</span>
          <SignOutButton compact />
        </div>
      ) : (
        <Link href="/signin" className="text-sm text-brass hover:text-brass-strong">
          Sign in
        </Link>
      )}
    </header>
  );
}
