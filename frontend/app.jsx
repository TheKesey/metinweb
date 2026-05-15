// Main App — routing, global state, tweaks panel
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "stats",
  "accent": "gold",
  "shopLayout": "grid",
  "lang": "hu"
}/*EDITMODE-END*/;

const ACCENTS = {
  gold:    { name: "Arany",   bright: "#f0c270", base: "#d4a04a", deep: "#8b6a2a", cream: "#f5e6c8", glow: "rgba(240,194,112,0.5)" },
  crimson: { name: "Vörös",   bright: "#ff7a8e", base: "#c0334a", deep: "#7e1726", cream: "#fbd5da", glow: "rgba(255,122,142,0.45)" },
  cyan:    { name: "Ciánkék", bright: "#7df0ff", base: "#22c5e0", deep: "#0a6b7e", cream: "#cdf5ff", glow: "rgba(125,240,255,0.5)" },
  emerald: { name: "Smaragd", bright: "#7fe6a8", base: "#28c075", deep: "#0d5e3c", cream: "#cef5dc", glow: "rgba(127,230,168,0.45)" },
};

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lang, setLang] = useState(tweaks.lang || "hu");
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(1850);
  const [cart, setCart] = useState([]);
  const [route, setRouteState] = useState({ name: "home" });
  const [auth, setAuth] = useState(null); // null | "login" | "register"
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(null); // null | review | processing | done
  const [mobileMenu, setMobileMenu] = useState(false);
  const toast = useToast();

  useEffect(() => { setLang(tweaks.lang); }, [tweaks.lang]);

  // Apply accent theme via CSS custom props
  useEffect(() => {
    const a = ACCENTS[tweaks.accent] || ACCENTS.gold;
    const r = document.documentElement.style;
    r.setProperty("--gold", a.base);
    r.setProperty("--gold-bright", a.bright);
    r.setProperty("--gold-deep", a.deep);
    r.setProperty("--cream", a.cream);
    // glow override (used in glow-gold)
  }, [tweaks.accent]);

  // Translations helper
  const t = useCallback((k) => window.I18N[lang][k] || k, [lang]);

  // Route with scroll-to-top
  const setRoute = useCallback((r) => {
    setRouteState(r);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" }));
  }, []);

  // Cart actions
  const addToCart = useCallback((item) => {
    setCart((arr) => {
      const ex = arr.find(c => c.id === item.id);
      if (ex) return arr.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...arr, { ...item, qty: 1 }];
    });
    toast.push(lang === "hu" ? "Kosárba téve: " + item["name_" + lang] : "Added to cart: " + item["name_" + lang], "ok");
  }, [lang, toast]);
  const removeFromCart = useCallback((id) => setCart((arr) => arr.filter(c => c.id !== id)), []);
  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return setCart((arr) => arr.filter(c => c.id !== id));
    setCart((arr) => arr.map(c => c.id === id ? { ...c, qty } : c));
  }, []);

  // Auth
  const login = useCallback((u) => {
    setUser(u);
    setAuth(null);
    toast.push(lang === "hu" ? "Üdv, " + u.username + "!" : "Welcome, " + u.username + "!", "ok");
  }, [lang, toast]);
  const logout = useCallback(() => {
    setUser(null);
    setRoute({ name: "home" });
    toast.push(lang === "hu" ? "Kijelentkeztél." : "Signed out.", "info");
  }, [lang, toast, setRoute]);

  const addTransaction = useCallback((tx) => {
    // Prepend to MOCK transactions (won't persist but ok for prototype)
    window.MOCK.transactions = [tx, ...window.MOCK.transactions];
  }, []);

  const ctxValue = useMemo(() => ({
    lang, setLang: (l) => { setLang(l); setTweak("lang", l); },
    t, tweaks, user, coins, setCoins, cart, setCart,
    addToCart, removeFromCart, updateQty,
    cartOpen, setCartOpen,
    mobileMenu, setMobileMenu,
    openLogin: () => setAuth("login"),
    openRegister: () => setAuth("register"),
    login, logout, setRoute, addTransaction,
    pushToast: toast.push,
  }), [lang, t, tweaks, user, coins, cart, addToCart, removeFromCart, updateQty, cartOpen, mobileMenu, login, logout, setRoute, addTransaction, toast.push]);

  // Cart checkout handler
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const doCheckout = () => {
    if (coins < cartTotal) { toast.push(t("not_enough_coins"), "err"); return; }
    setCheckoutStep("processing");
    setTimeout(() => {
      setCoins(coins - cartTotal);
      setCart([]);
      setCheckoutStep("done");
      setTimeout(() => {
        setCheckoutStep(null);
        setCartOpen(false);
        toast.push(t("purchase_success"), "ok");
      }, 1800);
    }, 1600);
  };

  return (
    <AppCtx.Provider value={ctxValue}>
      <Header route={route} setRoute={setRoute} />
      <main style={{ position: "relative", zIndex: 2 }}>
        {route.name === "home" && <Home setRoute={setRoute} />}
        {route.name === "news" && <News articleId={route.articleId} setRoute={setRoute} />}
        {route.name === "ranking" && <Ranking />}
        {route.name === "online" && <Online />}
        {route.name === "shop" && <Itemshop />}
        {route.name === "download" && <Download />}
        {route.name === "profile" && (user ? <Profile setRoute={setRoute} /> : <RequireAuth onLogin={() => setAuth("login")} />)}
        {route.name === "payment" && (user ? <Payment setRoute={setRoute} /> : <RequireAuth onLogin={() => setAuth("login")} />)}
      </main>
      <Footer />

      {/* Cart drawer — global so it works from anywhere */}
      {cartOpen && (
        <CartDrawer
          onClose={() => setCartOpen(false)}
          onCheckout={() => setCheckoutStep("review")}
        />
      )}
      {checkoutStep && (
        <CheckoutModal
          step={checkoutStep}
          onClose={() => setCheckoutStep(null)}
          onConfirm={doCheckout}
          onTopup={() => { setCheckoutStep(null); setCartOpen(false); setRoute({ name: "payment" }); }}
        />
      )}

      {/* Auth modal */}
      {auth && (
        <AuthModal mode={auth} onClose={() => setAuth(null)}
                   switchMode={setAuth}
                   onSuccess={() => setAuth(null)} />
      )}

      {toast.node}

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero">
          <TweakRadio label="Variáció" value={tweaks.heroVariant}
            options={[
              { value: "stats", label: "Stats" },
              { value: "scene", label: "Scene" },
              { value: "split", label: "Split" },
            ]}
            onChange={(v) => setTweak("heroVariant", v)} />
        </TweakSection>

        <TweakSection label="Akcent szín">
          <TweakColor label="Paletta" value={tweaks.accent}
            options={[
              [ACCENTS.gold.bright, ACCENTS.gold.base, ACCENTS.gold.deep],
              [ACCENTS.crimson.bright, ACCENTS.crimson.base, ACCENTS.crimson.deep],
              [ACCENTS.cyan.bright, ACCENTS.cyan.base, ACCENTS.cyan.deep],
              [ACCENTS.emerald.bright, ACCENTS.emerald.base, ACCENTS.emerald.deep],
            ]}
            onChange={(v) => {
              // Match palette to key
              const key = Object.keys(ACCENTS).find(k => ACCENTS[k].base === v[1]) || "gold";
              setTweak("accent", key);
            }} />
        </TweakSection>

        <TweakSection label="Itemshop">
          <TweakRadio label="Layout" value={tweaks.shopLayout}
            options={["grid", "list"]}
            onChange={(v) => setTweak("shopLayout", v)} />
        </TweakSection>

        <TweakSection label="Nyelv">
          <TweakRadio label="Language" value={tweaks.lang}
            options={[
              { value: "hu", label: "Magyar" },
              { value: "en", label: "English" },
            ]}
            onChange={(v) => setTweak("lang", v)} />
        </TweakSection>
      </TweaksPanel>
    </AppCtx.Provider>
  );
}

function RequireAuth({ onLogin }) {
  return (
    <Container>
      <div style={{ padding: 80, textAlign: "center" }}>
        <KeseyMark size={48}/>
        <h2 className="head" style={{ fontSize: 24, color: "var(--cream)", marginTop: 14 }}>Jelentkezz be a folytatáshoz.</h2>
        <button onClick={onLogin} className="btn btn-primary btn-lg" style={{ marginTop: 20 }}>
          {Icon.user(14)} Belépés
        </button>
      </div>
    </Container>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
