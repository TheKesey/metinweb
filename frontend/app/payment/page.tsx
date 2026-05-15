"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useStore } from "@/lib/store";
import { topupTiers } from "@/lib/mock-data";
import { fmtNum } from "@/lib/utils";
import { CheckIcon, SpinnerIcon, ArrowRightIcon, CardIcon, MailIcon, LockIcon, CoinIcon } from "@/components/brand/Icon";

type Step = "select" | "confirm" | "processing" | "done";
type Method = "card" | "paypal" | "sms" | "crypto" | "bank";

// ── Card preview + form ───────────────────────────────────────────────────────
function CardForm({ onPay, onCancel, eur }: { onPay: () => void; onCancel: () => void; eur: number }) {
  const [card, setCard] = useState({ name: "", num: "", exp: "", cvc: "" });

  const fmt = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v: string) => v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");

  const valid = card.name && card.num.replace(/\s/g, "").length >= 16 && card.exp.length >= 4 && card.cvc.length >= 3;

  return (
    <div className="surface corners" style={{ padding: 32, background: "var(--bg-2)", maxWidth: 440 }}>
      {/* Card preview */}
      <div style={{
        padding: 24, borderRadius: 12, marginBottom: 24,
        background: "linear-gradient(135deg, #1a1f2e 0%, #0f1118 60%, #1a1413 100%)",
        border: "1px solid var(--line-2)", aspectRatio: "1.586/1",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,224,0.12), transparent 70%)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="display" style={{ fontSize: 18, color: "var(--accent)", letterSpacing: "0.06em" }}>KESEY</div>
          <span className="mono" style={{ fontSize: 10, color: "var(--accent)", letterSpacing: "0.18em" }}>VISA</span>
        </div>
        <div className="mono" style={{ fontSize: 18, color: "#ecead8", letterSpacing: "0.18em", marginTop: 28 }}>
          {card.num || "•••• •••• •••• ••••"}
        </div>
        <div style={{ position: "absolute", bottom: 18, left: 24, right: 24, display: "flex", justifyContent: "space-between", fontSize: 11 }} className="mono">
          <span style={{ color: "var(--fg-muted)" }}>{card.name.toUpperCase() || "KÁRTYABIRTOKOS"}</span>
          <span style={{ color: "var(--fg-muted)" }}>{card.exp || "MM/YY"}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label className="field-label">KÁRTYABIRTOKOS NEVE</label>
          <input className="field" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} autoFocus />
        </div>
        <div>
          <label className="field-label">KÁRTYASZÁM</label>
          <input className="field mono" value={card.num} onChange={(e) => setCard({ ...card, num: fmt(e.target.value) })} placeholder="•••• •••• •••• ••••" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label className="field-label">LEJÁRAT</label>
            <input className="field mono" value={card.exp} onChange={(e) => setCard({ ...card, exp: fmtExp(e.target.value) })} placeholder="MM/YY" />
          </div>
          <div>
            <label className="field-label">CVC</label>
            <input className="field mono" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })} placeholder="•••" />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button onClick={onCancel} className="btn btn-ghost">Vissza</button>
        <button onClick={onPay} className="btn btn-primary" style={{ flex: 1 }} disabled={!valid}>
          <LockIcon size={14} /> Fizetek €{eur}
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PaymentPage() {
  const t = useTranslations();
  const { user, setUser } = useStore();
  const [tierIdx, setTierIdx] = useState(2);
  const [method, setMethod] = useState<Method>("card");
  const [step, setStep] = useState<Step>("select");

  const cur = topupTiers[tierIdx];

  const methods: Array<{ id: Method; label: string; icon: React.FC<{ size?: number }>; fee: string }> = [
    { id: "card",   label: t("pm_card"),   icon: CardIcon,  fee: "0%" },
    { id: "paypal", label: t("pm_paypal"), icon: MailIcon,  fee: "2.9%" },
    { id: "sms",    label: t("pm_sms"),    icon: SpinnerIcon, fee: "12%" },
    { id: "crypto", label: t("pm_crypto"), icon: CoinIcon,  fee: "1%" },
    { id: "bank",   label: t("pm_bank"),   icon: CoinIcon,  fee: "0%" },
  ];

  function handlePay() {
    setStep("processing");
    setTimeout(() => {
      if (user) {
        const added = cur.coins + cur.bonus;
        setUser({ ...user, coins: user.coins + added });
      }
      setStep("done");
    }, 2000);
  }

  if (!user) {
    return (
      <div className="page-enter">
        <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
          <h2 className="head" style={{ color: "#ecead8", fontSize: 24 }}>Jelentkezz be a feltöltéshez.</h2>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 12 }}>
            <button onClick={() => useStore.getState().setAuthModal("login")} className="btn btn-primary btn-lg">
              {t("login")}
            </button>
            <button onClick={() => useStore.getState().setAuthModal("register")} className="btn btn-secondary btn-lg">
              {t("register")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const Summary = () => (
    <div className="surface corners" style={{ padding: 24, background: "var(--bg-2)", position: "sticky", top: 116 }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>ÖSSZESÍTÉS</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--fg-muted)" }}>{t("coins")}</span>
          <span style={{ color: "#ecead8" }}>{fmtNum(cur.coins)}</span>
        </div>
        {cur.bonus > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--fg-muted)" }}>{t("bonus")}</span>
            <span style={{ color: "var(--accent)" }}>+{fmtNum(cur.bonus)}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--fg-muted)" }}>{t("payment_method")}</span>
          <span style={{ color: "#ecead8" }}>{methods.find((m) => m.id === method)?.label}</span>
        </div>
      </div>
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="eyebrow" style={{ fontSize: 9 }}>KAPSZ</div>
          <div className="display accent-text glow-accent" style={{ fontSize: 34, letterSpacing: "0.02em", lineHeight: 1 }}>
            {fmtNum(cur.coins + cur.bonus)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="eyebrow" style={{ fontSize: 9 }}>FIZETSZ</div>
          <div className="display" style={{ fontSize: 28, color: "#ecead8", letterSpacing: "0.02em" }}>€{cur.eur}</div>
        </div>
      </div>
      {step === "select" && (
        <button onClick={() => setStep("confirm")} className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 18 }}>
          {t("pay_now")} <ArrowRightIcon size={14} />
        </button>
      )}
      <div style={{ marginTop: 12, fontSize: 11, color: "var(--fg-faint)", textAlign: "center" }} className="mono">
        256-bit SSL · 3D Secure
      </div>
    </div>
  );

  return (
    <div className="page-enter">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div style={{ padding: "40px 0 28px" }}>
          <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 10 }}>TOP UP</div>
          <h1 className="display accent-text glow-accent hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>
            {t("pay_title")}
          </h1>
          <p style={{ color: "var(--fg-muted)", marginTop: 4 }}>{t("pay_sub")}</p>
        </div>

        {step === "select" && (
          <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, marginBottom: 60 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>{t("select_amount")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {topupTiers.map((tier, i) => {
                  const active = tierIdx === i;
                  return (
                    <button key={i} onClick={() => setTierIdx(i)} style={{
                      position: "relative", textAlign: "left", padding: 20, borderRadius: 12,
                      background: active ? "linear-gradient(135deg, rgba(34,197,224,0.15), var(--bg-2))" : "var(--bg-2)",
                      border: active ? "1px solid rgba(34,197,224,0.5)" : "1px solid var(--line-2)",
                      cursor: "pointer", color: "var(--fg)",
                      boxShadow: active ? "0 0 32px -10px var(--accent)" : "none",
                      transition: "all 0.18s",
                    }}>
                      {tier.popular && <span className="tag tag-accent" style={{ position: "absolute", top: 12, right: 12 }}>NÉPSZERŰ</span>}
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                        <span className="display accent-text" style={{ fontSize: 34, letterSpacing: "0.02em" }}>{fmtNum(tier.coins)}</span>
                        {tier.bonus > 0 && <span className="tag tag-accent">+{tier.bonus} {t("bonus")}</span>}
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 4 }}>{t("coins")}</div>
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="display" style={{ fontSize: 20, color: "#ecead8", letterSpacing: "0.02em" }}>€{tier.eur}</span>
                        {active && <CheckIcon size={18} style={{ color: "var(--accent)" }} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="eyebrow" style={{ marginTop: 28, marginBottom: 10 }}>{t("payment_method")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {methods.map((m) => {
                  const active = method === m.id;
                  return (
                    <button key={m.id} onClick={() => setMethod(m.id)} style={{
                      display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 8,
                      background: active ? "rgba(34,197,224,0.08)" : "var(--bg-2)",
                      border: active ? "1px solid rgba(34,197,224,0.4)" : "1px solid var(--line-2)",
                      color: "var(--fg)", cursor: "pointer",
                    }}>
                      <span style={{ color: active ? "var(--accent)" : "var(--fg-muted)" }}><m.icon size={18} /></span>
                      <span style={{ flex: 1, textAlign: "left", fontWeight: 500 }}>{m.label}</span>
                      <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>Díj: {m.fee}</span>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                        border: active ? "5px solid var(--accent)" : "1px solid var(--line-strong)",
                      }} />
                    </button>
                  );
                })}
              </div>
            </div>
            <aside><Summary /></aside>
          </div>
        )}

        {step === "confirm" && method === "card" && (
          <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 60 }}>
            <CardForm onPay={handlePay} onCancel={() => setStep("select")} eur={cur.eur} />
            <aside><Summary /></aside>
          </div>
        )}

        {step === "confirm" && method !== "card" && (
          <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 60 }}>
            <div className="surface corners" style={{ padding: 36, background: "var(--bg-2)", textAlign: "center" }}>
              <div style={{ color: "var(--accent)", display: "inline-block", marginBottom: 16 }}>
                {(() => { const M = methods.find((m) => m.id === method)!; return <M.icon size={40} />; })()}
              </div>
              <h3 className="head" style={{ fontSize: 22, color: "#ecead8" }}>{methods.find((m) => m.id === method)!.label}</h3>
              <p style={{ color: "var(--fg-muted)", marginTop: 8 }}>Átirányítás a fizetési oldalra… (demo)</p>
              <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 10 }}>
                <button onClick={() => setStep("select")} className="btn btn-ghost">Vissza</button>
                <button onClick={handlePay} className="btn btn-primary">Fizetek €{cur.eur}</button>
              </div>
            </div>
            <aside><Summary /></aside>
          </div>
        )}

        {step === "processing" && (
          <div className="surface corners fade-up" style={{ padding: 80, textAlign: "center", background: "var(--bg-2)", marginBottom: 60 }}>
            <SpinnerIcon size={56} style={{ color: "var(--accent)" }} />
            <h2 className="head" style={{ fontSize: 24, color: "#ecead8", marginTop: 18 }}>{t("pay_processing")}</h2>
            <p className="mono" style={{ color: "var(--fg-faint)", marginTop: 6 }}>Ne zárd be az oldalt.</p>
          </div>
        )}

        {step === "done" && (
          <div className="surface corners fade-up" style={{ padding: 60, textAlign: "center", background: "linear-gradient(180deg, rgba(74,222,128,0.06), var(--bg-2))", marginBottom: 60 }}>
            <div style={{
              display: "inline-flex", width: 80, height: 80, borderRadius: "50%",
              background: "rgba(74,222,128,0.15)", color: "var(--ok)",
              alignItems: "center", justifyContent: "center", marginBottom: 18,
            }}>
              <CheckIcon size={40} />
            </div>
            <h2 className="head" style={{ fontSize: 28, color: "#ecead8" }}>{t("pay_success")}</h2>
            <p style={{ color: "var(--fg-muted)", marginTop: 8, fontSize: 15 }}>
              <span className="display accent-text" style={{ fontSize: 30, letterSpacing: "0.02em" }}>+{fmtNum(cur.coins + cur.bonus)}</span>{" "}
              {t("coins")} jóváírva.
            </p>
            <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <Link href="/shop" className="btn btn-primary">{t("nav_shop")}</Link>
              <button onClick={() => setStep("select")} className="btn btn-ghost">Még egy feltöltés</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
