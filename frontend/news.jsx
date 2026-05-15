// News + News Article pages

function News({ articleId, setRoute }) {
  const { t } = useApp();
  if (articleId) {
    const article = window.MOCK.news.find(n => n.id === articleId);
    if (article) return <NewsArticle article={article} setRoute={setRoute} />;
  }
  return <NewsList setRoute={setRoute} />;
}

function NewsList({ setRoute }) {
  const { lang, t } = useApp();
  const [filter, setFilter] = useState("all");
  let posts = window.MOCK.news;
  if (filter !== "all") posts = posts.filter(p => p.tag === "tag_" + filter);

  return (
    <div className="page-enter">
      <Container>
        <div style={{ padding: "40px 0 28px" }}>
          <div className="eyebrow" style={{ color: "var(--gold)", marginBottom: 10 }}>BLOG</div>
          <h1 className="display gold-text glow-gold hero-page-title" style={{ fontSize: 64, letterSpacing: "0.02em" }}>{t("news_title")}</h1>
          <p style={{ color: "var(--fg-muted)", marginTop: 4 }}>{t("news_sub")}</p>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[
            { id: "all", label: t("all") },
            { id: "update", label: t("tag_update") },
            { id: "event", label: t("tag_event") },
            { id: "devblog", label: t("tag_devblog") },
            { id: "patch", label: t("tag_patch") },
          ].map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: "8px 16px", borderRadius: 999,
              background: filter === f.id ? "rgba(212,160,74,0.15)" : "transparent",
              border: filter === f.id ? "1px solid rgba(212,160,74,0.4)" : "1px solid var(--line-2)",
              color: filter === f.id ? "var(--gold-bright)" : "var(--fg-muted)",
              cursor: "pointer", fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 600,
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>{f.label}</button>
          ))}
        </div>

        {/* Featured + grid */}
        {posts.length > 0 && filter === "all" && (
          <article onClick={() => setRoute({ name: "news", articleId: posts[0].id })}
                   className="surface corners lift fade-up stack-mobile" style={{
            padding: 0, marginBottom: 16, background: "var(--bg-2)",
            cursor: "pointer", overflow: "hidden",
            display: "grid", gridTemplateColumns: "1.2fr 1fr",
          }}>
            <div className="img-ph" style={{ minHeight: 280, position: "relative" }}>
              <span>FEATURED HERO ART</span>
              {/* Subtle highlight grid overlay */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.4 }} preserveAspectRatio="none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="30" fill="none" stroke="var(--gold)" strokeOpacity="0.2"/>
                <circle cx="50" cy="50" r="18" fill="none" stroke="var(--gold)" strokeOpacity="0.3"/>
              </svg>
            </div>
            <div style={{ padding: 36, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <span className={`tag ${posts[0].tagColor}`}>{t(posts[0].tag)}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{posts[0].date}</span>
              </div>
              <h2 className="head" style={{ fontSize: 32, lineHeight: 1.1, marginBottom: 12, color: "var(--cream)" }}>
                {posts[0]["title_" + lang]}
              </h2>
              <p style={{ color: "var(--fg-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
                {posts[0]["excerpt_" + lang]}
              </p>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--fg-faint)" }} className="mono">
                <span>{t("posted_by")} {posts[0].author}</span>
                <span>·</span>
                <span>{posts[0].read_min} {t("min_read")}</span>
              </div>
            </div>
          </article>
        )}

        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {posts.slice(filter === "all" ? 1 : 0).map((p, i) => (
            <NewsCardSmall key={p.id} news={p} onClick={() => setRoute({ name: "news", articleId: p.id })} delay={i * 50}/>
          ))}
        </div>
      </Container>
    </div>
  );
}

