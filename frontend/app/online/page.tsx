"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { online, locations, ONLINE_BASE } from "@/lib/mock-data";
import { fmtNum } from "@/lib/utils";
import { RefreshIcon, SearchIcon } from "@/components/brand/Icon";
import { CLASS_ICONS, REALM_COLORS } from "@/components/brand/Icon";
import type { Locale, CharClass, Realm } from "@/types";

export default function OnlinePage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [query, setQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [tick, setTick] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  const filtered = online.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  const total = online.length;

  const byRealm = (["red", "blue", "yellow"] as Realm[]).map((r) => ({
    realm: r,
    count: online.filter((p) => p.realm === r).length,
  }));

  const byLoc = locations.map((l) => ({
    ...l,
    count: online.filter((p) => p.loc === l.id).length,
  }));

  return (
    <div className="page-enter">
      <div className="container">
        <div style={{ padding: "40px 0 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 10 }}>
                <span className="dot dot-ok pulse" style={{ marginRight: 6 }} />LIVE
              </div>
              <h1 className="display accent-text glow-accent hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>
                {t("online_title")}
              </h1>
              <p style={{ color: "var(--fg-muted)", marginTop: 4 }}>{t("online_sub")}</p>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "btn btn-accent btn-sm" : "btn btn-ghost btn-sm"}
            >
              <RefreshIcon size={12} /> {t("auto_refresh")} {autoRefresh ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="surface corners stat-grid-3" style={{ padding: 24, marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: 32, background: "var(--bg-2)" }}>
          {/* Online count */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>{t("online_now")}</div>
            <div className="display accent-text glow-accent" style={{ fontSize: 52, letterSpacing: "0.02em" }}>{fmtNum(ONLINE_BASE)}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>/ 3892 peak today</div>
          </div>

          {/* By realm */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>BY REALM</div>
            <div style={{ display: "flex", gap: 8, height: 36 }}>
              {byRealm.map((r) => {
                const pct = (r.count / total) * 100;
                const c = REALM_COLORS[r.realm];
                return (
                  <div key={r.realm} style={{ flex: pct, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ flex: 1, background: c.bg, border: `1px solid ${c.brd}`, borderRadius: 3 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: c.fg }} className="mono">
                      <span>{t(`realm_${r.realm}` as "realm_red").toUpperCase()}</span>
                      <span>{r.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By location */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{t("map")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {byLoc.slice(0, 6).map((l) => (
                <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: "var(--fg-muted)" }}>{locale === "hu" ? l.name_hu : l.name_en}</span>
                  <span className="mono" style={{ color: "var(--accent)" }}>{l.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative", maxWidth: 320 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--fg-faint)", pointerEvents: "none" }}>
              <SearchIcon size={14} />
            </span>
            <input
              ref={searchRef}
              className="field"
              placeholder={t("search_player")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: 36, width: 320 }}
            />
          </div>
          <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>
            {filtered.length} {locale === "hu" ? "találat" : "results"}
          </div>
        </div>

        {/* Player table */}
        <div className="surface scroll-x" style={{ background: "var(--bg-2)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 1fr 1fr 1.4fr 60px", padding: "10px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-3)" }}>
            {[t("name"), t("level"), t("class_label"), t("realm"), t("location"), "MS"].map((h, i) => (
              <span key={i} className="eyebrow" style={{ fontSize: 10 }}>{h}</span>
            ))}
          </div>
          <div style={{ maxHeight: 560, overflow: "auto" }}>
            {filtered.map((p, i) => {
              const loc = locations.find((l) => l.id === p.loc);
              const ClassGlyph = CLASS_ICONS[p.class as CharClass];
              const realm = REALM_COLORS[p.realm as Realm];
              return (
                <div key={p.id} style={{
                  display: "grid", gridTemplateColumns: "2fr 80px 1fr 1fr 1.4fr 60px",
                  padding: "10px 20px", alignItems: "center",
                  borderBottom: i === filtered.length - 1 ? 0 : "1px solid var(--line)",
                  fontSize: 13,
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="dot dot-ok" />
                    <span style={{ color: "#ecead8" }}>{p.name}</span>
                  </span>
                  <span className="mono" style={{ fontSize: 12 }}>{p.level}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--fg-muted)", fontSize: 12 }}>
                    <ClassGlyph /> {t(`class_${p.class}` as "class_warrior")}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: realm.fg }} />
                    <span className="mono" style={{ fontSize: 11, color: realm.fg }}>{t(`realm_${p.realm}` as "realm_red")}</span>
                  </span>
                  <span style={{ color: "var(--fg-muted)", fontSize: 12 }}>
                    {loc ? (locale === "hu" ? loc.name_hu : loc.name_en) : "?"}
                  </span>
                  <span className="mono" style={{ fontSize: 11, color: p.ms < 40 ? "var(--ok)" : p.ms < 60 ? "var(--warn)" : "var(--danger)" }}>
                    {p.ms}ms
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
