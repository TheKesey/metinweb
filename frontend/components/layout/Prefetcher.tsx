"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ROUTES = [
  "/", "/news", "/ranking", "/online",
  "/shop", "/download", "/guide", "/payment", "/profile",
];

export function Prefetcher() {
  const router = useRouter();

  useEffect(() => {
    // 1.5s delay: ne versenyezzen az initial page renderrel
    const timer = setTimeout(() => {
      ROUTES.forEach((route) => router.prefetch(route));
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return null;
}
