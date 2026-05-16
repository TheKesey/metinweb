import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <div className="page-enter">
      <div className="container" style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div className="display accent-text glow-accent" style={{ fontSize: 120, lineHeight: 1, letterSpacing: "0.04em", opacity: 0.15 }}>
            404
          </div>
          <div style={{ marginTop: -24 }}>
            <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 12 }}>NOT FOUND</div>
            <h1 className="head" style={{ fontSize: 28, color: "#ecead8", marginBottom: 12 }}>
              {t("err_404_title")}
            </h1>
            <p style={{ color: "var(--fg-muted)", fontSize: 14, lineHeight: 1.65, marginBottom: 32 }}>
              {t("err_404_sub")}
            </p>
            <Link href="/" className="btn btn-primary">
              {t("err_back_home")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
