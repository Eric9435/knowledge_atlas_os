"use client";

import { useEffect, useState } from "react";

export function FloatingControls() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("ka_theme") || "dark";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";

    setTheme(next);

    localStorage.setItem("ka_theme", next);

    document.documentElement.dataset.theme = next;
  }

  return (
    <button
      className="floating-theme-toggle"
      onClick={toggleTheme}
      title="Toggle Theme"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
