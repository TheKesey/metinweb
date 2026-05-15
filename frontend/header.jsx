// Header — top nav, logo, language switcher, auth state, cart
function Header({ route, setRoute }) {
  const app = useApp();
  const { lang, t, user, coins, cart, openLogin, openRegister, logout, setCartOpen, mobileMenu, setMobileMenu } = app;
  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const vp = useViewport();

  useEffect(() => {
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenu(false);
    };
    if (userMenu) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userMenu]);

  const navItems = [
    { id: "home", label: t("nav_home"), icon: Icon.home },
    { id: "news", label: t("nav_news"), icon: Icon.news },
    { id: "ranking", label: t("nav_ranking"), icon: Icon.trophy },
    { id: "online", label: t("nav_online"), icon: Icon.users },
    { id: "shop", label: t("nav_shop"), icon: Icon.shop },
    { id: "download", label: t("nav_download"), icon: Icon.download },
  ];

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(8, 10, 15, 0.78)",
      backdropFilter: "blur(20px) saturate(160%)",
      WebkitBackdropFilter: "blur(20px) saturate(160%)",
      borderBottom: "1px solid var(--line)",
    }}>
      {/* Top utility bar (desktop only) */}
      <div className="hdr-util" style={{ background: "rgba(0,0,0,0.4)", borderBottom: "1px solid var(--line)" }}>
        <Container>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", fontSize: 11 }} className="mono">
            <div style={{ display: "flex", gap: 24, alignItems: "center", color: "var(--fg-muted)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span className="dot dot-ok pulse" />
                <span>Kesey-1 · {t("online_text")}</span>
              </span>
              <span>S4 · v4.1.2</span>
              <span style={{ color: "var(--fg-faint)" }}>ping 24ms · fut 1888 napja</span>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <button onClick={() => app.setLang(lang === "hu" ? "en" : "hu")}
                      className="mono" style={{
                background: "transparent", border: 0, color: "var(--fg-muted)",
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                {Icon.globe(12)} {lang === "hu" ? "HU / EN" : "EN / HU"}
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Main nav */}
      <Container>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: vp.isMobile ? "10px 0" : "14px 0", gap: 16 }}>
          {/* Logo */}
          <button onClick={() => setRoute({ name: "home" })} style={{
            display: "flex", alignItems: "center", gap: 10, background: "transparent", border: 0, cursor: "pointer", padding: 0, flexShrink: 0,
          }}>
            <KeseyMark size={vp.isMobile ? 30 : 38} />
            <div style={{ textAlign: "left", lineHeight: 1 }}>
              <div className="display" style={{ fontSize: vp.isMobile ? 18 : 22, letterSpacing: "0.08em", color: "var(--cream)" }}>KESEY</div>
              {!vp.isMobile && <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "var(--fg-faint)", marginTop: 2 }}>S4 · YU PLAINS</div>}
            </div>
          </button>

          {/* Desktop nav links */}
          <nav className="hdr-nav-desktop" style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {navItems.map((item) => {
              const active = route.name === item.id;
              return (
                <button key={item.id} onClick={() => setRoute({ name: item.id })} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: active ? "rgba(212,160,74,0.08)" : "transparent",
                  border: active ? "1px solid rgba(212,160,74,0.3)" : "1px solid transparent",
                  color: active ? "var(--gold-bright)" : "var(--fg-muted)",
                  padding: "8px 12px", borderRadius: 8, cursor: "pointer",
                  fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 600,
                  letterSpacing: "0.05em", textTransform: "uppercase",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = "var(--fg)"; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = "var(--fg-muted)"; } }}
                >
                  <item.icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Auth area */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {user ? (
              <>
                {/* Coin balance — hide pill on mobile, show just icon */}
                {!vp.isMobile ? (
                  <button onClick={() => setRoute({ name: "payment" })} className="surface hdr-coin-balance" style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "0 12px", height: 36,
                    background: "var(--bg-2)", cursor: "pointer",
                    border: "1px solid rgba(212,160,74,0.25)",
                  }}>
                    <span style={{ color: "var(--gold-bright)", display: "inline-flex" }}>{Icon.coin(14)}</span>
                    <span className="display" style={{ fontSize: 16, color: "var(--gold-bright)", letterSpacing: "0.05em" }}>{fmtNum(coins)}</span>
                    <span style={{ color: "var(--gold)", opacity: 0.6, display: "inline-flex" }}>{Icon.plus(14)}</span>
                  </button>
                ) : (
                  <button onClick={() => setRoute({ name: "payment" })} style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: "var(--bg-2)", border: "1px solid rgba(212,160,74,0.25)",
                    color: "var(--gold-bright)", display: "inline-flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}>{Icon.coin(14)}</button>
                )}

                {/* Cart — opens drawer globally */}
                <button onClick={() => setCartOpen(true)} style={{
                  position: "relative", background: "transparent",
                  border: "1px solid var(--line-2)", borderRadius: 8,
                  width: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "var(--fg)",
                }}>
                  {Icon.cart(14)}
                  {cartCount > 0 && (
                    <span style={{
                      position: "absolute", top: -6, right: -6,
                      background: "var(--red)", color: "#fff",
                      borderRadius: 999, padding: "2px 6px", fontSize: 10,
                      fontFamily: "var(--font-mono)", fontWeight: 600,
                      minWidth: 18, textAlign: "center",
                      boxShadow: "0 0 0 2px var(--bg-1)",
                    }}>{cartCount}</span>
                  )}
                </button>

                {/* User menu */}
                {!vp.isMobile && (
                  <div ref={userMenuRef} style={{ position: "relative" }}>
                    <button onClick={() => setUserMenu(!userMenu)} style={{
                      display: "flex", alignItems: "center", gap: 8, height: 36,
                      background: "var(--bg-3)", border: "1px solid var(--line-2)",
                      padding: "0 12px 0 4px", borderRadius: 8, cursor: "pointer", color: "var(--fg)",
                    }}>
                      <span style={{
                        width: 26, height: 26, borderRadius: 5,
                        background: "linear-gradient(135deg, var(--gold), var(--red))",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 12,
                      }}>{user.username.charAt(0).toUpperCase()}</span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{user.username}</span>
                    </button>
                    {userMenu && (
                      <div className="surface fade-up" style={{
                        position: "absolute", right: 0, top: "calc(100% + 8px)",
                        width: 220, padding: 6, background: "var(--bg-2)",
                        boxShadow: "0 16px 40px -10px rgba(0,0,0,0.8)", zIndex: 200,
                      }}>
                        <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--line)" }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{user.username}</div>
                          <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{user.email}</div>
                        </div>
                        {[
                          { label: t("nav_account"), route: "profile", icon: Icon.user },
                          { label: t("topup"), route: "payment", icon: Icon.coin },
                        ].map((m) => (
                          <button key={m.route} onClick={() => { setUserMenu(false); setRoute({ name: m.route }); }} style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10,
                            padding: "9px 12px", background: "transparent", border: 0,
                            color: "var(--fg)", cursor: "pointer", borderRadius: 6,
                            fontFamily: "var(--font-body)", fontSize: 13, textAlign: "left",
                          }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-3)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                            <span style={{ display: "inline-flex", width: 12, color: "var(--fg-muted)" }}><m.icon size={12} /></span> {m.label}
                          </button>
                        ))}
                        <div style={{ height: 1, background: "var(--line)", margin: "6px 0" }}/>
                        <button onClick={() => { setUserMenu(false); logout(); }} style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 10,
                          padding: "9px 12px", background: "transparent", border: 0,
                          color: "var(--red-bright)", cursor: "pointer", borderRadius: 6,
                          fontFamily: "var(--font-body)", fontSize: 13, textAlign: "left",
                        }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(192,51,74,0.08)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                          <span style={{ display: "inline-flex", width: 12 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 17l5-5-5-5M21 12H9M13 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8"/></svg></span> {t("logout")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              !vp.isMobile && (
                <>
                  <button onClick={openLogin} className="btn btn-ghost btn-sm">{t("login")}</button>
                  <button onClick={openRegister} className="btn btn-primary btn-sm">{t("register")}</button>
                </>
              )
            )}

            {/* Mobile hamburger */}
            {vp.isMobile && (
              <button onClick={() => setMobileMenu(true)} style={{
                width: 36, height: 36, borderRadius: 8,
                background: "var(--bg-3)", border: "1px solid var(--line-2)",
                color: "var(--fg)", display: "inline-flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }} aria-label="Menu">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile menu drawer */}
      {mobileMenu && (
        <div className="mobile-menu" onClick={() => setMobileMenu(false)}>
          <div className="mobile-menu-inner" onClick={(e) => e.stopPropagation()}>
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <button onClick={() => { setMobileMenu(false); setRoute({ name: "home" }); }} style={{
                display: "flex", alignItems: "center", gap: 10, background: "transparent", border: 0, cursor: "pointer", color: "var(--cream)", padding: 0,
              }}>
                <KeseyMark size={30}/>
                <div className="display" style={{ fontSize: 22, letterSpacing: "0.08em" }}>KESEY</div>
              </button>
              <button onClick={() => setMobileMenu(false)} style={{
                width: 36, height: 36, borderRadius: 8,
                background: "var(--bg-3)", border: "1px solid var(--line-2)",
                color: "var(--fg)", display: "inline-flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>{Icon.x(16)}</button>
            </div>

            {/* User block */}
            {user ? (
              <div className="surface" style={{ padding: 14, marginTop: 16, display: "flex", alignItems: "center", gap: 12, background: "var(--bg-2)" }}>
                <span style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: "linear-gradient(135deg, var(--gold), var(--red))",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 18,
                }}>{user.username.charAt(0).toUpperCase()}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--cream)" }}>{user.username}</div>
                  <div className="mono gold" style={{ fontSize: 12 }}>{fmtNum(coins)} érme</div>
                </div>
                <button onClick={() => { setMobileMenu(false); setRoute({ name: "payment" }); }} className="btn btn-primary btn-sm">{Icon.plus(12)} {t("topup")}</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={() => { setMobileMenu(false); openLogin(); }} className="btn btn-ghost" style={{ flex: 1 }}>{t("login")}</button>
                <button onClick={() => { setMobileMenu(false); openRegister(); }} className="btn btn-primary" style={{ flex: 1 }}>{t("register")}</button>
              </div>
            )}

            {/* Nav links */}
            <nav>
              {navItems.map((item) => {
                const active = route.name === item.id;
                return (
                  <button key={item.id} onClick={() => { setMobileMenu(false); setRoute({ name: item.id }); }} data-active={active ? "1" : "0"}>
                    <item.icon size={16}/>{item.label}
                  </button>
                );
              })}
              {user && (
                <button onClick={() => { setMobileMenu(false); setRoute({ name: "profile" }); }} data-active={route.name === "profile" ? "1" : "0"}>
                  {Icon.user(16)}{t("nav_account")}
                </button>
              )}
              <button onClick={() => { setMobileMenu(false); window.location.href = "guide.html"; }}>
                {Icon.news(16)} Kalauz
              </button>
            </nav>

            {/* Language + logout */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => app.setLang(lang === "hu" ? "en" : "hu")} className="mono" style={{
                background: "transparent", border: "1px solid var(--line-2)", borderRadius: 8,
                color: "var(--fg-muted)", padding: "8px 14px", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12,
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                {Icon.globe(12)} {lang === "hu" ? "Magyar" : "English"}
              </button>
              {user && (
                <button onClick={() => { setMobileMenu(false); logout(); }} className="btn btn-ghost btn-sm" style={{ color: "var(--red-bright)" }}>
                  {t("logout")}
                </button>
              )}
            </div>

            <div className="mono" style={{ marginTop: 20, fontSize: 10, color: "var(--fg-faint)", textAlign: "center", letterSpacing: "0.1em" }}>
              KESEY-1 · {t("online_text")} · S4 · v4.1.2
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// Footer
function Footer() {
  const { t } = useApp();
  return (
    <footer style={{ marginTop: 80, borderTop: "1px solid var(--line)", background: "rgba(0,0,0,0.3)", position: "relative", zIndex: 2 }}>
      <Container>
        <div className="footer-cols" style={{ padding: "48px 0 32px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <KeseyMark size={32} />
              <div className="display" style={{ fontSize: 22, letterSpacing: "0.08em", color: "var(--cream)" }}>KESEY</div>
            </div>
            <p style={{ color: "var(--fg-muted)", fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>
              Független, közösség által fenntartott szerver. 2021 óta. Nem áll kapcsolatban semmilyen kiadóval.
            </p>
            <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tag tag-gold">EU · Frankfurt</span>
              <span className="tag tag-cyan">DDoS védett</span>
            </div>
          </div>

          {[
            { title: "Játék", links: [
              { label: t("nav_download"), href: "#" },
              { label: "Játékszabályzat", href: "guide.html#rules" },
              { label: "Új játékos guide", href: "guide.html" },
              { label: "Klán-háborúk", href: "guide.html#pvp" },
            ]},
            { title: "Közösség", links: [
              { label: "Discord", href: "#" },
              { label: "Forum", href: "#" },
              { label: "Bug jelentés", href: "#" },
              { label: "Streamers", href: "#" },
            ]},
            { title: "Jogi", links: [
              { label: "GYIK", href: "guide.html" },
              { label: "ÁSZF", href: "#" },
              { label: "Adatvédelem", href: "#" },
              { label: "Visszatérítés", href: "#" },
            ]},
          ].map((col) => (
            <div key={col.title}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>{col.title}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map((l) => (
                  <li key={l.label}><a href={l.href} onClick={(e) => { if (l.href === "#") e.preventDefault(); }} style={{ color: "var(--fg-muted)", fontSize: 13 }}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--line)", padding: "20px 0", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", color: "var(--fg-faint)", fontSize: 11 }} className="mono">
          <span>© 2026 Kesey Network · Független szerver projekt</span>
          <span>build 4.1.2-r9920 · {new Date().toISOString().slice(0,10)}</span>
        </div>
      </Container>
    </footer>
  );
}

Object.assign(window, { Header, Footer });
