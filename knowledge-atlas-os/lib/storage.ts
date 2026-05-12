export type KnowledgeBook = {
  id: string | number;
  title: string;
  author?: string;
  subjects?: string[];
  downloads?: number;
  textUrl?: string;
  analysis?: string;
  favorite?: boolean;
  important?: boolean;
  status?: "saved" | "reading" | "done";
  savedAt?: string;
  updatedAt?: string;
  recordDate?: string;
};

export function todayKey(){ return new Date().toISOString().slice(0,10); }

export function getBooks(): KnowledgeBook[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("ka_books") || "[]"); }
  catch { return []; }
}

export function saveBook(book: KnowledgeBook) {
  const old = getBooks();
  const id = String(book.id);
  const exists = old.find(b => String(b.id) === id);
  const record = {
    ...exists, ...book, id,
    favorite: book.favorite ?? exists?.favorite ?? false,
    important: book.important ?? exists?.important ?? false,
    status: book.status ?? exists?.status ?? "saved",
    savedAt: exists?.savedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    recordDate: exists?.recordDate || todayKey(),
  };
  const next = exists ? old.map(b => String(b.id) === id ? record : b) : [record, ...old];
  localStorage.setItem("ka_books", JSON.stringify(next));
  return record;
}

export function deleteBook(id: string | number) {
  const next = getBooks().filter(b => String(b.id) !== String(id));
  localStorage.setItem("ka_books", JSON.stringify(next));
  return next;
}
