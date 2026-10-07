"use client";

import { useState } from "react";

export function UpvoteButton({
  experienceId,
  initialCount,
  initialVoted,
  signedIn,
}: {
  experienceId: string;
  initialCount: number;
  initialVoted: boolean;
  signedIn: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    if (!signedIn) {
      setError("Sign in to upvote this experience.");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/experiences/${experienceId}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voted: !voted }),
      });
      const data: unknown = await response.json();
      if (!response.ok || !isUpvoteResponse(data)) {
        throw new Error("Upvote could not be updated.");
      }
      setCount(data.count);
      setVoted(data.voted);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Upvote could not be updated.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={voted}
        className="rounded-lg border border-line px-4 py-2 text-sm text-paper transition-[border-color,color] duration-200 hover:border-brass hover:text-brass-strong disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Updating..." : voted ? "Upvoted" : "Upvote"} · {count}
      </button>
      {error ? <p className="mt-2 text-sm text-clay">{error}</p> : null}
    </div>
  );
}

function isUpvoteResponse(value: unknown): value is { count: number; voted: boolean } {
  return (
    typeof value === "object" &&
    value !== null &&
    "count" in value &&
    "voted" in value &&
    typeof value.count === "number" &&
    typeof value.voted === "boolean"
  );
}
