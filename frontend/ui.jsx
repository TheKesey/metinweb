// Shared UI primitives — icons (inline SVG), badges, status indicators
// Designed to be original (not derived from any branded asset).

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ── ICONS (line glyphs, original) ──────────────────────────────────────────
const Icon = {
  // Navigation
  home:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>,
  news:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M7 8h10M7 12h6M7 16h8"/></svg>,
  trophy: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M5 5H3v2a3 3 0 0 0 3 3M19 5h2v2a3 3 0 0 1-3 3M9 14h6M12 11v3M8 20h8"/></svg>,
  users:  (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="9" r="3.5"/><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5"/><circle cx="17" cy="8" r="2.5"/><path d="M15 19c.4-2 2-3.5 4-3.5s3.5 1.4 4 3.5"/></svg>,
  shop:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 7h16l-1.4 12.2A2 2 0 0 1 16.6 21H7.4a2 2 0 0 1-2-1.8z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>,
  download: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 4v11m0 0l-4-4m4 4l4-4M4 19h16"/></svg>,
  user:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>,
  cart:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 4h2l2.5 12.5A2 2 0 0 0 9.5 18h8a2 2 0 0 0 2-1.7L21 9H7"/><circle cx="10" cy="21" r="1.2"/><circle cx="17" cy="21" r="1.2"/></svg>,
  coin:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><path d="M12 9v6M10 11h4M10 13h4"/></svg>,
  arrowRight: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14m0 0l-5-5m5 5l-5 5"/></svg>,
  arrowLeft: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M19 12H5m0 0l5-5m-5 5l5 5"/></svg>,
  check:  (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12l5 5L20 6"/></svg>,
  x:      (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18"/></svg>,
  search: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg>,
  grid:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>,
  list:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
  plus:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 5v14m-7-7h14"/></svg>,
  minus:  (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14"/></svg>,
  globe:  (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>,
  shield: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z"/></svg>,
  bolt:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M13 3L4 14h7l-1 7 9-11h-7z"/></svg>,
  swords: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 5l9 9M14.5 14.5L19 19M3 7l2-2M17 21l2-2M5 19l9-9M14.5 9.5L19 5M3 17l2 2M17 3l2 2"/></svg>,
  flame:  (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-3 2-5 2-7s3 1 3-2zM10 16a2 2 0 1 0 4 0c0-2-2-2-2-4 0 1-2 2-2 4z"/></svg>,
  crown:  (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8l4 5 5-7 5 7 4-5v11H3z"/></svg>,
  star:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3l2.7 6 6.3.7-4.7 4.3 1.3 6.3L12 17l-5.6 3.3L7.7 14 3 9.7 9.3 9z"/></svg>,
  lock:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="10" width="16" height="11" rx="1.5"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></svg>,
  mail:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/></svg>,
  clock:  (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></svg>,
  card:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="6" width="18" height="13" rx="1.5"/><path d="M3 10h18M7 16h4"/></svg>,
  spinner: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.9s" repeatCount="indefinite"/></path></svg>,
  external: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 4h6v6M10 14l10-10M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>,
  refresh: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4"/></svg>,
};

// ── Class & realm helpers ──────────────────────────────────────────────────
const CLASS_GLYPH = {
  warrior:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 4l6 6-9 9-2 1-1-1 1-2 9-9-4-4z"/><path d="M3 21l5-5"/></svg>,
  assassin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 5l9 9-2 5-5-5z"/><path d="M19 5l-9 9"/></svg>,
  shaman:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="6"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>,
  archer:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 20L20 4M14 4h6v6M9 9l2 2M15 15l2 2"/></svg>,
};

const REALM_COLOR = {
  red:    { fg: "#e5536b", bg: "rgba(229,83,107,0.10)", brd: "rgba(229,83,107,0.35)" },
  blue:   { fg: "#5ec1f5", bg: "rgba(94,193,245,0.10)", brd: "rgba(94,193,245,0.35)" },
  yellow: { fg: "#f0c270", bg: "rgba(240,194,112,0.10)", brd: "rgba(240,194,112,0.35)" },
};

function ClassBadge({ klass, lang, mini = false }) {
  const G = CLASS_GLYPH[klass] || CLASS_GLYPH.warrior;
  const label = window.I18N[lang]["class_" + klass];
  if (mini) {
    return <span style={{ color: "var(--fg-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}><G />{label}</span>;
  }
  return (
    <span className="tag" style={{ color: "var(--cream)", borderColor: "var(--line-2)" }}>
      <G />{label}
    </span>
  );
}

function RealmDot({ realm, withLabel = false, lang }) {
  const c = REALM_COLOR[realm] || REALM_COLOR.red;
  const label = window.I18N[lang]["realm_" + realm];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: c.fg }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: c.fg, boxShadow: `0 0 6px ${c.fg}` }} />
      {withLabel && <span className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>}
    </span>
  );
}

// ── KeseyMark — original logomark (no branded references) ──────────────────
// Stylized "K" inside an octagonal frame.
function KeseyMark({ size = 32, glow = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={glow ? { filter: "drop-shadow(0 0 12px rgba(212,160,74,0.4))" } : undefined}>
      <defs>
        <linearGradient id="kg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0c270" />
          <stop offset="55%" stopColor="#d4a04a" />
          <stop offset="100%" stopColor="#8b6a2a" />
        </linearGradient>
      </defs>
      {/* Octagonal frame */}
      <path d="M20 4 L44 4 L60 20 L60 44 L44 60 L20 60 L4 44 L4 20 Z"
        fill="none" stroke="url(#kg)" strokeWidth="1.5" opacity="0.9"/>
      {/* Inner octagon */}
      <path d="M22 10 L42 10 L54 22 L54 42 L42 54 L22 54 L10 42 L10 22 Z"
        fill="none" stroke="url(#kg)" strokeWidth="0.6" opacity="0.5"/>
      {/* Stylized K */}
      <path d="M22 16 L22 48 M22 32 L36 16 M22 32 L38 48"
        fill="none" stroke="url(#kg)" strokeWidth="3" strokeLinecap="square"/>
      {/* Dot accent */}
      <circle cx="46" cy="22" r="1.5" fill="#f5e6c8"/>
    </svg>
  );
}

// ── Number formatters ──────────────────────────────────────────────────────
function fmtNum(n) {
  return n.toLocaleString("hu-HU").replace(/,/g, " ");
}
function fmtShort(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toString();
}

// ── Stat block (big number + label) ────────────────────────────────────────
function Stat({ value, label, sub, accent = "gold", glowing = false }) {
  const color = accent === "gold" ? "var(--gold-bright)" : accent === "cyan" ? "var(--cyan)" : accent === "red" ? "var(--red-bright)" : "var(--cream)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div className="display" style={{
        fontSize: 48, lineHeight: 1, color,
        textShadow: glowing ? `0 0 24px ${color}` : "none",
      }}>{value}</div>
      <div className="eyebrow" style={{ fontSize: 10 }}>{label}</div>
      {sub && <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{sub}</div>}
    </div>
  );
}

// ── Section heading ────────────────────────────────────────────────────────
function SectionTitle({ kicker, title, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20, gap: 24 }}>
      <div>
        {kicker && <div className="eyebrow" style={{ marginBottom: 6 }}>{kicker}</div>}
        <h2 className="display" style={{ fontSize: 38, letterSpacing: "0.02em" }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

// ── Live ticking number — uses requestAnimationFrame ──────────────────────
function useTicker(initial, range, intervalMs = 4000) {
  const [v, setV] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => {
      setV((prev) => {
        const delta = Math.floor((Math.random() - 0.5) * range);
        return Math.max(initial - range * 5, Math.min(initial + range * 5, prev + delta));
      });
    }, intervalMs);
    return () => clearInterval(t);
  }, [initial, range, intervalMs]);
  return v;
}

// ── Modal ──────────────────────────────────────────────────────────────────
function Modal({ open, onClose, children, width = 520, title }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(4, 6, 10, 0.7)",
      backdropFilter: "blur(8px)", zIndex: 200, display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
      animation: "fade-in 0.18s ease-out",
    }}>
      <div onClick={(e) => e.stopPropagation()} className="surface corners" style={{
        width: "100%", maxWidth: width, padding: 28, background: "var(--bg-2)",
        boxShadow: "0 24px 60px -16px rgba(0,0,0,0.8)",
        animation: "fade-up 0.22s ease-out",
      }}>
        {title && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 className="head" style={{ fontSize: 18 }}>{title}</h3>
            <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: 6, border: 0 }}>{Icon.x()}</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, kind = "ok") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((arr) => [...arr, { id, msg, kind }]);
    setTimeout(() => setToasts((arr) => arr.filter(t => t.id !== id)), 3200);
  }, []);
  const node = (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 500, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} className="surface fade-up" style={{
          padding: "10px 16px", background: "var(--bg-3)",
          border: "1px solid var(--line-strong)",
          boxShadow: "0 12px 32px -8px rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ color: t.kind === "ok" ? "var(--ok)" : t.kind === "err" ? "var(--danger)" : "var(--gold)" }}>
            {t.kind === "ok" ? Icon.check(16) : t.kind === "err" ? Icon.x(16) : Icon.bolt(16)}
          </span>
          <span style={{ fontSize: 13 }}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
  return { push, node };
}

// ── Container ──────────────────────────────────────────────────────────────
function Container({ children, max = 1280, style, className = "" }) {
  return <div className={"container " + className} style={{ maxWidth: max, margin: "0 auto", padding: "0 var(--page-pad-x)", ...style }}>{children}</div>;
}

// ── useViewport — track viewport width for layout switching ────────────────
function useViewport() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return { w, isMobile: w < 900, isNarrow: w < 560 };
}

