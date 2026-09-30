export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <main className="flex flex-1 px-6 py-16">
      <div className="mx-auto w-full max-w-xl">
        <p className="text-sm tracking-[0.16em] text-brass">LIBRARY</p>
        <h1 className="mt-3 text-4xl text-paper">Experiences</h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          {query
            ? `“${query}” stays in this search. Written experiences will collect on this page.`
            : "Company, role, and year will narrow this list once experiences are published."}
        </p>
      </div>
    </main>
  );
}
