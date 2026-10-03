import { ExperienceCard } from "@/components/experience-card";
import { listExperiences } from "@/lib/experiences";

export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let cards: Awaited<ReturnType<typeof listExperiences>> = [];
  let failed = false;

  try {
    cards = await listExperiences();
  } catch {
    failed = true;
  }

  return (
    <main className="flex flex-1 px-6 py-16">
      <div className="mx-auto w-full max-w-xl">
        <p className="text-sm tracking-[0.16em] text-brass">LIBRARY</p>
        <h1 className="mt-3 text-4xl text-paper">Experiences</h1>
        {query ? (
          <p className="mt-4 text-muted">“{query}” is in this search.</p>
        ) : (
          <p className="mt-4 text-muted">Interview experiences from seniors, one card at a time.</p>
        )}

        {failed ? (
          <p className="mt-8 text-sm text-clay">Experiences could not be loaded. Try again in a moment.</p>
        ) : cards.length === 0 ? (
          <p className="mt-8 text-muted">No experiences yet.</p>
        ) : (
          <ul className="mt-8 flex flex-col gap-4">
            {cards.map((card, index) => (
              <li key={card.id}>
                <ExperienceCard {...card} index={index} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
