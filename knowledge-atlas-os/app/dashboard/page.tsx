"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getBooks, KnowledgeBook, deleteBook } from "@/lib/storage";
import { getCloudBooks, deleteCloudBook } from "@/lib/cloudStorage";
import { getVisitLogs, formatDuration } from "@/lib/session";
import { PolishedOutput } from "@/components/PolishedOutput";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardPage() {

  const [books, setBooks] = useState<KnowledgeBook[]>([]);
  const [selected, setSelected] = useState<KnowledgeBook | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  function refresh() {
    const data = getBooks();
    setBooks(data);
    setSelected(data[0] || null);
    setLogs(getVisitLogs());
  }

  useEffect(() => { void refresh(); }, []);

  const favorite = books.filter((b) => b.favorite).length;
  const important = books.filter((b) => b.important).length;

  const categoryStats = useMemo(() => {
    const map: Record<string, number> = {};
    books.forEach((b) => {
      const c = b.subjects?.[0] || "General";
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [books]);

  async function remove(id: string | number) {
    if (!confirm("Delete this record?")) return;
    await deleteCloudBook(id);
    const next = deleteBook(id);
    setBooks(next);
    setSelected(next[0] || null);
  }

  const total = books.length || 1;
  let offset = 0;

  return (
    <main className="page">
      <style>{`
        body{margin:0;background:#050816;font-family:Inter,Arial,sans-serif}
.light{
  color:#111827 !important;
  background:
    radial-gradient(circle at top left,rgba(59,130,246,.16),transparent 30%),
    radial-gradient(circle at bottom right,rgba(168,85,247,.13),transparent 30%),
    #f8fafc !important;
}
.light .card,
.light .panel,
.light .sheet,
.light .detail,
.light .stat,
.light .cardBox{
  background:rgba(255,255,255,.82) !important;
  border-color:rgba(15,23,42,.12) !important;
  color:#111827 !important;
  box-shadow:0 20px 60px rgba(15,23,42,.08);
}
.light .sub,
.light .author,
.light .muted{
  color:#475569 !important;
}
.light .btn,
.light .themebtn,
.light .nav a{
  background:#111827 !important;
  color:white !important;
}
.light .polished{
  background:#ffffff !important;
  color:#111827 !important;
  border-color:rgba(15,23,42,.12) !important;
}
.light .polished p,
.light .polished li,
.light .polished td{
  color:#111827 !important;
}
.light .polished th{
  color:#111827 !important;
  background:#dbeafe !important;
}
.themebtn{
  border:1px solid rgba(255,255,255,.14);
  background:rgba(255,255,255,.07);
  color:white;
  padding:14px 18px;
  border-radius:16px;
  font-weight:900;
  cursor:pointer;
}
        .page{min-height:100vh;color:white;padding:34px;background:radial-gradient(circle at top left,rgba(59,130,246,.22),transparent 30%),radial-gradient(circle at bottom right,rgba(168,85,247,.18),transparent 30%),#050816}
        .top{max-width:1500px;margin:0 auto 26px;display:flex;justify-content:space-between;gap:20px;align-items:end;flex-wrap:wrap}
        .eyebrow{color:#93c5fd;letter-spacing:.28em;text-transform:uppercase;font-size:12px;font-weight:900}
        h1{font-size:52px;margin:12px 0 0;line-height:1}.sub{color:#a1a1aa;line-height:1.8}
        .nav{display:flex;gap:10px;flex-wrap:wrap}.nav a{color:white;text-decoration:none;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);padding:12px 16px;border-radius:14px;font-weight:800}
        .stats{max-width:1500px;margin:0 auto 24px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.stat{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.055);border-radius:24px;padding:20px}.stat b{font-size:34px;display:block}
        .grid{max-width:1500px;margin:0 auto 24px;display:grid;grid-template-columns:.85fr 1.15fr;gap:20px}
        .cardBox,.sheet,.detail{border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.38);border-radius:28px;overflow:hidden}
        .cardBox{padding:24px}.pieWrap{display:flex;gap:22px;align-items:center;flex-wrap:wrap}.legend{display:grid;gap:10px}.dot{display:inline-block;width:12px;height:12px;border-radius:99px;margin-right:8px}
        .layout{max-width:1500px;margin:0 auto;display:grid;grid-template-columns:1.1fr .9fr;gap:20px}
        .head,.row{display:grid;grid-template-columns:54px 2fr 1.2fr 1fr 90px}.head{background:rgba(255,255,255,.08);color:#93c5fd;font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
        .row{width:100%;border:0;border-top:1px solid rgba(255,255,255,.08);background:transparent;color:white;text-align:left;cursor:pointer;font:inherit}.row:hover,.row.active{background:rgba(59,130,246,.18)}
        .cell{padding:15px 14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.muted{color:#a1a1aa}.pill{border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:5px 9px;color:#c4b5fd;font-size:12px}
        .detail{padding:24px;max-height:82vh;overflow:auto}.detail h2{font-size:32px;margin:12px 0}.actions{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}.btn{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.07);color:white;border-radius:14px;padding:12px 15px;font-weight:900;cursor:pointer}.delete{color:#fecaca;border-color:rgba(248,113,113,.35)}
        .logRow{display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,.08);padding:12px 0;color:#e5e7eb}
        .polished{margin-top:18px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.12);border-radius:24px;padding:24px;line-height:1.85;color:#e5e7eb}
        @media(max-width:950px){.layout,.grid{grid-template-columns:1fr}.stats{grid-template-columns:repeat(2,1fr)}.head,.row{grid-template-columns:45px 2fr 1fr}.hide{display:none}h1{font-size:38px}}
      `}</style>

      <ThemeToggle />
      <section className="top">
        <div>
          <div className="eyebrow">Knowledge Atlas OS</div>
          <h1>Dashboard</h1>
          <p className="sub">Category chart, reading records, and site duration.</p>
        </div>
        <nav className="nav">
          <Link href="/">Home</Link>
          <Link href="/daily">Daily Feed</Link>
          <Link href="/records">Records</Link>
          <Link href="/books">Library</Link>
        </nav>
      </section>

      <section className="stats">
        <div className="stat"><b>{books.length}</b><span className="sub">Saved</span></div>
        <div className="stat"><b>{favorite}</b><span className="sub">Favorite</span></div>
        <div className="stat"><b>{important}</b><span className="sub">Important</span></div>
        <div className="stat"><b>{logs[0]?.durationSeconds ? formatDuration(logs[0].durationSeconds) : "0h 0m 0s"}</b><span className="sub">Today Duration</span></div>
      </section>

      <section className="grid">
        <div className="cardBox">
          <div className="eyebrow">Category Pie Chart</div>
          <div className="pieWrap">
            <svg width="220" height="220" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="rgba(255,255,255,.08)" strokeWidth="8" />
              {categoryStats.map(([name, count], i) => {
                const colors = ["#60a5fa","#a78bfa","#22c55e","#facc15","#fb7185","#38bdf8","#f97316"];
                const value = (count / total) * 100;
                const dash = `${value} ${100-value}`;
                const el = <circle key={name} cx="21" cy="21" r="15.9" fill="transparent" stroke={colors[i%colors.length]} strokeWidth="8" strokeDasharray={dash} strokeDashoffset={-offset} />;
                offset += value;
                return el;
              })}
            </svg>

            <div className="legend">
              {categoryStats.length === 0 ? <p className="sub">No data yet.</p> : categoryStats.map(([name, count], i) => {
                const colors = ["#60a5fa","#a78bfa","#22c55e","#facc15","#fb7185","#38bdf8","#f97316"];
                return <div key={name}><span className="dot" style={{background:colors[i%colors.length]}} />{name}: {count}</div>
              })}
            </div>
          </div>
        </div>

        <div className="cardBox">
          <div className="eyebrow">Visit Logs</div>
          {logs.length === 0 ? <p className="sub">No visit log yet.</p> : logs.map((log, i) => (
            <div className="logRow" key={i}>
              <span>{log.date}</span>
              <span>{formatDuration(log.durationSeconds || 0)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="layout">
        <div className="sheet">
          <div className="head">
            <div className="cell">No</div><div className="cell">Book</div><div className="cell hide">Author</div><div className="cell hide">Category</div><div className="cell">Flags</div>
          </div>
          {books.map((book, i) => (
            <button key={`${book.id}-${i}`} className={`row ${selected?.id===book.id?"active":""}`} onClick={() => setSelected(book)}>
              <div className="cell muted">{i+1}</div>
              <div className="cell"><b>{book.title}</b></div>
              <div className="cell muted hide">{book.author || "Unknown"}</div>
              <div className="cell hide"><span className="pill">{book.subjects?.[0] || "General"}</span></div>
              <div className="cell">{book.favorite ? "★ " : ""}{book.important ? "!" : ""}</div>
            </button>
          ))}
        </div>

        <aside className="detail">
          {selected ? (
            <>
              <div className="eyebrow">{selected.subjects?.[0] || "Book"}</div>
              <h2>{selected.title}</h2>
              <p className="sub">{selected.author || "Unknown author"}</p>
              <div className="actions"><button className="btn delete" onClick={() => remove(selected.id)}>Delete</button></div>
              <PolishedOutput content={selected.analysis || selected.insight || "No analysis saved."} />
            </>
          ) : <p className="sub">No saved books yet.</p>}
        </aside>
      </section>
    </main>
  );
}
