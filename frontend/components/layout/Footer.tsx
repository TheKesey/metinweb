import Link from "next/link";
import { KeseyMark } from "@/components/brand/KeseyMark";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations();

  const cols = [
    {
      title: "Játék",
      links: [
        { label: t("nav_download"), href: "/download" },
        { label: "Játékszabályzat", href: "/guide" },
        { label: "Új játékos kalauz", href: "/guide" },
        { label: "Klán-háborúk", href: "/guide" },
      ],
    },
    {
      title: "Közösség",
      links: [
        { label: "Discord", href: "#" },
        { label: "Forum", href: "#" },
        { label: "Bug jelentés", href: "#" },
        { label: "Streamers", href: "#" },
      ],
    },
    {
      title: "Jogi",
      links: [
        { label: "GYIK", href: "/guide" },
        { label: "ÁSZF", href: "#" },
        { label: "Adatvédelem", href: "#" },
        { label: "Visszatérítés", href: "#" },
      ],
    },
  ];

  return (
    <footer style={{ marginTop: 80, borderTop: "1px solid var(--line)", background: "rgba(0,0,0,0.3)", position: "relative", zIndex: 2 }}>
      <div className="container">
        <div
          className="footer-cols"
          style={{ padding: "48px 0 32px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40 }}
        >
          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <KeseyMark size={32} />
              <div className="display" style={{ fontSize: 22, letterSpacing: "0.08em", color: "#ecead8" }}>KESEY</div>
            </div>
            <p style={{ color: "var(--fg-muted)", fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>
              Független, közösség által fenntartott szerver. 2021 óta. Nem áll kapcsolatban semmilyen kiadóval.
            </p>
            <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tag tag-accent">EU · Frankfurt</span>
              <span className="tag tag-ok">DDoS védett</span>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>{col.title}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="footer-link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{ borderTop: "1px solid var(--line)", padding: "20px 0", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", color: "var(--fg-faint)", fontSize: 11 }}
          className="mono"
        >
          <span>© 2026 Kesey Network · Független szerver projekt</span>
          <span>build 4.1.2-r9920 · {new Date().toISOString().slice(0, 10)}</span>
        </div>
      </div>
    </footer>
  );
}
