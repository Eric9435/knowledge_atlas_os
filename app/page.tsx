"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, rgba(59,130,246,.26), transparent 34%), radial-gradient(circle at 80% 80%, rgba(124,58,237,.20), transparent 34%), #050816",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 40px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, Arial, sans-serif',
        overflow: "hidden",
      }}
    >
      <motion.section
        initial={{ opacity: 0, y: 36, filter: "blur(14px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: "1120px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 1 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "34px",
          }}
        >
          <span
            style={{
              width: "11px",
              height: "11px",
              borderRadius: "999px",
              background: "#60a5fa",
              boxShadow: "0 0 16px #60a5fa, 0 0 36px #60a5fa",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "17px",
              color: "#cbd5e1",
              fontWeight: 600,
              letterSpacing: "0.01em",
            }}
          >
            Hello Eric — Welcome back.
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 1 }}
          style={{
            fontSize: "14px",
            fontWeight: 900,
            letterSpacing: "0.42em",
            color: "#93c5fd",
            marginBottom: "22px",
          }}
        >
          KNOWLEDGE ATLAS OS
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 42, filter: "blur(18px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.35, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            margin: 0,
            maxWidth: "1050px",
            fontSize: "clamp(72px, 9vw, 128px)",
            lineHeight: "0.92",
            letterSpacing: "-0.075em",
            fontWeight: 950,
            background:
              "linear-gradient(180deg, #ffffff 0%, #dbeafe 42%, #93c5fd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Full-Text Book Intelligence Engine
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1 }}
          style={{
            marginTop: "34px",
            marginBottom: 0,
            maxWidth: "820px",
            fontSize: "24px",
            lineHeight: "1.65",
            color: "#cbd5e1",
            fontWeight: 500,
          }}
        >
          Search real public-domain books, analyze actual full text, extract
          important insights, organize records, and build a personal intelligence
          system.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 1 }}
          style={{
            display: "flex",
            gap: "18px",
            marginTop: "48px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/daily"
            style={{
              padding: "18px 34px",
              borderRadius: "999px",
              background: "#ffffff",
              color: "#111827",
              fontSize: "15px",
              fontWeight: 900,
              textDecoration: "none",
              boxShadow: "0 18px 40px rgba(255,255,255,.12)",
            }}
          >
            Start Daily Feed
          </Link>

          <Link
            href="/dashboard"
            style={{
              padding: "18px 34px",
              borderRadius: "999px",
              background: "rgba(255,255,255,.06)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,.16)",
              fontSize: "15px",
              fontWeight: 800,
              textDecoration: "none",
              backdropFilter: "blur(18px)",
            }}
          >
            Dashboard
          </Link>

          <Link
            href="/records"
            style={{
              padding: "18px 34px",
              borderRadius: "999px",
              background: "rgba(255,255,255,.06)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,.16)",
              fontSize: "15px",
              fontWeight: 800,
              textDecoration: "none",
              backdropFilter: "blur(18px)",
            }}
          >
            Records
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}
