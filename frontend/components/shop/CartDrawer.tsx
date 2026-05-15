"use client";

import { useTranslations, useLocale } from "next-intl";
import { useStore } from "@/lib/store";
import { XIcon, PlusIcon, MinusIcon, CartIcon, SpinnerIcon, CheckIcon } from "@/components/brand/Icon";
import { fmtNum } from "@/lib/utils";
import Link from "next/link";

export function CartDrawer() {
  const t = useTranslations();
  const locale = useLocale();
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, clearCart, cartTotal, user, checkoutStep, setCheckoutStep } = useStore();
  const total = cartTotal();

  if (!cartOpen) return null;

  async function handleCheckout() {
    if (!user) return;
    setCheckoutStep("review");
  }

  async function handleBuy() {
    setCheckoutStep("processing");
    await new Promise((r) => setTimeout(r, 1400));
    useStore.getState().setUser({ ...user!, coins: user!.coins - total });
    clearCart();
    setCheckoutStep("done");
  }

  function handleClose() {
    setCartOpen(false);
    setCheckoutStep(null);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(4,6,10,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 200,
        }}
      />

      {/* Drawer */}
      <div
        className="cart-drawer fade-in"
        style={{
          position: "fixed",
          top: "var(--header-h)",
          right: 0,
          bottom: 0,
          width: 420,
          background: "var(--bg-1)",
          borderLeft: "1px solid var(--line-2)",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-24px 0 60px -12px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 4 }}>{t("cart")}</div>
              <div className="display" style={{ fontSize: 32 }}>
                {cart.length} {cart.length === 1 ? "TÉTEL" : "TÉTEL"}
              </div>
            </div>
            <button onClick={handleClose} style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--bg-3)", border: "1px solid var(--line-2)",
              color: "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
              <XIcon size={14} />
            </button>
          </div>
        </div>

        {/* Checkout steps */}
        {checkoutStep === "processing" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32 }}>
            <SpinnerIcon size={32} style={{ color: "var(--accent)" }} />
            <div style={{ fontSize: 15, color: "var(--fg-muted)" }}>{t("pay_processing")}</div>
          </div>
        )}

        {checkoutStep === "done" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--ok)",
            }}>
              <CheckIcon size={28} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#ecead8" }}>{t("pay_success")}</div>
            <div style={{ fontSize: 13, color: "var(--fg-muted)", textAlign: "center" }}>{t("purchase_success")}</div>
            <button onClick={handleClose} className="btn btn-primary" style={{ marginTop: 8 }}>
              {t("close")}
            </button>
          </div>
        )}

        {checkoutStep === "review" && (
          <div style={{ flex: 1, overflow: "auto", padding: "16px 24px" }}>
            <div style={{ marginBottom: 16, fontSize: 13, color: "var(--fg-muted)" }}>Rendelés összesítő</div>
            {cart.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ fontSize: 13 }}>{locale === "hu" ? item.name_hu : item.name_en}</div>
                <div className="mono" style={{ color: "var(--accent-bright)", fontSize: 13 }}>
                  {fmtNum(item.price * item.qty)}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{t("total")}</div>
              <div className="display" style={{ fontSize: 24, color: "var(--accent-bright)" }}>{fmtNum(total)}</div>
            </div>
            {user && user.coins < total && (
              <div style={{ padding: "10px 14px", background: "rgba(192,51,74,0.1)", border: "1px solid rgba(192,51,74,0.3)", borderRadius: "var(--radius)", marginBottom: 16, fontSize: 13, color: "var(--red-bright)" }}>
                {t("not_enough_coins")} <Link href="/payment" onClick={handleClose} style={{ color: "var(--accent)" }}>{t("topup")}</Link>
              </div>
            )}
          </div>
        )}

        {(!checkoutStep || checkoutStep === null) && (
          <>
            {/* Cart items */}
            {cart.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "var(--fg-faint)" }}>
                <CartIcon size={32} />
                <div style={{ fontSize: 13 }}>{t("empty_cart")}</div>
              </div>
            ) : (
              <div style={{ flex: 1, overflow: "auto", padding: "8px 0" }}>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", borderBottom: "1px solid var(--line)" }}
                  >
                    {/* Art */}
                    <div className={`img-ph rar-${item.rarity}`} style={{ width: 56, height: 56, borderRadius: "var(--radius)", flexShrink: 0, fontSize: 18 }}>
                      <span>{(locale === "hu" ? item.name_hu : item.name_en)[0]}</span>
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#ecead8", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {locale === "hu" ? item.name_hu : item.name_en}
                      </div>
                      <div className="mono" style={{ fontSize: 12, color: "var(--accent-bright)" }}>{fmtNum(item.price)}</div>
                    </div>
                    {/* Qty */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 24, height: 24, borderRadius: 4, background: "var(--bg-3)", border: "1px solid var(--line-2)", color: "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <MinusIcon size={10} />
                      </button>
                      <span className="mono" style={{ fontSize: 13, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 24, height: 24, borderRadius: 4, background: "var(--bg-3)", border: "1px solid var(--line-2)", color: "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <PlusIcon size={10} />
                      </button>
                    </div>
                    {/* Remove */}
                    <button onClick={() => removeFromCart(item.id)} style={{ width: 24, height: 24, borderRadius: 4, background: "transparent", border: "1px solid var(--line)", color: "var(--fg-faint)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <XIcon size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        {cart.length > 0 && checkoutStep === null && (
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--line)", background: "var(--bg-2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: "var(--fg-muted)" }}>{t("subtotal")}</div>
              <div className="display" style={{ fontSize: 28, color: "var(--accent-bright)" }}>{fmtNum(total)}</div>
            </div>
            {!user ? (
              <button onClick={() => { setCartOpen(false); useStore.getState().setAuthModal("login"); }} className="btn btn-primary" style={{ width: "100%" }}>
                {t("login")}
              </button>
            ) : (
              <button onClick={handleCheckout} className="btn btn-primary" style={{ width: "100%" }}>
                {t("checkout")}
              </button>
            )}
          </div>
        )}

        {checkoutStep === "review" && (
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--line)", background: "var(--bg-2)", display: "flex", gap: 8 }}>
            <button onClick={() => setCheckoutStep(null)} className="btn btn-secondary" style={{ flex: 1 }}>Vissza</button>
            <button
              onClick={handleBuy}
              disabled={!user || user.coins < total}
              className="btn btn-primary"
              style={{ flex: 1, opacity: !user || user.coins < total ? 0.5 : 1 }}
            >
              {t("buy_now")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
