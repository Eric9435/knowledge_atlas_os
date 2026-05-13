"use client";

import { useEffect, useState } from "react";
import { startSession, updateSessionDuration, formatDuration } from "@/lib/session";
import Link from "next/link";
import jsPDF from "jspdf";
import { saveBook, getBooks } from "@/lib/storage";
import { saveCloudBook } from "@/lib/cloudStorage";
import { PolishedOutput } from "@/components/PolishedOutput";
import { ThemeToggle } from "@/components/ThemeToggle";

type Book = { id:number; title:string; author:string; subjects:string[]; downloads:number; textUrl:string; };

export default function DailyPage(){

  const categories = [
    "psychology",
    "business",
    "history",
    "technology",
    "science",
    "philosophy",
    "economics",
    "leadership",
    "productivity",
    "music"
  ];

  const [category,setCategory]=useState("psychology");
  const [query,setQuery]=useState("psychology");
  const [duration,setDuration]=useState(0);
  const [books,setBooks]=useState<Book[]>([]);
  const [selected,setSelected]=useState<Book|null>(null);
  const [analysis,setAnalysis]=useState("");
  const [loading,setLoading]=useState(false);
  const [analyzing,setAnalyzing]=useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ka_generated_books");
    if (saved) {
      try {
        setBooks(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const [leftWidth,setLeftWidth]=useState(42);
  const [dragging,setDragging]=useState(false);

  useEffect(() => {
    startSession();
    const timer = setInterval(() => {
      setDuration(updateSessionDuration());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  async function searchBooks(){
    setLoading(true);
    const savedIds=new Set(getBooks().map(x=>String(x.id)));
    const searchTerm = category || query;
    const res=await fetch(`https://gutendex.com/books/?search=${encodeURIComponent(searchTerm)}`);
    const data=await res.json();
    const mapped=(data.results||[])
      .filter((b:any)=>(b.formats["text/plain; charset=utf-8"]||b.formats["text/plain"])&&!savedIds.has(String(b.id)))
      .slice(0,5)
      .map((b:any)=>({
        id:b.id,title:b.title,author:b.authors?.map((a:any)=>a.name).join(", ")||"Unknown",
        subjects:b.subjects||[],downloads:b.download_count||0,
        textUrl:b.formats["text/plain; charset=utf-8"]||b.formats["text/plain"]
      }));
    setBooks(mapped);
    localStorage.setItem("ka_generated_books", JSON.stringify(mapped));
    setLoading(false);
  }

  async function openBook(book:Book){
    setSelected(book); setAnalysis(""); setAnalyzing(true);
    const res=await fetch("/api/analyze-fulltext",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(book)});
    const raw=await res.text();
    let data:any={};
    try{ data=raw?JSON.parse(raw):{}; }catch{ setAnalysis("API returned invalid response."); setAnalyzing(false); return; }
    if(!res.ok||data.error){ setAnalysis("❌ ERROR\n\n"+JSON.stringify(data,null,2)); setAnalyzing(false); return; }
    setAnalysis(data.analysis); setAnalyzing(false);
  }

  async function saveCurrent(){
    if(!selected) return;

    const record = {
      ...selected,
      analysis,
      important:true,
      status:"saved" as const,
    };

    saveBook(record);

    try {
      await saveCloudBook(record);
      alert("Saved locally + Supabase cloud.");
    } catch (err:any) {
      alert("Saved locally, but Supabase failed: " + (err?.message || String(err)));
    }
  }

  function newGenerateSection(){
    if (!confirm("Clear current generated books?")) return;
    setBooks([]);
    setSelected(null);
    setAnalysis("");
    localStorage.removeItem("ka_generated_books");
  }

  function exportPDF(){
    const doc=new jsPDF(); let y=18;
    doc.setFontSize(18); doc.text("Knowledge Atlas OS - Generated Books",14,y); y+=12;
    books.forEach((b,i)=>{ if(y>270){doc.addPage(); y=18;} doc.setFontSize(12); doc.text(`${i+1}. ${b.title}`,14,y); y+=7; doc.setFontSize(10); doc.text(`Author: ${b.author}`,14,y); y+=7; doc.text(`Downloads: ${b.downloads}`,14,y); y+=10; });
    doc.save("generated-books.pdf");
  }

  return <main
    className="app"
    onMouseMove={(e)=>{
      if(!dragging) return;

      if(window.innerWidth <= 950){
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.min(75, Math.max(25, percent)));
    }}
    onMouseUp={()=>setDragging(false)}
    onMouseLeave={()=>setDragging(false)}
  >
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
}.app{min-height:100vh;color:white;padding:34px;background:radial-gradient(circle at top left,rgba(59,130,246,.22),transparent 30%),radial-gradient(circle at bottom right,rgba(168,85,247,.18),transparent 30%),#050816}.top{max-width:1500px;margin:0 auto 28px}.nav{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.nav a{color:white;text-decoration:none;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);padding:12px 16px;border-radius:14px;font-weight:800}.eyebrow{color:#93c5fd;letter-spacing:.28em;text-transform:uppercase;font-size:12px;font-weight:900}h1{font-size:54px;margin:12px 0}.sub{color:#a1a1aa;line-height:1.8}.search{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}input,.select{
        flex:1;
        min-width:260px;
        background:rgba(255,255,255,.06);
        border:1px solid rgba(255,255,255,.12);
        color:white;
        padding:16px 20px;
        border-radius:18px;
        font-weight:900;
      }.select option{color:black}.timer{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);border-radius:18px;padding:16px 20px;font-weight:900;color:#93c5fd}.btn{border:0;background:white;color:black;padding:16px 20px;border-radius:18px;font-weight:900;cursor:pointer}
.danger{background:#ef4444;color:white}.layout{
        max-width:1600px;
        margin:0 auto;
        display:grid;
        grid-template-columns:${leftWidth}% 10px calc(${100-leftWidth}% - 10px);
        gap:18px;
        align-items:start;
      }

      .divider{
        width:10px;
        min-height:82vh;
        cursor:col-resize;
        background:transparent !important;
        border:0 !important;
        box-shadow:none !important;
        opacity:0 !important;
        justify-self:center;
      }

      .divider:hover,
      .divider.active{
        background:linear-gradient(180deg,#60a5fa,#a78bfa);
        box-shadow:0 0 25px rgba(96,165,250,.45);
      }.list{
        display:grid;
        gap:15px;
        max-height:88vh;
        overflow:auto;
      }.card{background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.12);border-radius:26px;padding:22px;cursor:pointer}.card:hover{background:rgba(255,255,255,.1)}.cat{color:#c4b5fd;font-size:11px;font-weight:900;letter-spacing:.24em;text-transform:uppercase}.title{font-size:25px;font-weight:900;margin-top:10px}.author{color:#a1a1aa;margin-top:8px}.panel{
        background:rgba(0,0,0,.42);
        border:1px solid rgba(255,255,255,.12);
        border-radius:30px;
        padding:28px;
        max-height:88vh;
        overflow:auto;
        resize:horizontal;
      }.paneltitle{font-size:38px;font-weight:900;line-height:1.1;margin-top:12px}.actions{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}.save{background:#22c55e;color:white}.polished{
        margin-top:20px;
        background:rgba(255,255,255,.055);
        border:1px solid rgba(255,255,255,.12);
        border-radius:24px;
        padding:28px;
        line-height:2;
        color:#e5e7eb;
        font-size:17px;
        overflow-wrap:break-word;
      }.polished h1,.polished h2,.polished h3{color:white}.polished table{width:100%;border-collapse:separate;border-spacing:0;border:1px solid rgba(255,255,255,.14);border-radius:16px;overflow:hidden}.polished th{background:rgba(59,130,246,.22);padding:12px;text-align:left}.polished td{padding:12px;border-top:1px solid rgba(255,255,255,.08)}@media(max-width:950px){
        .layout{
          grid-template-columns:1fr !important;
          grid-template-rows:auto 8px auto;
        }
        .divider{
        width:10px;
        min-height:82vh;
        cursor:col-resize;
        background:transparent !important;
        border:0 !important;
        box-shadow:none !important;
        opacity:0 !important;
        justify-self:center;
      }
        h1{font-size:38px}
      }
        .divider{
        width:10px;
        min-height:82vh;
        cursor:col-resize;
        background:transparent !important;
        border:0 !important;
        box-shadow:none !important;
        opacity:0 !important;
        justify-self:center;
      }
        h1{
          font-size:38px;
        }
      }`}</style>
    <ThemeToggle />
      <section className="top">
      <div className="eyebrow">Knowledge Atlas OS</div><h1>Daily Full-Text Intelligence</h1>
      <p className="sub">Generate public-domain books. Saved books will not appear again unless deleted from records.</p><nav className="nav"><Link href="/">Home</Link><Link href="/dashboard">Dashboard</Link><Link href="/records">Records</Link><Link href="/books">Library</Link></nav>
      <div className="search">
        <select
          className="select"
          value={category}
          onChange={(e)=>{
            setCategory(e.target.value);
            setQuery(e.target.value);
          }}
        >
          {categories.map(c => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>

        <button className="btn" onClick={searchBooks}>
          {loading?"Generating...":"Generate 5 Books"}
        </button>

        <button className="btn" onClick={exportPDF}>
          Export PDF
        </button>


      </div>

    </section>
    <section className="layout">
      <div className="list">{books.map(b=><div className="card" key={b.id} onClick={()=>openBook(b)}><div className="cat">{b.subjects[0]||"Public Domain"}</div><div className="title">{b.title}</div><div className="author">{b.author}</div><div className="author">{b.downloads.toLocaleString()} downloads</div></div>)}</div>

      <div
        className={`divider ${dragging ? "active" : ""}`}
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
        onTouchMove={(e)=>{
          if(window.innerWidth > 950) return;
          const touch = e.touches[0];
          const panel = document.querySelector(".panel") as HTMLElement | null;
          const list = document.querySelector(".list") as HTMLElement | null;
          if(!panel || !list) return;
          const y = touch.clientY;
          list.style.maxHeight = Math.max(180, y - list.getBoundingClientRect().top - 20) + "px";
        }}
        onTouchEnd={() => setDragging(false)}
      />

      <aside className="panel">{selected? <><div className="cat">{selected.subjects[0]||"Book"}</div><div className="paneltitle">{selected.title}</div><div className="author">{selected.author}</div><div className="actions"><button className="btn save" onClick={saveCurrent}>Save Book</button></div>{analyzing?<p className="sub">Analyzing...</p>:<PolishedOutput content={analysis}/>}</> : <p className="sub">Search and click a book.</p>}</aside>
    </section>
  </main>
}
