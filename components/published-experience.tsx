import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BookmarkButton } from "@/components/bookmark-button";
import { getBookmarkStatus } from "@/lib/bookmarks";
import { getExperience, type ExperienceDetail } from "@/lib/experience-detail";
import type { OpportunityType, RoundType } from "@/lib/models/enums";
import { readSession } from "@/lib/supabase/session";

const opportunityLabels: Record<OpportunityType, string> = {
  internship: "Internship",
  full_time: "Full-time",
};

const roundLabels: Record<RoundType, string> = {
  online_assessment: "Online assessment",
  technical: "Technical",
  managerial: "Managerial",
  hr: "HR",
  other: "Other",
};

export async function PublishedExperience({ id }: { id: string }) {
  const experience = await getExperience(id);
  if (!experience) {
    notFound();
  }
  const session = await readSession();
  const initialSaved = session.user ? await getBookmarkStatus(session.user.id, id) : false;

  return (
    <article className="mx-auto w-full max-w-2xl">
      <Link
        href="/experiences"
        className="text-sm text-brass transition-colors duration-200 hover:text-brass-strong"
      >
        ← Back to experiences
      </Link>
      <header className="mt-8 border-b border-line pb-8">
        <Link
          href={`/companies/${experience.companySlug}`}
          className="text-sm tracking-[0.16em] text-brass transition-colors duration-200 hover:text-brass-strong"
        >
          {experience.companyName.toUpperCase()}
        </Link>
        <h1 className="mt-3 text-4xl text-paper">{experience.roleTitle}</h1>
        <p className="mt-4 text-muted">
          {experience.collegeName} · {experience.branch} · {experience.interviewYear}
        </p>
        <Link
          href={`/profiles/${experience.authorId}`}
          className="mt-3 inline-block text-sm text-muted transition-colors duration-200 hover:text-brass"
        >
          View contributor profile →
        </Link>
        <div className="mt-5 flex flex-wrap gap-2 text-sm text-faint">
          <Badge>{opportunityLabels[experience.opportunityType]}</Badge>
          <Badge>{selectionLabel(experience.selectionStatus)}</Badge>
          <Badge>Graduating {experience.graduationYear}</Badge>
        </div>
        <BookmarkButton experienceId={id} initialSaved={initialSaved} signedIn={Boolean(session.user)} />
      </header>

      <div className="divide-y divide-line">
        <DetailSection title="Preparation">
          <DetailText label="How I prepared" value={experience.preparation} />
          <DetailText label="Focus topics" value={experience.focusTopics} />
          <DetailText label="Resources" value={experience.resources} />
        </DetailSection>

        <DetailSection title="Interview rounds">
          <div className="flex flex-col gap-5">
            {experience.rounds.map((round) => (
              <section key={round.position} className="rounded-lg border border-line bg-panel p-4 sm:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl text-paper">
                    Round {round.position}: {round.title || roundLabels[round.roundType]}
                  </h3>
                  <p className="text-sm text-faint">
                    {[roundLabels[round.roundType], round.difficulty, durationLabel(round.durationMinutes)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <DetailText label="Notes" value={round.notes} />
                <DetailText label="Topics" value={round.topics.join(", ")} />
                {round.questions.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-xs tracking-[0.12em] text-faint">QUESTIONS</p>
                    <ol className="mt-2 list-decimal space-y-2 pl-5 text-muted">
                      {round.questions.map((question) => (
                        <li key={question.position}>{question.prompt}</li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </DetailSection>

        <DetailSection title="Advice">
          <DetailText value={experience.advice} />
        </DetailSection>
      </div>
    </article>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="py-8 first:pt-0">
      <h2 className="text-2xl text-paper">{title}</h2>
      <div className="mt-4 flex flex-col gap-5">{children}</div>
    </section>
  );
}

function DetailText({ label, value }: { label?: string; value?: string }) {
  if (!value?.trim()) {
    return null;
  }

  return (
    <div>
      {label ? <p className="text-xs tracking-[0.12em] text-faint">{label.toUpperCase()}</p> : null}
      <p className="mt-1 whitespace-pre-wrap text-muted">{value}</p>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-line px-3 py-1">{children}</span>;
}

function selectionLabel(status: ExperienceDetail["selectionStatus"]) {
  if (!status) {
    return "Outcome not shared";
  }
  return status.replace("_", " ");
}

function durationLabel(minutes?: number) {
  return minutes ? `${minutes} min` : undefined;
}
