"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRightIcon } from "@/components/brand/Icon";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PER_PAGE = 12;
const POLL_MS  = 30_000;

type NewsType = "news" | "patch" | "event";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  image_url: string | null;
  type: NewsType;
  published_at: string;
  read_min: number;
  user: { id: number; name: string };
}

const TYPE_COLORS: Record<NewsType, string> = {
  news:  "tag-accent",
  patch: "tag-warn",
  event: "tag-success",
};

const FILTERS = ["all", "news", "patch", "event"] as const;
type Filter = typeof FILTERS[number];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" });
}

function TypeBadge({ type }: { type: NewsType }) {
  const t = useTranslations();
  return <span className={`tag ${TYPE_COLORS[type]}`}>{t(`tag_${type}` as "tag_news")}</span>;
}

function FeaturedCard({ item }: { item: NewsItem }) {
  const t = useTranslations();
  return (
    <Link
      href={`/news/${item.id}`}
      className="surface corners lift fade-up stack-mobile"
      style={{
        padding: 0, marginBottom: 20, background: "var(--bg-2)",
        display: "grid", gridTemplateColumns: "1.2fr 1fr",
        textDecoration: "none", overflow: "hidden",
      }}
    >
      <div style={{ minHeight: 280, position: "relative", overflow: "hidden" }}>
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div className="img-ph" style={{ height: "100%", borderRadius: 0 }}>
            <span>FEATURED</span>
          </div>
        )}
      </div>
      <div style={{ padding: 36, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <TypeBadge type={item.type} />
          <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", alignSelf: "center" }}>
            {formatDate(item.published_at)}
          </span>
        </div>
        <h2 className="head" style={{ fontSize: 28, lineHeight: 1.1, marginBottom: 12, color: "#ecead8" }}>
          {item.title}
        </h2>
        <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", marginBottom: 18 }}>
          {t("posted_by")} {item.user.name} · {item.read_min} {t("min_read")}
        </div>
        <div style={{ color: "var(--accent)", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
          {t("read_more")} <ArrowRightIcon size={12} />
        </div>
      </div>
    </Link>
  );
}

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const t = useTranslations();
  return (
    <Link
      href={`/news/${item.id}`}
      className="surface lift corners fade-up"
      style={{
        padding: 0, background: "var(--bg-2)", overflow: "hidden",
        textDecoration: "none", animationDelay: `${(index % 12) * 40}ms`,
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ height: 140, overflow: "hidden", flexShrink: 0 }}>
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div className="img-ph" style={{ height: "100%", borderRadius: 0 }}>
            <span>{item.type.toUpperCase()}</span>
          </div>
        )}
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <TypeBadge type={item.type} />
          <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{formatDate(item.published_at)}</span>
        </div>
        <h3 className="head" style={{ fontSize: 15, lineHeight: 1.25, marginBottom: 8, color: "#ecead8", flex: 1 }}>
          {item.title}
        </h3>
        <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", display: "flex", justifyContent: "space-between", marginTop: "auto" }}>
          <span>{item.user.name} · {item.read_min} {t("min_read")}</span>
          <span style={{ color: "var(--accent)", display: "flex", alignItems: "center", gap: 4 }}>
            {t("read_more")} <ArrowRightIcon size={10} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function NewsPage() {
  const t         = useTranslations();
  const locale    = useLocale();
  const localeRef = useRef(locale);
  localeRef.current = locale;
  const [filter, setFilter]           = useState<Filter>("all");
  const [items, setItems]             = useState<NewsItem[]>([]);
  const [pendingNew, setPendingNew]   = useState<NewsItem[]>([]);
  const [hasMore, setHasMore]         = useState(true);
  const [loading, setLoading]         = useState(false);
  const [initialLoading, setInitial]  = useState(true);
  const sentinelRef  = useRef<HTMLDivElement>(null);
  const oldestId     = useRef<number | null>(null);
  const newestId     = useRef<number | null>(null);
  const activeFilter = useRef(filter);

  // ── helpers ───────────────────────────────────────────────────────────────
  function buildTypeParam(f: Filter) {
    return f !== "all" ? `&type=${f}` : "";
  }

  function updateCursors(data: NewsItem[], reset: boolean) {
    if (data.length === 0) return;
    if (reset || newestId.current === null) newestId.current = data[0].id;
    oldestId.current = data[data.length - 1].id;
  }

  // ── initial / filter-change load ─────────────────────────────────────────
  const loadInitial = useCallback(async (f: Filter) => {
    setInitial(true);
    setPendingNew([]);
    oldestId.current = null;
    newestId.current = null;
    try {
      const res  = await fetch(`${API_URL}/api/news?per_page=${PER_PAGE}&locale=${localeRef.current}${buildTypeParam(f)}`);
      const json = await res.json();
      const data: NewsItem[] = json.data ?? [];
      setItems(data);
      setHasMore(json.has_more ?? false);
      updateCursors(data, true);
    } catch {
      setHasMore(false);
    } finally {
      setInitial(false);
    }
  }, []);

  // ── load older (infinite scroll) ─────────────────────────────────────────
  const loadOlder = useCallback(async () => {
    if (loading || !hasMore || oldestId.current === null) return;
    setLoading(true);
    try {
      const res  = await fetch(
        `${API_URL}/api/news?per_page=${PER_PAGE}&locale=${localeRef.current}&before_id=${oldestId.current}${buildTypeParam(activeFilter.current)}`
      );
      const json = await res.json();
      const data: NewsItem[] = json.data ?? [];
      setItems((prev) => [...prev, ...data]);
      setHasMore(json.has_more ?? false);
      if (data.length > 0) oldestId.current = data[data.length - 1].id;
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  // ── filter change ─────────────────────────────────────────────────────────
  useEffect(() => {
    activeFilter.current = filter;
    loadInitial(filter);
  }, [filter, loadInitial]);

  // ── poll for new items ────────────────────────────────────────────────────
  useEffect(() => {
    const poll = async () => {
      if (newestId.current === null) return;
      try {
        const res  = await fetch(
          `${API_URL}/api/news?after_id=${newestId.current}&locale=${localeRef.current}${buildTypeParam(activeFilter.current)}`
        );
        const json = await res.json();
        const data: NewsItem[] = json.data ?? [];
        if (data.length > 0) setPendingNew(data);
      } catch {}
    };
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, []);

  // ── prepend pending new items ─────────────────────────────────────────────
  function applyPending() {
    setItems((prev) => [...pendingNew, ...prev]);
    newestId.current = pendingNew[0].id;
    setPendingNew([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── intersection observer ─────────────────────────────────────────────────
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadOlder(); },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadOlder]);

  const featured = filter === "all" && items.length > 0 ? items[0] : null;
  const grid     = featured ? items.slice(1) : items;

  return (
    <div className="page-enter">
      <div className="container">
        <div style={{ padding: "40px 0 28px" }}>
          <h1 className="display accent-text glow-accent hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>
            {t("news_title")}
          </h1>
          <p style={{ color: "var(--fg-muted)", marginTop: 4 }}>{t("news_sub")}</p>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 16px", borderRadius: 999,
                background: filter === f ? "rgba(34,197,224,0.15)" : "transparent",
                border: filter === f ? "1px solid rgba(34,197,224,0.4)" : "1px solid var(--line-2)",
                color: filter === f ? "var(--accent-bright)" : "var(--fg-muted)",
                cursor: "pointer", fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 600,
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}
            >
              {f === "all" ? t("all") : t(`tag_${f}` as "tag_news")}
            </button>
          ))}
        </div>

        {/* New items banner */}
        {pendingNew.length > 0 && (
          <button
            onClick={applyPending}
            style={{
              display: "block", width: "100%", marginBottom: 16,
              padding: "10px 16px", borderRadius: "var(--radius)",
              background: "rgba(34,197,224,0.12)", border: "1px solid rgba(34,197,224,0.35)",
              color: "var(--accent-bright)", cursor: "pointer", fontSize: 13,
              fontFamily: "var(--font-head)", fontWeight: 600, letterSpacing: "0.04em",
              textAlign: "center",
            }}
          >
            {t("news_new_available", { count: pendingNew.length })}
          </button>
        )}

        {initialLoading && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--fg-muted)" }}>
            {t("loading")}
          </div>
        )}

        {!initialLoading && items.length === 0 && (
          <div className="surface" style={{ padding: 60, textAlign: "center", color: "var(--fg-muted)", marginBottom: 40 }}>
            {t("news_no_results")}
          </div>
        )}

        {/* Featured */}
        {featured && <FeaturedCard item={featured} />}

        {/* Grid */}
        {grid.length > 0 && (
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {grid.map((item, i) => (
              <NewsCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}

        {/* Sentinel + loader */}
        <div ref={sentinelRef} style={{ height: 1 }} />
        {loading && !initialLoading && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--fg-muted)" }}>
            {t("loading")}
          </div>
        )}
        {!hasMore && items.length > 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--fg-faint)", fontSize: 13 }}>
            {t("news_end")}
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
