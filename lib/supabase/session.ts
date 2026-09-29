import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function readSession(): Promise<{
  user: User | null;
  configMessage: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return { user: data.user, configMessage: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.startsWith("NEXT_PUBLIC_SUPABASE_URL")) {
      return { user: null, configMessage: message };
    }

    return { user: null, configMessage: "Sign-in is unavailable right now." };
  }
}
