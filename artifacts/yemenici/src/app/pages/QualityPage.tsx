import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ContactBlock from "../components/ContactBlock";
import { useLanguage, type Lang } from "../contexts/LanguageContext";

type ContentRow = { section: string; key: string; value: string };

function useAllContent() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then(setRows)
      .catch(() => {});
  }, []);
  return (section: string, key: string, fallback = "") =>
    rows.find((c) => c.section === section && c.key === key)?.value || fallback;
}

/* ─── Icons ────────────────────────────────────────────────────────────────── */
function FocusIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function ProcessIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" />
    </svg>
  );
}
function ImproveIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

/* ─── Principle Config ──────────────────────────────────────────────────────── */
type PrincipleDef = {
  section: string;
  Icon: () => React.JSX.Element;
  accentBg: string;
  defaultTitle: Record<Lang, string>;
  defaultBody: Record<Lang, string>;
};

const PRINCIPLES: PrincipleDef[] = [
  {
    section: "quality_principle_focus",
    Icon: FocusIcon,
    accentBg: "#004FA3",
    defaultTitle: { en: "Customer Focus", de: "Kundenorientierung", tr: "Müşteri Odaklılık" },
    defaultBody: {
      en: "Every component we design and manufacture is developed with the end-user's performance and safety at its core. Customer requirements drive our specification, process planning, and final validation procedures from the earliest engineering stage.",
      de: "Jede Komponente, die wir entwickeln und herstellen, wird mit der Leistung und Sicherheit des Endanwenders im Mittelpunkt entwickelt. Kundenanforderungen bestimmen unsere Spezifikation und Validierungsverfahren.",
      tr: "Tasarladığımız ve ürettiğimiz her bileşen, son kullanıcının performansı ve güvenliği ön planda tutularak geliştirilmektedir. Müşteri gereksinimleri; spesifikasyon, proses planlama ve nihai doğrulama süreçlerimizi yönlendirir.",
    },
  },
  {
    section: "quality_principle_process",
    Icon: ProcessIcon,
    accentBg: "#1a3d6f",
    defaultTitle: { en: "Process-Based Thinking", de: "Prozessbasiertes Denken", tr: "Süreç Tabanlı Düşünce" },
    defaultBody: {
      en: "Systematic, documented process management ensures full repeatability and traceability from raw-material receipt through final dispatch. FMEA-driven risk assessment and control plans govern every production step without exception.",
      de: "Systematisches Prozessmanagement sichert Reproduzierbarkeit und Rückverfolgbarkeit vom Rohstoffeingang bis zur Auslieferung. FMEA-getriebene Risikobeurteilung und Kontrollpläne regeln jeden Produktionsschritt.",
      tr: "Sistematik proses yönetimi, ham madde kabulünden nihai sevkiyata kadar tam tekrarlanabilirlik ve izlenebilirlik sağlar. FMEA tabanlı risk değerlendirmesi ve kontrol planları her üretim adımını yönetir.",
    },
  },
  {
    section: "quality_principle_improve",
    Icon: ImproveIcon,
    accentBg: "#2d5a9e",
    defaultTitle: { en: "Continuous Improvement", de: "Kontinuierliche Verbesserung", tr: "Sürekli İyileştirme" },
    defaultBody: {
      en: "Structured 8D problem-solving, SPC monitoring, and annual management reviews ensure every nonconformance drives a measurable improvement cycle — not just a corrective action. We measure what matters and act on the data.",
      de: "Strukturierte 8D-Problemlösung und SPC-Überwachung stellen sicher, dass jede Nichtkonformität einen messbaren Verbesserungszyklus antreibt — nicht nur eine Korrekturmaßnahme.",
      tr: "Yapılandırılmış 8D problem çözme ve SPC izleme, her uygunsuzluğun ölçülebilir bir iyileştirme döngüsü oluşturmasını sağlar. Önemli olanı ölçer ve verilere göre hareket ederiz.",
    },
  },
  {
    section: "quality_principle_compliance",
    Icon: ShieldIcon,
    accentBg: "#003d80",
    defaultTitle: { en: "Standards Alignment", de: "Normenanpassung", tr: "Standartlara Uyum" },
    defaultBody: {
      en: "Our quality management system is certified to ISO 9001:2015 and IATF 16949:2016. These frameworks form the structural backbone of our auditing, supplier qualification, and product release routines — reviewed and re-certified on schedule.",
      de: "Unser QMS ist nach ISO 9001:2015 und IATF 16949:2016 zertifiziert. Diese Frameworks bilden das Rückgrat unserer Auditierungen, Lieferantenqualifizierung und Produktfreigaben.",
      tr: "Kalite yönetim sistemimiz ISO 9001:2015 ve IATF 16949:2016 ile sertifikalandırılmıştır. Bu çerçeveler, denetim, tedarikçi yeterliliği ve ürün onay süreçlerimizin yapısal temelini oluşturur.",
    },
  },
];

