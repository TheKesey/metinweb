"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { news } from "@/lib/mock-data";
import { ArrowRightIcon } from "@/components/brand/Icon";
import type { Locale } from "@/types";

const FILTERS = ["all", "update", "event", "devblog", "patch"] as const;
type Filter = typeof FILTERS[number];

export default function NewsPage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [filter, setFilter] = useState<Filter>("all");

  const posts = filter === "all" ? news : news.filter((p) => p.tag === `tag_${filter}`);
  const featured = filter === "all" ? posts[0] : null;
  const rest = featured ? posts.slice(1) : posts;

  return (
    <div className="page-enter">
      <div className="container">
        <div style={{ padding: "40px 0 28px" }}>
          <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 10 }}>BLOG</div>
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
              {f === "all" ? t("all") : t(`tag_${f}` as "tag_update")}
            </button>
          ))}
        </div>

        {/* Featured */}
        {featured && (
          <Link
            href={`/news/${featured.id}`}
            className="surface corners lift fade-up stack-mobile"
            style={{
              padding: 0, marginBottom: 20, background: "var(--bg-2)",
              display: "grid", gridTemplateColumns: "1.2fr 1fr",
              textDecoration: "none", overflow: "hidden",
            }}
          >
            <div className="img-ph" style={{ minHeight: 280, position: "relative", borderRadius: 0 }}>
              <span>FEATURED</span>
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.4 }} preserveAspectRatio="none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="30" fill="none" stroke="var(--accent)" strokeOpacity="0.2"/>
                <circle cx="50" cy="50" r="18" fill="none" stroke="var(--accent)" strokeOpacity="0.3"/>
              </svg>
            </div>
            <div style={{ padding: 36, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <span className={`tag ${featured.tagColor}`}>{t(featured.tag as "tag_event")}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", alignSelf: "center" }}>{featured.date}</span>
              </div>
              <h2 className="head" style={{ fontSize: 28, lineHeight: 1.1, marginBottom: 12, color: "#ecead8" }}>
                {locale === "hu" ? featured.title_hu : featured.title_en}
              </h2>
              <p style={{ color: "var(--fg-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
                {locale === "hu" ? featured.excerpt_hu : featured.excerpt_en}
              </p>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--fg-faint)" }} className="mono">
                <span>{t("posted_by")} {featured.author}</span>
                <span>·</span>
                <span>{featured.read_min} {t("min_read")}</span>
              </div>
              <div style={{ marginTop: 18, color: "var(--accent)", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                {t("read_more")} <ArrowRightIcon size={12} />
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {rest.map((p, i) => (
            <Link
              key={p.id}
              href={`/news/${p.id}`}
              className="surface lift corners fade-up"
              style={{ padding: 0, background: "var(--bg-2)", overflow: "hidden", textDecoration: "none", animationDelay: `${i * 50}ms` }}
            >
              <div className="img-ph" style={{ height: 140, borderRadius: 0 }}>
                <span>{p.id.toUpperCase()}</span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span className={`tag ${p.tagColor}`}>{t(p.tag as "tag_event")}</span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{p.date}</span>
                </div>
                <h3 className="head" style={{ fontSize: 15, lineHeight: 1.25, marginBottom: 8, color: "#ecead8" }}>
                  {locale === "hu" ? p.title_hu : p.title_en}
                </h3>
                <p style={{ color: "var(--fg-muted)", fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>
                  {locale === "hu" ? p.excerpt_hu : p.excerpt_en}
                </p>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", display: "flex", justifyContent: "space-between" }}>
                  <span>{p.author} · {p.read_min} {t("min_read")}</span>
                  <span style={{ color: "var(--accent)", display: "flex", alignItems: "center", gap: 4 }}>
                    {t("read_more")} <ArrowRightIcon size={10} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="surface" style={{ padding: 60, textAlign: "center", color: "var(--fg-muted)", marginBottom: 40 }}>
            Nincs találat ezzel a szűrővel.
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
