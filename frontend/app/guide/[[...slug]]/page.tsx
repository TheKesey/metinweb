"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { GUIDE_PAGES, CHAPTERS } from "@/lib/guide-content";
import type { GuidePage, Block, CalloutKind } from "@/lib/guide-content";
import { SearchIcon } from "@/components/brand/Icon";

// ── Block renderer ─────────────────────────────────────────────────────────────

const CALLOUT_STYLES: Record<CalloutKind, { bg: string; border: string; label: string; labelColor: string }> = {
  info: { bg: "rgba(34,197,224,0.07)", border: "rgba(34,197,224,0.35)", label: "INFO", labelColor: "var(--accent)" },
  warn: { bg: "rgba(255,180,0,0.07)", border: "rgba(255,180,0,0.35)", label: "FIGYELEM", labelColor: "var(--warn)" },
  tip:  { bg: "rgba(74,222,128,0.07)", border: "rgba(74,222,128,0.35)", label: "TIPP", labelColor: "var(--ok)" },
  lore: { bg: "rgba(167,139,250,0.07)", border: "rgba(167,139,250,0.35)", label: "LORE", labelColor: "#a78bfa" },
};

function BlockView({ block }: { block: Block }) {
  if (block.type === "p") {
    return <p style={{ color: "var(--fg)", lineHeight: 1.75, marginBottom: 14, fontSize: 14 }}>{block.text}</p>;
  }

  if (block.type === "list") {
    const Tag = block.numbered ? "ol" : "ul";
    return (
      <Tag style={{ paddingLeft: 22, marginBottom: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        {block.items?.map((item, i) => (
          <li key={i} style={{ color: "var(--fg)", lineHeight: 1.65, fontSize: 14 }}>{item}</li>
        ))}
      </Tag>
    );
  }

  if (block.type === "table") {
    return (
      <div className="scroll-x" style={{ marginBottom: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--bg-3)" }}>
              {block.cols?.map((col, i) => (
                <th key={i} className="eyebrow" style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, borderBottom: "1px solid var(--line)", whiteSpace: "nowrap" }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows?.map((row, ri) => (
              <tr key={ri} style={{ borderBottom: "1px solid var(--line)" }}>
                {row.map((cell, ci) => (
                  <td key={ci} className={ci === 0 ? "mono" : ""} style={{ padding: "9px 12px", color: ci === 0 ? "var(--accent)" : "var(--fg)", fontSize: 13 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "callout") {
    const s = CALLOUT_STYLES[block.kind ?? "info"];
    return (
      <div style={{
        background: s.bg, border: `1px solid ${s.border}`,
        borderRadius: 8, padding: "14px 18px", marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span className="eyebrow" style={{ fontSize: 10, color: s.labelColor }}>{s.label}</span>
          {block.title && <span style={{ fontSize: 13, fontWeight: 600, color: "#ecead8" }}>{block.title}</span>}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "var(--fg)", lineHeight: 1.65 }}>{block.text}</p>
      </div>
    );
  }

  return null;
}

// ── ToC (right sidebar) ────────────────────────────────────────────────────────

function TableOfContents({ page, activeHeading }: { page: GuidePage; activeHeading: string }) {
  return (
    <nav style={{ position: "sticky", top: 116, maxHeight: "calc(100vh - 132px)", overflowY: "auto" }}>
      <div className="eyebrow" style={{ fontSize: 10, marginBottom: 12 }}>TARTALOM</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {page.sections.map((sec) => (
          <a
            key={sec.heading}
            href={`#${encodeURIComponent(sec.heading)}`}
            style={{
              display: "block", fontSize: 12, padding: "5px 10px",
              color: activeHeading === sec.heading ? "var(--accent-bright)" : "var(--fg-muted)",
              borderLeft: `2px solid ${activeHeading === sec.heading ? "var(--accent)" : "transparent"}`,
              textDecoration: "none", lineHeight: 1.4, transition: "color 0.15s, border-color 0.15s",
            }}
          >
            {sec.heading}
          </a>
        ))}
      </div>
    </nav>
  );
}

// ── Chapter sidebar ────────────────────────────────────────────────────────────

function ChapterSidebar({ current, onSelect }: { current: GuidePage; onSelect: (id: string) => void }) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const results = query.trim().length > 1
    ? GUIDE_PAGES.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.summary.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  function handleSelect(id: string) {
    onSelect(id);
    setQuery("");
    setSearchOpen(false);
  }

  return (
    <aside style={{ position: "sticky", top: 116, maxHeight: "calc(100vh - 132px)", overflowY: "auto" }}>
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--fg-faint)", pointerEvents: "none" }}>
          <SearchIcon size={13} />
        </span>
        <input
          ref={searchRef}
          className="field"
          placeholder={t("search") + "…"}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
          style={{ paddingLeft: 32, fontSize: 12, padding: "8px 10px 8px 32px" }}
        />
        {searchOpen && results.length > 0 && (
          <div className="surface" style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
            background: "var(--bg-2)", border: "1px solid var(--line-2)", borderRadius: 8,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}>
            {results.map((p) => (
              <button
                key={p.id}
                onMouseDown={() => handleSelect(p.id)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "10px 14px", background: "transparent", border: 0,
                  cursor: "pointer", borderBottom: "1px solid var(--line)",
                }}
              >
                <div style={{ fontSize: 12, color: "#ecead8", fontWeight: 600 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 2 }}>{p.chapter}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chapter groups */}
      {CHAPTERS.map((chapter) => {
        const pages = GUIDE_PAGES.filter((p) => p.chapter === chapter);
        return (
          <div key={chapter} style={{ marginBottom: 20 }}>
            <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6, color: "var(--fg-faint)" }}>{chapter.toUpperCase()}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "7px 10px", background: "transparent", border: 0,
                    borderLeft: `2px solid ${current.id === p.id ? "var(--accent)" : "transparent"}`,
                    color: current.id === p.id ? "var(--accent-bright)" : "var(--fg-muted)",
                    fontSize: 13, cursor: "pointer", transition: "color 0.15s, border-color 0.15s",
                    borderRadius: "0 4px 4px 0",
                  }}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </aside>
  );
}

// ── Article content ────────────────────────────────────────────────────────────

function Article({ page, onSection }: { page: GuidePage; onSection: (h: string) => void }) {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onSection(entry.target.getAttribute("data-heading") ?? "");
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [page, onSection]);

  return (
    <article>
      <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 8 }}>{page.chapter.toUpperCase()}</div>
      <h1 className="display accent-text glow-accent" style={{ fontSize: 44, letterSpacing: "0.02em", marginBottom: 8, lineHeight: 1.1 }}>
        {page.title}
      </h1>
      <p style={{ color: "var(--fg-muted)", fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>{page.summary}</p>

      {page.sections.map((sec) => (
        <section
          key={sec.heading}
          id={encodeURIComponent(sec.heading)}
          data-heading={sec.heading}
          ref={(el) => { sectionRefs.current[sec.heading] = el; }}
          style={{ marginBottom: 36 }}
        >
          <h2 className="head" style={{ fontSize: 20, color: "#ecead8", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
            {sec.heading}
          </h2>
          {sec.blocks.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </section>
      ))}
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GuidePage({ params }: { params?: { slug?: string[] } }) {
  const t = useTranslations();
  const slugId = params?.slug?.[0] ?? null;
  const initial = GUIDE_PAGES.find((p) => p.id === slugId) ?? GUIDE_PAGES[0];

  const [page, setPage] = useState<GuidePage>(initial);
  const [activeHeading, setActiveHeading] = useState(page.sections[0]?.heading ?? "");
  const [readPct, setReadPct] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const pageIdx = GUIDE_PAGES.findIndex((p) => p.id === page.id);
  const prevPage = GUIDE_PAGES[pageIdx - 1] ?? null;
  const nextPage = GUIDE_PAGES[pageIdx + 1] ?? null;

  // Read progress
  useEffect(() => {
    function onScroll() {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight;
      const visible = Math.max(0, -rect.top);
      setReadPct(Math.min(100, (visible / total) * 100));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" && nextPage) { setPage(nextPage); window.scrollTo(0, 0); }
      if (e.key === "ArrowLeft" && prevPage) { setPage(prevPage); window.scrollTo(0, 0); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevPage, nextPage]);

  const handleSection = useCallback((h: string) => setActiveHeading(h), []);

  function navigate(p: GuidePage) {
    setPage(p);
    setActiveHeading(p.sections[0]?.heading ?? "");
    setReadPct(0);
    window.scrollTo(0, 0);
  }

  return (
    <div className="page-enter">
      {/* Progress bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 100,
        background: "var(--bg-1)",
      }}>
        <div style={{
          height: "100%", width: `${readPct}%`,
          background: "linear-gradient(90deg, var(--accent-deep), var(--accent-bright))",
          boxShadow: "0 0 10px var(--accent)",
          transition: "width 0.1s ease",
        }} />
      </div>

      <div className="container" style={{ paddingTop: 32 }}>
        {/* Page header */}
        <div style={{ paddingBottom: 24 }}>
          <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 10 }}>KALAUZ</div>
          <h1 className="display accent-text glow-accent hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>
            {t("guide_title")}
          </h1>
        </div>

        {/* 3-column layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr 180px",
          gap: 32,
          alignItems: "start",
          paddingBottom: 60,
        }}>
          {/* Left: chapter nav */}
          <ChapterSidebar current={page} onSelect={(id) => {
            const p = GUIDE_PAGES.find((x) => x.id === id);
            if (p) navigate(p);
          }} />

          {/* Center: article */}
          <div ref={contentRef}>
            <Article page={page} onSection={handleSection} />

            {/* Prev / Next */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
              {prevPage ? (
                <button onClick={() => navigate(prevPage)} className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                  ← {prevPage.title}
                </button>
              ) : <span />}
              {nextPage && (
                <button onClick={() => navigate(nextPage)} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                  {nextPage.title} →
                </button>
              )}
            </div>

            <div className="mono" style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: "var(--fg-faint)" }}>
              ← → billentyűkkel lapozható
            </div>
          </div>

          {/* Right: ToC */}
          <TableOfContents page={page} activeHeading={activeHeading} />
        </div>
      </div>
    </div>
  );
}
