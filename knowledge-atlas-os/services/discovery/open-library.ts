export async function searchOpenLibrary(query: string) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Open Library search failed");
  return response.json();
}
