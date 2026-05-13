"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function PolishedOutput({ content }: { content: string }) {
  return (
    <div className="polished">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "No output yet."}</ReactMarkdown>
    </div>
  );
}
