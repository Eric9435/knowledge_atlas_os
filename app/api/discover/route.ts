import { NextResponse } from "next/server";
import { searchGoogleBooks } from "@/services/discovery/google-books";
import { searchOpenLibrary } from "@/services/discovery/open-library";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "business strategy";

  const [google, openLibrary] = await Promise.allSettled([
    searchGoogleBooks(q),
    searchOpenLibrary(q),
  ]);

  return NextResponse.json({
    query: q,
    google: google.status === "fulfilled" ? google.value : null,
    openLibrary: openLibrary.status === "fulfilled" ? openLibrary.value : null,
  });
}
