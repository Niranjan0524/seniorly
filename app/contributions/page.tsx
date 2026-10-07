import Link from "next/link";
import { redirect } from "next/navigation";
import { ExperienceCard } from "@/components/experience-card";
import { listExperiencesByAuthor } from "@/lib/experiences";
import { readSession } from "@/lib/supabase/session";

export default async function ContributionsPage() {
  const session = await readSession();
  if (!session.user) {
    redirect("/signin?next=/contributions");
  }

  let experiences: Awaited<ReturnType<typeof listExperiencesByAuthor>> = [];
  let failed = false;
  try {
    experiences = await listExperiencesByAuthor(session.user.id);
  } catch {
    failed = true;
  }

  return (
    <main className="flex flex-1 px-6 py-16">
      <div className="mx-auto w-full max-w-xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm tracking-[0.16em] text-brass">YOUR CONTRIBUTIONS</p>
            <h1 className="mt-3 text-4xl text-paper">Experiences you shared</h1>
            <p className="mt-4 text-muted">Keep track of the interview stories you have added to Seniorly.</p>
          </div>
          <Link
            href="/experiences/new"
            className="text-sm text-brass transition-colors duration-200 hover:text-brass-strong"
          >
            Share another →
          </Link>
        </div>

        {failed ? (
          <p className="mt-8 text-sm text-clay">Your contributions could not be loaded. Try again in a moment.</p>
        ) : experiences.length === 0 ? (
          <div className="mt-8 rounded-lg border border-line bg-panel p-5">
            <p className="text-muted">You have not shared an experience yet.</p>
            <Link
              href="/experiences/new"
              className="mt-4 inline-block text-sm text-brass transition-colors duration-200 hover:text-brass-strong"
            >
              Share your first experience →
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
