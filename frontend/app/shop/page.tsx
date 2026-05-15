"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useStore } from "@/lib/store";
import { items } from "@/lib/mock-data";
import { fmtNum } from "@/lib/utils";
import { GridIcon, ListIcon, CartIcon, CheckIcon, XIcon, PlusIcon, CoinIcon } from "@/components/brand/Icon";
import type { Locale, ShopItem, ItemCategory } from "@/types";

type Sort = "popular" | "new" | "price_asc" | "price_desc";
type Layout = "grid" | "list";

// ── Item art placeholder ──────────────────────────────────────────────────────
function ItemArt({ item, size = 80 }: { item: ShopItem; size?: number }) {
  return (
    <div className={`img-ph rar-bg-${item.rarity}`} style={{ width: size, height: size, borderRadius: 8, flexShrink: 0, fontSize: 11 }}>
      <span>{(item.name_hu[0] ?? "?")}</span>
    </div>
  );
}

// ── Item detail modal ─────────────────────────────────────────────────────────
function ItemModal({ item, onClose }: { item: ShopItem; onClose: () => void }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { cart, addToCart } = useStore();
  const inCart = cart.some((c) => c.id === item.id);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(4,6,10,0.72)", backdropFilter: "blur(8px)", zIndex: 300 }} />
      <div className="surface fade-up" style={{
        position: "fixed", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
        width: "min(640px, calc(100vw - 32px))",
        background: "var(--bg-2)", zIndex: 301, padding: "28px 28px 24px",
        boxShadow: "0 32px 80px -16px rgba(0,0,0,0.8)",
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: 8, background: "var(--bg-3)", border: "1px solid var(--line-2)", color: "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <XIcon size={13} />
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>
          <div className={`surface rar-bg-${item.rarity}`} style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ItemArt item={item} size={160} />
          </div>
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span className={`mono rar-${item.rarity}`} style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>{item.rarity}</span>
              <span className="tag">{t(`cat_${item.cat}` as "cat_costumes")}</span>
              {item.new && <span className="tag tag-accent">NEW</span>}
            </div>
            <h2 className="head" style={{ fontSize: 22, color: "#ecead8" }}>{locale === "hu" ? item.name_hu : item.name_en}</h2>
            <p style={{ marginTop: 8, color: "var(--fg-muted)", fontSize: 14, lineHeight: 1.6 }}>
              {locale === "hu" ? item.desc_hu : item.desc_en}
            </p>
            <div className="surface" style={{ marginTop: 16, padding: "14px 16px", background: "var(--bg-3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
                <div>
                  <div className="eyebrow" style={{ fontSize: 9, marginBottom: 2 }}>{t("coins")}</div>
                  <div className="display accent-text" style={{ fontSize: 34, letterSpacing: "0.04em", lineHeight: 1 }}>{fmtNum(item.price)}</div>
                  {item.oldPrice && <div className="mono" style={{ fontSize: 12, color: "var(--fg-faint)", textDecoration: "line-through", marginTop: 4 }}>{fmtNum(item.oldPrice)}</div>}
                </div>
                <button onClick={() => { addToCart({ ...item, qty: 1 }); onClose(); }} className={inCart ? "btn btn-ghost" : "btn btn-primary"}>
                  {inCart ? <><CheckIcon size={14} /> {t("in_cart")}</> : <><CartIcon size={14} /> {t("add_to_cart")}</>}
                </button>
              </div>
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: "var(--fg-muted)", display: "flex", gap: 20 }}>
              <span>{item.popular}% {locale === "hu" ? "kedveltség" : "approval"}</span>
              <span>{Math.floor(item.popular * 14)} {locale === "hu" ? "eladás" : "sold"}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Item card grid ────────────────────────────────────────────────────────────
function ItemCardGrid({ item, onClick, delay = 0 }: { item: ShopItem; onClick: () => void; delay?: number }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { cart, addToCart } = useStore();
  const inCart = cart.some((c) => c.id === item.id);
  const disc = item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;

  return (
    <div className={`surface lift corners fade-up rar-bg-${item.rarity}`} style={{ padding: 0, background: "var(--bg-2)", animationDelay: `${delay}ms`, overflow: "hidden" }}>
      <div onClick={onClick} style={{ position: "relative", cursor: "pointer", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ItemArt item={item} size={130} />
        {item.new && <span className="tag tag-accent" style={{ position: "absolute", top: 8, left: 8 }}>NEW</span>}
        {disc > 0 && <span className="tag tag-red" style={{ position: "absolute", top: 8, right: 8 }}>-{disc}%</span>}
      </div>
      <div style={{ padding: 14, borderTop: "1px solid var(--line)" }}>
        <div className={`mono rar-${item.rarity}`} style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>{item.rarity}</div>
        <h4 className="head" style={{ fontSize: 13, marginBottom: 10, color: "#ecead8", minHeight: 32, lineHeight: 1.3 }}>
          {locale === "hu" ? item.name_hu : item.name_en}
        </h4>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="display accent-text" style={{ fontSize: 20, letterSpacing: "0.04em", lineHeight: 1 }}>{fmtNum(item.price)}</div>
            {item.oldPrice && <div className="mono" style={{ fontSize: 10, color: "var(--fg-faint)", textDecoration: "line-through" }}>{fmtNum(item.oldPrice)}</div>}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); addToCart({ ...item, qty: 1 }); }}
            className={inCart ? "btn btn-ghost btn-sm" : "btn btn-primary btn-sm"}
            style={{ padding: "7px 9px" }}
          >
            {inCart ? <CheckIcon size={11} /> : <CartIcon size={11} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Item card list ────────────────────────────────────────────────────────────
function ItemCardList({ item, onClick, delay = 0 }: { item: ShopItem; onClick: () => void; delay?: number }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { cart, addToCart } = useStore();
  const inCart = cart.some((c) => c.id === item.id);
  const disc = item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;

  return (
    <div className={`surface lift fade-up rar-bg-${item.rarity}`} style={{
      padding: 0, background: "var(--bg-2)", animationDelay: `${delay}ms`,
      display: "grid", gridTemplateColumns: "80px 1fr auto auto", gap: 0, alignItems: "center",
      overflow: "hidden",
    }}>
      <div onClick={onClick} style={{ cursor: "pointer", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid var(--line)" }}>
        <ItemArt item={item} size={64} />
      </div>
      <div onClick={onClick} style={{ cursor: "pointer", padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span className={`mono rar-${item.rarity}`} style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>{item.rarity}</span>
          {item.new && <span className="tag tag-accent">NEW</span>}
          {disc > 0 && <span className="tag tag-red">-{disc}%</span>}
        </div>
        <h4 className="head" style={{ fontSize: 14, color: "#ecead8" }}>{locale === "hu" ? item.name_hu : item.name_en}</h4>
        <p style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 2 }}>{locale === "hu" ? item.desc_hu : item.desc_en}</p>
      </div>
      <div style={{ textAlign: "right", padding: "12px 16px" }}>
        <div className="display accent-text" style={{ fontSize: 22, letterSpacing: "0.04em" }}>{fmtNum(item.price)}</div>
        {item.oldPrice && <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", textDecoration: "line-through" }}>{fmtNum(item.oldPrice)}</div>}
      </div>
      <div style={{ padding: "12px 16px 12px 0" }}>
        <button
          onClick={(e) => { e.stopPropagation(); addToCart({ ...item, qty: 1 }); }}
          className={inCart ? "btn btn-ghost btn-sm" : "btn btn-primary btn-sm"}
        >
          {inCart ? <><CheckIcon size={12} /> {t("in_cart")}</> : <><CartIcon size={12} /> {t("add_to_cart")}</>}
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const CATS: Array<{ id: "all" | ItemCategory; labelKey: string }> = [
  { id: "all", labelKey: "all" },
  { id: "costumes", labelKey: "cat_costumes" },
  { id: "mounts", labelKey: "cat_mounts" },
  { id: "pets", labelKey: "cat_pets" },
  { id: "consumable", labelKey: "cat_consumable" },
  { id: "storage", labelKey: "cat_storage" },
  { id: "bundle", labelKey: "cat_bundle" },
];

const SORTS: Array<{ id: Sort; labelKey: string }> = [
  { id: "popular", labelKey: "sort_popular" },
  { id: "new", labelKey: "sort_new" },
  { id: "price_asc", labelKey: "sort_price_asc" },
  { id: "price_desc", labelKey: "sort_price_desc" },
];

export default function ShopPage() {
  const t = useTranslations();
  const { user, setCartOpen, cartCount, setAuthModal } = useStore();
  const [cat, setCat] = useState<"all" | ItemCategory>("all");
  const [sort, setSort] = useState<Sort>("popular");
  const [layout, setLayout] = useState<Layout>("grid");
  const [selected, setSelected] = useState<ShopItem | null>(null);

  let filtered = cat === "all" ? items : items.filter((i) => i.cat === cat);
  filtered = [...filtered].sort((a, b) => {
    if (sort === "popular") return b.popular - a.popular;
    if (sort === "new") return Number(b.new) - Number(a.new);
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    return 0;
  });

  const count = cartCount();

  return (
    <div className="page-enter">
      <div className="container">
        <div style={{ padding: "40px 0 24px" }}>
          <div className="eyebrow" style={{ marginBottom: 10, color: "var(--accent)" }}>SHOP</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 className="display accent-text glow-accent hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>
                {t("shop_title")}
              </h1>
              <p style={{ color: "var(--fg-muted)", fontSize: 15, marginTop: 4 }}>{t("shop_sub")}</p>
            </div>
            <button onClick={() => setCartOpen(true)} className="btn btn-secondary" style={{ position: "relative" }}>
              <CartIcon size={14} /> {t("cart")}
              {count > 0 && (
                <span style={{ background: "var(--accent)", color: "#071018", padding: "1px 7px", borderRadius: 99, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}>{count}</span>
              )}
            </button>
          </div>
        </div>

        <div className="sidebar-main" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, marginTop: 8, marginBottom: 60 }}>
          {/* Sidebar */}
          <aside>
            <div className="surface" style={{ padding: 16, background: "var(--bg-2)" }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>{t("categories")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {CATS.map((c) => {
                  const active = cat === c.id;
                  const count = c.id === "all" ? items.length : items.filter((i) => i.cat === c.id).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCat(c.id)}
                      className="cat-btn"
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "8px 10px",
                        background: active ? "rgba(34,197,224,0.10)" : "transparent",
                        border: 0, borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                        color: active ? "var(--accent-bright)" : "var(--fg-muted)",
                        cursor: "pointer", fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 500,
                        textAlign: "left", borderRadius: 4, width: "100%",
                      }}
                    >
                      <span>{t(c.labelKey as "all")}</span>
                      <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coin balance */}
            <div className="surface" style={{ padding: 16, marginTop: 12, background: "var(--bg-2)" }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>{t("coins")}</div>
              {user ? (
                <>
                  <div className="display accent-text" style={{ fontSize: 30, letterSpacing: "0.02em" }}>{fmtNum(user.coins)}</div>
                  <Link href="/payment" className="btn btn-accent btn-sm" style={{ width: "100%", marginTop: 12, justifyContent: "center" }}>
                    <PlusIcon size={12} /> {t("topup")}
                  </Link>
                </>
              ) : (
                <>
                  <div style={{ color: "var(--fg-muted)", fontSize: 13, marginBottom: 10 }}>— —</div>
                  <button onClick={() => setAuthModal("login")} className="btn btn-primary btn-sm" style={{ width: "100%" }}>
                    {t("login")}
                  </button>
                </>
              )}
            </div>
          </aside>

          {/* Items */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {SORTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSort(s.id)}
                    style={{
                      padding: "6px 12px",
                      background: sort === s.id ? "var(--bg-3)" : "transparent",
                      border: sort === s.id ? "1px solid var(--line-strong)" : "1px solid var(--line)",
                      color: sort === s.id ? "var(--fg)" : "var(--fg-muted)",
                      cursor: "pointer", fontFamily: "var(--font-head)", fontSize: 11,
                      letterSpacing: "0.05em", textTransform: "uppercase", borderRadius: 6, fontWeight: 600,
                    }}
                  >
                    {t(s.labelKey as "sort_popular")}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 2, background: "var(--bg-2)", padding: 2, borderRadius: 6, border: "1px solid var(--line)" }}>
                <button
                  onClick={() => setLayout("grid")}
                  style={{ padding: 6, background: layout === "grid" ? "var(--bg-4)" : "transparent", border: 0, color: layout === "grid" ? "var(--accent)" : "var(--fg-muted)", cursor: "pointer", borderRadius: 4, display: "flex" }}
                >
                  <GridIcon size={14} />
                </button>
                <button
                  onClick={() => setLayout("list")}
                  style={{ padding: 6, background: layout === "list" ? "var(--bg-4)" : "transparent", border: 0, color: layout === "list" ? "var(--accent)" : "var(--fg-muted)", cursor: "pointer", borderRadius: 4, display: "flex" }}
                >
                  <ListIcon size={14} />
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="surface" style={{ padding: 60, textAlign: "center", color: "var(--fg-muted)" }}>
                {t("error")}
              </div>
            ) : layout === "grid" ? (
              <div className="grid-shop" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                {filtered.map((it, i) => (
                  <ItemCardGrid key={it.id} item={it} onClick={() => setSelected(it)} delay={i * 25} />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map((it, i) => (
                  <ItemCardList key={it.id} item={it} onClick={() => setSelected(it)} delay={i * 20} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
