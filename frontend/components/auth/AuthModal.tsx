"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useStore } from "@/lib/store";
import { KeseyMark } from "@/components/brand/KeseyMark";
import { SpinnerIcon, XIcon, LockIcon, UserIcon, MailIcon, CheckIcon, ArrowLeftIcon } from "@/components/brand/Icon";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Schemas ──────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  remember: z.boolean().optional(),
});

const registerSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9]{4,}$/, "auth_err_username"),
  email: z.string().email("auth_err_email"),
  password: z.string().min(8).regex(/\d/, "auth_err_password"),
  confirm: z.string(),
  tos: z.literal(true).refine((v) => v === true, { message: "auth_err_tos" }),
}).refine((d) => d.password === d.confirm, { message: "auth_err_confirm", path: ["confirm"] });

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

// ── Password strength meter ───────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/\d/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  const colors = ["var(--danger)", "var(--danger)", "var(--warn)", "var(--warn)", "var(--ok)", "var(--ok)"];
  return (
    <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
      {[1,2,3,4,5].map((i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= score ? colors[score] : "var(--bg-4)", transition: "background 0.2s" }} />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function AuthModal() {
  const t = useTranslations();
  const { authModal, setAuthModal, setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  if (!authModal) return null;

  function close() {
    setAuthModal(null);
    setError("");
    setForgotSent(false);
    setForgotEmail("");
    loginForm.reset();
    registerForm.reset();
  }

  function storeAuth(token: string, user: { username: string; email: string; member_since: string }, remember: boolean) {
    if (remember) {
      localStorage.setItem("auth_token", token);
      sessionStorage.removeItem("auth_token");
    } else {
      sessionStorage.setItem("auth_token", token);
      localStorage.removeItem("auth_token");
    }
    setUser({ id: user.username, username: user.username, email: user.email, coins: 0, vip_tier: 0, member_since: user.member_since });
    close();
  }

  async function handleLogin(data: LoginForm) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ login: data.username, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json.errors?.login?.[0] || json.message || t("auth_err_creds");
        setError(msg);
        return;
      }
      storeAuth(json.token, json.user, !!data.remember);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(data: RegisterForm) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ login: data.username, email: data.email, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json.errors?.login?.[0] || json.errors?.email?.[0] || json.message || t("error");
        setError(msg);
        return;
      }
      storeAuth(json.token, json.user, true);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!forgotEmail) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotSent(true);
    } catch {
      setForgotSent(true); // mindig mutassuk a success-t
    } finally {
      setLoading(false);
    }
  }

  const pw = registerForm.watch("password") ?? "";

  const headingMap = {
    login:    t("auth_login_title"),
    register: t("auth_register_title"),
    forgot:   t("forgot_title"),
  };
  const subMap = {
    login:    t("auth_login_sub"),
    register: t("auth_register_sub"),
    forgot:   t("forgot_sub"),
  };

  return (
    <>
      <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(4,6,10,0.72)", backdropFilter: "blur(8px)", zIndex: 300 }} />
      <div
        className="surface modal-enter"
        style={{
          position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          width: "min(460px, calc(100vw - 32px))",
          background: "var(--bg-2)", zIndex: 301, padding: "32px 32px 28px",
          boxShadow: "0 32px 80px -16px rgba(0,0,0,0.8)",
        }}
      >
        <button onClick={close} style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 8, background: "var(--bg-3)", border: "1px solid var(--line-2)", color: "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <XIcon size={14} />
        </button>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <KeseyMark size={44} />
          <h2 style={{ marginTop: 12, fontSize: 22, color: "#ecead8" }}>
            {forgotSent ? t("forgot_success_title") : headingMap[authModal]}
          </h2>
          <p style={{ color: "var(--fg-muted)", fontSize: 13, marginTop: 6 }}>
            {forgotSent ? t("forgot_success_sub") : subMap[authModal]}
          </p>
        </div>

        {/* Login */}
        {authModal === "login" && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="field-label">{t("username")}</label>
              <input {...loginForm.register("username")} className={`field${loginForm.formState.errors.username ? " error" : ""}`} placeholder={t("username")} autoFocus />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label className="field-label" style={{ marginBottom: 0 }}>{t("password")}</label>
                <button type="button" onClick={() => setAuthModal("forgot")} style={{ background: "none", border: 0, fontSize: 11, color: "var(--accent)", cursor: "pointer", padding: 0 }}>
                  {t("forgot_password")}
                </button>
              </div>
              <input {...loginForm.register("password")} type="password" className={`field${loginForm.formState.errors.password ? " error" : ""}`} placeholder="••••••••" />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--fg-muted)" }}>
              <input type="checkbox" {...loginForm.register("remember")} style={{ width: 14, height: 14, accentColor: "var(--accent)" }} />
              {t("remember_me")}
            </label>
            {error && <div className="field-error" style={{ textAlign: "center" }}>{error}</div>}
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 4 }}>
              {loading ? <SpinnerIcon size={14} /> : <LockIcon size={14} />}
              {loading ? t("loading") : t("sign_in")}
            </button>
            <div style={{ textAlign: "center", fontSize: 13, color: "var(--fg-muted)" }}>
              {t("no_account")}{" "}
              <button type="button" onClick={() => setAuthModal("register")} style={{ background: "none", border: 0, color: "var(--accent)", cursor: "pointer", fontSize: 13 }}>
                {t("register")}
              </button>
            </div>
          </form>
        )}

        {/* Register */}
        {authModal === "register" && (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label className="field-label">{t("username")}</label>
              <input {...registerForm.register("username")} className={`field${registerForm.formState.errors.username ? " error" : ""}`} placeholder={t("username")} autoFocus />
              {registerForm.formState.errors.username && <div className="field-error">{t(registerForm.formState.errors.username.message as "auth_err_username")}</div>}
            </div>
            <div>
              <label className="field-label">{t("email")}</label>
              <input {...registerForm.register("email")} type="email" className={`field${registerForm.formState.errors.email ? " error" : ""}`} placeholder="email@example.com" />
              {registerForm.formState.errors.email && <div className="field-error">{t(registerForm.formState.errors.email.message as "auth_err_email")}</div>}
            </div>
            <div>
              <label className="field-label">{t("password")}</label>
              <input {...registerForm.register("password")} type="password" className={`field${registerForm.formState.errors.password ? " error" : ""}`} placeholder="••••••••" />
              {pw && <PasswordStrength password={pw} />}
              {registerForm.formState.errors.password && <div className="field-error">{t(registerForm.formState.errors.password.message as "auth_err_password")}</div>}
            </div>
            <div>
              <label className="field-label">{t("password_confirm")}</label>
              <input {...registerForm.register("confirm")} type="password" className={`field${registerForm.formState.errors.confirm ? " error" : ""}`} placeholder="••••••••" />
              {registerForm.formState.errors.confirm && <div className="field-error">{t(registerForm.formState.errors.confirm.message as "auth_err_confirm")}</div>}
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.5 }}>
              <input type="checkbox" {...registerForm.register("tos")} style={{ width: 14, height: 14, marginTop: 2, accentColor: "var(--accent)", flexShrink: 0 }} />
              {t("accept_tos")}
            </label>
            {registerForm.formState.errors.tos && <div className="field-error">{t("auth_err_tos")}</div>}
            {error && <div className="field-error" style={{ textAlign: "center" }}>{error}</div>}
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 4 }}>
              {loading ? <SpinnerIcon size={14} /> : <UserIcon size={14} />}
              {loading ? t("loading") : t("create_my_account")}
            </button>
            <div style={{ textAlign: "center", fontSize: 13, color: "var(--fg-muted)" }}>
              {t("have_account")}{" "}
              <button type="button" onClick={() => setAuthModal("login")} style={{ background: "none", border: 0, color: "var(--accent)", cursor: "pointer", fontSize: 13 }}>
                {t("sign_in")}
              </button>
            </div>
          </form>
        )}

        {/* Forgot */}
        {authModal === "forgot" && !forgotSent && (
          <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="field-label">{t("email")}</label>
              <input
                type="email"
                className="field"
                placeholder="email@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                autoFocus
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 4 }}>
              {loading ? <SpinnerIcon size={14} /> : <MailIcon size={14} />}
              {loading ? t("loading") : t("forgot_send")}
            </button>
            <div style={{ textAlign: "center" }}>
              <button type="button" onClick={() => setAuthModal("login")} style={{ background: "none", border: 0, color: "var(--fg-muted)", cursor: "pointer", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <ArrowLeftIcon size={12} /> {t("back_to_login")}
              </button>
            </div>
          </form>
        )}

        {/* Forgot success */}
        {authModal === "forgot" && forgotSent && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckIcon size={24} style={{ color: "var(--ok)" }} />
            </div>
            <button onClick={close} className="btn btn-primary" style={{ width: "100%" }}>
              {t("back_to_login")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
