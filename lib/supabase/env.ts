export function supabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be the project URL from Supabase, starting with https://",
    );
  }

  if (key.startsWith("sb_secret_")) {
    throw new Error(
      "Use the publishable key in NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, not the secret key",
    );
  }

  return { url, anonKey: key };
}
