// Home page — 3 hero variants + server status + news + live feed
// Hero variants controlled by tweaks.heroVariant: "stats" (default), "scene", "split"

function Home({ setRoute }) {
  const app = useApp();
  const { lang, t, tweaks, openRegister } = app;
  const heroVariant = tweaks.heroVariant;

  const online = useTicker(2847, 60, 4500);
  const peak = 3892;

  return (
    <div className="page-enter">
      {/* HERO */}
      {heroVariant === "stats" && <HeroStats online={online} peak={peak} setRoute={setRoute} openRegister={openRegister} />}
      {heroVariant === "scene" && <HeroScene2 online={online} peak={peak} setRoute={setRoute} openRegister={openRegister} />}
      {heroVariant === "split" && <HeroSplit online={online} peak={peak} setRoute={setRoute} openRegister={openRegister} />}

      <Container>
        {/* News + Live feed */}
        <section style={{ marginTop: 80, display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }} className="stack-mobile">
          <div>
            <SectionTitle
              kicker={t("today")}
              title={t("latest_news")}
              action={<button onClick={() => setRoute({ name: "news" })} className="btn btn-ghost btn-sm">{t("view_all")} {Icon.arrowRight(12)}</button>}
            />
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {window.MOCK.news.slice(0, 4).map((n, i) => (
                <NewsCard key={n.id} news={n} onClick={() => setRoute({ name: "news", articleId: n.id })} delay={i * 60}/>
              ))}
            </div>
          </div>
          <div>
            <SectionTitle kicker="LIVE" title={t("live_feed")} />
            <LiveFeed />
          </div>
        </section>

        {/* Top players preview */}
        <section style={{ marginTop: 80 }}>
          <SectionTitle
            kicker="TOP 5"
            title={t("top_players")}
            action={<button onClick={() => setRoute({ name: "ranking" })} className="btn btn-ghost btn-sm">{t("view_all")} {Icon.arrowRight(12)}</button>}
          />
          <TopPlayersPreview />
        </section>

        {/* CTA strip */}
        <section style={{ marginTop: 80, marginBottom: 40 }}>
          <CTAStrip setRoute={setRoute} openRegister={openRegister} />
        </section>
      </Container>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// HERO VARIANT 1: Stats-forward (default) — big live numbers center stage
// ──────────────────────────────────────────────────────────────────────────
function HeroStats({ online, peak, setRoute, openRegister }) {
  const { t, user } = useApp();
  const SERVER_START = new Date("2021-03-14");
  const daysRunning = Math.floor((Date.now() - SERVER_START.getTime()) / 86400000);
  return (
    <section style={{ position: "relative", padding: "60px 0 80px", overflow: "hidden" }}>
      <HeroScene variant="data" />
      <Container style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 920, margin: "0 auto" }}>
          <div className="eyebrow" style={{ marginBottom: 18, color: "var(--gold)" }}>
            <span className="dot dot-ok pulse" style={{ marginRight: 8 }}/>
            {t("hero_kicker")}
          </div>
          <h1 className="display gold-text glow-gold hero-title" style={{ fontSize: 96, lineHeight: 0.95, letterSpacing: "0.02em", margin: "0 0 8px" }}>
            {t("hero_title_1")}
          </h1>
          <h1 className="display cream-text hero-title" style={{ fontSize: 96, lineHeight: 0.95, letterSpacing: "0.02em", margin: 0 }}>
            {t("hero_title_2")}
          </h1>
          <p style={{ marginTop: 24, fontSize: 17, color: "var(--fg-muted)", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            {t("hero_sub")}
          </p>

          {/* Live stats grid */}
          <div className="surface corners stat-grid-4" style={{
            marginTop: 48, padding: "28px 24px",
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            background: "rgba(11, 14, 20, 0.7)",
            borderColor: "var(--line-2)",
          }}>
            <HeroStatCell value={fmtNum(online)} label={t("online_now")} sub={`/ ${fmtNum(peak)} ${t("today")}`} icon={Icon.users} glow/>
            <HeroStatCell value={fmtNum(daysRunning) + " nap"} label={t("uptime")} sub={t("since_date")} icon={Icon.bolt}/>
            <HeroStatCell value="14m 30s" label={t("next_event")} sub="Hold-fesztivál" icon={Icon.flame} accent="red"/>
            <HeroStatCell value="S4" label="Season" sub="Day 12 / 90" icon={Icon.crown} accent="cyan"/>
          </div>

          <div style={{ marginTop: 36, display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => setRoute({ name: "download" })} className="btn btn-primary btn-lg">
              {Icon.download(16)} {t("download_client")}
            </button>
            {!user && (
              <button onClick={openRegister} className="btn btn-secondary btn-lg">
                {t("create_account")}
              </button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroStatCell({ value, label, sub, icon, glow, accent = "gold" }) {
  const color = accent === "cyan" ? "var(--cyan)" : accent === "red" ? "var(--red-bright)" : "var(--gold-bright)";
  return (
    <div style={{ padding: "0 20px", borderLeft: "1px solid var(--line)", textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--fg-faint)", marginBottom: 6 }}>
        {icon(13)}
        <span className="eyebrow" style={{ fontSize: 10 }}>{label}</span>
      </div>
      <div className="display" style={{
        fontSize: 42, lineHeight: 1, color,
        textShadow: glow ? `0 0 24px ${color}` : "none",
        letterSpacing: "0.02em",
      }}>{value}</div>
      <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", marginTop: 4 }}>{sub}</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// HERO VARIANT 2: Cinematic scene — big illustration with stat overlay
// ──────────────────────────────────────────────────────────────────────────
function HeroScene2({ online, peak, setRoute, openRegister }) {
  const { t, user } = useApp();
  const SERVER_START = new Date("2021-03-14");
  const daysRunning = Math.floor((Date.now() - SERVER_START.getTime()) / 86400000);
  return (
    <section style={{ position: "relative", padding: "40px 0", overflow: "hidden" }}>
      <Container>
        <div className="corners" style={{
          position: "relative", borderRadius: 16,
          background: "var(--bg-2)", border: "1px solid var(--line-2)",
          overflow: "hidden", minHeight: 580,
        }}>
          <HeroScene variant="lore" />

          {/* Top bar: server status */}
          <div style={{
            position: "absolute", top: 20, left: 20, right: 20,
            display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2,
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="tag tag-ok"><span className="dot dot-ok"/> {t("online_text")}</span>
              <span className="tag">PING 24MS</span>
            </div>
            <span className="mono" style={{ fontSize: 11, color: "var(--fg-muted)", letterSpacing: "0.12em" }}>KESEY-1 · EU-FRA</span>
          </div>

          {/* Center text */}
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "0 32px", zIndex: 2,
          }}>
            <div className="eyebrow" style={{ marginBottom: 18, color: "var(--gold)" }}>{t("hero_kicker")}</div>
            <h1 className="display hero-title" style={{ fontSize: 112, lineHeight: 0.92, color: "var(--cream)", letterSpacing: "0.02em", margin: 0 }}>
              <span className="gold-text glow-gold">{t("hero_title_1")}</span><br/>
              {t("hero_title_2")}
            </h1>
            <p style={{ marginTop: 22, fontSize: 17, color: "var(--fg-muted)", maxWidth: 520 }}>{t("hero_sub")}</p>
            <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
              <button onClick={() => setRoute({ name: "download" })} className="btn btn-primary btn-lg">
                {Icon.download(16)} {t("download_client")}
              </button>
              {!user && <button onClick={openRegister} className="btn btn-secondary btn-lg">{t("create_account")}</button>}
            </div>
          </div>

          {/* Bottom strip: live stats */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(180deg, transparent, rgba(7,9,13,0.92) 40%)",
            padding: "60px 32px 24px", zIndex: 2,
          }}>
            <div className="stat-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
              {[
                { v: fmtNum(online), l: t("online_now"), sub: `peak ${fmtNum(peak)}` },
                { v: fmtNum(daysRunning), l: t("uptime"), sub: t("since_date") },
                { v: "14:30", l: t("next_event"), sub: "Hold-fesztivál" },
                { v: "Day 12", l: "Season 4", sub: "of 90" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>{s.l}</div>
                  <div className="display" style={{ fontSize: 32, color: "var(--cream)", letterSpacing: "0.02em" }}>{s.v}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// HERO VARIANT 3: Split — news/CTA dominant left, big number on right
// ──────────────────────────────────────────────────────────────────────────
function HeroSplit({ online, peak, setRoute, openRegister }) {
  const { t, user } = useApp();
  const SERVER_START = new Date("2021-03-14");
  const daysRunning = Math.floor((Date.now() - SERVER_START.getTime()) / 86400000);
  return (
    <section style={{ position: "relative", padding: "40px 0 60px" }}>
      <Container>
        <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "stretch" }}>
          {/* Left — copy */}
          <div className="corners" style={{
            position: "relative", padding: "48px 44px", borderRadius: 12,
            background: "linear-gradient(135deg, var(--bg-2), var(--bg-1))",
            border: "1px solid var(--line-2)", overflow: "hidden",
          }}>
            <HeroScene variant="minimal" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="eyebrow" style={{ marginBottom: 12, color: "var(--gold)" }}>{t("hero_kicker")}</div>
              <h1 className="display hero-title" style={{ fontSize: 84, lineHeight: 0.92, letterSpacing: "0.02em", margin: "0 0 8px" }}>
                <span className="gold-text glow-gold">{t("hero_title_1")}</span>
              </h1>
              <h1 className="display cream-text hero-title" style={{ fontSize: 84, lineHeight: 0.92, letterSpacing: "0.02em", margin: 0 }}>
                {t("hero_title_2")}
              </h1>
              <p style={{ marginTop: 20, fontSize: 16, color: "var(--fg-muted)", maxWidth: 480 }}>{t("hero_sub")}</p>
              <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
                <button onClick={() => setRoute({ name: "download" })} className="btn btn-primary btn-lg">
                  {Icon.download(16)} {t("download_client")}
                </button>
                {!user && <button onClick={openRegister} className="btn btn-ghost btn-lg">{t("create_account")}</button>}
              </div>
            </div>
          </div>

          {/* Right — single-purpose live stat */}
          <div className="surface corners" style={{
            padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between",
            background: "var(--bg-2)", borderColor: "var(--line-2)",
            backgroundImage: "radial-gradient(circle at 80% 0%, rgba(212,160,74,0.10), transparent 60%)",
          }}>
            <div>
              <div className="eyebrow">{t("online_now")}</div>
              <div className="display" style={{
                fontSize: 128, lineHeight: 0.9, marginTop: 12,
                color: "var(--gold-bright)", textShadow: "0 0 32px rgba(240,194,112,0.5)",
                letterSpacing: "0.02em",
              }}>{fmtNum(online)}</div>
              <div className="mono" style={{ marginTop: 10, color: "var(--fg-muted)", fontSize: 12 }}>
                / {fmtNum(peak)} peak {t("today")}
              </div>
              {/* Bar */}
              <div style={{ marginTop: 20, height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${(online / peak) * 100}%`,
                  background: "linear-gradient(90deg, var(--gold-deep), var(--gold-bright))",
                  transition: "width 0.6s ease",
                }}/>
              </div>
            </div>

            <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div className="eyebrow" style={{ fontSize: 9 }}>{t("uptime")}</div>
                <div className="display" style={{ fontSize: 28, color: "var(--cream)" }}>{fmtNum(daysRunning)}</div>
              </div>
              <div>
                <div className="eyebrow" style={{ fontSize: 9 }}>{t("next_event")}</div>
                <div className="display" style={{ fontSize: 28, color: "var(--cyan)" }}>14:30</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// News card
// ──────────────────────────────────────────────────────────────────────────
function NewsCard({ news, onClick, delay = 0 }) {
  const { lang, t } = useApp();
  const tagLabel = t(news.tag);
  return (
    <article onClick={onClick} className="surface corners lift fade-up" style={{
      padding: 20, background: "var(--bg-2)", cursor: "pointer", animationDelay: `${delay}ms`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span className={`tag ${news.tagColor}`}>{tagLabel}</span>
        <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{news.date}</span>
      </div>
      <h3 className="head" style={{ fontSize: 18, lineHeight: 1.25, marginBottom: 8, color: "var(--cream)" }}>
        {news["title_" + lang]}
      </h3>
      <p style={{ color: "var(--fg-muted)", fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
        {news["excerpt_" + lang]}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "var(--fg-faint)" }} className="mono">
        <span>{news.author}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{Icon.clock(11)} {news.read_min} {t("min_read")}</span>
      </div>
    </article>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Live feed — animated ticker
// ──────────────────────────────────────────────────────────────────────────
function LiveFeed() {
  const { lang } = useApp();
  const feed = window.MOCK.liveFeed;
  return (
    <div className="surface" style={{ padding: 16, background: "var(--bg-2)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {feed.map((f, i) => (
          <div key={i} className="fade-up" style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            paddingBottom: 12, borderBottom: i === feed.length - 1 ? 0 : "1px solid var(--line)",
            animationDelay: `${i * 80}ms`,
          }}>
            <span className="dot dot-ok pulse" style={{ marginTop: 6 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13 }}>
                <span style={{ color: "var(--gold-bright)", fontWeight: 600 }}>{f.who}</span>
                <span style={{ color: "var(--fg-muted)" }}> {f["what_" + lang]}</span>
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-faint)", marginTop: 2 }}>{f.t}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Top players preview
// ──────────────────────────────────────────────────────────────────────────
function TopPlayersPreview() {
  const { lang, t } = useApp();
  const top5 = window.MOCK.players.slice(0, 5);
  return (
    <div className="surface scroll-x" style={{ padding: 0, overflow: "hidden", background: "var(--bg-2)" }}>
      <div>
      <div style={{ display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr 1fr 1.4fr", padding: "10px 20px", borderBottom: "1px solid var(--line)" }}>
        {[t("rank"), t("name"), t("class_label"), t("realm"), t("level"), t("score")].map((h, i) => (
          <span key={i} className="eyebrow" style={{ fontSize: 10 }}>{h}</span>
        ))}
      </div>
      {top5.map((p, i) => (
        <div key={p.rank} className="fade-up" style={{
          display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr 1fr 1.4fr",
          padding: "14px 20px", alignItems: "center",
          borderBottom: i === top5.length - 1 ? 0 : "1px solid var(--line)",
          animationDelay: `${i * 50}ms`,
          background: i === 0 ? "linear-gradient(90deg, rgba(212,160,74,0.06), transparent 60%)" : "transparent",
        }}>
          <span className="display" style={{
            fontSize: 24, letterSpacing: "0.04em",
            color: i === 0 ? "var(--gold-bright)" : i === 1 ? "#d4d4d4" : i === 2 ? "#cd7f32" : "var(--fg-muted)",
          }}>#{p.rank}</span>
          <span style={{ fontWeight: 600, color: "var(--cream)" }}>{p.name}</span>
          <ClassBadge klass={p.class} lang={lang} mini />
          <RealmDot realm={p.realm} withLabel lang={lang} />
          <span className="mono" style={{ fontSize: 13 }}>{p.level}</span>
          <span className="mono gold" style={{ fontSize: 13 }}>{fmtNum(p.score)}</span>
        </div>
      ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// CTA Strip
// ──────────────────────────────────────────────────────────────────────────
function CTAStrip({ setRoute, openRegister }) {
  const { t, user } = useApp();
  return (
    <div className="corners cta-strip" style={{
      padding: "44px 48px", borderRadius: 12,
      background: "linear-gradient(135deg, rgba(212,160,74,0.10), rgba(192,51,74,0.05) 60%, transparent)",
      border: "1px solid var(--line-2)",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32,
    }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 10, color: "var(--gold)" }}>READY?</div>
        <h2 className="display hero-title" style={{ fontSize: 56, lineHeight: 0.95, letterSpacing: "0.02em", color: "var(--cream)" }}>
          Csatlakozz <span className="gold-text">2 847</span> hős mellé.
        </h2>
        <p style={{ marginTop: 8, color: "var(--fg-muted)", fontSize: 15 }}>
          30 másodperces regisztráció. Nincs e-mail megerősítés. Ingyenes letöltés.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {!user && <button onClick={openRegister} className="btn btn-primary btn-lg">{t("register")} {Icon.arrowRight(14)}</button>}
        <button onClick={() => setRoute({ name: "download" })} className="btn btn-secondary btn-lg">{Icon.download(14)} {t("download_client")}</button>
        <a href="guide.html" className="btn btn-ghost btn-lg" style={{ textDecoration: "none" }}>{Icon.news(14)} Olvasd el a Kalauzt</a>
      </div>
    </div>
  );
}

Object.assign(window, { Home });
