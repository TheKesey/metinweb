"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useStore } from "@/lib/store";
import { characters, orders, transactions, locations } from "@/lib/mock-data";
import { fmtNum } from "@/lib/utils";
import { UserIcon, ShopIcon, CoinIcon, LockIcon, PlusIcon } from "@/components/brand/Icon";
import { CLASS_ICONS, REALM_COLORS } from "@/components/brand/Icon";
import type { Locale, CharClass, Realm } from "@/types";

type Tab = "characters" | "orders" | "transactions" | "settings";

// ── Characters tab ────────────────────────────────────────────────────────────
function CharactersTab() {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  return (
    <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {characters.map((c, i) => {
        const loc = locations.find((l) => l.id === c.loc);
        const ClassGlyph = CLASS_ICONS[c.class as CharClass];
        const realm = REALM_COLORS[c.realm as Realm];
        return (
          <div key={c.name} className="surface corners lift fade-up" style={{ padding: 0, background: "var(--bg-2)", overflow: "hidden", animationDelay: `${i * 60}ms` }}>
            <div className="img-ph" style={{ height: 200, borderRadius: 0, position: "relative" }}>
              <span>{c.name.toUpperCase()}</span>
              <div style={{ position: "absolute", bottom: 10, left: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: realm.bg, border: `1px solid ${realm.brd}`, borderRadius: 4, padding: "3px 8px", color: realm.fg, fontSize: 11 }}>
                  {t(`realm_${c.realm}` as "realm_red")}
                </span>
              </div>
              <div style={{ position: "absolute", top: 10, right: 12 }}>
                <span className="tag">LV {c.level}</span>
              </div>
            </div>
            <div style={{ padding: 18 }}>
              <h3 className="head" style={{ fontSize: 17, color: "#ecead8" }}>{c.name}</h3>
              <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 5, color: "var(--fg-muted)", fontSize: 12 }}>
                <ClassGlyph /> {t(`class_${c.class}` as "class_warrior")}
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)", fontSize: 12, color: "var(--fg-muted)", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t("playtime")}</span><span className="mono" style={{ color: "var(--accent)" }}>{c.playtime}h</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t("last_login")}</span><span className="mono">{c.last}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t("location_now")}</span>
                  <span>{loc ? (locale === "hu" ? loc.name_hu : loc.name_en) : "?"}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/* Empty slot */}
      <div className="surface" style={{
        border: "1px dashed var(--line-strong)", display: "flex", alignItems: "center",
        justifyContent: "center", flexDirection: "column", gap: 12, minHeight: 320, cursor: "pointer",
        color: "var(--fg-muted)", background: "transparent",
      }}>
        <PlusIcon size={28} />
        <span className="head" style={{ fontSize: 14 }}>{t("create_character")}</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--fg-faint)" }}>SLOT 3/8</span>
      </div>
    </div>
  );
}

