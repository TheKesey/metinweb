"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function AuthInit() {
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    const token = localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token");
    if (!token) return;

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("auth_token");
          sessionStorage.removeItem("auth_token");
          return null;
        }
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data) setUser({ id: data.username, username: data.username, email: data.email, coins: 0, vip_tier: 0, member_since: data.member_since });
      })
      .catch(() => {});
  }, [setUser]);

  return null;
}
