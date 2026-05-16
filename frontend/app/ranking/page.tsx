"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { players, guilds } from "@/lib/mock-data";
import { fmtNum } from "@/lib/utils";
import { CrownIcon, TrophyIcon, UsersIcon } from "@/components/brand/Icon";
import { CLASS_ICONS, REALM_COLORS } from "@/components/brand/Icon";
import type { Locale, CharClass, Realm } from "@/types";

type Tab = "level" | "pvp" | "metin" | "boss" | "guild";

// ── Podium ────────────────────────────────────────────────────────────────────
function PodiumCard({
  p, rank, color, glow, scale,
}: {
  p: typeof players[0]; rank: string; color: string; glow: boolean; scale: "lg" | "md" | "sm";
}) {
  const t = useTranslations();
  const ClassGlyph = CLASS_ICONS[p.class as CharClass];
  const realm = REALM_COLORS[p.realm as Realm];
  const isFirst = scale === "lg";
  const avatarSize = scale === "lg" ? 72 : scale === "md" ? 56 : 48;
  const rankFontSize = scale === "lg" ? 64 : scale === "md" ? 52 : 42;
  const nameFontSize = scale === "lg" ? 20 : scale === "md" ? 16 : 14;
  const statFontSize = scale === "lg" ? 26 : scale === "md" ? 20 : 17;
  const pad = scale === "lg" ? 24 : scale === "md" ? 18 : 14;

  return (
    <div className="surface corners fade-up" style={{
      padding: pad, textAlign: "center", height: "100%",
      background: isFirst ? "linear-gradient(180deg, rgba(34,197,224,0.12), var(--bg-2))" : "var(--bg-2)",
      borderColor: isFirst ? "rgba(34,197,224,0.4)" : "var(--line-2)",
    }}>
      <div className="display" style={{ fontSize: rankFontSize, lineHeight: 1, color, letterSpacing: "0.04em", textShadow: glow ? `0 0 32px ${color}` : "none" }}>
        {rank}
      </div>
      <div style={{
        width: avatarSize, height: avatarSize, borderRadius: "50%", margin: "12px auto 8px",
        background: "linear-gradient(135deg, var(--accent), var(--red))",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: avatarSize * 0.38,
        boxShadow: isFirst ? "0 0 40px rgba(34,197,224,0.45)" : "none",
      }}>{p.name.charAt(0)}</div>
      <div className="head" style={{ fontSize: nameFontSize, color: "#ecead8" }}>{p.name}</div>
      <div style={{ marginTop: 5, display: "flex", justifyContent: "center", gap: 5, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: "var(--fg-muted)" }}>
          <ClassGlyph /> {t(`class_${p.class}` as "class_warrior")}
        </span>
        <span style={{ color: "var(--fg-faint)" }}>·</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
          <span style={{ width: 6, height: 6, borderRadius: 2, background: realm.fg }} />
          <span style={{ fontSize: 11, color: realm.fg }}>{t(`realm_${p.realm}` as "realm_red")}</span>
        </span>
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-around" }}>
        <div>
          <div className="eyebrow" style={{ fontSize: 9 }}>{t("level")}</div>
          <div className="display accent-text" style={{ fontSize: statFontSize }}>{p.level}</div>
        </div>
        <div>
          <div className="eyebrow" style={{ fontSize: 9 }}>{t("guild")}</div>
          <div style={{ fontSize: 11, marginTop: 4, color: "var(--fg-muted)" }}>{p.guild}</div>
        </div>
      </div>
    </div>
  );
}

function Podium({ top3 }: { top3: typeof players }) {
  const [first, second, third] = top3;

  return (
    // align-items: flex-end = alulra igazítás → lépcsős hatás
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 20 }}>
      {/* 2nd — bal, közepes magasság */}
      <div style={{ flex: 1 }}>
        {second && <PodiumCard p={second} rank="II" color="#d4d4d4" glow={false} scale="md" />}
      </div>
      {/* 1st — középen, legmagasabb */}
      <div style={{ flex: 1 }}>
        {first && (
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <CrownIcon size={48} style={{ color: "var(--accent-bright)", filter: "drop-shadow(0 0 12px var(--accent))" }} />
            </div>
            <PodiumCard p={first} rank="I" color="var(--accent-bright)" glow scale="lg" />
          </div>
        )}
      </div>
      {/* 3rd — jobb, legalacsonyabb */}
      <div style={{ flex: 1 }}>
        {third && <PodiumCard p={third} rank="III" color="#cd7f32" glow={false} scale="sm" />}
      </div>
    </div>
  );
}

