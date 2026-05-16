"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-enter">
      <div className="container" style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div className="display accent-text glow-accent" style={{ fontSize: 120, lineHeight: 1, letterSpacing: "0.04em", opacity: 0.15 }}>
            500
          </div>
          <div style={{ marginTop: -24 }}>
            <div className="eyebrow" style={{ color: "var(--warn)", marginBottom: 12 }}>ERROR</div>
            <h1 className="head" style={{ fontSize: 28, color: "#ecead8", marginBottom: 12 }}>
              {t("err_500_title")}
            </h1>
            <p style={{ color: "var(--fg-muted)", fontSize: 14, lineHeight: 1.65, marginBottom: 32 }}>
              {t("err_500_sub")}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={reset} className="btn btn-primary">
                {t("err_try_again")}
              </button>
              <Link href="/" className="btn btn-secondary">
                {t("err_back_home")}
              </Link>
            </div>
            {error.digest && (
              <div className="mono" style={{ marginTop: 24, fontSize: 11, color: "var(--fg-faint)" }}>
                {error.digest}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
