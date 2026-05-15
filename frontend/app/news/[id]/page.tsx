"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { news } from "@/lib/mock-data";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/brand/Icon";
import type { Locale } from "@/types";

export default function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { id } = use(params);

  const article = news.find((n) => n.id === id);
  if (!article) notFound();

  const related = news.filter((n) => n.id !== article.id).slice(0, 3);
  const body = locale === "hu" ? article.body_hu : article.body_en;

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
            <span className={`tag ${article.tagColor}`}>{t(article.tag as "tag_event")}</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", alignSelf: "center" }}>{article.date}</span>
          </div>

          <h1 className="display hero-page-title" style={{ fontSize: 64, lineHeight: 0.98, letterSpacing: "0.01em", color: "#ecead8", marginBottom: 18 }}>
            {locale === "hu" ? article.title_hu : article.title_en}
          </h1>

          <div className="mono" style={{ display: "flex", gap: 20, padding: "16px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", marginBottom: 32, color: "var(--fg-muted)" }}>
            <span style={{ fontSize: 12 }}>{t("posted_by")} <span style={{ color: "var(--accent)" }}>{article.author}</span></span>
            <span style={{ fontSize: 12 }}>{article.read_min} {t("min_read")}</span>
          </div>

          <div className="img-ph" style={{ height: 360, marginBottom: 36, borderRadius: 8 }}>
            <span>{article.id.toUpperCase()} · HERO ART</span>
          </div>

          <div style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg)", maxWidth: 720, margin: "0 auto" }}>
            {body.map((p, i) => (
              <p key={i} style={{ marginBottom: 18 }}>{p}</p>
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <section style={{ marginBottom: 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 0 }}>MORE</div>
              <h2 className="head sect-rule" style={{ fontSize: 20, fontWeight: 700, margin: 0, gap: 12 }}>
                {locale === "hu" ? "További hírek" : "More news"}
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
                  <div className="img-ph" style={{ height: 120, borderRadius: 0 }}>
                    <span>{n.id.toUpperCase()}</span>
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span className={`tag ${n.tagColor}`}>{t(n.tag as "tag_event")}</span>
                      <span className="mono" style={{ fontSize: 10, color: "var(--fg-faint)" }}>{n.date}</span>
                    </div>
                    <h3 className="head" style={{ fontSize: 14, lineHeight: 1.3, color: "#ecead8" }}>
                      {locale === "hu" ? n.title_hu : n.title_en}
                    </h3>
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