// ── Orders tab ────────────────────────────────────────────────────────────────
function OrdersTab() {
  const locale = useLocale() as Locale;

  return (
    <div className="surface scroll-x" style={{ background: "var(--bg-2)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "120px 120px 1fr 120px 100px", padding: "10px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-3)" }}>
        {["ORDER", "DATE", "ITEM", "COINS", "STATUS"].map((h) => (
          <span key={h} className="eyebrow" style={{ fontSize: 10 }}>{h}</span>
        ))}
      </div>
      {orders.map((o, i) => (
        <div key={o.id} style={{
          display: "grid", gridTemplateColumns: "120px 120px 1fr 120px 100px",
          padding: "14px 20px", alignItems: "center",
          borderBottom: i === orders.length - 1 ? 0 : "1px solid var(--line)", fontSize: 13,
        }}>
          <span className="mono" style={{ color: "var(--accent)" }}>{o.id}</span>
          <span className="mono" style={{ color: "var(--fg-muted)" }}>{o.date}</span>
          <span style={{ color: "#ecead8" }}>{locale === "hu" ? o.item : o.item_en}</span>
          <span className="mono" style={{ color: "var(--accent)" }}>{fmtNum(o.coins)}</span>
          <span className="tag tag-ok" style={{ width: "fit-content" }}>
            <span className="dot dot-ok" />
            {locale === "hu" ? "KÉSZ" : "DONE"}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Transactions tab ──────────────────────────────────────────────────────────
function TransactionsTab() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const methods: Record<string, string> = {
    card: t("pm_card"), paypal: t("pm_paypal"),
    sms: t("pm_sms"), crypto: t("pm_crypto"), bank: t("pm_bank"),
  };

  return (
    <div className="surface scroll-x" style={{ background: "var(--bg-2)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "120px 120px 1fr 120px 100px", padding: "10px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-3)" }}>
        {["TX ID", "DATE", "METHOD", "COINS", "STATUS"].map((h) => (
          <span key={h} className="eyebrow" style={{ fontSize: 10 }}>{h}</span>
        ))}
      </div>
      {transactions.map((tx, i) => (
        <div key={tx.id} style={{
          display: "grid", gridTemplateColumns: "120px 120px 1fr 120px 100px",
          padding: "14px 20px", alignItems: "center",
          borderBottom: i === transactions.length - 1 ? 0 : "1px solid var(--line)", fontSize: 13,
        }}>
          <span className="mono" style={{ color: "var(--accent)" }}>{tx.id}</span>
          <span className="mono" style={{ color: "var(--fg-muted)" }}>{tx.date}</span>
          <span>{methods[tx.method] ?? tx.method}</span>
          <span className="mono" style={{ color: "var(--ok)" }}>+{fmtNum(tx.amount)}</span>
          <span className="tag tag-ok" style={{ width: "fit-content" }}>
            <span className="dot dot-ok" /> OK
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Settings tab ──────────────────────────────────────────────────────────────
function SettingsTab() {
  const t = useTranslations();
  const { user } = useStore();
  if (!user) return null;

  return (
    <div className="surface" style={{ padding: 28, background: "var(--bg-2)", maxWidth: 560 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label className="field-label">{t("email")}</label>
          <input className="field" value={user.email} readOnly style={{ color: "var(--fg-muted)" }} />
        </div>
        <div>
          <label className="field-label">2FA</label>
          <div className="surface" style={{ padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-3)" }}>
            <span style={{ fontSize: 13 }}>
              Kétfaktoros hitelesítés <span className="tag tag-red" style={{ marginLeft: 8 }}>KIKAPCSOLVA</span>
            </span>
            <button className="btn btn-secondary btn-sm"><LockIcon size={12} /> Bekapcsol</button>
          </div>
        </div>
        <div>
          <label className="field-label">JELSZÓ</label>
          <button className="btn btn-secondary">Jelszó megváltoztatása</button>
        </div>
        <div style={{ paddingTop: 18, borderTop: "1px solid var(--line)" }}>
          <button onClick={() => useStore.getState().setUser(null)} className="btn btn-danger btn-sm">
            {t("logout")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const TABS: Array<{ id: Tab; labelKey: string; Icon: React.FC<{ size?: number }> }> = [
  { id: "characters",  labelKey: "my_characters",   Icon: UserIcon },
  { id: "orders",      labelKey: "my_orders",        Icon: ShopIcon },
  { id: "transactions",labelKey: "my_transactions",  Icon: CoinIcon },
  { id: "settings",    labelKey: "account_settings", Icon: LockIcon },
];

export default function ProfilePage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { user, setAuthModal } = useStore();
  const [tab, setTab] = useState<Tab>("characters");

  if (!user) {
    return (
      <div className="page-enter">
        <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
          <h2 className="head" style={{ color: "#ecead8", fontSize: 24 }}>Jelentkezz be a fiókodhoz.</h2>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 12 }}>
            <button onClick={() => setAuthModal("login")} className="btn btn-primary btn-lg">{t("login")}</button>
            <button onClick={() => setAuthModal("register")} className="btn btn-secondary btn-lg">{t("register")}</button>
          </div>
        </div>
      </div>
    );
  }

  const vipLabel = user.vip_tier > 0 ? `VIP NÍVÓ ${user.vip_tier}` : "ALAP";

  return (
    <div className="page-enter">
      <div className="container">
        <div style={{ padding: "40px 0 28px" }}>
          <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 10 }}>ACCOUNT</div>
          <h1 className="display accent-text glow-accent hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>
            {t("profile_title")}
          </h1>
        </div>

        {/* Account header */}
        <div className="surface corners" style={{
          padding: 28, background: "linear-gradient(135deg, rgba(34,197,224,0.08), var(--bg-2))",
          borderColor: "var(--line-2)",
          display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 28, alignItems: "center",
        }}>
          <div style={{
            width: 88, height: 88, borderRadius: 12,
            background: "linear-gradient(135deg, var(--accent), var(--red))",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 38,
            boxShadow: "0 0 32px rgba(34,197,224,0.35)",
          }}>{user.username.charAt(0).toUpperCase()}</div>
          <div>
            <h2 className="head" style={{ fontSize: 26, color: "#ecead8" }}>{user.username}</h2>
            <div className="mono" style={{ color: "var(--fg-muted)", fontSize: 12, marginTop: 4 }}>{user.email}</div>
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {user.vip_tier > 0 && <span className="tag tag-accent">{vipLabel}</span>}
              <span className="tag">{user.member_since} ÓTA TAG</span>
              <span className="tag tag-ok">⚡ AKTÍV</span>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div className="eyebrow" style={{ fontSize: 10 }}>{t("coins")}</div>
            <div className="display accent-text glow-accent" style={{ fontSize: 44, letterSpacing: "0.02em", lineHeight: 1 }}>
              {fmtNum(user.coins)}
            </div>
            <Link href="/payment" className="btn btn-primary btn-sm" style={{ marginTop: 10, display: "inline-flex" }}>
              <PlusIcon size={12} /> {t("topup")}
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 24, borderBottom: "1px solid var(--line)", flexWrap: "wrap" }} className="wrap-tabs">
          {TABS.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{
              padding: "12px 18px", background: "transparent", border: 0,
              borderBottom: tab === tb.id ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: -1,
              color: tab === tb.id ? "var(--accent-bright)" : "var(--fg-muted)",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 600,
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              <tb.Icon size={14} /> {t(tb.labelKey as "my_characters")}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 24, marginBottom: 60 }}>
          {tab === "characters"   && <CharactersTab />}
          {tab === "orders"       && <OrdersTab />}
          {tab === "transactions" && <TransactionsTab />}
          {tab === "settings"     && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}
