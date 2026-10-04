import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceCard } from "@/components/experience-card";
import { getCompanyPage } from "@/lib/company-page";

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await getCompanyPage(slug);

  if (!company) {
    notFound();
  }

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
          <p className="text-sm tracking-[0.16em] text-brass">COMPANY</p>
          <h1 className="mt-3 text-4xl text-paper">{company.name}</h1>
          <p className="mt-4 text-muted">
            {company.experiences.length === 1
              ? "1 interview experience from the Seniorly community."
              : `${company.experiences.length} interview experiences from the Seniorly community.`}
          </p>
          {company.website ? (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block text-sm text-brass transition-colors duration-200 hover:text-brass-strong"
            >
              Visit company website ↗
            </a>
          ) : null}
        </header>

        {company.experiences.length === 0 ? (
          <p className="mt-8 text-muted">
            No experiences have been shared for {company.name} yet. Be the first to add one.
          </p>
        ) : (
          <ul className="mt-8 flex flex-col gap-4">
            {company.experiences.map((experience, index) => (
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
