import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { upsertUserProfile } from "@/lib/users";

function nextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/experiences/new";
  }

  return value;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const destination = nextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        try {
          await upsertUserProfile(data.user);
        } catch (profileError) {
          console.error(profileError);
        }
      }

      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/signin?error=auth`);
}
