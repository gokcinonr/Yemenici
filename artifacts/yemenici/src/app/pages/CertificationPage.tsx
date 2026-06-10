import { useState, useEffect } from "react";
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

/* ─── Flag buttons ─────────────────────────────────────────────────────────── */
type FlagEntry = { flag: string; lang: string; url: string };

function FlagDownloadButton({ flag, lang, url }: FlagEntry) {
  const [hovered, setHovered] = useState(false);
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: 8,
        border: `1px solid ${hovered ? "#004FA3" : "#e5e7eb"}`,
        backgroundColor: hovered ? "#f0f5ff" : "#ffffff",
        color: hovered ? "#004FA3" : "#374151",
        textDecoration: "none",
        fontFamily: "Poppins, sans-serif",
        fontWeight: 600,
        fontSize: 12,
        letterSpacing: "0.03em",
        transition: "all 0.18s ease",
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{flag}</span>
      <span>{lang}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </a>
  );
}

/* ─── Cert card ─────────────────────────────────────────────────────────────── */
type CertData = {
  title: string;
  image_url: string;
  pdf_en: string;
  pdf_de: string;
  pdf_tr: string;
};

function CertCard({ cert }: { cert: CertData }) {
  const [hovered, setHovered] = useState(false);
  const hasPdf = cert.pdf_en || cert.pdf_de || cert.pdf_tr;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#ffffff",
        border: `1px solid ${hovered ? "rgba(0,79,163,0.18)" : "rgba(0,0,0,0.07)"}`,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.10)" : "0 2px 12px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Preview image area */}
      <div
        style={{
          height: 200,
          backgroundColor: "#f8f9fb",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {cert.image_url ? (
          <img
            src={cert.image_url}
            alt={cert.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #0a1628 0%, #1a3d6f 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, letterSpacing: "0.12em", fontWeight: 600 }}>
              CERTIFICATE
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "24px 24px 28px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        <h3
          style={{
            fontWeight: 600,
            fontSize: 15,
            color: "#0d1219",
            lineHeight: 1.4,
            margin: 0,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {cert.title}
        </h3>

        {/* Flag download buttons */}
        {hasPdf ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <FlagDownloadButton flag="🇬🇧" lang="EN" url={cert.pdf_en} />
            <FlagDownloadButton flag="🇩🇪" lang="DE" url={cert.pdf_de} />
            <FlagDownloadButton flag="🇹🇷" lang="TR" url={cert.pdf_tr} />
          </div>
        ) : (
          <p style={{ fontSize: 12, color: "#adb5bd", fontStyle: "italic", margin: 0 }}>
            Documents coming soon
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Default certs shown when DB is empty ─────────────────────────────────── */
const DEFAULT_CERTS: CertData[] = [
  {
    title: "ISO 9001:2015 – Quality Management System",
    image_url: "",
    pdf_en: "",
    pdf_de: "",
    pdf_tr: "",
  },
  {
    title: "IATF 16949:2016 – Automotive Quality Management System",
    image_url: "",
    pdf_en: "",
    pdf_de: "",
    pdf_tr: "",
  },
];

const DEFAULT_OVERVIEW: Record<Lang, string> = {
  en: "Yemenici's quality management system operates under internationally recognised certifications that validate both our general industrial processes and our automotive-specific production standards. Our ISO 9001:2015 certification confirms robust, customer-focused quality management, while IATF 16949:2016 extends these assurances to automotive supply-chain requirements. All certification documents are available for direct download in English, German, and Turkish below.",
  de: "Das Qualitätsmanagementsystem von Yemenici wird durch international anerkannte Zertifizierungen gestützt, die sowohl unsere allgemeinen industriellen Prozesse als auch unsere automobil­spezifischen Produktionsstandards belegen. ISO 9001:2015 bestätigt ein robustes, kundenorientiertes Qualitätsmanagement; IATF 16949:2016 erweitert diese Anforderungen auf die Automobilzulieferkette.",
  tr: "Yemenici'nin kalite yönetim sistemi, hem genel endüstriyel süreçlerimizi hem de otomotiv sektörüne özgü üretim standartlarımızı doğrulayan uluslararası alanda tanınan sertifikasyonlara dayanmaktadır. ISO 9001:2015 sertifikası müşteri odaklı kalite yönetimini; IATF 16949:2016 ise bu gereksinimleri otomotiv tedarik zincirine genişletmektedir.",
};

/* ─── Main page ─────────────────────────────────────────────────────────────── */
export default function CertificationPage() {
  const { lang } = useLanguage();
  const get = useAllContent();
  const [certs, setCerts] = useState<CertData[]>([]);
  const [certsLoaded, setCertsLoaded] = useState(false);

  // Fetch cert data once content is available
  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((rows: ContentRow[]) => {
        const getVal = (section: string, key: string) =>
          rows.find((c) => c.section === section && c.key === key)?.value || "";

        const countStr = getVal("page_quality_certification", "cert_count");
        const count = parseInt(countStr, 10) || 0;

        if (count === 0) {
          setCerts([]);
        } else {
          const loaded: CertData[] = [];
          for (let i = 1; i <= count; i++) {
            const section = `cert_${i}`;
            const title = getVal(section, "title");
            if (title) {
              loaded.push({
                title,
                image_url: getVal(section, "image_url"),
                pdf_en: getVal(section, "pdf_en"),
                pdf_de: getVal(section, "pdf_de"),
                pdf_tr: getVal(section, "pdf_tr"),
              });
            }
          }
          setCerts(loaded);
        }
        setCertsLoaded(true);
      })
      .catch(() => setCertsLoaded(true));
  }, []);

  const heroTitle    = get("page_quality_certification", "hero_title")    || "Certified for Global Standards";
  const heroSubtitle = get("page_quality_certification", "hero_subtitle") || {
    en: "ISO 9001:2015 · IATF 16949:2016 Certified Quality Management",
    de: "ISO 9001:2015 · IATF 16949:2016 Zertifiziertes Qualitätsmanagement",
    tr: "ISO 9001:2015 · IATF 16949:2016 Sertifikalı Kalite Yönetimi",
  }[lang];
  const heroBgColor  = get("page_quality_certification", "hero_bg_color") || "#0a1628";
  const heroBgImage  = get("page_quality_certification", "hero_bg_image");
  const overview     = get("page_quality_certification", `overview_${lang}`) || DEFAULT_OVERVIEW[lang];

  const displayCerts = certsLoaded && certs.length > 0 ? certs : DEFAULT_CERTS;

  return (
    <Layout>

      {/* ── 1. HERO ───────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: 540,
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
            Quality · Certification
          </p>
          <h1
            style={{
              fontWeight: 200,
              fontSize: "clamp(48px, 7vw, 82px)",
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
              fontSize: "clamp(14px, 1.5vw, 17px)",
              color: "rgba(255,255,255,0.55)",
              maxWidth: 500,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── 2. CERTIFICATION OVERVIEW ─────────────────────────────────────── */}
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
            display: "flex",
            gap: 80,
            alignItems: "flex-start",
          }}
        >
          {/* Left label column */}
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
              Our Credentials
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
              {lang === "de" ? "Zertifizierungs­übersicht" : lang === "tr" ? "Sertifikasyon\nGenel Bakış" : "Certification\nOverview"}
            </p>
          </div>

          {/* Right text column */}
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
              {overview}
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. DOWNLOAD GRID ──────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#f8f9fb",
          padding: "0 0 100px",
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
          {/* Section label row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 40,
              paddingTop: 16,
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              marginBottom: 40,
            }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#9ca3af",
                margin: 0,
              }}
            >
              Download Certificates
            </p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, fontFamily: "Poppins, sans-serif" }}>
              {lang === "de" ? "Verfügbar in EN, DE, TR" : lang === "tr" ? "EN, DE, TR dillerinde mevcut" : "Available in EN, DE, TR"}
            </p>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {displayCerts.map((cert, i) => (
              <CertCard key={i} cert={cert} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CONTACT ────────────────────────────────────────────────────── */}
      <ContactBlock lang={lang} />

    </Layout>
  );
}
