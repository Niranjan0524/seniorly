"use client";

import { useState, type FormEvent } from "react";
import type { ExperienceComment } from "@/lib/comments";

export function ExperienceComments({
  experienceId,
  initialComments,
  signedIn,
}: {
  experienceId: string;
  initialComments: ExperienceComment[];
  signedIn: boolean;
}) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) {
      setError("Write a comment before posting.");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/experiences/${experienceId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data: unknown = await response.json();
      if (!response.ok || !data || typeof data !== "object" || !("comment" in data)) {
        throw new Error("Comment could not be posted.");
      }

      const comment = parseComment(data.comment);
      if (!comment) {
        throw new Error("Comment could not be posted.");
      }
      setComments((current) => [...current, comment]);
      setBody("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Comment could not be posted.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="border-t border-line py-8">
      <h2 className="text-2xl text-paper">Discussion</h2>
      {comments.length === 0 ? (
        <p className="mt-4 text-muted">No comments yet. Add the first helpful note.</p>
      ) : (
        <ul className="mt-5 flex flex-col gap-4">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-lg border border-line bg-panel p-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm text-paper">{comment.authorName}</p>
                <time className="text-xs text-faint" dateTime={comment.createdAt}>
                  {formatDate(comment.createdAt)}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}

      {signedIn ? (
        <form className="mt-6" onSubmit={submit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm text-faint">Share a helpful note</span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="What would help another student prepare?"
              className="rounded-lg border border-line bg-fill px-3 py-2 text-sm text-paper outline-none placeholder:text-faint focus:border-brass"
            />
          </label>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-faint">{body.length}/2000</span>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg border border-line px-4 py-2 text-sm text-paper transition-[border-color,color] duration-200 hover:border-brass hover:text-brass-strong disabled:opacity-60"
            >
              {pending ? "Posting..." : "Post comment"}
            </button>
          </div>
          {error ? <p className="mt-2 text-sm text-clay">{error}</p> : null}
        </form>
      ) : (
        <p className="mt-6 text-sm text-muted">
          <a href="/signin" className="text-brass transition-colors hover:text-brass-strong">
            Sign in
          </a>{" "}
          to join the discussion.
        </p>
      )}
    </section>
  );
}

function parseComment(value: unknown): ExperienceComment | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  if (
    !("id" in value) ||
    !("authorId" in value) ||
    !("authorName" in value) ||
    !("body" in value) ||
    !("createdAt" in value) ||
    typeof value.id !== "string" ||
    typeof value.authorId !== "string" ||
    typeof value.authorName !== "string" ||
    typeof value.body !== "string" ||
    typeof value.createdAt !== "string"
  ) {
    return null;
  }
  return {
    id: value.id,
    authorId: value.authorId,
    authorName: value.authorName,
    body: value.body,
    createdAt: value.createdAt,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}