const DEFAULT_INTRO: Record<Lang, string> = {
  en: "At Yemenici, quality is not an afterthought — it is the foundation of every engineering decision we make. From compound selection to final dimensional inspection, every step is controlled, documented, and continuously improved against the world's leading automotive and industrial standards.",
  de: "Bei Yemenici ist Qualität kein Nachgedanke — sie ist die Grundlage jeder Ingenieurentscheidung. Von der Compoundauswahl bis zur abschließenden Maßprüfung ist jeder Schritt kontrolliert, dokumentiert und kontinuierlich verbessert.",
  tr: "Yemenici'de kalite bir düşünce değil — her mühendislik kararımızın temelidir. Karışım seçiminden nihai boyutsal kontrole kadar her adım kontrol edilmekte, belgelenmekte ve sürekli iyileştirilmektedir.",
};

const DEFAULT_STANDARDS: Record<Lang, string> = {
  en: "ISO 9001:2015  ·  IATF 16949:2016  ·  ISO 14001:2015",
  de: "ISO 9001:2015  ·  IATF 16949:2016  ·  ISO 14001:2015",
  tr: "ISO 9001:2015  ·  IATF 16949:2016  ·  ISO 14001:2015",
};

/* ─── Principle Card ────────────────────────────────────────────────────────── */
function PrincipleCard({
  Icon,
  accentBg,
  title,
  body,
  index,
}: {
  Icon: () => React.JSX.Element;
  accentBg: string;
  title: string;
  body: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#ffffff",
        border: `1px solid ${hovered ? "rgba(0,79,163,0.18)" : "rgba(0,0,0,0.07)"}`,
        borderRadius: 20,
        padding: "36px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 16px 40px rgba(0,0,0,0.10)"
          : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Icon + number row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            backgroundColor: accentBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            flexShrink: 0,
          }}
        >
          <Icon />
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.14em",
            color: "rgba(0,0,0,0.14)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Text */}
      <div>
        <h3
          style={{
            fontWeight: 600,
            fontSize: 18,
            color: "#0d1219",
            marginBottom: 12,
            lineHeight: 1.25,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontWeight: 400,
            fontSize: 14,
            color: "#5a6475",
            lineHeight: 1.8,
            margin: 0,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────────── */
export default function QualityPage() {
  const { lang } = useLanguage();
  const get = useAllContent();

  const heroTitle    = get("page_quality", "hero_title")    || "Quality That Performs";
  const heroSubtitle = get("page_quality", "hero_subtitle") || {
    en: "Certified Quality Systems Built for Demanding Industries",
    de: "Zertifizierte Qualitätssysteme für Anspruchsvolle Industrien",
    tr: "Zorlu Sektörler İçin Sertifikalı Kalite Sistemleri",
  }[lang];
  const heroBgColor  = get("page_quality", "hero_bg_color") || "#0a1628";
  const heroBgImage  = get("page_quality", "hero_bg_image");

  const intro     = get("page_quality", `intro_${lang}`)     || DEFAULT_INTRO[lang];
  const standards = get("page_quality", `standards_${lang}`) || DEFAULT_STANDARDS[lang];

  const principles = PRINCIPLES.map((p) => ({
    ...p,
    title: get(p.section, `title_${lang}`) || p.defaultTitle[lang],
    body:  get(p.section, `body_${lang}`)  || p.defaultBody[lang],
  }));

  return (
    <Layout>

      {/* ── 1. HERO ───────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: 560,
          backgroundColor: heroBgColor,
          backgroundImage: heroBgImage ? `url(${heroBgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(4,10,22,0.93) 0%, rgba(4,10,22,0.50) 45%, rgba(4,10,22,0.16) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: 1280,
            margin: "0 auto",
            width: "100%",
            padding: "0 48px 80px",
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.42)",
              marginBottom: 20,
              marginTop: 0,
            }}
          >
            Quality · Standards
          </p>
          <h1
            style={{
              fontWeight: 200,
              fontSize: "clamp(52px, 7.5vw, 88px)",
              lineHeight: 1.0,
              color: "#ffffff",
              margin: "0 0 22px",
              letterSpacing: "-0.01em",
            }}
          >
            {heroTitle}
          </h1>
          <p
            style={{
              fontWeight: 400,
              fontSize: "clamp(14px, 1.6vw, 18px)",
              color: "rgba(255,255,255,0.58)",
              maxWidth: 520,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── 2. QUALITY OVERVIEW ───────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#ffffff",
          padding: "100px 0 80px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 48px",
            boxSizing: "border-box",
          }}
        >
          {/* Section header + intro */}
          <div
            style={{
              display: "flex",
              gap: 80,
              alignItems: "flex-start",
              marginBottom: 72,
            }}
          >
            <div style={{ flexShrink: 0, width: 200, paddingTop: 6 }}>
              <div style={{ width: 36, height: 2, backgroundColor: "#004FA3", marginBottom: 22 }} />
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#004FA3",
                  marginBottom: 14,
                  marginTop: 0,
                }}
              >
                Our Principles
              </p>
              <p
                style={{
                  fontWeight: 300,
                  fontSize: 26,
                  lineHeight: 1.25,
                  color: "#0d1219",
                  margin: 0,
                }}
              >
                {lang === "de" ? "Qualitäts­übersicht" : lang === "tr" ? "Kalite Genel\nBakış" : "Quality\nOverview"}
              </p>
            </div>
            <div style={{ flex: 1, maxWidth: 640 }}>
              <p
                style={{
                  fontWeight: 300,
                  fontSize: "clamp(16px, 1.5vw, 19px)",
                  lineHeight: 1.9,
                  color: "#2c3e50",
                  margin: 0,
                }}
              >
                {intro}
              </p>
            </div>
          </div>

          {/* Principles grid — 2×2 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 24,
              marginBottom: 0,
            }}
          >
            {principles.map((p, i) => (
              <PrincipleCard
                key={p.section}
                Icon={p.Icon}
                accentBg={p.accentBg}
                title={p.title}
                body={p.body}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. STANDARDS COMPLIANCE STRIP ────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#0a1628",
          padding: "40px 0",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 48px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              margin: 0,
              flexShrink: 0,
            }}
          >
            Certifications
          </p>
          <div
            style={{
              width: 1,
              height: 24,
              backgroundColor: "rgba(255,255,255,0.12)",
              flexShrink: 0,
            }}
          />
          {standards.split("·").map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {i > 0 && (
                <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 16 }}>·</span>
              )}
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.75)",
                  letterSpacing: "0.04em",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {s.trim()}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. CONTACT ────────────────────────────────────────────────────── */}
      <ContactBlock lang={lang} />

    </Layout>
  );
}
