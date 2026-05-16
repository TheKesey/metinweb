"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useStore } from "@/lib/store";
import { players, liveFeed, ONLINE_BASE, ONLINE_VARIANCE } from "@/lib/mock-data";
import { daysSinceLaunch, fmtNum, fmtShort } from "@/lib/utils";
import { DownloadIcon, UsersIcon, ArrowRightIcon } from "@/components/brand/Icon";
import { CLASS_ICONS, REALM_COLORS } from "@/components/brand/Icon";
import type { Locale } from "@/types";
import React from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TAG_COLORS: Record<string, string> = { news: "tag-accent", patch: "tag-warn", event: "tag-success" };

interface NewsItem {
  id: number;
  title: string;
  image_url: string | null;
  type: "news" | "patch" | "event";
  published_at: string;
  read_min: number;
  user: { id: number; name: string };
}

function useLatestNews(locale: string) {
  const [items, setItems] = React.useState<NewsItem[]>([]);
  React.useEffect(() => {
    const load = () =>
      fetch(`${API_URL}/api/news?per_page=4&locale=${locale}`)
        .then((r) => r.json())
        .then((j) => setItems(j.data ?? []))
        .catch(() => {});
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [locale]);
  return items;
}

// ── Ticker ───────────────────────────────────────────────────────────────────
function useTicker(base: number, variance: number, interval: number) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      const delta = Math.floor(Math.random() * variance * 2) - variance;
      setCount((c) => Math.max(1, c + delta));
    }, interval);
    return () => clearInterval(id);
  }, [variance, interval]);
  return count;
}

// ── Small SVG icons (inline to avoid reexport issues) ───────────────────────
const Bolt  = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M13 3L4 14h7l-1 7 9-11h-7z"/></svg>;
const Flame = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-3 2-5 2-7s3 1 3-2z"/><path d="M10 16a2 2 0 1 0 4 0c0-2-2-2-2-4 0 1-2 2-2 4z"/></svg>;
const Crown = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8l4 5 5-7 5 7 4-5v11H3z"/></svg>;

