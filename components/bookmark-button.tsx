"use client";

import { useState } from "react";

export function BookmarkButton({
  experienceId,
  initialSaved,
  signedIn,
}: {
  experienceId: string;
  initialSaved: boolean;
  signedIn: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateBookmark() {
    if (!signedIn) {
      setError("Sign in to save experiences.");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/experiences/${experienceId}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saved: !saved }),
      });
      const data: unknown = await response.json();
      if (!response.ok || !data || typeof data !== "object" || !("saved" in data) || typeof data.saved !== "boolean") {
        throw new Error("Bookmark could not be updated.");
      }
      setSaved(data.saved);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Bookmark could not be updated.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={updateBookmark}
        disabled={pending}
        aria-pressed={saved}
        className="rounded-lg border border-line px-4 py-2 text-sm text-paper transition-[border-color,color] duration-200 hover:border-brass hover:text-brass-strong disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Saving..." : saved ? "Saved" : "Save experience"}
      </button>
      {error ? <p className="mt-2 text-sm text-clay">{error}</p> : null}
    </div>
  );
}
