"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function nextPath() {
  const next = new URLSearchParams(window.location.search).get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/experiences/new";
  }

  return next;
}

export function GoogleSignInButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setPending(true);
    setError(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath())}`;
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (signInError) {
      setError("Google sign-in could not start.");
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={signIn}
        disabled={pending}
        className="rounded-lg bg-brass px-4 py-2.5 text-sm font-medium text-ink hover:bg-brass-strong disabled:opacity-60"
      >
        {pending ? "Redirecting to Google…" : "Continue with Google"}
      </button>
      {error ? <p className="text-sm text-clay">{error}</p> : null}
    </div>
  );
}
