import { useState, useEffect, useRef } from "react";
import { useLanguage, type Lang } from "../contexts/LanguageContext";

type ContentRow = { section: string; key: string; value: string };

function useCookieContent() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetch("/api/content")
      .then((r) => r.json())
      .then((all: ContentRow[]) => setRows(all.filter((r) => r.section === "legal_cookie")))
      .catch(() => {});
  }, []);
  return (key: string, fallback: string) =>
    rows.find((r) => r.key === key)?.value || fallback;
}

/* ─── Consent Storage ─── */
const CONSENT_KEY = "yemenici_cookie_consent";
const CONSENT_VERSION = "1.1";

interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
  version: string;
  savedAt: string;
}

function getStoredConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function storeConsent(analytics: boolean, marketing: boolean) {
  const c: CookieConsent = {
    analytics,
    marketing,
    version: CONSENT_VERSION,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
}

/* ─── Labels ─── */
const LABELS: Record<Lang, {
  title: string;
  desc: string;
  acceptAll: string;
  rejectAll: string;
  manage: string;
  savePrefs: string;
  essential_name: string;
  essential_desc: string;
  analytics_name: string;
  analytics_desc: string;
  marketing_name: string;
  marketing_desc: string;
  always_on: string;
  privacy: string;
  terms: string;
}> = {
  en: {
    title: "Cookie Preferences",
    desc: "We use cookies to improve your browsing experience, analyse site traffic, and serve personalised content. You can choose which categories you allow.",
    acceptAll: "Accept All Cookies",
    rejectAll: "Reject All Optional",
    manage: "Manage Preferences",
    savePrefs: "Save Preferences",
    essential_name: "Essential Cookies",
    essential_desc: "Required for the website to function properly. Cannot be disabled.",
    analytics_name: "Performance & Analytics",
    analytics_desc: "Help us understand how visitors interact with our website by collecting anonymised usage statistics.",
    marketing_name: "Marketing Cookies",
    marketing_desc: "Used to deliver personalised advertising and track the effectiveness of our campaigns.",
    always_on: "Always On",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
  },
  de: {
    title: "Cookie-Einstellungen",
    desc: "Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern, den Website-Traffic zu analysieren und personalisierte Inhalte bereitzustellen. Sie können wählen, welche Kategorien Sie zulassen.",
    acceptAll: "Alle Cookies akzeptieren",
    rejectAll: "Optionale ablehnen",
    manage: "Einstellungen verwalten",
    savePrefs: "Einstellungen speichern",
    essential_name: "Essentielle Cookies",
    essential_desc: "Für die ordnungsgemäße Funktion der Website erforderlich. Können nicht deaktiviert werden.",
    analytics_name: "Leistung & Analyse",
    analytics_desc: "Helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, indem anonymisierte Nutzungsstatistiken gesammelt werden.",
    marketing_name: "Marketing-Cookies",
    marketing_desc: "Werden verwendet, um personalisierte Werbung zu liefern und die Wirksamkeit unserer Kampagnen zu verfolgen.",
    always_on: "Immer aktiv",
    privacy: "Datenschutzerklärung",
    terms: "AGB",
  },
  tr: {
    title: "Çerez Tercihleri",
    desc: "Gezinme deneyiminizi iyileştirmek, site trafiğini analiz etmek ve kişiselleştirilmiş içerik sunmak için çerezler kullanıyoruz. Hangi kategorilere izin vereceğinizi seçebilirsiniz.",
    acceptAll: "Tüm Çerezleri Kabul Et",
    rejectAll: "Opsiyonelleri Reddet",
    manage: "Tercihleri Yönet",
    savePrefs: "Tercihleri Kaydet",
    essential_name: "Zorunlu Çerezler",
    essential_desc: "Web sitesinin düzgün çalışması için gereklidir. Devre dışı bırakılamaz.",
    analytics_name: "Performans & Analitik",
    analytics_desc: "Anonim kullanım istatistikleri toplayarak ziyaretçilerin web sitemizle nasıl etkileşime girdiğini anlamamıza yardımcı olur.",
    marketing_name: "Pazarlama Çerezleri",
    marketing_desc: "Kişiselleştirilmiş reklamlar sunmak ve kampanyalarımızın etkinliğini izlemek için kullanılır.",
    always_on: "Her Zaman Açık",
    privacy: "Gizlilik Politikası",
    terms: "Kullanım Koşulları",
  },
};

/* ─── Toggle ─── */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="relative flex-shrink-0"
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        background: value ? "#004FA3" : "#d1d5db",
        border: "none",
        cursor: "pointer",
        transition: "background 0.2s ease",
        padding: 0,
      }}
    >
      <span
        style={{
          display: "block",
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: 3,
          left: value ? 23 : 3,
          transition: "left 0.2s ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

/* ─── Category Row ─── */
function CategoryRow({
  name,
  desc,
  value,
  locked,
  alwaysOnLabel,
  onChange,
}: {
  name: string;
  desc: string;
  value: boolean;
  locked?: boolean;
  alwaysOnLabel: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: "16px 0",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 4 }}>{name}</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{desc}</p>
      </div>
      <div className="flex-shrink-0 flex items-center">
        {locked ? (
          <span style={{ fontSize: 11, fontWeight: 600, color: "#22c55e", letterSpacing: "0.06em" }}>
            {alwaysOnLabel}
          </span>
        ) : (
          <Toggle value={value} onChange={onChange} />
        )}
      </div>
    </div>
  );
}