// ── HeroStats ────────────────────────────────────────────────────────────────
function HeroStats() {
  const t = useTranslations();
  const { user, setAuthModal } = useStore();
  const online = useTicker(ONLINE_BASE, ONLINE_VARIANCE, 4500);
  const daysRunning = daysSinceLaunch();

  const cells = [
    { icon: <UsersIcon size={13} />, value: fmtNum(online), label: t("online_now"), sub: `/ ${fmtNum(3892)} ${t("today")}`, color: "var(--accent-bright)", glow: true },
    { icon: <Bolt s={13} />,         value: `${fmtNum(daysRunning)} nap`,           label: t("uptime"),      sub: t("since_date"),       color: "var(--accent-bright)", glow: false },
    { icon: <Flame s={13} />,        value: "14m 30s",                              label: t("next_event"), sub: "Hold-fesztivál",      color: "var(--red-bright)",   glow: false },
    { icon: <Crown s={13} />,        value: "S4",                                   label: t("season"),     sub: `${t("day_of_season")} 12 / 90`, color: "var(--accent)", glow: false },
  ];

  return (
    <section style={{ position: "relative", padding: "60px 0 80px", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 500px at 50% 0%, rgba(34,197,224,0.06), transparent 70%)", pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 920, margin: "0 auto" }}>
          <div className="eyebrow" style={{ marginBottom: 18, color: "var(--accent)" }}>
            <span className="dot dot-ok pulse" style={{ marginRight: 8 }} />
            {t("hero_kicker")}
          </div>
          <h1 className="display accent-text glow-accent hero-title" style={{ fontSize: 96, lineHeight: 0.95, letterSpacing: "0.02em", margin: "0 0 8px" }}>
            {t("hero_title_1")}
          </h1>
          <h1 className="display cream-text hero-title" style={{ fontSize: 96, lineHeight: 0.95, letterSpacing: "0.02em", margin: 0 }}>
            {t("hero_title_2")}
          </h1>
          <p style={{ marginTop: 24, fontSize: 17, color: "var(--fg-muted)", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            {t("hero_sub")}
          </p>

          {/* Stat grid */}
          <div className="surface corners stat-grid-4" style={{ marginTop: 48, padding: "28px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "rgba(11,14,20,0.7)", borderColor: "var(--line-2)" }}>
            {cells.map((c, i) => (
              <div key={i} style={{ padding: "0 20px", borderLeft: i > 0 ? "1px solid var(--line)" : "none", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--fg-faint)", marginBottom: 6 }}>
                  {c.icon}
                  <span className="eyebrow" style={{ fontSize: 10 }}>{c.label}</span>
                </div>
                <div className="display" style={{ fontSize: 42, lineHeight: 1, color: c.color, textShadow: c.glow ? `0 0 24px ${c.color}` : "none" }}>
                  {c.value}
                </div>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", marginTop: 4 }}>{c.sub}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 36, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/download" className="btn btn-primary btn-lg">
              <DownloadIcon size={16} /> {t("download_client")}
            </Link>
            {!user && (
              <button onClick={() => setAuthModal("register")} className="btn btn-secondary btn-lg">
                {t("create_account")}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── NewsCard ─────────────────────────────────────────────────────────────────
function NewsCard({ post, delay = 0 }: { post: NewsItem; delay?: number }) {
  const t = useTranslations();
  const date = new Date(post.published_at).toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" });

  return (
    <Link href={`/news/${post.id}`} className="surface lift fade-up" style={{ padding: 0, display: "flex", flexDirection: "column", textDecoration: "none", animationDelay: `${delay}ms`, overflow: "hidden" }}>
      <div style={{ height: 100, overflow: "hidden", flexShrink: 0 }}>
        {post.image_url
          ? <img src={post.image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div className="img-ph" style={{ height: "100%", borderRadius: 0 }}><span>{post.type.toUpperCase()}</span></div>
        }
      </div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className={`tag ${TAG_COLORS[post.type]}`} style={{ fontSize: 9 }}>{t(`tag_${post.type}` as "tag_news")}</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-faint)" }}>{date}</span>
        </div>
        <div className="head" style={{ fontSize: 14, color: "#ecead8", lineHeight: 1.4, fontWeight: 600, flex: 1 }}>{post.title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-faint)" }}>{post.user.name} · {post.read_min} {t("min_read")}</span>
          <span style={{ color: "var(--accent)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
            {t("read_more")} <ArrowRightIcon size={11} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── LiveFeed ─────────────────────────────────────────────────────────────────
function LiveFeedSection() {
  const locale = useLocale() as Locale;

  return (
    <div className="surface" style={{ padding: "0 0 4px" }}>
      {liveFeed.map((entry, i) => (
        <div key={i} className="fade-up" style={{ padding: "11px 16px", borderBottom: i < liveFeed.length - 1 ? "1px solid var(--line)" : "none", display: "flex", alignItems: "flex-start", gap: 10, animationDelay: `${i * 80}ms` }}>
          <span className="dot dot-ok pulse" style={{ marginTop: 5, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontWeight: 600, color: "var(--accent-bright)", fontSize: 13 }}>{entry.who} </span>
            <span style={{ color: "var(--fg-muted)", fontSize: 13 }}>{locale === "hu" ? entry.what_hu : entry.what_en}</span>
          </div>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-faint)", flexShrink: 0 }}>{entry.t}</span>
        </div>
      ))}
    </div>
  );
}

// ── TopPlayersPreview ────────────────────────────────────────────────────────
function TopPlayersPreview() {
  const t = useTranslations();
  const top5 = players.slice(0, 5);

  return (
    <div className="surface scroll-x">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--line-2)" }}>
            {([t("rank"), t("name"), t("class_label"), t("realm"), t("level"), t("guild"), t("score")] as string[]).map((h) => (
              <th key={h} className="eyebrow" style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, color: "var(--fg-faint)", fontWeight: 400 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {top5.map((p, i) => {
            const ClassGlyph = CLASS_ICONS[p.class];
            const realm = REALM_COLORS[p.realm];
            return (
              <tr key={p.rank} style={{ borderBottom: "1px solid var(--line)", background: i < 3 ? "rgba(34,197,224,0.03)" : "transparent" }}>
                <td style={{ padding: "12px 16px" }}>
                  <span className="display" style={{ fontSize: 20, color: i === 0 ? "var(--accent-bright)" : i === 1 ? "var(--fg)" : "var(--fg-muted)" }}>{p.rank}</span>
                </td>
                <td style={{ padding: "12px 16px", fontWeight: 600, color: "#ecead8" }}>{p.name}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--fg-muted)", fontSize: 12 }}>
                    <ClassGlyph /> {t(`class_${p.class}` as "class_warrior")}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: realm.fg, boxShadow: `0 0 6px ${realm.fg}` }} />
                    <span className="mono" style={{ fontSize: 11, color: realm.fg }}>{t(`realm_${p.realm}` as "realm_red")}</span>
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}><span className="mono" style={{ fontSize: 13, color: "var(--accent-bright)" }}>{p.level}</span></td>
                <td style={{ padding: "12px 16px", color: "var(--fg-muted)", fontSize: 12 }}>{p.guild}</td>
                <td style={{ padding: "12px 16px" }}><span className="mono" style={{ fontSize: 12, color: "var(--fg-muted)" }}>{fmtShort(p.score)}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── CTAStrip ─────────────────────────────────────────────────────────────────
function CTAStrip() {
  const t = useTranslations();
  const { user, setAuthModal } = useStore();

  return (
    <div className="surface corners cta-strip" style={{ padding: "48px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, background: "linear-gradient(135deg, rgba(34,197,224,0.08) 0%, rgba(192,51,74,0.06) 100%)", borderColor: "rgba(34,197,224,0.2)" }}>
      <div style={{ maxWidth: 480 }}>
        <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 8 }}>{t("cta_eyebrow")}</div>
        <h2 className="display" style={{ fontSize: 48, lineHeight: 1, color: "#ecead8", letterSpacing: "0.02em" }}>{t("cta_title")}</h2>
        <p style={{ color: "var(--fg-muted)", fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>{t("cta_sub")}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
        <Link href="/download" className="btn btn-primary btn-lg"><DownloadIcon size={16} /> {t("download_client")}</Link>
        {!user && <button onClick={() => setAuthModal("register")} className="btn btn-secondary btn-lg">{t("create_account")}</button>}
        <Link href="/guide" className="btn btn-ghost btn-lg" style={{ textAlign: "center" }}>{t("nav_guide")}</Link>
      </div>
    </div>
  );
}

// ── Section title ─────────────────────────────────────────────────────────────
function SectionTitle({ kicker, title, action }: { kicker?: string; title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20, gap: 24 }}>
      <div>
        {kicker && <div className="eyebrow" style={{ marginBottom: 6 }}>{kicker}</div>}
        <h2 className="head sect-rule" style={{ fontSize: 22, fontWeight: 700, margin: 0, gap: 12 }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const latestNews = useLatestNews(locale);

  return (
    <div className="page-enter">
      <HeroStats />
      <div className="container">
        <section style={{ marginTop: 80, display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }} className="stack-mobile">
          <div>
            <SectionTitle
              kicker={t("today")}
              title={t("latest_news")}
              action={<Link href="/news" className="btn btn-ghost btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{t("view_all")} <ArrowRightIcon size={12} /></Link>}
            />
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {latestNews.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="surface" style={{ height: 220, borderRadius: "var(--radius)", background: "var(--bg-2)", animation: "pulse 1.5s ease-in-out infinite" }} />
                  ))
                : latestNews.map((n, i) => <NewsCard key={n.id} post={n} delay={i * 60} />)
              }
            </div>
          </div>
          <div>
            <SectionTitle kicker="LIVE" title={t("live_feed")} />
            <LiveFeedSection />
          </div>
        </section>

        <section style={{ marginTop: 80 }}>
          <SectionTitle
            kicker="TOP 5"
            title={t("top_players")}
            action={<Link href="/ranking" className="btn btn-ghost btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{t("view_all")} <ArrowRightIcon size={12} /></Link>}
          />
          <TopPlayersPreview />
        </section>

        <section style={{ marginTop: 80, marginBottom: 40 }}>
          <CTAStrip />
        </section>
      </div>
    </div>
  );
}
