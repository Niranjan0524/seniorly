import { redirect } from "next/navigation";
import { BasicsForm } from "@/app/experiences/new/basics-form";
import { connectDB } from "@/lib/db";
import { CollegeModel } from "@/lib/models/college";
import { UserModel } from "@/lib/models/user";
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

  let colleges: { id: string; name: string }[] = [];
  let initialCollegeId = "";

  try {
    await connectDB();
    const [collegeDocs, profile] = await Promise.all([
      CollegeModel.find().sort({ name: 1 }).select("name").lean(),
      UserModel.findById(session.user.id).select("collegeId").lean(),
    ]);
    colleges = collegeDocs.map((college) => ({
      id: String(college._id),
      name: college.name,
    }));
    if (profile?.collegeId) {
      initialCollegeId = String(profile.collegeId);
    }
  } catch {
    return (
      <main className="flex flex-1 bg-ink px-6 py-16 text-paper">
        <p className="mx-auto max-w-xl text-sm text-clay">
          Colleges could not be loaded. Try again in a moment.
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 bg-ink px-6 py-16 text-paper">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-3xl">New interview experience</h1>
        <p className="mt-3 text-muted">
          Start with the company, role, and when you interviewed. Rounds come next.
        </p>
        <BasicsForm colleges={colleges} initialCollegeId={initialCollegeId} />
      </div>
    </main>
  );
}