/* ─── Banner ─── */
export default function CookieBanner() {
  const { lang } = useLanguage();
  const getDb = useCookieContent();
  const base = LABELS[lang];
  const t = {
    title:          getDb(`title_${lang}`, base.title),
    desc:           getDb(`desc_${lang}`, base.desc),
    acceptAll:      getDb(`acceptAll_${lang}`, base.acceptAll),
    rejectAll:      getDb(`rejectAll_${lang}`, base.rejectAll),
    manage:         getDb(`manage_${lang}`, base.manage),
    savePrefs:      getDb(`savePrefs_${lang}`, base.savePrefs),
    essential_name: getDb(`essential_name_${lang}`, base.essential_name),
    essential_desc: getDb(`essential_desc_${lang}`, base.essential_desc),
    analytics_name: getDb(`analytics_name_${lang}`, base.analytics_name),
    analytics_desc: getDb(`analytics_desc_${lang}`, base.analytics_desc),
    marketing_name: getDb(`marketing_name_${lang}`, base.marketing_name),
    marketing_desc: getDb(`marketing_desc_${lang}`, base.marketing_desc),
    always_on:      base.always_on,
    privacy:        base.privacy,
    terms:          base.terms,
  };
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setTimeout(() => {
        setVisible(true);
        setMounted(true);
      }, 800);
    } else {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
    }
  }, []);

  const accept = () => {
    storeConsent(true, true);
    setVisible(false);
  };

  const reject = () => {
    storeConsent(false, false);
    setVisible(false);
  };

  const save = () => {
    storeConsent(analytics, marketing);
    setVisible(false);
  };

  if (!mounted && !visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(11,22,40,0.97)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.4)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-5">
          {!expanded ? (
            /* Compact view */
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: 4 }}>
                  {t.title}
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 680 }}>
                  {t.desc}{" "}
                  <a href="/privacy-policy" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                    {t.privacy}
                  </a>
                  {" & "}
                  <a href="/terms-conditions" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                    {t.terms}
                  </a>
                  .
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={() => setExpanded(true)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "transparent",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s",
                  }}
                >
                  {t.manage}
                </button>
                <button
                  onClick={reject}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s",
                  }}
                >
                  {t.rejectAll}
                </button>
                <button
                  onClick={accept}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 10,
                    border: "none",
                    background: "#004FA3",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                    whiteSpace: "nowrap",
                    transition: "background 0.15s",
                  }}
                >
                  {t.acceptAll}
                </button>
              </div>
            </div>
          ) : (
            /* Expanded preferences view */
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: 4 }}>
                    {t.title}
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: 600 }}>
                    {t.desc}
                  </p>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.35)",
                    padding: 4,
                    marginLeft: 16,
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <div className="my-4">
                <CategoryRow
                  name={t.essential_name}
                  desc={t.essential_desc}
                  value={true}
                  locked={true}
                  alwaysOnLabel={t.always_on}
                  onChange={() => {}}
                />
                <CategoryRow
                  name={t.analytics_name}
                  desc={t.analytics_desc}
                  value={analytics}
                  alwaysOnLabel={t.always_on}
                  onChange={setAnalytics}
                />
                <CategoryRow
                  name={t.marketing_name}
                  desc={t.marketing_desc}
                  value={marketing}
                  alwaysOnLabel={t.always_on}
                  onChange={setMarketing}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  onClick={reject}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {t.rejectAll}
                </button>
                <button
                  onClick={accept}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {t.acceptAll}
                </button>
                <button
                  onClick={save}
                  style={{
                    padding: "8px 24px",
                    borderRadius: 10,
                    border: "none",
                    background: "#004FA3",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {t.savePrefs}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
