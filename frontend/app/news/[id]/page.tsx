"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/brand/Icon";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type NewsType = "news" | "patch" | "event";

interface NewsItem {
  id: number;
  title: string;
  content: string;
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" });
}

export default function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const t      = useTranslations();
  const locale = useLocale();
  const { id } = use(params);

  const [article, setArticle] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/news/${id}?locale=${locale}`);
        if (res.status === 404) { setMissing(true); return; }
        if (!res.ok) throw new Error();
        const data: NewsItem = await res.json();
        setArticle(data);

        // Related: fetch latest 4, exclude current
        const rel = await fetch(`${API_URL}/api/news?per_page=4&locale=${locale}`);
        if (rel.ok) {
          const relData = await rel.json();
          setRelated((relData.data as NewsItem[]).filter((n) => n.id !== data.id).slice(0, 3));
        }
      } catch {
        setMissing(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, locale]);

  if (missing) notFound();

  if (loading) {
    return (
      <div className="page-enter">
        <div className="container" style={{ maxWidth: 920, padding: "80px 0", textAlign: "center", color: "var(--fg-muted)" }}>
          {t("loading")}
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="page-enter">
      <div className="container" style={{ maxWidth: 920 }}>
        <div style={{ padding: "32px 0 0" }}>
          <Link href="/news" className="btn btn-ghost btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ArrowLeftIcon size={12} /> {t("back_to_news")}
          </Link>
        </div>

        <article style={{ padding: "24px 0 80px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <span className={`tag ${TYPE_COLORS[article.type]}`}>
              {t(`tag_${article.type}` as "tag_news")}
            </span>
            <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", alignSelf: "center" }}>
              {formatDate(article.published_at)}
            </span>
          </div>

          <h1 className="display hero-page-title" style={{ fontSize: 64, lineHeight: 0.98, letterSpacing: "0.01em", color: "#ecead8", marginBottom: 18 }}>
            {article.title}
          </h1>

          <div className="mono" style={{ display: "flex", gap: 20, padding: "16px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", marginBottom: 32, color: "var(--fg-muted)" }}>
            <span style={{ fontSize: 12 }}>{t("posted_by")} <span style={{ color: "var(--accent)" }}>{article.user.name}</span></span>
            <span style={{ fontSize: 12 }}>{article.read_min} {t("min_read")}</span>
          </div>

          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title}
              style={{ width: "100%", height: 360, objectFit: "cover", borderRadius: 8, marginBottom: 36 }}
            />
          ) : (
            <div className="img-ph" style={{ height: 360, marginBottom: 36, borderRadius: 8 }}>
              <span>{article.type.toUpperCase()} · HERO ART</span>
            </div>
          )}

          <div
            className="news-content"
            style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg)", maxWidth: 720, margin: "0 auto" }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {related.length > 0 && (
          <section style={{ marginBottom: 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <h2 className="head sect-rule" style={{ fontSize: 20, fontWeight: 700, margin: 0, gap: 12 }}>
                {t("related_news")}
              </h2>
            </div>
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {related.map((n, i) => (
                <Link
                  key={n.id}
                  href={`/news/${n.id}`}
                  className="surface lift corners fade-up"
                  style={{ padding: 0, background: "var(--bg-2)", overflow: "hidden", textDecoration: "none", animationDelay: `${i * 50}ms` }}
                >
                  <div style={{ height: 120, overflow: "hidden" }}>
                    {n.image_url ? (
                      <img src={n.image_url} alt={n.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div className="img-ph" style={{ height: "100%", borderRadius: 0 }}>
                        <span>{n.type.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span className={`tag ${TYPE_COLORS[n.type]}`}>{t(`tag_${n.type}` as "tag_news")}</span>
                      <span className="mono" style={{ fontSize: 10, color: "var(--fg-faint)" }}>{formatDate(n.published_at)}</span>
                    </div>
                    <h3 className="head" style={{ fontSize: 14, lineHeight: 1.3, color: "#ecead8" }}>{n.title}</h3>
                    <div style={{ marginTop: 10, color: "var(--accent)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                      {t("read_more")} <ArrowRightIcon size={10} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