function NewsCardSmall({ news, onClick, delay }) {
  const { lang, t } = useApp();
  return (
    <article onClick={onClick} className="surface lift corners fade-up" style={{
      padding: 0, background: "var(--bg-2)", cursor: "pointer", overflow: "hidden",
      animationDelay: `${delay}ms`,
    }}>
      <div className="img-ph" style={{ height: 140 }}>
        <span>{news.id.toUpperCase()}</span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span className={`tag ${news.tagColor}`}>{t(news.tag)}</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{news.date}</span>
        </div>
        <h3 className="head" style={{ fontSize: 15, lineHeight: 1.25, marginBottom: 8, color: "var(--cream)" }}>
          {news["title_" + lang]}
        </h3>
        <p style={{ color: "var(--fg-muted)", fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>
          {news["excerpt_" + lang]}
        </p>
        <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>
          {news.author} · {news.read_min} {t("min_read")}
        </div>
      </div>
    </article>
  );
}

function NewsArticle({ article, setRoute }) {
  const { lang, t } = useApp();
  const body = article["body_" + lang];
  const related = window.MOCK.news.filter(n => n.id !== article.id).slice(0, 3);
  return (
    <div className="page-enter">
      <Container max={920}>
        <div style={{ padding: "32px 0" }}>
          <button onClick={() => setRoute({ name: "news" })} className="btn btn-ghost btn-sm">
            {Icon.arrowLeft(12)} {t("back_to_news")}
          </button>
        </div>

        <article>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <span className={`tag ${article.tagColor}`}>{t(article.tag)}</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", alignSelf: "center" }}>{article.date}</span>
          </div>
          <h1 className="display hero-page-title" style={{
            fontSize: 64, lineHeight: 0.98, letterSpacing: "0.01em",
            color: "var(--cream)", marginBottom: 18,
          }}>{article["title_" + lang]}</h1>

          <div style={{ display: "flex", gap: 20, padding: "16px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", marginBottom: 32, color: "var(--fg-muted)" }} className="mono">
            <span style={{ fontSize: 12 }}>{t("posted_by")} <span style={{ color: "var(--gold)" }}>{article.author}</span></span>
            <span style={{ fontSize: 12 }}>{article.read_min} {t("min_read")}</span>
          </div>

          <div className="img-ph" style={{ height: 360, marginBottom: 36, borderRadius: 8 }}>
            <span>{article.id.toUpperCase()} · HERO ART</span>
          </div>

          <div style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg)", maxWidth: 720, margin: "0 auto" }}>
            {body.map((p, i) => (
              <p key={i} style={{ marginBottom: 18, textWrap: "pretty" }}>{p}</p>
            ))}
          </div>
        </article>

        <div style={{ marginTop: 72 }}>
          <SectionTitle kicker="MORE" title={lang === "hu" ? "További hírek" : "More news"} />
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {related.map((n, i) => (
              <NewsCardSmall key={n.id} news={n} onClick={() => setRoute({ name: "news", articleId: n.id })} delay={i * 50}/>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// AUTH — Login + Register flows with validation
// ──────────────────────────────────────────────────────────────────────────
function AuthModal({ mode, onClose, switchMode, onSuccess }) {
  const { t } = useApp();
  return (
    <Modal open onClose={onClose} width={460}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <KeseyMark size={48} />
        <h2 className="display gold-text" style={{ fontSize: 36, letterSpacing: "0.04em", marginTop: 14 }}>
          {mode === "login" ? t("auth_login_title") : t("auth_register_title")}
        </h2>
        <p style={{ color: "var(--fg-muted)", fontSize: 13, marginTop: 4 }}>
          {mode === "login" ? t("auth_login_sub") : t("auth_register_sub")}
        </p>
      </div>
      {mode === "login" ? <LoginForm onSuccess={onSuccess} /> : <RegisterForm onSuccess={onSuccess} />}
      <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)", textAlign: "center" }}>
        <span style={{ color: "var(--fg-muted)", fontSize: 13 }}>
          {mode === "login" ? t("no_account") : t("have_account")}
        </span>
        {" "}
        <a href="#" onClick={(e) => { e.preventDefault(); switchMode(mode === "login" ? "register" : "login"); }}>
          {mode === "login" ? t("register") : t("sign_in_short")}
        </a>
      </div>
    </Modal>
  );
}

function LoginForm({ onSuccess }) {
  const { t, login } = useApp();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!u || !p) { setErr(t("auth_err_creds")); return; }
    setLoading(true);
    setErr("");
    setTimeout(() => {
      setLoading(false);
      // Accept any non-empty for demo; reject "wrong"
      if (p.toLowerCase() === "wrong") { setErr(t("auth_err_creds")); return; }
      login({ username: u, email: `${u.toLowerCase()}@kesey.gg` });
      onSuccess();
    }, 800);
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label className="field-label">{t("username")}</label>
        <input className={"field" + (err ? " error" : "")} value={u} onChange={(e) => setU(e.target.value)} autoFocus />
      </div>
      <div>
        <label className="field-label" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{t("password")}</span>
          <a href="#" style={{ fontSize: 11, textTransform: "none", letterSpacing: 0 }} onClick={(e) => e.preventDefault()}>{t("forgot_password")}</a>
        </label>
        <input className={"field" + (err ? " error" : "")} type="password" value={p} onChange={(e) => setP(e.target.value)} />
        {err && <div className="field-error">{err}</div>}
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--fg-muted)" }}>
        <Checkbox checked={remember} onChange={setRemember} />
        {t("remember_me")}
      </label>
      <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 8 }}>
        {loading ? <>{Icon.spinner(14)} ...</> : <>{t("sign_in")} {Icon.arrowRight(14)}</>}
      </button>
    </form>
  );
}

