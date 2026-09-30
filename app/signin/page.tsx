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
    <main className="flex flex-1 items-center px-6 py-16">
      <div className="mx-auto w-full max-w-md">
        <p className="text-sm tracking-[0.16em] text-brass">SENIORLY</p>
        <h1 className="mt-3 text-4xl text-paper">Sign in</h1>
        <p className="mt-3 text-muted">
          Use Google to share an interview experience. Reading stays open without an account.
        </p>

        {params.error === "auth" ? (
          <p className="mt-6 text-sm text-clay">
            Google sign-in did not finish. Try again.
          </p>
        ) : null}

        {session.configMessage ? (
          <p className="mt-6 text-sm text-clay">{session.configMessage}</p>
        ) : null}

        <div className="mt-8">
          {session.configMessage ? null : user ? (
            <div className="flex flex-col items-start gap-4">
              <p className="text-sm text-muted">
                Signed in as {user.email ?? user.id}
              </p>
              <Link href="/experiences/new" className="text-sm text-brass transition-colors duration-200 hover:text-brass-strong">
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
