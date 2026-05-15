// Itemshop — categories, grid/list layout, cart, detail modal, checkout

function Itemshop() {
  const app = useApp();
  const { lang, t, tweaks, cart, addToCart, setCartOpen, coins } = app;
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("popular");
  const [layout, setLayout] = useState(tweaks.shopLayout);
  const [selected, setSelected] = useState(null);
  const vp = useViewport();

  // Sync layout w/ tweak changes
  useEffect(() => { setLayout(tweaks.shopLayout); }, [tweaks.shopLayout]);

  const categories = [
    { id: "all", label: t("all") },
    { id: "costumes", label: t("cat_costumes") },
    { id: "mounts", label: t("cat_mounts") },
    { id: "pets", label: t("cat_pets") },
    { id: "consumable", label: t("cat_consumable") },
    { id: "storage", label: t("cat_storage") },
    { id: "bundle", label: t("cat_bundle") },
  ];
  const sorts = [
    { id: "popular", label: t("sort_popular") },
    { id: "new", label: t("sort_new") },
    { id: "price_asc", label: t("sort_price_asc") },
    { id: "price_desc", label: t("sort_price_desc") },
  ];

  let items = window.MOCK.items;
  if (cat !== "all") items = items.filter((i) => i.cat === cat);
  items = [...items].sort((a, b) => {
    if (sort === "popular") return b.popular - a.popular;
    if (sort === "new") return Number(b.new) - Number(a.new);
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="page-enter">
      <Container>
        <div style={{ padding: "40px 0 24px" }}>
          <div className="eyebrow" style={{ marginBottom: 10, color: "var(--gold)" }}>SHOP</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 className="display gold-text glow-gold" style={{ fontSize: 64, letterSpacing: "0.02em" }}>{t("shop_title")}</h1>
              <p style={{ color: "var(--fg-muted)", fontSize: 15, marginTop: 4 }}>{t("shop_sub")}</p>
            </div>
            <button onClick={() => setCartOpen(true)} className="btn btn-secondary" style={{ position: "relative" }}>
              {Icon.cart(14)} {t("cart")} {cart.length > 0 && (
                <span style={{ background: "var(--gold)", color: "#19140a", padding: "1px 7px", borderRadius: 99, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}>{cart.reduce((s,i) => s+i.qty, 0)}</span>
              )}
            </button>
          </div>
        </div>

        <div className="sidebar-main" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, marginTop: 16 }}>
          {/* Sidebar */}
          <aside>
            <div className="surface" style={{ padding: 16, background: "var(--bg-2)" }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>{t("categories")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {categories.map((c) => (
                  <button key={c.id} onClick={() => setCat(c.id)} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 10px", background: cat === c.id ? "rgba(212,160,74,0.10)" : "transparent",
                    border: 0, borderLeft: cat === c.id ? "2px solid var(--gold)" : "2px solid transparent",
                    color: cat === c.id ? "var(--gold-bright)" : "var(--fg-muted)",
                    cursor: "pointer", fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 500,
                    textAlign: "left", borderRadius: 4,
                  }}
                    onMouseEnter={(e) => { if (cat !== c.id) e.currentTarget.style.color = "var(--fg)"; }}
                    onMouseLeave={(e) => { if (cat !== c.id) e.currentTarget.style.color = "var(--fg-muted)"; }}
                  >
                    <span>{c.label}</span>
                    <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>
                      {c.id === "all" ? window.MOCK.items.length : window.MOCK.items.filter(i => i.cat === c.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="surface" style={{ padding: 16, marginTop: 12, background: "var(--bg-2)" }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>{t("coins")}</div>
              <div className="display gold-text" style={{ fontSize: 32, letterSpacing: "0.02em" }}>{fmtNum(coins)}</div>
              <button className="btn btn-cyan btn-sm" style={{ width: "100%", marginTop: 12 }}
                onClick={() => app.setRoute({ name: "payment" })}>
                {Icon.plus(12)} {t("topup")}
              </button>
            </div>
          </aside>

          {/* Items */}
          <div>
            {/* Sort + layout toolbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 4 }}>
                {sorts.map((s) => (
                  <button key={s.id} onClick={() => setSort(s.id)} style={{
                    padding: "6px 12px", background: sort === s.id ? "var(--bg-3)" : "transparent",
                    border: sort === s.id ? "1px solid var(--line-strong)" : "1px solid var(--line)",
                    color: sort === s.id ? "var(--fg)" : "var(--fg-muted)",
                    cursor: "pointer", fontFamily: "var(--font-head)", fontSize: 11,
                    letterSpacing: "0.05em", textTransform: "uppercase", borderRadius: 6, fontWeight: 600,
                  }}>{s.label}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 2, background: "var(--bg-2)", padding: 2, borderRadius: 6, border: "1px solid var(--line)" }}>
                <button onClick={() => setLayout("grid")} style={{
                  padding: 6, background: layout === "grid" ? "var(--bg-4)" : "transparent",
                  border: 0, color: layout === "grid" ? "var(--gold)" : "var(--fg-muted)",
                  cursor: "pointer", borderRadius: 4, display: "flex",
                }}>{Icon.grid(14)}</button>
                <button onClick={() => setLayout("list")} style={{
                  padding: 6, background: layout === "list" ? "var(--bg-4)" : "transparent",
                  border: 0, color: layout === "list" ? "var(--gold)" : "var(--fg-muted)",
                  cursor: "pointer", borderRadius: 4, display: "flex",
                }}>{Icon.list(14)}</button>
              </div>
            </div>

            {/* Items grid/list */}
            {layout === "grid" ? (
              <div className="grid-shop" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                {items.map((it, i) => (
                  <ItemCardGrid key={it.id} item={it} onClick={() => setSelected(it)} onBuy={() => addToCart(it)} delay={i * 30}/>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map((it, i) => (
                  <ItemCardList key={it.id} item={it} onClick={() => setSelected(it)} onBuy={() => addToCart(it)} delay={i * 20}/>
                ))}
              </div>
            )}
            {items.length === 0 && (
              <div className="surface" style={{ padding: 60, textAlign: "center", color: "var(--fg-muted)" }}>
                Nincs találat ezzel a szűrővel.
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Item detail modal */}
      {selected && <ItemDetail item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function ItemCardGrid({ item, onClick, onBuy, delay = 0 }) {
  const { lang, t, cart } = useApp();
  const inCart = cart.some((c) => c.id === item.id);
  return (
    <div className={`surface lift corners fade-up rar-bg-${item.rarity}`} style={{
      padding: 0, background: "var(--bg-2)", animationDelay: `${delay}ms`, overflow: "hidden",
    }}>
      <div onClick={onClick} style={{ position: "relative", cursor: "pointer" }}>
        <div style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ItemArt item={item} size={140}/>
        </div>
        {item.new && <span className="tag tag-cyan" style={{ position: "absolute", top: 8, left: 8 }}>NEW</span>}
        {item.oldPrice && <span className="tag tag-red" style={{ position: "absolute", top: 8, right: 8 }}>-{Math.round((1 - item.price/item.oldPrice) * 100)}%</span>}
      </div>
      <div style={{ padding: 14, borderTop: "1px solid var(--line)" }}>
        <div className={`mono rar-${item.rarity}`} style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>
          {item.rarity}
        </div>
        <h4 className="head" style={{ fontSize: 14, marginBottom: 10, color: "var(--cream)", minHeight: 32 }}>
          {item["name_" + lang]}
        </h4>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="display gold-text" style={{ fontSize: 22, letterSpacing: "0.04em", lineHeight: 1 }}>{fmtNum(item.price)}</div>
            {item.oldPrice && <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", textDecoration: "line-through" }}>{fmtNum(item.oldPrice)}</div>}
          </div>
          <button onClick={onBuy} className={inCart ? "btn btn-ghost btn-sm" : "btn btn-primary btn-sm"} style={{ padding: "8px 10px" }}>
            {inCart ? <>{Icon.check(12)} {t("in_cart")}</> : <>{Icon.cart(12)} {t("add_to_cart")}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ItemCardList({ item, onClick, onBuy, delay = 0 }) {
  const { lang, t, cart } = useApp();
  const inCart = cart.some((c) => c.id === item.id);
  return (
    <div className={`surface lift fade-up rar-bg-${item.rarity}`} style={{
      padding: 0, background: "var(--bg-2)", animationDelay: `${delay}ms`,
      display: "grid", gridTemplateColumns: "80px 1fr auto auto", gap: 16, alignItems: "center",
    }}>
      <div onClick={onClick} style={{ cursor: "pointer", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid var(--line)" }}>
        <ItemArt item={item} size={72}/>
      </div>
      <div onClick={onClick} style={{ cursor: "pointer", padding: "12px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span className={`mono rar-${item.rarity}`} style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>{item.rarity}</span>
          {item.new && <span className="tag tag-cyan">NEW</span>}
          {item.oldPrice && <span className="tag tag-red">-{Math.round((1 - item.price/item.oldPrice) * 100)}%</span>}
        </div>
        <h4 className="head" style={{ fontSize: 15, color: "var(--cream)" }}>{item["name_" + lang]}</h4>
        <p style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 2 }}>{item["desc_" + lang]}</p>
      </div>
      <div style={{ textAlign: "right", paddingRight: 16 }}>
        <div className="display gold-text" style={{ fontSize: 24, letterSpacing: "0.04em" }}>{fmtNum(item.price)}</div>
        {item.oldPrice && <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", textDecoration: "line-through" }}>{fmtNum(item.oldPrice)}</div>}
      </div>
      <button onClick={onBuy} className={inCart ? "btn btn-ghost btn-sm" : "btn btn-primary btn-sm"} style={{ marginRight: 14 }}>
        {inCart ? <>{Icon.check(12)} {t("in_cart")}</> : <>{Icon.cart(12)} {t("add_to_cart")}</>}
      </button>
    </div>
  );
}

function ItemDetail({ item, onClose }) {
  const { lang, t, addToCart, cart } = useApp();
  const inCart = cart.some((c) => c.id === item.id);
  return (
    <Modal open onClose={onClose} width={620}>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>
        <div className={`surface rar-bg-${item.rarity}`} style={{
          aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <ItemArt item={item} size={170}/>
        </div>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span className={`mono rar-${item.rarity}`} style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>{item.rarity}</span>
            <span className="tag">{t("cat_" + item.cat)}</span>
            {item.new && <span className="tag tag-cyan">NEW</span>}
          </div>
          <h2 className="head" style={{ fontSize: 24, color: "var(--cream)" }}>{item["name_" + lang]}</h2>
          <p style={{ marginTop: 8, color: "var(--fg-muted)", fontSize: 14, lineHeight: 1.6 }}>{item["desc_" + lang]}</p>

          <div className="surface" style={{ marginTop: 16, padding: 12, background: "var(--bg-3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
              <div>
                <div className="eyebrow" style={{ fontSize: 9, marginBottom: 2 }}>{t("coins")}</div>
                <div className="display gold-text" style={{ fontSize: 36, letterSpacing: "0.04em", lineHeight: 1 }}>{fmtNum(item.price)}</div>
                {item.oldPrice && <div className="mono" style={{ fontSize: 12, color: "var(--fg-faint)", textDecoration: "line-through", marginTop: 4 }}>{fmtNum(item.oldPrice)}</div>}
              </div>
              <button onClick={() => { addToCart(item); onClose(); }} className="btn btn-primary">
                {inCart ? <>{Icon.check(14)} {t("in_cart")}</> : <>{Icon.cart(14)} {t("add_to_cart")}</>}
              </button>
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: 12, color: "var(--fg-muted)", display: "flex", gap: 20 }}>
            <span>{Icon.star(12)} {item.popular}% kedveltség</span>
            <span>{Icon.users(12)} {Math.floor(item.popular * 14)} eladás</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ────────────────────────────────────────────────────────────────────
function CartDrawer({ onClose, onCheckout }) {
  const { lang, t, cart, removeFromCart, updateQty } = useApp();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div onClick={onClose} style={{
      position: "fixed", top: "var(--header-h)", left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
      zIndex: 90, display: "flex", justifyContent: "flex-end", animation: "fade-in 0.2s ease-out",
    }}>
      <div onClick={(e) => e.stopPropagation()} className="surface cart-drawer" style={{
        width: 420, maxWidth: "100vw", height: "100%", background: "var(--bg-2)",
        borderLeft: "1px solid var(--line-strong)",
        display: "flex", flexDirection: "column",
        animation: "fade-up 0.3s ease-out",
      }}>
        <div style={{ padding: 20, borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="eyebrow">{t("cart")}</div>
            <h2 className="display gold-text" style={{ fontSize: 32, letterSpacing: "0.03em" }}>{cart.reduce((s,i) => s+i.qty, 0)} TÉTEL</h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: 8, border: 0 }}>{Icon.x()}</button>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--fg-muted)" }}>
              {Icon.cart(40)}
              <div style={{ marginTop: 12 }}>{t("empty_cart")}</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cart.map((c) => (
                <div key={c.id} className={`surface rar-bg-${c.rarity}`} style={{
                  padding: 12, display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 12, alignItems: "center",
                }}>
                  <ItemArt item={c} size={56}/>
                  <div>
                    <div className={`mono rar-${c.rarity}`} style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase" }}>{c.rarity}</div>
                    <div style={{ fontSize: 13, color: "var(--cream)", fontWeight: 500 }}>{c["name_" + lang]}</div>
                    <div className="mono gold" style={{ fontSize: 13, marginTop: 2 }}>{fmtNum(c.price)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line-2)", borderRadius: 6 }}>
                      <button onClick={() => updateQty(c.id, c.qty - 1)} style={{ padding: 5, background: "transparent", border: 0, color: "var(--fg-muted)", cursor: "pointer", display: "flex" }}>{Icon.minus(12)}</button>
                      <span className="mono" style={{ padding: "0 8px", fontSize: 12 }}>{c.qty}</span>
                      <button onClick={() => updateQty(c.id, c.qty + 1)} style={{ padding: 5, background: "transparent", border: 0, color: "var(--fg-muted)", cursor: "pointer", display: "flex" }}>{Icon.plus(12)}</button>
                    </div>
                    <button onClick={() => removeFromCart(c.id)} style={{ padding: 4, background: "transparent", border: 0, color: "var(--fg-faint)", cursor: "pointer", display: "flex" }}>{Icon.x(14)}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: 20, borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span className="eyebrow">{t("subtotal")}</span>
              <span className="display gold-text" style={{ fontSize: 28 }}>{fmtNum(total)}</span>
            </div>
            <button onClick={onCheckout} className="btn btn-primary" style={{ width: "100%" }}>
              {t("checkout")} {Icon.arrowRight(14)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Itemshop, CartDrawer, CheckoutModal });

function CheckoutModal({ step, onClose, onConfirm, onTopup }) {
  const { lang, t, cart, coins } = useApp();
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <Modal open onClose={() => step === "review" ? onClose() : null}
           title={step === "review" ? t("checkout") : step === "processing" ? t("pay_processing") : t("pay_success")} width={460}>
      {step === "review" && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {cart.map((c) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                <span>{c["name_" + lang]} <span style={{ color: "var(--fg-faint)" }}>×{c.qty}</span></span>
                <span className="mono gold">{fmtNum(c.price * c.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
            <span className="eyebrow">{t("total")}</span>
            <span className="display gold-text" style={{ fontSize: 28 }}>{fmtNum(cartTotal)}</span>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: "var(--fg-muted)", display: "flex", justifyContent: "space-between" }}>
            <span>{t("coins")} egyenleg</span>
            <span className={coins >= cartTotal ? "gold" : "red"}>{fmtNum(coins)}</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Vissza</button>
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={onConfirm} disabled={coins < cartTotal}>
              {t("buy_now")}
            </button>
          </div>
          {coins < cartTotal && (
            <div className="field-error" style={{ marginTop: 10, textAlign: "center" }}>
              {t("not_enough_coins")} <a href="#" onClick={(e) => { e.preventDefault(); onTopup(); }}>{t("topup")}</a>
            </div>
          )}
        </div>
      )}
      {step === "processing" && (
        <div style={{ padding: "30px 0", textAlign: "center" }}>
          <div style={{ display: "inline-flex", color: "var(--gold)" }}>{Icon.spinner(40)}</div>
          <div style={{ marginTop: 16, color: "var(--fg-muted)" }}>Fizetés feldolgozása…</div>
        </div>
      )}
      {step === "done" && (
        <div style={{ padding: "30px 0", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", width: 64, height: 64, borderRadius: "50%",
            background: "rgba(74,222,128,0.15)", color: "var(--ok)",
            alignItems: "center", justifyContent: "center", marginBottom: 16,
          }}>{Icon.check(32)}</div>
          <h3 className="head" style={{ fontSize: 18 }}>{t("purchase_success")}</h3>
        </div>
      )}
    </Modal>
  );
}
