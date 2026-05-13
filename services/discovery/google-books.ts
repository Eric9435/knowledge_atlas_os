export async function searchGoogleBooks(query: string) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Google Books search failed");
  return response.json();
}
