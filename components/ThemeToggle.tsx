"use client";

import { useEffect, useState } from "react";
import "../app/theme.css";

export function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("ka_theme") || "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("light", saved === "light");
    document.body.classList.toggle("light", saved === "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("ka_theme", next);
    document.documentElement.classList.toggle("light", next === "light");
    document.body.classList.toggle("light", next === "light");
  }

  return (
    <button className="theme-toggle-fixed" onClick={toggle}>
    </button>
  );
}
