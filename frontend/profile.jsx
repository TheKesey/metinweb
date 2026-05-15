// Profile + Payment pages

function Profile({ setRoute }) {
  const { lang, t, user, coins } = useApp();
  const [tab, setTab] = useState("characters");
  if (!user) return null;

  const tabs = [
    { id: "characters", label: t("my_characters"), icon: Icon.user },
    { id: "orders", label: t("my_orders"), icon: Icon.shop },
    { id: "transactions", label: t("my_transactions"), icon: Icon.coin },
    { id: "settings", label: t("account_settings"), icon: Icon.lock },
  ];

  return (
    <div className="page-enter">
      <Container>
        <div style={{ padding: "40px 0 28px" }}>
          <div className="eyebrow" style={{ color: "var(--gold)", marginBottom: 10 }}>ACCOUNT</div>
          <h1 className="display gold-text glow-gold hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>{t("profile_title")}</h1>
        </div>

        {/* Account header */}
        <div className="surface corners" style={{
          padding: 28, background: "linear-gradient(135deg, rgba(212,160,74,0.08), var(--bg-2))",
          borderColor: "var(--line-2)",
          display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 28, alignItems: "center",
        }}>
          <div style={{
            width: 88, height: 88, borderRadius: 12,
            background: "linear-gradient(135deg, var(--gold), var(--red))",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 40,
            boxShadow: "0 0 32px rgba(240, 194, 112, 0.4)",
          }}>{user.username.charAt(0).toUpperCase()}</div>
          <div>
            <h2 className="head" style={{ fontSize: 28, color: "var(--cream)" }}>{user.username}</h2>
            <div className="mono" style={{ color: "var(--fg-muted)", fontSize: 12, marginTop: 4 }}>{user.email}</div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <span className="tag tag-gold">VIP NÍVÓ 2</span>
              <span className="tag">2024 ÓTA TAG</span>
              <span className="tag tag-cyan">⚡ AKTÍV</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="eyebrow" style={{ fontSize: 10 }}>{t("coins")}</div>
            <div className="display gold-text glow-gold" style={{ fontSize: 48, letterSpacing: "0.02em", lineHeight: 1 }}>{fmtNum(coins)}</div>
            <button onClick={() => setRoute({ name: "payment" })} className="btn btn-primary btn-sm" style={{ marginTop: 10 }}>
              {Icon.plus(12)} {t("topup")}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 24, borderBottom: "1px solid var(--line)" }}>
          {tabs.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{
              padding: "12px 18px", background: "transparent", border: 0,
              borderBottom: tab === tb.id ? "2px solid var(--gold)" : "2px solid transparent",
              marginBottom: -1,
              color: tab === tb.id ? "var(--gold-bright)" : "var(--fg-muted)",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 600,
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              <tb.icon size={14}/>{tb.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          {tab === "characters" && <Characters lang={lang} t={t} />}
          {tab === "orders" && <OrdersList lang={lang} t={t} />}
          {tab === "transactions" && <TxList t={t} />}
          {tab === "settings" && <Settings />}
        </div>
      </Container>
    </div>
  );
}

function Characters({ lang, t }) {
  const chars = window.MOCK.characters;
  return (
    <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {chars.map((c, i) => {
        const loc = window.MOCK.locations.find(l => l.id === c.loc);
        return (
          <div key={c.name} className="surface corners lift fade-up" style={{
            padding: 0, background: "var(--bg-2)", overflow: "hidden",
            animationDelay: `${i * 60}ms`,
          }}>
            <div className="img-ph" style={{ height: 200, position: "relative" }}>
              <span>{c.name.toUpperCase()}</span>
              <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                <RealmDot realm={c.realm} withLabel lang={lang}/>
              </div>
              <div style={{ position: "absolute", top: 12, right: 12 }}>
                <span className="tag" style={{ background: "rgba(0,0,0,0.5)" }}>LV {c.level}</span>
              </div>
            </div>
            <div style={{ padding: 18 }}>
              <h3 className="head" style={{ fontSize: 18, color: "var(--cream)" }}>{c.name}</h3>
              <div style={{ marginTop: 4 }}><ClassBadge klass={c.class} lang={lang} mini /></div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)", fontSize: 12, color: "var(--fg-muted)", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t("playtime")}</span><span className="mono gold">{c.playtime}h</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t("last_login")}</span><span className="mono">{c.last}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t("location_now")}</span><span>{loc["name_" + lang]}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/* Empty slot */}
      <div className="surface" style={{
        padding: 0, background: "var(--bg-2)",
        border: "1px dashed var(--line-strong)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 12, minHeight: 380, cursor: "pointer", color: "var(--fg-muted)",
      }}>
        {Icon.plus(28)}
        <span className="head" style={{ fontSize: 14 }}>{t("create_character")}</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--fg-faint)" }}>SLOT 3/8</span>
      </div>
    </div>
  );
}

function OrdersList({ lang, t }) {
  return (
    <div className="surface scroll-x" style={{ background: "var(--bg-2)" }}>
      <div>
      <div style={{ display: "grid", gridTemplateColumns: "120px 120px 1fr 120px 100px", padding: "10px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-3)" }}>
        {["ORDER", "DATE", "ITEM", "COINS", "STATUS"].map((h, i) => (
          <span key={i} className="eyebrow" style={{ fontSize: 10 }}>{h}</span>
        ))}
      </div>
      {window.MOCK.orders.map((o, i) => (
        <div key={o.id} style={{
          display: "grid", gridTemplateColumns: "120px 120px 1fr 120px 100px",
          padding: "14px 20px", alignItems: "center",
          borderBottom: i === window.MOCK.orders.length - 1 ? 0 : "1px solid var(--line)",
          fontSize: 13,
        }}>
          <span className="mono gold">{o.id}</span>
          <span className="mono" style={{ color: "var(--fg-muted)" }}>{o.date}</span>
          <span style={{ color: "var(--cream)" }}>{o["item" + (lang === "en" ? "_en" : "")]}</span>
          <span className="mono gold">{fmtNum(o.coins)}</span>
          <span className="tag tag-ok"><span className="dot dot-ok"/> KÉSZ</span>
        </div>
      ))}
      </div>
    </div>
  );
}

function TxList({ t }) {
  const methods = { card: t("pm_card"), paypal: t("pm_paypal"), sms: t("pm_sms"), crypto: t("pm_crypto"), bank: t("pm_bank") };
  return (
    <div className="surface scroll-x" style={{ background: "var(--bg-2)" }}>
      <div>
      <div style={{ display: "grid", gridTemplateColumns: "120px 120px 1fr 120px 100px", padding: "10px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-3)" }}>
        {["TX ID", "DATE", "METHOD", "COINS", "STATUS"].map((h, i) => (
          <span key={i} className="eyebrow" style={{ fontSize: 10 }}>{h}</span>
        ))}
      </div>
      {window.MOCK.transactions.map((tx, i) => (
        <div key={tx.id} style={{
          display: "grid", gridTemplateColumns: "120px 120px 1fr 120px 100px",
          padding: "14px 20px", alignItems: "center",
          borderBottom: i === window.MOCK.transactions.length - 1 ? 0 : "1px solid var(--line)",
          fontSize: 13,
        }}>
          <span className="mono gold">{tx.id}</span>
          <span className="mono" style={{ color: "var(--fg-muted)" }}>{tx.date}</span>
          <span>{methods[tx.method]}</span>
          <span className="mono gold">+{fmtNum(tx.amount)}</span>
          <span className="tag tag-ok"><span className="dot dot-ok"/> OK</span>
        </div>
      ))}
      </div>
    </div>
  );
}

function Settings() {
  const { t, user } = useApp();
  return (
    <div className="surface" style={{ padding: 28, background: "var(--bg-2)", maxWidth: 560 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label className="field-label">{t("email")}</label>
          <input className="field" value={user.email} readOnly/>
        </div>
        <div>
          <label className="field-label">2FA</label>
          <div className="surface" style={{ padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-3)" }}>
            <span style={{ fontSize: 13 }}>Kétfaktoros hitelesítés <span className="tag tag-red" style={{ marginLeft: 8 }}>KIKAPCSOLVA</span></span>
            <button className="btn btn-secondary btn-sm">{Icon.lock(12)} Bekapcsol</button>
          </div>
        </div>
        <div>
          <label className="field-label">JELSZÓ</label>
          <button className="btn btn-secondary">Jelszó megváltoztatása</button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// PAYMENT — top-up flow
// ──────────────────────────────────────────────────────────────────────────
function Payment({ setRoute }) {
  const { t, coins, setCoins, addTransaction, pushToast, user } = useApp();
  const [tier, setTier] = useState(2); // index in topupTiers
  const [method, setMethod] = useState("card");
  const [step, setStep] = useState("select"); // select | card | processing | done

  const tiers = window.MOCK.topupTiers;
  const cur = tiers[tier];

  const methods = [
    { id: "card", label: t("pm_card"), icon: Icon.card, fee: "0%" },
    { id: "paypal", label: t("pm_paypal"), icon: Icon.mail, fee: "2.9%" },
    { id: "sms", label: t("pm_sms"), icon: Icon.bolt, fee: "12%" },
    { id: "crypto", label: t("pm_crypto"), icon: Icon.shield, fee: "1%" },
    { id: "bank", label: t("pm_bank"), icon: Icon.coin, fee: "0%" },
  ];

  const proceed = () => {
    setStep("card");
  };

  const pay = () => {
    setStep("processing");
    setTimeout(() => {
      const totalCoins = cur.coins + cur.bonus;
      setCoins(coins + totalCoins);
      addTransaction({ id: "TX-" + Math.floor(Math.random() * 90000 + 10000), date: new Date().toISOString().slice(0, 10), amount: totalCoins, method, status: "ok" });
      setStep("done");
    }, 2000);
  };

  if (!user) {
    return (
      <div className="page-enter">
        <Container>
          <div style={{ padding: 80, textAlign: "center" }}>
            <h2 className="head" style={{ color: "var(--cream)" }}>Jelentkezz be a feltöltéshez.</h2>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <Container max={1000}>
        <div style={{ padding: "40px 0 28px" }}>
          <div className="eyebrow" style={{ color: "var(--gold)", marginBottom: 10 }}>TOP UP</div>
          <h1 className="display gold-text glow-gold hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>{t("pay_title")}</h1>
          <p style={{ color: "var(--fg-muted)", marginTop: 4 }}>{t("pay_sub")}</p>
        </div>

        {step === "select" && (
          <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>{t("select_amount")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {tiers.map((tt, i) => {
                  const active = tier === i;
                  return (
                    <button key={i} onClick={() => setTier(i)} style={{
                      position: "relative", textAlign: "left",
                      padding: 20, borderRadius: 12,
                      background: active ? "linear-gradient(135deg, rgba(212,160,74,0.15), var(--bg-2))" : "var(--bg-2)",
                      border: active ? "1px solid rgba(212,160,74,0.5)" : "1px solid var(--line-2)",
                      cursor: "pointer", color: "var(--fg)",
                      boxShadow: active ? "0 0 32px -10px var(--gold)" : "none",
                      transition: "all 0.18s",
                    }}>
                      {tt.popular && <span className="tag tag-cyan" style={{ position: "absolute", top: 12, right: 12 }}>NÉPSZERŰ</span>}
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span className="display gold-text" style={{ fontSize: 38, letterSpacing: "0.02em" }}>{fmtNum(tt.coins)}</span>
                        {tt.bonus > 0 && <span className="tag tag-gold">+{tt.bonus} {t("bonus")}</span>}
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 4 }}>{t("coins")}</div>
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="display" style={{ fontSize: 22, color: "var(--cream)", letterSpacing: "0.02em" }}>€{tt.eur}</span>
                        {active && <span style={{ color: "var(--gold)" }}>{Icon.check(20)}</span>}
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
                      display: "flex", alignItems: "center", gap: 14,
                      padding: 14, borderRadius: 8,
                      background: active ? "rgba(212,160,74,0.08)" : "var(--bg-2)",
                      border: active ? "1px solid rgba(212,160,74,0.4)" : "1px solid var(--line-2)",
                      color: "var(--fg)", cursor: "pointer",
                    }}>
                      <span style={{ color: active ? "var(--gold)" : "var(--fg-muted)" }}>{m.icon(18)}</span>
                      <span style={{ flex: 1, textAlign: "left", fontWeight: 500 }}>{m.label}</span>
                      <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>Díj: {m.fee}</span>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: active ? "5px solid var(--gold)" : "1px solid var(--line-strong)",
                      }}/>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <aside>
              <div className="surface corners" style={{ padding: 24, background: "var(--bg-2)", position: "sticky", top: 100 }}>
                <div className="eyebrow" style={{ marginBottom: 14 }}>ÖSSZESÍTÉS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                  <Row label={t("coins")} value={fmtNum(cur.coins)} />
                  {cur.bonus > 0 && <Row label={t("bonus")} value={"+" + fmtNum(cur.bonus)} accent="cyan" />}
                  <Row label={t("payment_method")} value={methods.find(m => m.id === method).label} />
                </div>
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div className="eyebrow" style={{ fontSize: 9 }}>KAPSZ</div>
                    <div className="display gold-text glow-gold" style={{ fontSize: 36, letterSpacing: "0.02em", lineHeight: 1 }}>{fmtNum(cur.coins + cur.bonus)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="eyebrow" style={{ fontSize: 9 }}>FIZETSZ</div>
                    <div className="display" style={{ fontSize: 30, color: "var(--cream)", letterSpacing: "0.02em" }}>€{cur.eur}</div>
                  </div>
                </div>
                <button onClick={proceed} className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 18 }}>
                  {t("pay_now")} {Icon.arrowRight(14)}
                </button>
                <div style={{ marginTop: 12, fontSize: 11, color: "var(--fg-faint)", textAlign: "center" }} className="mono">
                  256-bit SSL · 3D Secure
                </div>
              </div>
            </aside>
          </div>
        )}

        {step === "card" && method === "card" && <CardForm onPay={pay} onCancel={() => setStep("select")} eur={cur.eur} coins={cur.coins + cur.bonus} t={t}/>}
        {step === "card" && method !== "card" && (
          // Non-card methods skip card form (still show a confirm screen)
          <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            <div className="surface corners" style={{ padding: 36, background: "var(--bg-2)", textAlign: "center" }}>
              <div style={{ color: "var(--gold)", display: "inline-block", marginBottom: 16 }}>{methods.find(m => m.id === method).icon(40)}</div>
              <h3 className="head" style={{ fontSize: 22, color: "var(--cream)" }}>{methods.find(m => m.id === method).label}</h3>
              <p style={{ color: "var(--fg-muted)", marginTop: 8 }}>
                Átirányítás a fizetési szolgáltató oldalára… (demo — ugorjuk át)
              </p>
              <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 10 }}>
                <button onClick={() => setStep("select")} className="btn btn-ghost">Vissza</button>
                <button onClick={pay} className="btn btn-primary">Fizetek €{cur.eur}</button>
              </div>
            </div>
            <PaySummary cur={cur} t={t}/>
          </div>
        )}
        {step === "processing" && (
          <div className="surface corners" style={{ padding: 80, textAlign: "center", background: "var(--bg-2)" }}>
            <div style={{ display: "inline-flex", color: "var(--gold)", marginBottom: 18 }}>{Icon.spinner(56)}</div>
            <h2 className="head" style={{ fontSize: 24, color: "var(--cream)" }}>{t("pay_processing")}</h2>
            <p className="mono" style={{ color: "var(--fg-faint)", marginTop: 6 }}>Ne zárd be az oldalt.</p>
          </div>
        )}
        {step === "done" && (
          <div className="surface corners" style={{ padding: 60, textAlign: "center", background: "linear-gradient(180deg, rgba(74,222,128,0.06), var(--bg-2))" }}>
            <div style={{
              display: "inline-flex", width: 80, height: 80, borderRadius: "50%",
              background: "rgba(74,222,128,0.15)", color: "var(--ok)",
              alignItems: "center", justifyContent: "center", marginBottom: 18,
            }}>{Icon.check(40)}</div>
            <h2 className="head" style={{ fontSize: 28, color: "var(--cream)" }}>{t("pay_success")}</h2>
            <p style={{ color: "var(--fg-muted)", marginTop: 8, fontSize: 15 }}>
              <span className="display gold-text" style={{ fontSize: 32, letterSpacing: "0.02em" }}>+{fmtNum(cur.coins + cur.bonus)}</span> {t("coins")} jóváírva.
            </p>
            <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 10 }}>
              <button onClick={() => setRoute({ name: "shop" })} className="btn btn-primary">{Icon.shop(14)} {t("nav_shop")}</button>
              <button onClick={() => { setStep("select"); }} className="btn btn-ghost">Még egy feltöltés</button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "var(--fg-muted)" }}>{label}</span>
      <span className={accent === "cyan" ? "mono cyan" : "mono"} style={{ color: accent ? undefined : "var(--cream)" }}>{value}</span>
    </div>
  );
}

function PaySummary({ cur, t }) {
  return (
    <div className="surface corners" style={{ padding: 24, background: "var(--bg-2)" }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>ÖSSZESÍTÉS</div>
      <Row label={t("coins")} value={fmtNum(cur.coins)}/>
      {cur.bonus > 0 && <Row label={t("bonus")} value={"+" + fmtNum(cur.bonus)} accent="cyan"/>}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="eyebrow">{t("total")}</span>
          <span className="display gold-text" style={{ fontSize: 26 }}>€{cur.eur}</span>
        </div>
      </div>
    </div>
  );
}

function CardForm({ onPay, onCancel, eur, coins, t }) {
  const [card, setCard] = useState({ name: "", num: "", exp: "", cvc: "" });
  const fmt = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v) => v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");
  return (
    <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
      <div className="surface corners" style={{ padding: 32, background: "var(--bg-2)" }}>
        {/* Card preview */}
        <div style={{
          padding: 24, borderRadius: 12, marginBottom: 24,
          background: "linear-gradient(135deg, #1a1f2e 0%, #0f1118 60%, #1a1413 100%)",
          border: "1px solid var(--line-2)",
          aspectRatio: "1.586/1", maxWidth: 360,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,74,0.15), transparent 70%)" }}/>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <KeseyMark size={28}/>
            <span className="mono" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.18em" }}>VISA</span>
          </div>
          <div className="mono" style={{ fontSize: 18, color: "var(--cream)", letterSpacing: "0.18em", marginTop: 30 }}>
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
            <input className="field" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })}/>
          </div>
          <div>
            <label className="field-label">KÁRTYASZÁM</label>
            <input className="field mono" value={card.num} onChange={(e) => setCard({ ...card, num: fmt(e.target.value) })} placeholder="•••• •••• •••• ••••"/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label className="field-label">LEJÁRAT</label>
              <input className="field mono" value={card.exp} onChange={(e) => setCard({ ...card, exp: fmtExp(e.target.value) })} placeholder="MM/YY"/>
            </div>
            <div>
              <label className="field-label">CVC</label>
              <input className="field mono" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })} placeholder="•••"/>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button onClick={onCancel} className="btn btn-ghost">Vissza</button>
          <button onClick={onPay} className="btn btn-primary" style={{ flex: 1 }}
                  disabled={!card.name || card.num.replace(/\s/g, "").length < 16 || !card.exp || !card.cvc}>
            {Icon.lock(14)} Fizetek €{eur}
          </button>
        </div>
      </div>
      <div>
        <PaySummary cur={{ coins: coins, bonus: 0, eur }} t={t}/>
      </div>
    </div>
  );
}

Object.assign(window, { Profile, Payment });
