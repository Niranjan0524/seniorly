import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceCard } from "@/components/experience-card";
import { getPublicProfile } from "@/lib/profile";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getPublicProfile(id);

  if (!profile) {
    notFound();
  }

  const details = [profile.collegeName, profile.branch, profile.graduationYear ? `Class of ${profile.graduationYear}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="flex flex-1 px-6 py-16">
      <div className="mx-auto w-full max-w-xl">
        <Link
          href="/experiences"
          className="text-sm text-brass transition-colors duration-200 hover:text-brass-strong"
        >
          ← Back to experiences
        </Link>
        <header className="mt-8 border-b border-line pb-8">
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-xl text-brass"
            >
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm tracking-[0.16em] text-brass">SENIORLY MEMBER</p>
              <h1 className="mt-1 text-4xl text-paper">{profile.name}</h1>
            </div>
          </div>
          {details ? <p className="mt-5 text-muted">{details}</p> : null}
          <p className="mt-4 text-sm text-faint">
            {profile.experiences.length === 1
              ? "1 shared interview experience"
              : `${profile.experiences.length} shared interview experiences`}
          </p>
        </header>

        {profile.experiences.length === 0 ? (
          <p className="mt-8 text-muted">This member has not shared an interview experience yet.</p>
        ) : (
          <ul className="mt-8 flex flex-col gap-4">
            {profile.experiences.map((experience, index) => (
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
