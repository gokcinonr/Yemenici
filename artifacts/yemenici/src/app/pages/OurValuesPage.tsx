import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ContactBlock from "../components/ContactBlock";
import { useLanguage, type Lang } from "../contexts/LanguageContext";

type ContentRow = { section: string; key: string; value: string };

function useContent() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then(setRows).catch(() => {});
  }, []);
  return (section: string, key: string, fallback = "") =>
    rows.find((c) => c.section === section && c.key === key)?.value || fallback;
}

/* ─── Values data ─────────────────────────────────────────────────────────── */
type ValueDef = {
  icon: React.ReactNode;
  title: Record<Lang, string>;
  desc: Record<Lang, string>;
  accent: string;
};

const STROKE = { fill: "none" as const, stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const VALUES: ValueDef[] = [
  {
    accent: "#004FA3",
    icon: (
      <svg viewBox="0 0 24 24" {...STROKE}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    title: { en: "Quality First", de: "Qualität zuerst", tr: "Önce Kalite" },
    desc: {
      en: "Every product leaves our facility only after passing our internal test protocol. Quality is not a department — it is embedded in every workstation, every shift, every decision.",
      de: "Jedes Produkt verlässt unser Werk erst nach Bestehen unseres internen Prüfprotokolls. Qualität ist keine Abteilung — sie ist in jedem Arbeitsplatz verankert.",
      tr: "Her ürün, iç test protokolümüzü geçtikten sonra tesisimizi terk eder. Kalite bir departman değil, her iş istasyonuna ve her karara işlenmiş bir ilkedir.",
    },
  },
  {
    accent: "#1a5fb4",
    icon: (
      <svg viewBox="0 0 24 24" {...STROKE}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: { en: "Customer Partnership", de: "Kundenpartnerschaft", tr: "Müşteri Ortaklığı" },
    desc: {
      en: "We treat every customer relationship as a long-term partnership. Open communication, reliable lead times, and technical transparency are the foundations we are measured against.",
      de: "Wir betrachten jede Kundenbeziehung als langfristige Partnerschaft. Offene Kommunikation, zuverlässige Lieferzeiten und technische Transparenz sind unsere Grundsätze.",
      tr: "Her müşteri ilişkisini uzun vadeli bir ortaklık olarak ele alırız. Açık iletişim, güvenilir teslim süreleri ve teknik şeffaflık ölçüldüğümüz temellerdir.",
    },
  },
  {
    accent: "#2563eb",
    icon: (
      <svg viewBox="0 0 24 24" {...STROKE}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    title: { en: "Continuous Improvement", de: "Kontinuierliche Verbesserung", tr: "Sürekli İyileştirme" },
    desc: {
      en: "Kaizen is not a slogan here — it is a scheduled practice. Weekly improvement cycles, SPC monitoring, and 8D corrective actions ensure our processes never stagnate.",
      de: "Kaizen ist hier kein Slogan — es ist eine geplante Praxis. Wöchentliche Verbesserungszyklen und 8D-Korrekturmaßnahmen stellen sicher, dass unsere Prozesse nie stagnieren.",
      tr: "Kaizen burada bir slogan değil, planlanmış bir uygulamadır. Haftalık iyileştirme döngüleri ve 8D düzeltici eylemler süreçlerimizin asla durağanlaşmamasını sağlar.",
    },
  },
  {
    accent: "#1d4ed8",
    icon: (
      <svg viewBox="0 0 24 24" {...STROKE}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    title: { en: "People & Safety", de: "Menschen & Sicherheit", tr: "İnsan & Güvenlik" },
    desc: {
      en: "Our workforce is our most valued asset. A safe, respectful workplace and continuous training programmes are non-negotiable — not because the law requires it, but because we believe it.",
      de: "Unsere Belegschaft ist unser wertvollstes Asset. Ein sicherer, respektvoller Arbeitsplatz und Trainingsprogramme sind nicht verhandelbar — weil wir es glauben.",
      tr: "Çalışanlarımız en değerli varlığımızdır. Güvenli, saygılı bir çalışma ortamı ve sürekli eğitim programları tartışılmaz — bunu inanç olarak benimsedik.",
    },
  },
];

function ValueCard({ icon, title, desc, accent }: { icon: React.ReactNode; title: string; desc: string; accent: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "40px 36px",
        borderRadius: 20,
        backgroundColor: "#ffffff",
        border: `1px solid ${hovered ? accent + "30" : "#e5e7eb"}`,
        boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.08)` : "none",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: hovered ? accent : "#f1f5f9",
          color: hovered ? "#ffffff" : "#475569",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
          transition: "background-color 0.25s, color 0.25s",
          flexShrink: 0,
        }}
      >
        <div style={{ width: 24, height: 24 }}>{icon}</div>
      </div>
      <h3 style={{ fontWeight: 600, fontSize: 18, color: "#0d1219", marginBottom: 14, marginTop: 0, letterSpacing: "-0.01em" }}>
        {title}
      </h3>
      <p style={{ fontWeight: 300, fontSize: 14, color: "#64748b", lineHeight: 1.85, margin: 0 }}>
        {desc}
      </p>
    </div>
  );
}

export default function OurValuesPage() {
  const { lang } = useLanguage();
  const get = useContent();

  const heroTitle    = get("page_company_values", "hero_title")    || { en: "Our Values", de: "Unsere Werte", tr: "Değerlerimiz" }[lang];
  const heroSubtitle = get("page_company_values", "hero_subtitle") || {
    en: "The principles that guide every decision — from compound formulation to customer delivery.",
    de: "Die Prinzipien, die jede Entscheidung leiten — von der Mischungsformulierung bis zur Kundenlieferung.",
    tr: "Bileşik formülasyonundan müşteri teslimatına kadar her kararı yönlendiren ilkeler.",
  }[lang];
  const heroBgColor = get("page_company_values", "hero_bg_color") || "#0a1628";
  const heroBgImage = get("page_company_values", "hero_bg_image");
  const overviewBody = get("page_company_values", `overview_body_${lang}`) || {
    en: "Our values are not statements on a wall — they are the operating principles that shape how we design, manufacture, and support every rubber component that leaves our facility. They have guided us through decades of growth and continue to define what it means to be a Yemenici partner.",
    de: "Unsere Werte sind keine Aussagen an der Wand — sie sind die Betriebsprinzipien, die unsere Arbeit formen. Sie haben uns durch Jahrzehnte des Wachstums begleitet.",
    tr: "Değerlerimiz duvardaki ifadeler değil, her tasarımı, üretimi ve müşteri desteğini şekillendiren işletme ilkeleridir. Onlar onlarca yıllık büyümemize rehberlik etmiştir.",
  }[lang];

  return (
    <Layout>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: 520,
          backgroundColor: heroBgColor,
          backgroundImage: heroBgImage ? `url(${heroBgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,10,22,0.92) 0%, rgba(4,10,22,0.45) 50%, rgba(4,10,22,0.12) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", width: "100%", padding: "0 48px 80px", boxSizing: "border-box" }}>
          <p style={{ fontWeight: 600, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", marginBottom: 20, marginTop: 0 }}>
            Company · Values
          </p>
          <h1 style={{ fontWeight: 200, fontSize: "clamp(48px, 7vw, 82px)", lineHeight: 1.0, color: "#ffffff", margin: "0 0 22px", letterSpacing: "-0.01em" }}>
            {heroTitle}
          </h1>
          <p style={{ fontWeight: 400, fontSize: "clamp(14px, 1.5vw, 17px)", color: "rgba(255,255,255,0.55)", maxWidth: 560, lineHeight: 1.6, margin: 0 }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#ffffff", padding: "96px 0 72px", fontFamily: "Poppins, sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", gap: 80, alignItems: "flex-start", marginBottom: 64 }}>
            <div style={{ flexShrink: 0, width: 200, paddingTop: 4 }}>
              <div style={{ width: 36, height: 2, backgroundColor: "#004FA3", marginBottom: 20 }} />
              <p style={{ fontWeight: 300, fontSize: 24, lineHeight: 1.25, color: "#0d1219", margin: 0 }}>
                {lang === "de" ? "Was uns\nleitet" : lang === "tr" ? "Bizi\nYönlendiren" : "What\nGuides Us"}
              </p>
            </div>
            <div style={{ flex: 1, maxWidth: 640 }}>
              <p style={{ fontWeight: 300, fontSize: 17, lineHeight: 1.9, color: "#2c3e50", margin: 0 }}>
                {overviewBody}
              </p>
            </div>
          </div>

          {/* Values grid — 2×2 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {VALUES.map((v, i) => (
              <ValueCard
                key={i}
                icon={v.icon}
                title={v.title[lang]}
                desc={v.desc[lang]}
                accent={v.accent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <ContactBlock lang={lang} />

    </Layout>
  );
}
