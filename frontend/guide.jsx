// Kesey Kalauz — Wikipedia-szerű, lapozható guide
const { useState, useEffect, useMemo, useRef, useCallback } = React;

const PAGES = window.GUIDE_PAGES;

// Helper: chapter grouping
function groupByChapter(pages) {
  const map = new Map();
  pages.forEach((p, i) => {
    if (!map.has(p.chapter)) map.set(p.chapter, []);
    map.get(p.chapter).push({ ...p, idx: i });
  });
  return Array.from(map.entries());
}

// ── Block renderers ────────────────────────────────────────────────────────
function Block({ block }) {
  if (block.type === "p") {
    return <p style={{ fontSize: 16, lineHeight: 1.75, margin: "0 0 18px", color: "var(--fg)", textWrap: "pretty" }}>{block.text}</p>;
  }
  if (block.type === "h") {
    return <h3 className="head" style={{ fontSize: 18, color: "var(--cream)", margin: "28px 0 12px" }}>{block.text}</h3>;
  }
  if (block.type === "list") {
    const Tag = block.numbered ? "ol" : "ul";
    return (
      <Tag style={{
        margin: "0 0 22px", paddingLeft: 0, listStyle: "none",
        counterReset: block.numbered ? "li" : undefined,
      }}>
        {block.items.map((item, i) => (
          <li key={i} style={{
            position: "relative", paddingLeft: 28, marginBottom: 10,
            fontSize: 15, lineHeight: 1.7, color: "var(--fg)",
          }}>
            {block.numbered ? (
              <span style={{
                position: "absolute", left: 0, top: 2, width: 22, height: 22,
                borderRadius: "50%", background: "rgba(212,160,74,0.12)",
                border: "1px solid rgba(212,160,74,0.35)",
                color: "var(--gold-bright)", fontFamily: "var(--font-mono)",
                fontSize: 11, fontWeight: 600,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>{i + 1}</span>
            ) : (
              <span style={{
                position: "absolute", left: 8, top: 11, width: 4, height: 4,
                borderRadius: "50%", background: "var(--gold)",
              }}/>
            )}
            {item}
          </li>
        ))}
      </Tag>
    );
  }
  if (block.type === "table") {
    return (
      <div style={{ margin: "0 0 22px", border: "1px solid var(--line-2)", borderRadius: 8, overflow: "hidden", background: "rgba(0,0,0,0.2)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "var(--bg-3)" }}>
              {block.cols.map((c, i) => (
                <th key={i} className="mono" style={{
                  padding: "10px 14px", textAlign: "left",
                  fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "var(--fg-muted)", fontWeight: 600,
                  borderBottom: "1px solid var(--line-2)",
                }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i} style={{
                borderTop: i === 0 ? 0 : "1px solid var(--line)",
                background: i % 2 === 1 ? "rgba(255,255,255,0.01)" : "transparent",
              }}>
                {row.map((c, j) => (
                  <td key={j} style={{
                    padding: "11px 14px",
                    color: j === 0 ? "var(--cream)" : "var(--fg)",
                    fontWeight: j === 0 ? 500 : 400,
                  }}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (block.type === "callout") {
    const styles = {
      info: { bg: "rgba(94,193,245,0.06)", brd: "rgba(94,193,245,0.35)", fg: "#5ec1f5", icon: "i" },
      tip:  { bg: "rgba(74,222,128,0.05)", brd: "rgba(74,222,128,0.3)", fg: "#4ade80", icon: "✓" },
      warn: { bg: "rgba(239,68,68,0.05)", brd: "rgba(239,68,68,0.35)", fg: "#ef4444", icon: "!" },
      lore: { bg: "rgba(167,139,250,0.05)", brd: "rgba(167,139,250,0.35)", fg: "#a78bfa", icon: "✧" },
    };
    const s = styles[block.kind] || styles.info;
    return (
      <aside style={{
        margin: "0 0 22px", padding: "14px 16px 14px 18px",
        background: s.bg, border: `1px solid ${s.brd}`,
        borderLeft: `3px solid ${s.fg}`, borderRadius: 6,
        display: "flex", gap: 14, alignItems: "flex-start",
      }}>
        <span style={{
          flexShrink: 0, width: 26, height: 26, borderRadius: "50%",
          background: s.fg + "22", color: s.fg,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14,
        }}>{s.icon}</span>
        <div>
          <div className="head" style={{ fontSize: 13, color: s.fg, marginBottom: 4, fontWeight: 600 }}>{block.title}</div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg)" }}>{block.text}</div>
        </div>
      </aside>
    );
  }
  return null;
}

// ── Layout ────────────────────────────────────────────────────────────────
function GuideApp() {
  const [idx, setIdx] = useState(() => {
    const hash = window.location.hash.slice(1);
    const found = PAGES.findIndex(p => p.id === hash);
    return found >= 0 ? found : 0;
  });
  const [query, setQuery] = useState("");
  const articleRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);
  const [readProgress, setReadProgress] = useState(0);

  const page = PAGES[idx];

  // Sync URL hash
  useEffect(() => {
    window.location.hash = page.id;
    window.scrollTo({ top: 0, behavior: "instant" });
    setActiveSection(0);
  }, [idx]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        if (idx < PAGES.length - 1) setIdx(idx + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        if (idx > 0) setIdx(idx - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx]);

  // Scroll-based section + progress tracker
  useEffect(() => {
    const onScroll = () => {
      const article = articleRef.current;
      if (!article) return;
      const headings = article.querySelectorAll("[data-section]");
      let current = 0;
      headings.forEach((h, i) => {
        const r = h.getBoundingClientRect();
        if (r.top < 120) current = i;
      });
      setActiveSection(current);
      // Progress
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [idx]);

  // Search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PAGES
      .map((p, i) => ({ ...p, i }))
      .filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.sections.some(s => s.heading.toLowerCase().includes(q) || s.blocks.some(b => (b.text || "").toLowerCase().includes(q)))
      );
  }, [query]);

  const chapters = useMemo(() => groupByChapter(PAGES), []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 2 }}>
      {/* Top bar — progress + breadcrumb */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(7, 9, 13, 0.88)",
        backdropFilter: "blur(20px) saturate(160%)",
        borderBottom: "1px solid var(--line)",
      }}>
        {/* Progress bar */}
        <div style={{ height: 2, background: "transparent" }}>
          <div style={{
            height: "100%", width: `${readProgress}%`,
            background: "linear-gradient(90deg, var(--gold-deep), var(--gold-bright))",
            boxShadow: "0 0 8px var(--gold)",
            transition: "width 0.05s linear",
          }}/>
        </div>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "12px var(--page-pad-x)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="index.html" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--fg-muted)" }}>
              <KeseyMark size={28} glow={false}/>
              <span className="display" style={{ fontSize: 18, letterSpacing: "0.08em", color: "var(--cream)" }}>KESEY</span>
            </a>
            <span style={{ color: "var(--fg-faint)" }}>/</span>
            <span className="head" style={{ fontSize: 14, color: "var(--fg)", fontWeight: 500 }}>Kalauz</span>
            <span style={{ color: "var(--fg-faint)" }}>/</span>
            <span className="mono" style={{ fontSize: 12, color: "var(--gold)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{page.chapter}</span>
          </div>
          <div style={{ flex: 1, maxWidth: 360, position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--fg-faint)" }}>{Icon.search(14)}</span>
            <input
              className="field"
              placeholder="Keresés a kalauzban…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: 40, height: 36, fontSize: 13 }}
            />
            {searchResults.length > 0 && (
              <div className="surface fade-up" style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                background: "var(--bg-2)", boxShadow: "0 16px 40px -8px rgba(0,0,0,0.7)",
                maxHeight: 360, overflow: "auto", zIndex: 60,
              }}>
                {searchResults.slice(0, 8).map((r) => (
                  <button key={r.id} onClick={() => { setIdx(r.i); setQuery(""); }} style={{
                    width: "100%", padding: "10px 14px", background: "transparent", border: 0,
                    borderBottom: "1px solid var(--line)",
                    color: "var(--fg)", cursor: "pointer", textAlign: "left",
                    display: "flex", flexDirection: "column", gap: 2,
                  }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-3)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <span className="head" style={{ fontSize: 13, color: "var(--cream)" }}>{r.title}</span>
                    <span className="mono" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{r.chapter}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", letterSpacing: "0.1em" }}>
              {idx + 1} / {PAGES.length}
            </span>
            <span style={{ display: "inline-flex", gap: 4, alignItems: "center", color: "var(--fg-faint)" }}>
              <span className="kbd">←</span>
              <span className="kbd">→</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main 3-col layout */}
      <div className="guide-layout" style={{
        maxWidth: 1400, margin: "0 auto", padding: "32px var(--page-pad-x) 0",
        display: "grid", gridTemplateColumns: "240px minmax(0, 1fr) 220px",
        gap: 40, flex: 1, width: "100%",
      }}>
        {/* LEFT: chapter sidebar */}
        <aside style={{ position: "sticky", top: 80, alignSelf: "flex-start", maxHeight: "calc(100vh - 100px)", overflow: "auto", paddingRight: 8 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>FEJEZETEK</div>
          {chapters.map(([ch, pgs]) => (
            <div key={ch} style={{ marginBottom: 22 }}>
              <div className="mono gold" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>{ch}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {pgs.map((p) => (
                  <button key={p.id} onClick={() => setIdx(p.idx)} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 10px",
                    background: p.idx === idx ? "rgba(212,160,74,0.10)" : "transparent",
                    border: 0,
                    borderLeft: p.idx === idx ? "2px solid var(--gold)" : "2px solid transparent",
                    color: p.idx === idx ? "var(--gold-bright)" : "var(--fg-muted)",
                    cursor: "pointer", borderRadius: 4,
                    fontFamily: "var(--font-body)", fontSize: 13, fontWeight: p.idx === idx ? 600 : 400,
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => { if (p.idx !== idx) e.currentTarget.style.color = "var(--fg)"; }}
                  onMouseLeave={(e) => { if (p.idx !== idx) e.currentTarget.style.color = "var(--fg-muted)"; }}
                  >
                    <span className="mono" style={{ fontSize: 10, color: "var(--fg-faint)", minWidth: 16 }}>{String(p.idx + 1).padStart(2, "0")}</span>
                    <span>{p.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* CENTER: article */}
        <article ref={articleRef} key={page.id} className="page-enter" style={{ maxWidth: 720, paddingBottom: 80 }}>
          <div className="mono gold" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12 }}>
            FEJEZET {idx + 1} · {page.chapter}
          </div>
          <h1 className="display hero-page-title" style={{
            fontSize: 64, lineHeight: 0.98, letterSpacing: "0.01em",
            color: "var(--cream)", margin: "0 0 18px",
          }}>{page.title}</h1>
          {/* Lead */}
          <p style={{
            fontSize: 18, lineHeight: 1.6, color: "var(--fg-muted)",
            margin: "0 0 32px", paddingBottom: 24, borderBottom: "1px solid var(--line)",
            textWrap: "pretty",
          }}>{page.summary}</p>

          {/* Sections */}
          {page.sections.map((sec, i) => (
            <section key={i} data-section style={{ scrollMarginTop: 80 }}>
              <h2 className="head" style={{
                fontSize: 24, color: "var(--cream)", margin: "32px 0 18px",
                paddingBottom: 8, borderBottom: "1px dashed var(--line)",
              }}>
                <span className="display gold-text" style={{ fontSize: 18, marginRight: 12, letterSpacing: "0.05em" }}>§{i + 1}</span>
                {sec.heading}
              </h2>
              {sec.blocks.map((block, j) => <Block key={j} block={block} />)}
            </section>
          ))}

          {/* Prev / next nav */}
          <div style={{
            marginTop: 60, paddingTop: 28, borderTop: "1px solid var(--line)",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
          }}>
            {idx > 0 ? (
              <button onClick={() => setIdx(idx - 1)} className="surface lift" style={{
                padding: 18, background: "var(--bg-2)", border: "1px solid var(--line-2)",
                textAlign: "left", cursor: "pointer", color: "var(--fg)",
                display: "flex", flexDirection: "column", gap: 4,
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", fontSize: 11 }} className="mono">
                  {Icon.arrowLeft(12)} ELŐZŐ · {String(idx).padStart(2, "0")}
                </span>
                <span className="head" style={{ fontSize: 16, color: "var(--cream)" }}>{PAGES[idx - 1].title}</span>
              </button>
            ) : <div/>}
            {idx < PAGES.length - 1 ? (
              <button onClick={() => setIdx(idx + 1)} className="surface lift" style={{
                padding: 18, background: "var(--bg-2)", border: "1px solid var(--line-2)",
                textAlign: "right", cursor: "pointer", color: "var(--fg)",
                display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", fontSize: 11 }} className="mono">
                  KÖVETKEZŐ · {String(idx + 2).padStart(2, "0")} {Icon.arrowRight(12)}
                </span>
                <span className="head" style={{ fontSize: 16, color: "var(--cream)" }}>{PAGES[idx + 1].title}</span>
              </button>
            ) : (
              <a href="index.html" className="surface lift" style={{
                padding: 18, background: "linear-gradient(135deg, rgba(212,160,74,0.10), var(--bg-2))",
                border: "1px solid rgba(212,160,74,0.4)",
                textAlign: "right", cursor: "pointer", color: "var(--fg)",
                display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end",
                textDecoration: "none",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--gold)", fontSize: 11 }} className="mono">
                  KÉSZ · IRÁNY A JÁTÉK {Icon.arrowRight(12)}
                </span>
                <span className="head" style={{ fontSize: 16, color: "var(--cream)" }}>Vissza a Kesey főoldalra</span>
              </a>
            )}
          </div>
        </article>

        {/* RIGHT: on-page ToC */}
        <aside className="guide-right" style={{ position: "sticky", top: 80, alignSelf: "flex-start", maxHeight: "calc(100vh - 100px)", overflow: "auto" }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>EZEN AZ OLDALON</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {page.sections.map((sec, i) => (
              <a key={i}
                 href={"#" + page.id + "-s" + i}
                 onClick={(e) => {
                   e.preventDefault();
                   const headings = articleRef.current.querySelectorAll("[data-section]");
                   if (headings[i]) {
                     window.scrollTo({ top: headings[i].offsetTop - 80, behavior: "smooth" });
                   }
                 }}
                 style={{
                   padding: "6px 10px",
                   borderLeft: activeSection === i ? "2px solid var(--gold)" : "2px solid var(--line)",
                   color: activeSection === i ? "var(--gold-bright)" : "var(--fg-muted)",
                   fontSize: 13, fontWeight: activeSection === i ? 600 : 400,
                   textDecoration: "none", lineHeight: 1.4,
                 }}>
                §{i + 1}. {sec.heading}
              </a>
            ))}
          </div>

          {/* Reading stats */}
          <div className="surface" style={{ marginTop: 24, padding: 14, background: "var(--bg-2)" }}>
            <div className="eyebrow" style={{ fontSize: 9, marginBottom: 8 }}>HALADÁS</div>
            <div className="display gold-text" style={{ fontSize: 28, letterSpacing: "0.02em", lineHeight: 1 }}>
              {Math.round((idx / (PAGES.length - 1)) * 100)}%
            </div>
            <div style={{ marginTop: 8, height: 3, background: "var(--bg-1)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${(idx / (PAGES.length - 1)) * 100}%`,
                background: "linear-gradient(90deg, var(--gold-deep), var(--gold-bright))",
                transition: "width 0.3s ease",
              }}/>
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--fg-faint)", marginTop: 6 }}>
              {idx + 1} / {PAGES.length} fejezet
            </div>
          </div>
        </aside>
      </div>

      {/* Footer mini */}
      <footer style={{ marginTop: 60, borderTop: "1px solid var(--line)", background: "rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px var(--page-pad-x)", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--fg-faint)", fontSize: 11 }} className="mono">
          <span>Kesey Kalauz · v4.1.2 · {new Date().toISOString().slice(0, 10)}</span>
          <a href="index.html" style={{ color: "var(--fg-muted)" }}>{Icon.arrowLeft(12)} Vissza a főoldalra</a>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<GuideApp />);