// ── Player table ──────────────────────────────────────────────────────────────
function PlayerTable({ rows }: { rows: typeof players }) {
  const t = useTranslations();

  return (
    <div className="surface scroll-x" style={{ background: "var(--bg-2)", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "64px 2fr 1fr 1fr 80px 1.4fr 1.4fr", padding: "10px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-3)" }}>
        {[t("rank"), t("name"), t("class_label"), t("realm"), t("level"), t("guild"), t("score")].map((h, i) => (
          <span key={i} className="eyebrow" style={{ fontSize: 10 }}>{h}</span>
        ))}
      </div>
      {rows.map((p, i) => {
        const ClassGlyph = CLASS_ICONS[p.class as CharClass];
        const realm = REALM_COLORS[p.realm as Realm];
        return (
          <div key={p.rank} className="fade-up" style={{
            display: "grid", gridTemplateColumns: "64px 2fr 1fr 1fr 80px 1.4fr 1.4fr",
            padding: "12px 20px", alignItems: "center",
            borderBottom: i === rows.length - 1 ? 0 : "1px solid var(--line)",
            animationDelay: `${Math.min(i * 25, 400)}ms`,
            background: i < 3 ? `linear-gradient(90deg, rgba(34,197,224,${0.07 - i * 0.02}), transparent 60%)` : "transparent",
          }}>
            <span className="display" style={{ fontSize: 20, letterSpacing: "0.04em", color: i === 0 ? "var(--accent-bright)" : i === 1 ? "#d4d4d4" : i === 2 ? "#cd7f32" : "var(--fg-muted)" }}>
              #{p.rank}
            </span>
            <span style={{ fontWeight: 600, color: "#ecead8" }}>{p.name}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--fg-muted)", fontSize: 12 }}>
              <ClassGlyph /> {t(`class_${p.class}` as "class_warrior")}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: realm.fg, boxShadow: `0 0 5px ${realm.fg}` }} />
              <span className="mono" style={{ fontSize: 11, color: realm.fg }}>{t(`realm_${p.realm}` as "realm_red")}</span>
            </span>
            <span className="mono" style={{ fontSize: 13, color: "var(--accent-bright)" }}>{p.level}</span>
            <span style={{ fontSize: 13, color: "var(--fg-muted)" }}>{p.guild}</span>
            <span className="mono" style={{ fontSize: 12, color: "var(--fg-muted)" }}>{fmtNum(p.score)}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Guild table ───────────────────────────────────────────────────────────────
function GuildTable() {
  return (
    <div className="surface scroll-x" style={{ background: "var(--bg-2)", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "64px 2fr 80px 1.5fr 1.5fr", padding: "10px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-3)" }}>
        {["RANK", "GUILD", "MEMBERS", "LEADER", "SCORE"].map((h, i) => (
          <span key={i} className="eyebrow" style={{ fontSize: 10 }}>{h}</span>
        ))}
      </div>
      {guilds.map((g, i) => (
        <div key={g.name} className="fade-up" style={{
          display: "grid", gridTemplateColumns: "64px 2fr 80px 1.5fr 1.5fr",
          padding: "14px 20px", alignItems: "center",
          borderBottom: i === guilds.length - 1 ? 0 : "1px solid var(--line)",
          animationDelay: `${i * 40}ms`,
        }}>
          <span className="display" style={{ fontSize: 20, color: i === 0 ? "var(--accent-bright)" : i === 1 ? "#d4d4d4" : i === 2 ? "#cd7f32" : "var(--fg-muted)" }}>
            #{i + 1}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 28, height: 28, borderRadius: 6,
              background: "linear-gradient(135deg, var(--red), var(--accent))",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13,
            }}>{g.name.charAt(0)}</span>
            <span style={{ fontWeight: 600, color: "#ecead8" }}>{g.name}</span>
          </span>
          <span className="mono" style={{ fontSize: 13 }}>{g.members}</span>
          <span style={{ fontSize: 13, color: "var(--fg-muted)" }}>{g.leader}</span>
          <span className="mono" style={{ fontSize: 13, color: "var(--accent-bright)" }}>{fmtNum(g.score)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const TABS: Array<{ id: Tab; labelKey: string; Icon: React.FC }> = [
  { id: "level", labelKey: "rank_level", Icon: CrownIcon },
  { id: "pvp", labelKey: "rank_pvp", Icon: TrophyIcon },
  { id: "metin", labelKey: "rank_metin", Icon: TrophyIcon },
  { id: "boss", labelKey: "rank_boss", Icon: TrophyIcon },
  { id: "guild", labelKey: "rank_guild", Icon: UsersIcon },
];

export default function RankingPage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [tab, setTab] = useState<Tab>("level");
  const [classFilter, setClassFilter] = useState("all");
  const [realmFilter, setRealmFilter] = useState("all");

  let rows = players;
  if (classFilter !== "all") rows = rows.filter((p) => p.class === classFilter);
  if (realmFilter !== "all") rows = rows.filter((p) => p.realm === realmFilter);

  const showPodium = tab === "level" && classFilter === "all" && realmFilter === "all";

  const selectStyle = {
    background: "var(--bg-2)", border: "1px solid var(--line-2)",
    color: "var(--fg)", padding: "8px 12px", borderRadius: 6,
    fontFamily: "var(--font-mono)", fontSize: 12, cursor: "pointer",
    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='%239a958a' d='M0 0h10L5 6z'/></svg>\")",
    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
    appearance: "none" as const, paddingRight: 30,
  };

  return (
    <div className="page-enter">
      <div className="container">
        <div style={{ padding: "40px 0 28px" }}>
          <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 10 }}>SEASON 4</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 className="display accent-text glow-accent hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>
                {t("rank_title")}
              </h1>
              <p style={{ color: "var(--fg-muted)", marginTop: 4 }}>{t("rank_sub")}</p>
            </div>
            <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>
              {locale === "hu" ? "Frissítve: 2026-05-15 14:32" : "Updated: 2026-05-15 14:32"}
            </div>
          </div>
        </div>

        {showPodium && <Podium top3={players.slice(0, 3)} />}

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 4, marginTop: 20, borderBottom: "1px solid var(--line)", flexWrap: "wrap" }} className="wrap-tabs">
          {TABS.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{
              padding: "12px 18px", background: "transparent", border: 0,
              borderBottom: tab === tb.id ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: -1,
              color: tab === tb.id ? "var(--accent-bright)" : "var(--fg-muted)",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 600,
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              {t(tb.labelKey as "rank_level")}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginTop: 20, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="eyebrow">{t("filter")}</span>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} style={selectStyle}>
              <option value="all">{t("class_all")}</option>
              <option value="warrior">{t("class_warrior")}</option>
              <option value="assassin">{t("class_assassin")}</option>
              <option value="shaman">{t("class_shaman")}</option>
              <option value="archer">{t("class_archer")}</option>
            </select>
          </div>
          <select value={realmFilter} onChange={(e) => setRealmFilter(e.target.value)} style={selectStyle}>
            <option value="all">{t("realm_all")}</option>
            <option value="red">{t("realm_red")}</option>
            <option value="blue">{t("realm_blue")}</option>
            <option value="yellow">{t("realm_yellow")}</option>
          </select>
          <div style={{ flex: 1 }} />
          <div className="mono" style={{ fontSize: 11, color: "var(--fg-muted)" }}>
            {rows.length} {locale === "hu" ? "eredmény" : "results"}
          </div>
        </div>

        {tab === "guild" ? <GuildTable /> : <PlayerTable rows={rows} />}

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
