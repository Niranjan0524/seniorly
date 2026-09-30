import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { readSession } from "@/lib/supabase/session";

export default async function NewExperiencePage() {
  const session = await readSession();

  if (session.configMessage) {
    return (
      <main className="flex flex-1 bg-ink px-6 py-16 text-paper">
        <p className="mx-auto max-w-xl text-sm text-clay">{session.configMessage}</p>
      </main>
    );
  }

  if (!session.user) {
    redirect("/signin?next=/experiences/new");
  }

  return (
    <main className="flex flex-1 bg-ink px-6 py-16 text-paper">
      <div className="mx-auto w-full max-w-xl">
        <p className="text-sm text-muted">
          Signed in as {session.user.email ?? session.user.id}
        </p>
        <h1 className="mt-3 text-3xl">New interview experience</h1>
        <p className="mt-3 max-w-prose text-muted">
          The form for company, rounds, and questions comes next. This page is only available after you sign in.
        </p>
        <div className="mt-8">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
