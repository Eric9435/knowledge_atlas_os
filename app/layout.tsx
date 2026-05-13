import type { Metadata } from "next";
import "./globals.css";
import "./theme.css";
import { FloatingControls } from "@/components/FloatingControls";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Knowledge Atlas OS",
  description: "AI-powered personal knowledge operating system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <PageTransition>{children}</PageTransition>
        <FloatingControls />
      </body>
    </html>
  );
}
