"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;

    if (!overlay) return;

    overlay.animate(
      [
        {
          opacity: 1,
          backdropFilter: "blur(18px)",
        },
        {
          opacity: 0,
          backdropFilter: "blur(0px)",
        },
      ],
      {
        duration: 900,
        easing: "cubic-bezier(0.22,1,0.36,1)",
        fill: "forwards",
      }
    );
  }, [pathname]);

  return (
    <>
      <div ref={overlayRef} className="transition-overlay" />
      {children}
    </>
  );
}