// ── ItemArt — original SVG illustration for shop items (geometric, no IP) ──
// Each item gets a different geometric "sigil" based on its category + rarity.
function ItemArt({ item, size = 100 }) {
  const palette = {
    legend: ["#ff7e5a", "#ff9e7a", "#6e1426"],
    epic:   ["#f0c270", "#fae3ad", "#8b6a2a"],
    rare:   ["#a78bfa", "#c4b3fd", "#5b3aa8"],
    magic:  ["#5ec1f5", "#9eddff", "#1d6c9c"],
    common: ["#b8b3a3", "#e0dcce", "#5a574d"],
  };
  const [a, b, c] = palette[item.rarity] || palette.common;
  const seed = item.id.charCodeAt(item.id.length - 1) % 4;

  const Bg = () => (
    <>
      <rect width="100" height="100" fill={c} opacity="0.15"/>
      <rect width="100" height="100" fill="url(#stripe)"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke={a} strokeOpacity="0.4" strokeWidth="0.5"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke={a} strokeOpacity="0.25" strokeWidth="0.3"/>
    </>
  );

  // Per-category sigil
  const Sigil = () => {
    if (item.cat === "costumes") return (
      <g stroke={a} strokeWidth="1.5" fill="none">
        <path d="M35 30 L50 24 L65 30 L60 75 L40 75 Z"/>
        <path d="M50 24 V70"/>
        <path d="M40 40 L60 40"/>
      </g>
    );
    if (item.cat === "mounts") return (
      <g stroke={a} strokeWidth="1.5" fill="none">
        <path d="M28 55 Q38 35 50 38 Q62 35 72 55 L70 70 L60 65 L50 70 L40 65 L30 70 Z"/>
        <circle cx="44" cy="50" r="1.5" fill={a}/>
        <circle cx="56" cy="50" r="1.5" fill={a}/>
      </g>
    );
    if (item.cat === "pets") return (
      <g stroke={a} strokeWidth="1.5" fill="none">
        <circle cx="50" cy="50" r="14"/>
        <path d="M40 42 L36 34 L44 40"/>
        <path d="M60 42 L64 34 L56 40"/>
        <circle cx="45" cy="50" r="1" fill={a}/>
        <circle cx="55" cy="50" r="1" fill={a}/>
        <path d="M46 56 L50 58 L54 56"/>
      </g>
    );
    if (item.cat === "consumable") return (
      <g stroke={a} strokeWidth="1.5" fill="none">
        <path d="M45 28 L55 28 L55 38 Q66 45 64 60 Q62 75 50 75 Q38 75 36 60 Q34 45 45 38 Z"/>
        <path d="M44 56 Q50 50 56 56" fill={a} fillOpacity="0.2"/>
      </g>
    );
    if (item.cat === "storage") return (
      <g stroke={a} strokeWidth="1.5" fill="none">
        <rect x="28" y="34" width="44" height="36"/>
        <path d="M28 46 L72 46"/>
        <path d="M48 34 V46 M52 34 V46"/>
        <circle cx="50" cy="56" r="2"/>
      </g>
    );
    // bundle: stacked diamonds
    return (
      <g stroke={a} strokeWidth="1.5" fill="none">
        <path d="M50 25 L70 50 L50 75 L30 50 Z"/>
        <path d="M50 35 L62 50 L50 65 L38 50 Z" opacity="0.7"/>
        <path d="M50 45 L55 50 L50 55 L45 50 Z" fill={a} fillOpacity="0.3"/>
      </g>
    );
  };

  // Rays based on seed (rotation variety)
  const Rays = () => (
    <g transform={`rotate(${seed * 15} 50 50)`} opacity="0.4">
      <path d="M50 5 V18 M50 95 V82 M5 50 H18 M95 50 H82" stroke={b} strokeWidth="0.7"/>
    </g>
  );

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <defs>
        <pattern id="stripe" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={a} strokeOpacity="0.04" strokeWidth="2"/>
        </pattern>
      </defs>
      <Bg />
      <Rays />
      <Sigil />
    </svg>
  );
}

