"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  function start() {
    setVisible(true);
    setWidth(15);
  }

  function finish() {
    setWidth(100);
    setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 320);
  }

  // Detect internal link clicks to start the bar
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto")) return;
      // Only trigger for different routes
      const dest = href.split("?")[0];
      if (dest !== pathname) start();
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  // Slowly advance bar while navigating
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (visible && width < 85) {
      intervalRef.current = setInterval(() => {
        setWidth((w) => (w < 85 ? w + (85 - w) * 0.08 : w));
      }, 120);
    }
    return () => clearInterval(intervalRef.current);
  }, [visible, width]);

  // Detect navigation complete
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      finish();
    }
  }, [pathname]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, zIndex: 9999,
      height: 3, width: `${width}%`,
      background: "linear-gradient(90deg, var(--accent-deep), var(--accent-bright))",
      boxShadow: "0 0 10px var(--accent)",
      transition: "width 0.18s ease",
      pointerEvents: "none",
    }} />
  );
}
