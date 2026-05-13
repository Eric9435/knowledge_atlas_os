const categories = ["Business", "History", "Psychology", "Technology", "Society", "Philosophy", "Science", "AI", "Economics", "Music"];

export default function CategoriesPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Categories</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <div key={category} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{category}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}
