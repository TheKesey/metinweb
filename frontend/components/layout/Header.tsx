"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useStore } from "@/lib/store";
import { KeseyMark } from "@/components/brand/KeseyMark";
import {
  HomeIcon, NewsIcon, TrophyIcon, UsersIcon, ShopIcon,
  DownloadIcon, BookIcon, CartIcon, CoinIcon, PlusIcon, UserIcon,
  GlobeIcon, MenuIcon, XIcon, LogOutIcon,
} from "@/components/brand/Icon";
import { setLocaleCookie } from "@/app/actions/locale";
import { fmtNum, daysSinceLaunch } from "@/lib/utils";

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const { user, setUser, cart, cartOpen, setCartOpen, mobileMenuOpen, setMobileMenuOpen, setAuthModal } = useStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const navItems = [
    { href: "/",          label: t("nav_home"),     Icon: HomeIcon },
    { href: "/news",      label: t("nav_news"),     Icon: NewsIcon },
    { href: "/ranking",   label: t("nav_ranking"),  Icon: TrophyIcon },
    { href: "/online",    label: t("nav_online"),   Icon: UsersIcon },
    { href: "/shop",      label: t("nav_shop"),     Icon: ShopIcon },
    { href: "/download",  label: t("nav_download"), Icon: DownloadIcon },
    { href: "/guide",     label: t("nav_guide"),    Icon: BookIcon },
  ];

  function handleLocaleSwitch() {
    const next = locale === "hu" ? "en" : "hu";
    startTransition(async () => {
      await setLocaleCookie(next);
      router.refresh();
    });
  }

  function handleLogout() {
    setUser(null);
    setUserMenuOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(8, 10, 15, 0.82)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        borderBottom: "1px solid var(--line)",
      }}>
        {/* Utility bar (desktop only) */}
        <div className="hdr-util" style={{ background: "rgba(0,0,0,0.4)", borderBottom: "1px solid var(--line)" }}>
          <div className="container">
            <div className="mono" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", fontSize: 11 }}>
              <div style={{ display: "flex", gap: 24, alignItems: "center", color: "var(--fg-muted)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span className="dot dot-ok pulse" />
                  <span>Kesey-1 · {t("online_text")}</span>
                </span>
                <span>S4 · v4.1.2</span>
                <span style={{ color: "var(--fg-faint)" }}>
                  {t("uptime")} {daysSinceLaunch()} nap
                </span>
              </div>
              <button
                onClick={handleLocaleSwitch}
                className="mono"
                style={{
                  background: "transparent", border: 0, color: "var(--fg-muted)",
                  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                }}
              >
                <GlobeIcon size={12} />
                {locale === "hu" ? "HU / EN" : "EN / HU"}
              </button>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", gap: 16 }}>

            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <KeseyMark size={38} />
              <div style={{ textAlign: "left", lineHeight: 1 }}>
                <div className="display" style={{ fontSize: 22, letterSpacing: "0.08em", color: "#ecead8" }}>KESEY</div>
                <div className="mono hide-mobile" style={{ fontSize: 9, letterSpacing: "0.22em", color: "var(--fg-faint)", marginTop: 2 }}>S4 · YU PLAINS</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hdr-nav-desktop" style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {navItems.map(({ href, label, Icon: NavIcon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: active ? "rgba(34,197,224,0.08)" : "transparent",
                      border: active ? "1px solid rgba(34,197,224,0.3)" : "1px solid transparent",
                      color: active ? "var(--accent-bright)" : "var(--fg-muted)",
                      padding: "8px 12px", borderRadius: 8, cursor: "pointer",
                      fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 600,
                      letterSpacing: "0.05em", textTransform: "uppercase",
                      transition: "all 0.15s", textDecoration: "none",
                    }}
                    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--fg)"; }}
                    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)"; }}
                  >
                    <NavIcon size={14} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Auth area */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {user ? (
                <>
                  {/* Coin balance */}
                  <Link href="/payment" className="surface" style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "0 12px", height: 36,
                    background: "var(--bg-2)", cursor: "pointer",
                    border: "1px solid rgba(34,197,224,0.25)", borderRadius: "var(--radius)",
                    textDecoration: "none",
                  }}>
                    <CoinIcon size={14} style={{ color: "var(--accent-bright)" }} />
                    <span className="display hide-mobile" style={{ fontSize: 16, color: "var(--accent-bright)", letterSpacing: "0.05em" }}>{fmtNum(user.coins)}</span>
                    <PlusIcon size={14} style={{ color: "var(--accent)", opacity: 0.6 }} />
                  </Link>

                  {/* Cart button */}
                  <button
                    onClick={() => setCartOpen(true)}
                    style={{
                      position: "relative", background: "transparent",
                      border: "1px solid var(--line-2)", borderRadius: 8,
                      width: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "var(--fg)",
                    }}
                    aria-label={t("cart")}
                  >
                    <CartIcon size={14} />
                    {cartCount > 0 && (
                      <span style={{
                        position: "absolute", top: -6, right: -6,
                        background: "var(--red)", color: "#fff",
                        borderRadius: 999, padding: "2px 5px", fontSize: 10,
                        fontFamily: "var(--font-mono)", fontWeight: 600,
                        minWidth: 18, textAlign: "center",
                        boxShadow: "0 0 0 2px var(--bg-1)",
                      }}>{cartCount}</span>
                    )}
                  </button>

                  {/* User menu (desktop) */}
                  <div ref={userMenuRef} className="hide-mobile" style={{ position: "relative" }}>
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8, height: 36,
                        background: "var(--bg-3)", border: "1px solid var(--line-2)",
                        padding: "0 12px 0 4px", borderRadius: 8, cursor: "pointer", color: "var(--fg)",
                      }}
                    >
                      <span style={{
                        width: 26, height: 26, borderRadius: 5,
                        background: "linear-gradient(135deg, var(--accent), var(--red))",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 12,
                      }}>
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{user.username}</span>
                    </button>

                    {userMenuOpen && (
                      <div
                        className="surface fade-up"
                        style={{
                          position: "absolute", right: 0, top: "calc(100% + 8px)",
                          width: 220, padding: 6, background: "var(--bg-2)",
                          boxShadow: "0 16px 40px -10px rgba(0,0,0,0.8)", zIndex: 200,
                        }}
                        onMouseLeave={() => setUserMenuOpen(false)}
                      >
                        <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--line)" }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{user.username}</div>
                          <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{user.email}</div>
                        </div>
                        {[
                          { label: t("nav_account"), href: "/profile", Icon: UserIcon },
                          { label: t("topup"),        href: "/payment",  Icon: CoinIcon },
                        ].map((m) => (
                          <Link
                            key={m.href}
                            href={m.href}
                            onClick={() => setUserMenuOpen(false)}
                            style={{
                              width: "100%", display: "flex", alignItems: "center", gap: 10,
                              padding: "9px 12px", background: "transparent",
                              color: "var(--fg)", borderRadius: 6,
                              fontFamily: "var(--font-body)", fontSize: 13, textDecoration: "none",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-3)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <m.Icon size={12} />
                            {m.label}
                          </Link>
                        ))}
                        <div style={{ height: 1, background: "var(--line)", margin: "6px 0" }} />
                        <button
                          onClick={handleLogout}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10,
                            padding: "9px 12px", background: "transparent", border: 0,
                            color: "var(--red-bright)", cursor: "pointer", borderRadius: 6,
                            fontFamily: "var(--font-body)", fontSize: 13, textAlign: "left",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(192,51,74,0.08)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <LogOutIcon size={12} />
                          {t("logout")}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hide-mobile" style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setAuthModal("login")} className="btn btn-ghost btn-sm">{t("login")}</button>
                  <button onClick={() => setAuthModal("register")} className="btn btn-primary btn-sm">{t("register")}</button>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="show-mobile"
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "var(--bg-3)", border: "1px solid var(--line-2)",
                  color: "var(--fg)", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
                aria-label="Menu"
              >
                <MenuIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-inner" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <KeseyMark size={30} />
                <div className="display" style={{ fontSize: 22, letterSpacing: "0.08em", color: "#ecead8" }}>KESEY</div>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "var(--bg-3)", border: "1px solid var(--line-2)",
                  color: "var(--fg)", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <XIcon size={16} />
              </button>
            </div>

            {user ? (
              <div className="surface" style={{ padding: 14, marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                  background: "linear-gradient(135deg, var(--accent), var(--red))",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 18,
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#ecead8" }}>{user.username}</div>
                  <div className="mono accent-c" style={{ fontSize: 12 }}>{fmtNum(user.coins)} érme</div>
                </div>
                <Link href="/payment" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm">
                  <PlusIcon size={12} /> {t("topup")}
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={() => { setMobileMenuOpen(false); setAuthModal("login"); }} className="btn btn-ghost" style={{ flex: 1 }}>{t("login")}</button>
                <button onClick={() => { setMobileMenuOpen(false); setAuthModal("register"); }} className="btn btn-primary" style={{ flex: 1 }}>{t("register")}</button>
              </div>
            )}

            <nav>
              {navItems.map(({ href, label, Icon: NavIcon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  data-active={isActive(href) ? "1" : "0"}
                  style={{ textDecoration: "none" }}
                >
                  <NavIcon size={16} /> {label}
                </Link>
              ))}
              {user && (
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} data-active={pathname === "/profile" ? "1" : "0"} style={{ textDecoration: "none" }}>
                  <UserIcon size={16} /> {t("nav_account")}
                </Link>
              )}
            </nav>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={handleLocaleSwitch}
                className="mono"
                style={{
                  background: "transparent", border: "1px solid var(--line-2)", borderRadius: 8,
                  color: "var(--fg-muted)", padding: "8px 14px", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}
              >
                <GlobeIcon size={12} />
                {locale === "hu" ? "Magyar" : "English"}
              </button>
              {user && (
                <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ color: "var(--red-bright)" }}>
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
    </>
  );
}
