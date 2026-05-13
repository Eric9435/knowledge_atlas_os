import { supabase } from "./supabase";

function fail(error: any) {
  const message =
    error?.message ||
    error?.details ||
    error?.hint ||
    JSON.stringify(error);

  throw new Error(message);
}

export async function getCloudBooks() {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) fail(error);
  return data || [];
}

export async function saveCloudBook(book: any) {
  const payload = {
    id: String(book.id),
    title: book.title,
    author: book.author || "Unknown",
    subjects: book.subjects || [],
    downloads: book.downloads || 0,
    text_url: book.textUrl || book.text_url || "",
    analysis: book.analysis || "",
    favorite: book.favorite || false,
    important: book.important ?? true,
    status: book.status || "saved",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("books")
    .upsert(payload, { onConflict: "id" });

  if (error) fail(error);
}

export async function deleteCloudBook(id: string | number) {
  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", String(id));

  if (error) fail(error);
}
