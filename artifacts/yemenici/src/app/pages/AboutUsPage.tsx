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

const DEFAULTS = {
  hero_title:    { en: "About Us", de: "Über uns", tr: "Hakkımızda" },
  hero_subtitle: {
    en: "A global rubber manufacturer built on precision engineering and long-term partnerships.",
    de: "Ein globaler Kautschukhersteller, aufgebaut auf Präzisionstechnik und langfristigen Partnerschaften.",
    tr: "Hassas mühendislik ve uzun vadeli ortaklıklar üzerine kurulu küresel bir kauçuk üreticisi.",
  },
  overview_label: { en: "Our Story", de: "Unsere Geschichte", tr: "Hikayemiz" },
  overview_body: {
    en: "Yemenici has been engineering precision rubber components since 1987. Founded in Turkey, we have grown from a regional supplier to an international manufacturer serving automotive, industrial, and agricultural sectors across more than 25 countries. Our vertically integrated production — spanning compound development, precision moulding, and in-house testing — ensures every component meets the exacting standards our customers rely on. Decades of metallurgical and polymer expertise give us the depth to solve complex sealing and vibration challenges that off-the-shelf solutions cannot address.",
    de: "Yemenici entwickelt seit 1987 Präzisionskautschukkomponenten. Gegründet in der Türkei, hat sich unser Unternehmen von einem regionalen Lieferanten zu einem internationalen Hersteller entwickelt, der Automotive-, Industrie- und Agrarsektoren in über 25 Ländern bedient. Unsere vertikal integrierte Produktion — von der Mischungsentwicklung bis zur Inhouse-Prüfung — garantiert, dass jedes Bauteil die hohen Anforderungen unserer Kunden erfüllt.",
    tr: "Yemenici, 1987'den bu yana hassas kauçuk bileşenler üretmektedir. Türkiye'de kurulan şirketimiz, bölgesel bir tedarikçiden 25'ten fazla ülkede otomotiv, endüstriyel ve tarımsal sektörlere hizmet veren uluslararası bir üreticiye dönüşmüştür. Bileşik geliştirmeden hassas kalıplamaya ve yerinde teste kadar uzanan dikey entegre üretimimiz, her bileşenin müşterilerimizin güvendiği yüksek standartları karşılamasını sağlar.",
  },
  report_title: {
    en: "Vertical Integration",
    de: "Vertikale Integration",
    tr: "Dikey Entegrasyon",
  },
  report_body: {
    en: "From raw polymer selection and compound formulation through precision vulcanisation to final inspection and logistics — every stage is controlled under one roof. This integration eliminates supply-chain gaps, accelerates time-to-part, and gives our engineers direct influence over every quality variable.",
    de: "Von der Rohstoffauswahl und Mischungsformulierung über die Präzisionsvulkanisation bis zur Endkontrolle und Logistik — jeder Schritt wird unter einem Dach kontrolliert. Diese Integration beseitigt Lieferkettenlücken, verkürzt die Time-to-Part und gibt unseren Ingenieuren direkten Einfluss auf jede Qualitätsvariable.",
    tr: "Ham polimer seçimi ve bileşik formülasyonundan hassas vulkanizasyona, nihai denetime ve lojistiğe kadar — her aşama tek çatı altında kontrol edilir. Bu entegrasyon, tedarik zinciri boşluklarını ortadan kaldırır, parçaya ulaşma süresini hızlandırır ve mühendislerimize her kalite değişkeni üzerinde doğrudan etki sağlar.",
  },
};

const STATS: Array<{ label: Record<Lang, string>; value: string }> = [
  { label: { en: "Year Founded", de: "Gründungsjahr", tr: "Kuruluş Yılı" }, value: "1987" },
  { label: { en: "Export Markets", de: "Exportmärkte", tr: "İhracat Pazarları" }, value: "25+" },
  { label: { en: "Active Product Lines", de: "Aktive Produktlinien", tr: "Aktif Ürün Hatları" }, value: "500+" },
  { label: { en: "Quality Certifications", de: "Qualitätszertifizierungen", tr: "Kalite Sertifikası" }, value: "ISO" },
];

export default function AboutUsPage() {
  const { lang } = useLanguage();
  const get = useContent();

  const heroTitle    = get("page_company_about", "hero_title")    || DEFAULTS.hero_title[lang];
  const heroSubtitle = get("page_company_about", "hero_subtitle") || DEFAULTS.hero_subtitle[lang];
  const heroBgColor  = get("page_company_about", "hero_bg_color") || "#0a1628";
  const heroBgImage  = get("page_company_about", "hero_bg_image");
  const overviewLabel = get("page_company_about", `overview_label_${lang}`) || DEFAULTS.overview_label[lang];
  const overviewBody  = get("page_company_about", `overview_body_${lang}`)  || DEFAULTS.overview_body[lang];
  const reportTitle   = get("page_company_about", `report_title_${lang}`)   || DEFAULTS.report_title[lang];
  const reportBody    = get("page_company_about", `report_body_${lang}`)    || DEFAULTS.report_body[lang];

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
            Company · About
          </p>
          <h1 style={{ fontWeight: 200, fontSize: "clamp(48px, 7vw, 82px)", lineHeight: 1.0, color: "#ffffff", margin: "0 0 22px", letterSpacing: "-0.01em" }}>
            {heroTitle}
          </h1>
          <p style={{ fontWeight: 400, fontSize: "clamp(14px, 1.5vw, 17px)", color: "rgba(255,255,255,0.55)", maxWidth: 560, lineHeight: 1.6, margin: 0 }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── COMPANY OVERVIEW (600-layout) ────────────────────────────────── */}
      <section style={{ backgroundColor: "#ffffff", padding: "96px 0", fontFamily: "Poppins, sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, width: 200, paddingTop: 4 }}>
              <div style={{ width: 36, height: 2, backgroundColor: "#004FA3", marginBottom: 20 }} />
              <p style={{ fontWeight: 300, fontSize: 24, lineHeight: 1.25, color: "#0d1219", margin: 0 }}>
                {overviewLabel}
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 300, fontSize: 17, lineHeight: 1.9, color: "#2c3e50", margin: 0 }}>
                {overviewBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f9fb", padding: "60px 0", fontFamily: "Poppins, sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", boxSizing: "border-box" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {STATS.map((s, i) => (
              <StatCard key={i} value={s.value} label={s.label[lang]} />
            ))}
          </div>
        </div>
      </section>

      {/* ── VERTICAL INTEGRATION (dark) ──────────────────────────────────── */}
      <section style={{ backgroundColor: "#0a1628", padding: "80px 0", fontFamily: "Poppins, sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, width: 200, paddingTop: 4 }}>
              <div style={{ width: 36, height: 2, backgroundColor: "#4a7cbf", marginBottom: 20 }} />
              <p style={{ fontWeight: 300, fontSize: 22, lineHeight: 1.25, color: "#ffffff", margin: 0 }}>
                {reportTitle}
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 300, fontSize: 16, lineHeight: 1.9, color: "rgba(255,255,255,0.62)", margin: 0 }}>
                {reportBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <ContactBlock lang={lang} />

    </Layout>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "40px 32px",
        borderLeft: `3px solid ${hovered ? "#004FA3" : "transparent"}`,
        backgroundColor: hovered ? "#ffffff" : "transparent",
        transition: "border-color 0.22s, background-color 0.22s",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <p style={{ fontWeight: 200, fontSize: 52, lineHeight: 1, color: "#0d1219", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
        {value}
      </p>
      <p style={{ fontWeight: 500, fontSize: 12, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
        {label}
      </p>
    </div>
  );
}
