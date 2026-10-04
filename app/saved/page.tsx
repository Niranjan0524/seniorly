import Link from "next/link";
import { ExperienceCard } from "@/components/experience-card";
import { listBookmarkedExperiences } from "@/lib/bookmarks";
import { readSession } from "@/lib/supabase/session";

export default async function SavedPage() {
  const session = await readSession();

  if (!session.user) {
    return (
      <main className="flex flex-1 px-6 py-16">
        <div className="mx-auto w-full max-w-xl">
          <p className="text-sm tracking-[0.16em] text-brass">YOUR LIBRARY</p>
          <h1 className="mt-3 text-4xl text-paper">Saved experiences</h1>
          <p className="mt-4 text-muted">Sign in to keep interview experiences handy for later.</p>
          <Link
            href="/signin"
            className="mt-8 inline-block text-sm text-brass transition-colors duration-200 hover:text-brass-strong"
          >
            Sign in to view saved experiences →
          </Link>
        </div>
      </main>
    );
  }

  let experiences: Awaited<ReturnType<typeof listBookmarkedExperiences>> = [];
  let failed = false;
  try {
    experiences = await listBookmarkedExperiences(session.user.id);
  } catch {
    experiences = [];
    failed = true;
  }

  return (
    <main className="flex flex-1 px-6 py-16">
      <div className="mx-auto w-full max-w-xl">
        <p className="text-sm tracking-[0.16em] text-brass">YOUR LIBRARY</p>
        <h1 className="mt-3 text-4xl text-paper">Saved experiences</h1>
        <p className="mt-4 text-muted">The interviews you want to come back to.</p>
        {failed ? (
          <p className="mt-8 text-sm text-clay">Saved experiences could not be loaded. Try again in a moment.</p>
        ) : experiences.length === 0 ? (
          <div className="mt-8 rounded-lg border border-line bg-panel p-5">
            <p className="text-muted">Nothing saved yet.</p>
            <Link
              href="/experiences"
              className="mt-4 inline-block text-sm text-brass transition-colors duration-200 hover:text-brass-strong"
            >
              Browse experiences →
            </Link>
          </div>
        ) : (
          <ul className="mt-8 flex flex-col gap-4">
            {experiences.map((experience, index) => (
              <li key={experience.id}>
                <ExperienceCard {...experience} index={index} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
