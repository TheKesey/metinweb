// Ranking + Online + Download pages

function Ranking() {
  const { lang, t } = useApp();
  const [tab, setTab] = useState("level");
  const [classFilter, setClassFilter] = useState("all");
  const [realmFilter, setRealmFilter] = useState("all");

  const tabs = [
    { id: "level", label: t("rank_level"), icon: Icon.crown },
    { id: "pvp", label: t("rank_pvp"), icon: Icon.swords },
    { id: "metin", label: t("rank_metin"), icon: Icon.bolt },
    { id: "boss", label: t("rank_boss"), icon: Icon.flame },
    { id: "guild", label: t("rank_guild"), icon: Icon.shield },
  ];

  let players = window.MOCK.players;
  if (classFilter !== "all") players = players.filter(p => p.class === classFilter);
  if (realmFilter !== "all") players = players.filter(p => p.realm === realmFilter);

  return (
    <div className="page-enter">
      <Container>
        <div style={{ padding: "40px 0 28px" }}>
          <div className="eyebrow" style={{ color: "var(--gold)", marginBottom: 10 }}>SEASON 4</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 className="display gold-text glow-gold hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>{t("rank_title")}</h1>
              <p style={{ color: "var(--fg-muted)", marginTop: 4 }}>{t("rank_sub")}</p>
            </div>
            <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>
              Frissítve: 2026-05-15 14:32
            </div>
          </div>
        </div>

        {/* Top 3 podium */}
        {tab === "level" && classFilter === "all" && realmFilter === "all" && (
          <Podium players={players.slice(0, 3)} lang={lang} t={t}/>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 16, borderBottom: "1px solid var(--line)" }}>
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

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginTop: 20, marginBottom: 12 }}>
          <FilterSelect label={t("filter")} value={classFilter} onChange={setClassFilter} options={[
            { value: "all", label: t("class_all") },
            { value: "warrior", label: t("class_warrior") },
            { value: "assassin", label: t("class_assassin") },
            { value: "shaman", label: t("class_shaman") },
            { value: "archer", label: t("class_archer") },
          ]}/>
          <FilterSelect label="" value={realmFilter} onChange={setRealmFilter} options={[
            { value: "all", label: t("realm_all") },
            { value: "red", label: t("realm_red") },
            { value: "blue", label: t("realm_blue") },
            { value: "yellow", label: t("realm_yellow") },
          ]}/>
          <div style={{ flex: 1 }}/>
          <div className="mono" style={{ fontSize: 11, color: "var(--fg-muted)", alignSelf: "center" }}>
            {players.length} eredmény
          </div>
        </div>

        {/* Ranking table */}
        {tab === "guild" ? <GuildTable /> : <PlayerTable players={players} lang={lang} t={t}/>}
      </Container>
    </div>
  );
}