function RegisterForm({ onSuccess }) {
  const { t, login } = useApp();
  const [data, setData] = useState({ username: "", email: "", password: "", confirm: "", tos: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!/^[a-zA-Z0-9]{4,}$/.test(data.username)) e.username = t("auth_err_username");
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(data.email)) e.email = t("auth_err_email");
    if (!/^.{8,}$/.test(data.password) || !/\d/.test(data.password)) e.password = t("auth_err_password");
    if (data.confirm !== data.password) e.confirm = t("auth_err_confirm");
    if (!data.tos) e.tos = t("auth_err_tos");
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      login({ username: data.username, email: data.email });
      onSuccess();
    }, 900);
  };

  // Live password strength
  const pwScore = (() => {
    let s = 0;
    if (data.password.length >= 8) s++;
    if (data.password.length >= 12) s++;
    if (/\d/.test(data.password)) s++;
    if (/[A-Z]/.test(data.password) && /[a-z]/.test(data.password)) s++;
    if (/[^A-Za-z0-9]/.test(data.password)) s++;
    return s;
  })();
  const pwLabel = ["", "Gyenge", "Közepes", "Jó", "Erős", "Nagyon erős"][pwScore];
  const pwColor = ["", "#ef4444", "#f59e0b", "#fbbf24", "#84cc16", "#22c55e"][pwScore];

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label className="field-label">{t("username")}</label>
        <input className={"field" + (errors.username ? " error" : "")} value={data.username}
               onChange={(e) => setData({ ...data, username: e.target.value })} autoFocus />
        {errors.username ? <div className="field-error">{errors.username}</div> : <div className="field-hint">{t("auth_err_username")}</div>}
      </div>
      <div>
        <label className="field-label">{t("email")}</label>
        <input type="email" className={"field" + (errors.email ? " error" : "")} value={data.email}
               onChange={(e) => setData({ ...data, email: e.target.value })} />
        {errors.email && <div className="field-error">{errors.email}</div>}
      </div>
      <div>
        <label className="field-label">{t("password")}</label>
        <input type="password" className={"field" + (errors.password ? " error" : "")} value={data.password}
               onChange={(e) => setData({ ...data, password: e.target.value })} />
        {data.password && (
          <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: pwScore >= n ? pwColor : "rgba(255,255,255,0.06)",
                transition: "background 0.2s",
              }}/>
            ))}
          </div>
        )}
        {errors.password ? <div className="field-error">{errors.password}</div> :
          data.password ? <div className="field-hint" style={{ color: pwColor }}>{pwLabel}</div> :
          <div className="field-hint">{t("auth_err_password")}</div>}
      </div>
      <div>
        <label className="field-label">{t("password_confirm")}</label>
        <input type="password" className={"field" + (errors.confirm ? " error" : "")} value={data.confirm}
               onChange={(e) => setData({ ...data, confirm: e.target.value })} />
        {errors.confirm && <div className="field-error">{errors.confirm}</div>}
      </div>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--fg-muted)", marginTop: 4 }}>
        <Checkbox checked={data.tos} onChange={(v) => setData({ ...data, tos: v })}/>
        <span style={{ lineHeight: 1.4 }}>{t("accept_tos")}</span>
      </label>
      {errors.tos && <div className="field-error" style={{ marginTop: -8 }}>{errors.tos}</div>}
      <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 8 }}>
        {loading ? <>{Icon.spinner(14)} ...</> : <>{t("create_my_account")} {Icon.arrowRight(14)}</>}
      </button>
    </form>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} style={{
      width: 18, height: 18, borderRadius: 4,
      border: checked ? "1px solid var(--gold)" : "1px solid var(--line-strong)",
      background: checked ? "var(--gold)" : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#19140a", cursor: "pointer", flexShrink: 0, padding: 0,
    }}>
      {checked && Icon.check(12)}
    </button>
  );
}

Object.assign(window, { News, AuthModal });
