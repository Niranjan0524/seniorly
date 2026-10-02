import { notFound } from "next/navigation";
import { PublishedExperience } from "@/components/published-experience";

export default async function ExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) {
    notFound();
  }

  return (
    <main className="flex flex-1 px-6 py-16">
      <PublishedExperience />
    </main>
  );
}
