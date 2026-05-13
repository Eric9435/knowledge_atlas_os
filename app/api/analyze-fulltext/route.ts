import { NextResponse } from "next/server";

function cleanText(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/\*\*\* START OF.*?\*\*\*/g, "")
    .replace(/\*\*\* END OF.*?\*\*\*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function fetchBookText(book: any) {
  const urls = [
    book.textUrl,
    book.textUrl?.replace("http://", "https://"),
    `https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.txt`,
    `https://www.gutenberg.org/files/${book.id}/${book.id}-0.txt`,
    `https://www.gutenberg.org/files/${book.id}/${book.id}.txt`,
  ].filter(Boolean);

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const txt = await res.text();
        if (txt.length > 500) return txt;
      }
    } catch {}
  }

  throw new Error("Could not fetch Gutenberg text.");
}

export async function POST(request: Request) {
  try {
    const book = await request.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENROUTER_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const raw = await fetchBookText(book);
    const excerpt = cleanText(raw).slice(0, 1200);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Knowledge Atlas OS",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          {
            role: "system",
            content:
              "Analyze real public-domain book text in polished English. Use markdown headings, bullet points, and tables when useful.",
          },
          {
            role: "user",
            content: `BOOK: ${book.title}\nAUTHOR: ${book.author}\n\nTEXT:\n${excerpt}\n\nReturn:\n# Short Summary\n# Important Facts\n# Core Ideas\n# Mental Models\n# Key Takeaways\n# Action Points`,
          },
        ],
        temperature: 0.4,
      }),
    });

    const text = await response.text();

    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      return NextResponse.json(
        { error: "OpenRouter returned invalid JSON", raw: text.slice(0, 1000) },
        { status: 500 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || JSON.stringify(data) },
        { status: response.status }
      );
    }

    return NextResponse.json({
      analysis: data.choices?.[0]?.message?.content || "No analysis.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Analysis failed." },
      { status: 500 }
    );
  }
}
