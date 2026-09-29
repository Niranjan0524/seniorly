export function supabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set",
    );
  }

  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be the project URL from Supabase, starting with https://",
    );
  }

  return { url, anonKey };
}
