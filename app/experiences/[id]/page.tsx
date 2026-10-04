import { PublishedExperience } from "@/components/published-experience";

export default async function ExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="flex flex-1 px-6 py-16">
      <PublishedExperience id={id} />
    </main>
  );
}
