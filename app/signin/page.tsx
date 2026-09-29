import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { readSession } from "@/lib/supabase/session";
import { GoogleSignInButton } from "./google-button";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const session = await readSession();
  const user = session.user;

  return (
    <main className="flex flex-1 items-center bg-[#121410] px-6 py-16 text-[#eceae3]">
      <div className="mx-auto w-full max-w-md">
        <p className="text-sm tracking-wide text-[#d4c4a0]">Seniorly</p>
        <h1 className="mt-3 text-3xl text-[#eceae3]">Sign in</h1>
        <p className="mt-3 text-[#a8a292]">
          Use Google to share an interview experience. Reading stays open without an account.
        </p>

        {params.error === "auth" ? (
          <p className="mt-6 text-sm text-[#d4896a]">
            Google sign-in did not finish. Try again.
          </p>
        ) : null}

        {session.configMessage ? (
          <p className="mt-6 text-sm text-[#d4896a]">{session.configMessage}</p>
        ) : null}

        <div className="mt-8">
          {session.configMessage ? null : user ? (
            <div className="flex flex-col items-start gap-4">
              <p className="text-sm text-[#a8a292]">
                Signed in as {user.email ?? user.id}
              </p>
              <Link href="/experiences/new" className="text-sm text-[#d4c4a0] hover:text-[#e6d7b8]">
                Continue to a new experience
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <GoogleSignInButton />
          )}
        </div>
      </div>
    </main>
  );
}
