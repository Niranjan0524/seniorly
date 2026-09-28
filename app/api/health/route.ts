import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const connection = await connectDB();
    if (connection.connection.readyState !== 1) {
      return NextResponse.json(
        { ok: false, error: "Database is not connected" },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const errorText =
      message === "MONGODB_URI is not set"
        ? message
        : "Database connection failed";

    return NextResponse.json({ ok: false, error: errorText }, { status: 503 });
  }
}
