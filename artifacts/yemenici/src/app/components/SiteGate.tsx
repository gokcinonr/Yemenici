import { useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "yemenici_site_access";

function setAccess() {
  sessionStorage.setItem(STORAGE_KEY, "1");
}

function hasAccess() {
  return sessionStorage.getItem(STORAGE_KEY) === "1";
}

function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon({ show }: { show: boolean }) {
  if (show) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function SiteGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hasAccess()) setUnlocked(true);
    setReady(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/site-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAccess();
        setUnlocked(true);
      } else {
        setError("Geçersiz şifre. Lütfen tekrar deneyin.");
        setPassword("");
      }
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#0e1014",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background texture rings */}
      <div style={{
        position: "absolute",
        width: 700,
        height: 700,
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.04)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        width: 480,
        height: 480,
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.06)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.08)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: "48px 44px 44px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Lock icon */}
        <div style={{
          width: 56,
          height: 56,
          backgroundColor: "#f1f3f5",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
          color: "#202429",
        }}>
          <LockIcon />
        </div>

        {/* Brand */}
        <div style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          fontSize: 22,
          color: "#202429",
          letterSpacing: "-0.3px",
          marginBottom: 6,
        }}>
          Yemenici
        </div>
        <div style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          color: "#969696",
          lineHeight: 1.5,
          marginBottom: 36,
        }}>
          Site şu an geliştirme aşamasındadır. Devam etmek için şifreyi girin.
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              placeholder="Şifre"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              autoFocus
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 15,
                width: "100%",
                padding: "14px 48px 14px 18px",
                borderRadius: 12,
                border: error ? "1.5px solid #ff4d4f" : "1.5px solid #e8eaed",
                backgroundColor: "#f9fafb",
                color: "#202429",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = "#202429";
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = "#e8eaed";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#969696",
                display: "flex",
                alignItems: "center",
                padding: 4,
              }}
            >
              <EyeIcon show={showPw} />
            </button>
          </div>

          {error && (
            <div style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: "#ff4d4f",
              marginTop: -4,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              padding: "14px",
              borderRadius: 12,
              border: "none",
              backgroundColor: password.trim() && !loading ? "#202429" : "#d1d5db",
              color: "#ffffff",
              cursor: password.trim() && !loading ? "pointer" : "not-allowed",
              transition: "background-color 0.2s",
              marginTop: 4,
            }}
          >
            {loading ? "Kontrol ediliyor..." : "Giriş"}
          </button>
        </form>
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: 28,
        fontFamily: "Poppins, sans-serif",
        fontWeight: 400,
        fontSize: 12,
        color: "rgba(255,255,255,0.25)",
        zIndex: 1,
      }}>
        © {new Date().getFullYear()} Yemenici
      </div>
    </div>
  );
}