// ── HeroScene — fancy background composition (no game assets) ─────────────
function HeroScene({ variant = "lore" }) {
  if (variant === "data") {
    // Stats / data-themed grid
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 600">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M50 0 L0 0 L0 50" fill="none" stroke="rgba(212,160,74,0.06)" strokeWidth="0.5"/>
            </pattern>
            <radialGradient id="rg" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="rgba(212,160,74,0.15)"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
          </defs>
          <rect width="1200" height="600" fill="url(#grid)"/>
          <rect width="1200" height="600" fill="url(#rg)"/>
          {/* sparkly nodes */}
          {Array.from({ length: 28 }).map((_, i) => {
            const x = (i * 137) % 1200;
            const y = (i * 211) % 600;
            return <circle key={i} cx={x} cy={y} r="1.5" fill="#f0c270" opacity={0.3 + ((i * 7) % 7) / 10}><animate attributeName="opacity" values="0.3;0.9;0.3" dur={(2 + (i % 4))+"s"} repeatCount="indefinite" begin={(i * 0.2)+"s"}/></circle>;
          })}
        </svg>
      </div>
    );
  }
  if (variant === "minimal") {
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 80%, rgba(212,160,74,0.15) 0%, transparent 60%)",
        }}/>
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1200 600">
          {[...Array(7)].map((_, i) => (
            <line key={i} x1="0" y1={80 + i * 75} x2="1200" y2={80 + i * 75} stroke="rgba(255,240,200,0.04)" strokeWidth="1"/>
          ))}
        </svg>
      </div>
    );
  }
  // lore variant: stylized mountain silhouette + sun disc
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 600">
        <defs>
          <radialGradient id="sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0c270" stopOpacity="0.9"/>
            <stop offset="40%" stopColor="#d4a04a" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
          <linearGradient id="mnt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c0f15" stopOpacity="0"/>
            <stop offset="100%" stopColor="#07090d" stopOpacity="1"/>
          </linearGradient>
        </defs>
        {/* Sun */}
        <circle cx="600" cy="280" r="160" fill="url(#sun)"/>
        <circle cx="600" cy="280" r="90" fill="none" stroke="rgba(212,160,74,0.4)" strokeWidth="0.8"/>
        <circle cx="600" cy="280" r="60" fill="rgba(212,160,74,0.15)" stroke="rgba(212,160,74,0.6)" strokeWidth="0.5"/>
        {/* Far mountains */}
        <path d="M0 420 L120 360 L220 400 L340 340 L460 380 L600 320 L740 370 L860 330 L980 380 L1100 350 L1200 380 L1200 600 L0 600 Z"
          fill="#11151d" opacity="0.6"/>
        {/* Near mountains */}
        <path d="M0 500 L150 420 L280 470 L400 410 L540 460 L680 400 L820 450 L960 410 L1100 460 L1200 430 L1200 600 L0 600 Z"
          fill="#07090d"/>
        <rect y="380" width="1200" height="220" fill="url(#mnt)"/>
        {/* Sparkles */}
        {[...Array(12)].map((_, i) => (
          <circle key={i} cx={(i * 113) % 1200} cy={50 + (i * 23) % 200} r="1" fill="#f5e6c8" opacity={0.6}>
            <animate attributeName="opacity" values="0.2;1;0.2" dur={(3 + (i%3))+"s"} repeatCount="indefinite" begin={(i*0.3)+"s"}/>
          </circle>
        ))}
      </svg>
    </div>
  );
}

// Hooks — global app state via context shortcut
const AppCtx = React.createContext(null);
function useApp() { return React.useContext(AppCtx); }

Object.assign(window, {
  Icon, CLASS_GLYPH, REALM_COLOR, ClassBadge, RealmDot, KeseyMark,
  fmtNum, fmtShort, Stat, SectionTitle, useTicker, Modal, useToast,
  Container, useViewport, ItemArt, HeroScene, AppCtx, useApp,
});
