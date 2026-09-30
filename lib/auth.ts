import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { readSession } from "@/lib/supabase/session";

export async function requireUser(): Promise<User | NextResponse> {
  const session = await readSession();

  if (!session.user) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Sign in required" } },
      { status: 401 },
    );
  }

  return session.user;
}