function Podium({ players, lang, t }) {
  const positions = [
    { idx: 1, h: 140, color: "#d4d4d4", label: "II" }, // 2nd
    { idx: 0, h: 180, color: "var(--gold-bright)", label: "I" }, // 1st
    { idx: 2, h: 110, color: "#cd7f32", label: "III" }, // 3rd
  ];
  return (
    <div className="podium-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 20 }}>
      {positions.map((pos) => {
        const p = players[pos.idx];
        if (!p) return null;
        return (
          <div key={pos.idx} className="surface corners fade-up" style={{
            padding: 20, background: pos.idx === 0 ? "linear-gradient(180deg, rgba(212,160,74,0.10), var(--bg-2))" : "var(--bg-2)",
            borderColor: pos.idx === 0 ? "rgba(212,160,74,0.35)" : "var(--line-2)",
            textAlign: "center", animationDelay: `${pos.idx * 80}ms`,
          }}>
            <div className="display" style={{ fontSize: 64, lineHeight: 0.9, color: pos.color, letterSpacing: "0.04em" }}>{pos.label}</div>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", margin: "16px auto 12px",
              background: "linear-gradient(135deg, var(--gold), var(--red))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 28,
              boxShadow: pos.idx === 0 ? "0 0 32px rgba(240, 194, 112, 0.5)" : "none",
            }}>{p.name.charAt(0)}</div>
            <div className="head" style={{ fontSize: 18, color: "var(--cream)" }}>{p.name}</div>
            <div style={{ marginTop: 6, display: "flex", justifyContent: "center", gap: 8 }}>
              <ClassBadge klass={p.class} lang={lang} mini />
              <span style={{ color: "var(--fg-faint)" }}>·</span>
              <RealmDot realm={p.realm} withLabel lang={lang}/>
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-around" }}>
              <div>
                <div className="eyebrow" style={{ fontSize: 9 }}>{t("level")}</div>
                <div className="display gold-text" style={{ fontSize: 24 }}>{p.level}</div>
              </div>
              <div>
                <div className="eyebrow" style={{ fontSize: 9 }}>{t("guild")}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>{p.guild}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {label && <span className="eyebrow">{label}</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mono" style={{
        background: "var(--bg-2)", border: "1px solid var(--line-2)",
        color: "var(--fg)", padding: "8px 30px 8px 12px", borderRadius: 6,
        fontFamily: "var(--font-mono)", fontSize: 12,
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='%239a958a' d='M0 0h10L5 6z'/></svg>\")",
        backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
        appearance: "none", cursor: "pointer",
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function PlayerTable({ players, lang, t }) {
  return (
    <div className="surface scroll-x" style={{ background: "var(--bg-2)", overflow: "hidden" }}>
      <div>
      <div style={{ display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr 80px 1.4fr 1.4fr", padding: "10px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-3)" }}>
        {[t("rank"), t("name"), t("class_label"), t("realm"), t("level"), t("guild"), t("score")].map((h, i) => (
          <span key={i} className="eyebrow" style={{ fontSize: 10 }}>{h}</span>
        ))}
      </div>
      {players.map((p, i) => (
        <div key={p.rank} className="fade-up" style={{
          display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr 80px 1.4fr 1.4fr",
          padding: "12px 20px", alignItems: "center",
          borderBottom: i === players.length - 1 ? 0 : "1px solid var(--line)",
          animationDelay: `${Math.min(i * 25, 400)}ms`,
          background: i < 3 ? `linear-gradient(90deg, rgba(212,160,74,${0.08 - i * 0.02}), transparent 60%)` : "transparent",
        }}>
          <span className="display" style={{
            fontSize: 22, letterSpacing: "0.04em",
            color: i === 0 ? "var(--gold-bright)" : i === 1 ? "#d4d4d4" : i === 2 ? "#cd7f32" : "var(--fg-muted)",
          }}>#{p.rank}</span>
          <span style={{ fontWeight: 600, color: "var(--cream)" }}>{p.name}</span>
          <ClassBadge klass={p.class} lang={lang} mini/>
          <RealmDot realm={p.realm} withLabel lang={lang}/>
          <span className="mono" style={{ fontSize: 13 }}>{p.level}</span>
          <span style={{ fontSize: 13, color: "var(--fg-muted)" }}>{p.guild}</span>
          <span className="mono gold" style={{ fontSize: 13 }}>{fmtNum(p.score)}</span>
        </div>
      ))}
      </div>
    </div>
  );
}

function GuildTable() {
  const guilds = window.MOCK.guilds;
  return (
    <div className="surface scroll-x" style={{ background: "var(--bg-2)", overflow: "hidden" }}>
      <div>
      <div style={{ display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr 1.5fr", padding: "10px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-3)" }}>
        {["RANK", "GUILD", "MEMBERS", "LEADER", "SCORE"].map((h, i) => (
          <span key={i} className="eyebrow" style={{ fontSize: 10 }}>{h}</span>
        ))}
      </div>
      {guilds.map((g, i) => (
        <div key={g.name} className="fade-up" style={{
          display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr 1.5fr",
          padding: "14px 20px", alignItems: "center",
          borderBottom: i === guilds.length - 1 ? 0 : "1px solid var(--line)",
          animationDelay: `${i * 40}ms`,
        }}>
          <span className="display" style={{
            fontSize: 22, color: i === 0 ? "var(--gold-bright)" : i === 1 ? "#d4d4d4" : i === 2 ? "#cd7f32" : "var(--fg-muted)",
          }}>#{i + 1}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 28, height: 28, borderRadius: 6,
              background: "linear-gradient(135deg, var(--red), var(--gold))",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13,
            }}>{g.name.charAt(0)}</span>
            <span style={{ fontWeight: 600, color: "var(--cream)" }}>{g.name}</span>
          </span>
          <span className="mono" style={{ fontSize: 13 }}>{g.members}</span>
          <span style={{ fontSize: 13, color: "var(--fg-muted)" }}>{g.leader}</span>
          <span className="mono gold" style={{ fontSize: 13 }}>{fmtNum(g.score)}</span>
        </div>
      ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function Online() {
  const { lang, t } = useApp();
  const [query, setQuery] = useState("");
  const [auto, setAuto] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!auto) return;
    const interval = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(interval);
  }, [auto]);

  const online = window.MOCK.online.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  const total = window.MOCK.online.length;
  const locations = window.MOCK.locations;

  // Aggregate per-location
  const byLoc = locations.map((l) => ({
    ...l,
    count: window.MOCK.online.filter(p => p.loc === l.id).length,
  }));

  // Realms
  const byRealm = ["red", "blue", "yellow"].map((r) => ({
    realm: r,
    count: window.MOCK.online.filter(p => p.realm === r).length,
  }));

  return (
    <div className="page-enter">
      <Container>
        <div style={{ padding: "40px 0 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--gold)", marginBottom: 10 }}>
                <span className="dot dot-ok pulse" style={{ marginRight: 6 }}/>
                LIVE
              </div>
              <h1 className="display gold-text glow-gold hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>{t("online_title")}</h1>
              <p style={{ color: "var(--fg-muted)", marginTop: 4 }}>{t("online_sub")}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setAuto(!auto)} className={auto ? "btn btn-cyan btn-sm" : "btn btn-ghost btn-sm"}>
                {Icon.refresh(12)} {t("auto_refresh")} {auto ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="surface corners stat-grid-3" style={{ padding: 24, marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: 32, background: "var(--bg-2)" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>{t("online_now")}</div>
            <div className="display gold-text glow-gold" style={{ fontSize: 56, letterSpacing: "0.02em" }}>{fmtNum(total)}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>/ 3892 peak today</div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>BY REALM</div>
            <div style={{ display: "flex", gap: 8, height: 32 }}>
              {byRealm.map((r) => {
                const pct = (r.count / total) * 100;
                const c = REALM_COLOR[r.realm];
                return (
                  <div key={r.realm} style={{ flex: pct, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ flex: 1, background: c.bg, border: `1px solid ${c.brd}`, borderRadius: 3, position: "relative" }}>
                      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${c.fg} 0%, transparent 100%)`, opacity: 0.15 }}/>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: c.fg }} className="mono">
                      <span>{t("realm_" + r.realm).toUpperCase()}</span>
                      <span>{r.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{t("map")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {byLoc.slice(0, 4).map((l) => (
                <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: "var(--fg-muted)" }}>{l["name_" + lang]}</span>
                  <span className="mono gold">{l.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--fg-faint)" }}>{Icon.search(14)}</span>
            <input className="field" placeholder={t("search_player")} value={query} onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: 36 }}/>
          </div>
          <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{online.length} találat</div>
        </div>

        {/* Player list */}
        <div className="surface scroll-x" style={{ background: "var(--bg-2)", overflow: "hidden" }}>
          <div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 1fr 1fr 1.4fr 60px", padding: "10px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-3)" }}>
            {[t("name"), t("level"), t("class_label"), t("realm"), t("location"), "MS"].map((h, i) => (
              <span key={i} className="eyebrow" style={{ fontSize: 10 }}>{h}</span>
            ))}
          </div>
          <div style={{ maxHeight: 540, overflow: "auto" }}>
            {online.map((p, i) => {
              const loc = locations.find(l => l.id === p.loc);
              return (
                <div key={p.id} style={{
                  display: "grid", gridTemplateColumns: "2fr 80px 1fr 1fr 1.4fr 60px",
                  padding: "10px 20px", alignItems: "center",
                  borderBottom: i === online.length - 1 ? 0 : "1px solid var(--line)",
                  fontSize: 13,
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="dot dot-ok" style={{ width: 6, height: 6 }}/>
                    <span style={{ color: "var(--cream)" }}>{p.name}</span>
                  </span>
                  <span className="mono">{p.level}</span>
                  <ClassBadge klass={p.class} lang={lang} mini/>
                  <RealmDot realm={p.realm} withLabel lang={lang}/>
                  <span style={{ color: "var(--fg-muted)" }}>{loc["name_" + lang]}</span>
                  <span className="mono" style={{ color: p.ms < 40 ? "var(--ok)" : p.ms < 60 ? "var(--warn)" : "var(--danger)", fontSize: 11 }}>{p.ms}ms</span>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function Download() {
  const { t } = useApp();
  const [progress, setProgress] = useState(null);
  const [option, setOption] = useState("full");

  const start = (opt) => {
    setOption(opt);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p === null) return null;
        if (p >= 100) { clearInterval(interval); return 100; }
        return Math.min(100, p + Math.random() * 8 + 1);
      });
    }, 300);
  };

  const opts = [
    { id: "full", label: t("dl_full"), size: "8.4 GB", v: "4.1.2", icon: Icon.download, primary: true },
    { id: "torrent", label: t("dl_torrent"), size: "8.4 GB", v: "4.1.2", icon: Icon.bolt },
    { id: "patcher", label: t("dl_patcher"), size: "12 MB", v: "patcher", icon: Icon.refresh },
  ];

  return (
    <div className="page-enter">
      <Container>
        <div style={{ padding: "40px 0 28px" }}>
          <div className="eyebrow" style={{ color: "var(--gold)", marginBottom: 10 }}>WINDOWS 10/11</div>
          <h1 className="display gold-text glow-gold hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>{t("dl_title")}</h1>
          <p style={{ color: "var(--fg-muted)", marginTop: 4 }}>{t("dl_sub")}</p>
        </div>

        <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
          <div>
            {/* Download options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {opts.map((o) => (
                <div key={o.id} className={o.primary ? "surface corners" : "surface"} style={{
                  padding: 24, background: o.primary ? "linear-gradient(135deg, rgba(212,160,74,0.10), var(--bg-2))" : "var(--bg-2)",
                  borderColor: o.primary ? "rgba(212,160,74,0.35)" : "var(--line-2)",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 10,
                      background: o.primary ? "rgba(212,160,74,0.15)" : "var(--bg-3)",
                      color: o.primary ? "var(--gold-bright)" : "var(--fg)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{o.icon(22)}</div>
                    <div>
                      <h3 className="head" style={{ fontSize: 18, color: "var(--cream)" }}>{o.label}</h3>
                      <div className="mono" style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 2 }}>
                        {t("dl_size")} {o.size} · {t("dl_version")} {o.v}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => start(o.id)} className={o.primary ? "btn btn-primary btn-lg" : "btn btn-secondary"}>
                    {Icon.download(14)} {o.primary ? "DOWNLOAD" : t("dl_full").toUpperCase()}
                  </button>
                </div>
              ))}
            </div>

            {/* Progress */}
            {progress !== null && (
              <div className="surface fade-up" style={{ marginTop: 16, padding: 20, background: "var(--bg-2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span className="eyebrow">DOWNLOADING · {opts.find(o => o.id === option).label}</span>
                  <span className="mono gold">{progress.toFixed(1)}%</span>
                </div>
                <div style={{ height: 6, background: "var(--bg-1)", borderRadius: 3, overflow: "hidden", border: "1px solid var(--line)" }}>
                  <div style={{
                    height: "100%", width: `${progress}%`,
                    background: "linear-gradient(90deg, var(--gold-deep), var(--gold-bright))",
                    boxShadow: "0 0 12px var(--gold)",
                    transition: "width 0.25s ease",
                  }}/>
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
              <div className="eyebrow" style={{ marginBottom: 14 }}>{t("sys_requirements")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Reqs label={t("min")} items={[
                  ["CPU", "Intel i3-4xxx / AMD FX-6300"],
                  ["RAM", "4 GB"],
                  ["GPU", "GTX 750 / RX 460"],
                  ["VRAM", "1 GB"],
                  ["Disk", "12 GB"],
                  ["OS", "Windows 10 64-bit"],
                ]}/>
                <Reqs label={t("rec")} items={[
                  ["CPU", "Intel i5-8xxx / Ryzen 5 3xxx"],
                  ["RAM", "8 GB"],
                  ["GPU", "GTX 1060 / RX 580"],
                  ["VRAM", "4 GB"],
                  ["Disk", "12 GB SSD"],
                  ["OS", "Windows 11"],
                ]}/>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}

function Reqs({ label, items }) {
  return (
    <div>
      <div className="mono gold" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: "1px dashed var(--line)" }}>
            <span className="mono" style={{ color: "var(--fg-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{k}</span>
            <span style={{ color: "var(--fg)" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Ranking, Online, Download });
