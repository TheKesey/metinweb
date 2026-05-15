"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { DownloadIcon, RefreshIcon } from "@/components/brand/Icon";

type DownloadOption = "full" | "torrent" | "patcher";

export default function DownloadPage() {
  const t = useTranslations();
  const [progress, setProgress] = useState<number | null>(null);
  const [option, setOption] = useState<DownloadOption>("full");

  function startDownload(opt: DownloadOption) {
    setOption(opt);
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p === null) { clearInterval(id); return null; }
        if (p >= 100) { clearInterval(id); return 100; }
        return Math.min(100, p + Math.random() * 8 + 1);
      });
    }, 300);
  }

  const opts: Array<{
    id: DownloadOption;
    labelKey: string;
    size: string;
    version: string;
    primary: boolean;
    icon: React.FC<{ size?: number }>;
  }> = [
    { id: "full",    labelKey: "dl_full",    size: "8.4 GB", version: "4.1.2",  primary: true,  icon: DownloadIcon },
    { id: "torrent", labelKey: "dl_torrent", size: "8.4 GB", version: "4.1.2",  primary: false, icon: DownloadIcon },
    { id: "patcher", labelKey: "dl_patcher", size: "12 MB",  version: "patcher",primary: false, icon: RefreshIcon },
  ];

  const reqSections: Array<{ labelKey: "min" | "rec"; items: [string, string][] }> = [
    {
      labelKey: "min",
      items: [
        ["CPU", "Intel i3-4xxx / AMD FX-6300"],
        ["RAM", "4 GB"],
        ["GPU", "GTX 750 / RX 460"],
        ["VRAM", "1 GB"],
        ["Disk", "12 GB"],
        ["OS", "Windows 10 64-bit"],
      ],
    },
    {
      labelKey: "rec",
      items: [
        ["CPU", "Intel i5-8xxx / Ryzen 5 3xxx"],
        ["RAM", "8 GB"],
        ["GPU", "GTX 1060 / RX 580"],
        ["VRAM", "4 GB"],
        ["Disk", "12 GB SSD"],
        ["OS", "Windows 11"],
      ],
    },
  ];

  return (
    <div className="page-enter">
      <div className="container">
        <div style={{ padding: "40px 0 28px" }}>
          <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 10 }}>WINDOWS 10/11</div>
          <h1 className="display accent-text glow-accent hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>
            {t("dl_title")}
          </h1>
          <p style={{ color: "var(--fg-muted)", marginTop: 4 }}>{t("dl_sub")}</p>
        </div>

        <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, marginBottom: 60 }}>
          <div>
            {/* Download options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {opts.map((o) => (
                <div
                  key={o.id}
                  className={o.primary ? "surface corners" : "surface"}
                  style={{
                    padding: 24, background: o.primary ? "linear-gradient(135deg, rgba(34,197,224,0.10), var(--bg-2))" : "var(--bg-2)",
                    borderColor: o.primary ? "rgba(34,197,224,0.35)" : "var(--line-2)",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 10,
                      background: o.primary ? "rgba(34,197,224,0.15)" : "var(--bg-3)",
                      color: o.primary ? "var(--accent-bright)" : "var(--fg)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <o.icon size={22} />
                    </div>
                    <div>
                      <h3 className="head" style={{ fontSize: 17, color: "#ecead8" }}>{t(o.labelKey as "dl_full")}</h3>
                      <div className="mono" style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 2 }}>
                        {t("dl_size")} {o.size} · {t("dl_version")} {o.version}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => startDownload(o.id)}
                    className={o.primary ? "btn btn-primary btn-lg" : "btn btn-secondary"}
                    style={{ flexShrink: 0 }}
                  >
                    <DownloadIcon size={14} /> {o.primary ? "DOWNLOAD" : t("dl_full").toUpperCase()}
                  </button>
                </div>
              ))}
            </div>

            {/* Progress */}
            {progress !== null && (
              <div className="surface fade-up" style={{ marginTop: 16, padding: 20, background: "var(--bg-2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span className="eyebrow">DOWNLOADING · {t(opts.find((o) => o.id === option)!.labelKey as "dl_full")}</span>
                  <span className="mono" style={{ color: "var(--accent)" }}>{progress.toFixed(1)}%</span>
                </div>
                <div style={{ height: 6, background: "var(--bg-1)", borderRadius: 3, overflow: "hidden", border: "1px solid var(--line)" }}>
                  <div style={{
                    height: "100%", width: `${progress}%`,
                    background: "linear-gradient(90deg, var(--accent-deep), var(--accent-bright))",
                    boxShadow: "0 0 12px var(--accent)",
                    transition: "width 0.25s ease",
                  }} />
                </div>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span>{(progress / 100 * 8.4).toFixed(2)} / 8.40 GB</span>
                  <span>{progress >= 100 ? "Kész — futtasd a telepítőt." : `~${Math.max(1, Math.round((100 - progress) / 10))} perc`}</span>
                </div>
              </div>
            )}
          </div>

          {/* System requirements */}
          <aside>
            <div className="surface" style={{ padding: 24, background: "var(--bg-2)" }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>{t("sys_requirements")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {reqSections.map((sec) => (
                  <div key={sec.labelKey}>
                    <div className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>
                      {t(sec.labelKey)}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {sec.items.map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: "1px dashed var(--line)" }}>
                          <span className="mono" style={{ color: "var(--fg-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{k}</span>
                          <span style={{ color: "var(--fg)" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info strip */}
            <div className="surface" style={{ marginTop: 12, padding: 16, background: "var(--bg-2)", fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.6 }}>
              <div style={{ marginBottom: 8, fontWeight: 600, color: "#ecead8" }}>Tudnivalók</div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {["Antivírus false-positive lehetséges — add kivétellistára.", "Patcher az első indításkor frissíti a klienst.", "DX11 és Vulkan egyaránt támogatott.", "Mac / Linux: Wine vagy Proton szükséges."].map((t) => (
                  <li key={t} style={{ paddingLeft: 16, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--accent)" }}>›</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
