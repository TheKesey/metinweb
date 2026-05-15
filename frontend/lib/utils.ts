import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SERVER_LAUNCH_DATE } from "./mock-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtNum(n: number): string {
  return n.toLocaleString("hu-HU");
}

export function fmtShort(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "k";
  return String(n);
}

export function daysSinceLaunch(): number {
  const now = new Date();
  const diff = now.getTime() - SERVER_LAUNCH_DATE.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
