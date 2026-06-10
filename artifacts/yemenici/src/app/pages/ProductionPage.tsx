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

/* ─── Default multilingual content ─────────────────────────────────────── */
type ElDef = { section: string; title: Record<Lang, string>; body: Record<Lang, string> };

const ELEMENTS: ElDef[] = [
  {
    section: "prod_element_mixing",
    title: {
      en: "Compound Mixing",
      de: "Mischungsvorbereitung",
      tr: "Karışım Hazırlama",
    },
    body: {
      en: "In-house elastomer compound preparation covers ACM, ECO, FKM, NBR, and specialty grades. Closed-loop batch tracking ensures full traceability from raw material receipt to finished compound lot, supporting IATF 16949 requirements and enabling rapid root-cause analysis at every production stage.",
      de: "Die interne Elastomermischung umfasst ACM, ECO, FKM, NBR und Spezialqualitäten. Geschlossene Chargenverfolgung gewährleistet lückenlose Rückverfolgbarkeit vom Rohstoffeingang bis zum fertigen Mischungslos – konform mit IATF 16949.",
      tr: "İç bünyeli elastomer karışım hazırlama; ACM, ECO, FKM, NBR ve özel tipli kauçukları kapsar. Kapalı döngü parti takip sistemi, ham madde kabulünden bitmiş karışım lotuna kadar tam izlenebilirlik sağlar; IATF 16949 gereksinimlerini destekler.",
    },
  },
  {
    section: "prod_element_vulcanization",
    title: {
      en: "Vulcanization",
      de: "Vulkanisation",
      tr: "Vulkanizasyon",
    },
    body: {
      en: "Compression and transfer presses up to 1,500 tonnes, paired with injection moulding lines, handle the full spectrum from simple profiles to complex rubber-to-metal bonded assemblies with tight dimensional tolerances and high-volume repeatability.",
      de: "Kompression und Transferpressen bis 1.500 Tonnen, kombiniert mit Spritzgusslinien, decken alles ab – von einfachen Profilen bis hin zu komplexen Gummi-Metall-Verbundteilen mit engen Maßtoleranzen und hoher Reproduzierbarkeit.",
      tr: "1.500 tona kadar kompresyon ve transfer presler, enjeksiyon kalıplama hatlarıyla birlikte; basit profillerden sıkı boyutsal toleranslı ve yüksek hacimli karmaşık kauçuk-metal bağlantılı parçalara kadar tüm ürün yelpazesini kapsar.",
    },
  },
  {
    section: "prod_element_toolcenter",
    title: {
      en: "Tool Center",
      de: "Werkzeugzentrum",
      tr: "Takım Merkezi",
    },
    body: {
      en: "Five-axis CNC machining centres support complete in-house mould design, rapid prototyping, and tooling maintenance. Integrated tool lifecycle management reduces lead times and ensures consistent cavity geometry throughout the entire production run.",
      de: "Fünfachsige CNC-Bearbeitungszentren ermöglichen vollständiges internes Werkzeugdesign, Rapid Prototyping und Werkzeugwartung. Integriertes Werkzeug-Lebenszyklusmanagement reduziert Lieferzeiten und sichert gleichmäßige Kavitätsgeometrie.",
      tr: "Beş eksenli CNC işleme merkezleri; tam dahili kalıp tasarımı, hızlı prototipleme ve takım bakımını destekler. Entegre takım yaşam döngüsü yönetimi, temin sürelerini kısaltır ve üretim boyunca tutarlı boşluk geometrisini garanti eder.",
    },
  },
  {
    section: "prod_element_metalprep",
    title: {
      en: "Metal Preparation",
      de: "Metallvorbereitung",
      tr: "Metal Hazırlama",
    },
    body: {
      en: "Integrated sheet-metal bending, shot blasting, and phosphate coating lines pre-treat inserts to exact bonding specifications. Process-controlled surface preparation is validated per DIN EN ISO 8501 for reliable and durable rubber-to-metal adhesion.",
      de: "Integrierte Blechbiegung, Kugelstrahlung und Phosphatierung behandeln Einlegeteile nach exakten Bonding-Spezifikationen vor. Prozesskontrollierte Oberflächenvorbereitung wird nach DIN EN ISO 8501 validiert.",
      tr: "Entegre sac metal bükme, kumlama ve fosfat kaplama hatları, ek parçaları tam bağlanma spesifikasyonlarına göre ön işleme tabi tutar. DIN EN ISO 8501 standardına göre doğrulanan yüzey hazırlama, güvenilir ve kalıcı kauçuk-metal yapışması sağlar.",
    },
  },
];

/* ─── Accent colours per element ─────────────────────────────────────── */
const ACCENTS = ["#004FA3", "#1a3d6f", "#2d5a9e", "#1e4a8a"] as const;

/* ─── SVG placeholder icons ─────────────────────────────────────────── */
function MixingIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.4} style={{ width: 56, height: 56 }}>
      <circle cx={32} cy={32} r={20} strokeOpacity={0.25} />
      <path d="M32 12 C44 18 46 28 44 36 C42 44 32 52 32 52" strokeLinecap="round" />
      <path d="M32 12 C20 18 18 28 20 36 C22 44 32 52 32 52" strokeLinecap="round" />
      <circle cx={32} cy={32} r={4} fill="currentColor" fillOpacity={0.4} stroke="none" />
      <circle cx={32} cy={20} r={2.5} fill="currentColor" fillOpacity={0.6} stroke="none" />
    </svg>
  );
}
function VulcanIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.4} style={{ width: 56, height: 56 }}>
      <rect x={10} y={22} width={44} height={20} rx={2} strokeOpacity={0.25} />
      <rect x={18} y={27} width={28} height={10} rx={1.5} />
      <path d="M22 22 L22 14" strokeLinecap="round" />
      <path d="M32 22 L32 14" strokeLinecap="round" />
      <path d="M42 22 L42 14" strokeLinecap="round" />
      <path d="M22 42 L22 50" strokeLinecap="round" />
      <path d="M32 42 L32 50" strokeLinecap="round" />
      <path d="M42 42 L42 50" strokeLinecap="round" />
    </svg>
  );
}
function ToolIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.4} style={{ width: 56, height: 56 }}>
      <path d="M36 12 L52 28 L30 50 L14 34 Z" strokeLinejoin="round" />
      <path d="M12 52 L20 44" strokeLinecap="round" strokeWidth={3} />
      <circle cx={13} cy={51} r={3} />
      <path d="M40 8 L56 8 L56 24" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.3} />
    </svg>
  );
}
function MetalIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.4} style={{ width: 56, height: 56 }}>
      <rect x={10} y={18} width={44} height={28} rx={2} strokeOpacity={0.25} />
      <path d="M20 18 L20 10" strokeLinecap="round" />
      <path d="M44 18 L44 10" strokeLinecap="round" />
      <path d="M10 32 L54 32" />
      <path d="M29 18 L29 46" strokeOpacity={0.35} />
      <path d="M38 18 L38 46" strokeOpacity={0.35} />
    </svg>
  );
}
const ICONS = [MixingIcon, VulcanIcon, ToolIcon, MetalIcon];

/* ─── Intro strip labels ────────────────────────────────────────────── */
const INTRO: Record<Lang, { eye: string; heading: string; body: string }> = {
  en: {
    eye: "Production Capabilities",
    heading: "Integrated Production for Rubber",
    body: "We combine in-house rubber mixing, vulcanisation, tooling, and metal preparation under one roof — for complete traceability and quality control at every stage.",
  },
  de: {
    eye: "Produktionsbereiche",
    heading: "Integrierte Fertigung für Kautschuk",
    body: "Wir vereinen internes Kautschukmischen, Vulkanisation, Werkzeugherstellung und Metallvorbereitung unter einem Dach – für lückenlose Rückverfolgbarkeit und Qualitätskontrolle.",
  },
  tr: {
    eye: "Üretim Alanları",
    heading: "Kauçuk İçin Entegre Üretim",
    body: "Dahili kauçuk karıştırma, vulkanizasyon, takım merkezi ve metal hazırlamayı tek çatı altında birleştiriyoruz — her aşamada tam izlenebilirlik ve kalite kontrolü.",
  },
};

/* ─── Component ─────────────────────────────────────────────────────── */
export default function ProductionPage({
  sectionKey = "page_solutions_production",
}: {
  sectionKey?: string;
}) {
  const { lang } = useLanguage();
  const get = useAllContent();

  /* Hero values */
  const heroTitle   = get(sectionKey, "hero_title")    || "Production";
  const heroSub     = get(sectionKey, "hero_subtitle")  || "Solutions";
  const heroBgColor = get(sectionKey, "hero_bg_color")  || "#1e3a5f";
  const heroBgImage = get(sectionKey, "hero_bg_image")  || "";

  const intro = INTRO[lang];

  return (
    <Layout>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          width: "100%",
          height: 380,
          backgroundColor: heroBgColor,
          backgroundImage: heroBgImage ? `url(${heroBgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          paddingBottom: 56,
          paddingLeft: 32,
          paddingRight: 32,
          boxSizing: "border-box",
          position: "relative",
          transition: "background-color 0.4s ease",
        }}
      >
        {heroBgImage && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.44)" }} />
        )}
        <div
          style={{
            maxWidth: 1280, margin: "0 auto", width: "100%",
            position: "relative", zIndex: 1,
          }}
        >
          {heroSub && (
            <p
              style={{
                fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: 12,
                letterSpacing: 3, textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)", marginBottom: 14, marginTop: 0,
              }}
            >
              {heroSub}
            </p>
          )}
          <h1
            style={{
              fontFamily: "Poppins, sans-serif", fontWeight: 200,
              fontSize: 60, lineHeight: 1.1, color: "#ffffff", margin: 0,
            }}
          >
            {heroTitle}
          </h1>
        </div>
      </section>

      {/* ── Intro strip ──────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#f5f7fa",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p
                style={{
                  fontSize: 11, letterSpacing: "0.16em", fontWeight: 600,
                  color: "#004FA3", textTransform: "uppercase", marginBottom: 12,
                }}
              >
                {intro.eye}
              </p>
              <h2
                style={{
                  fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700,
                  color: "#0d1219", lineHeight: 1.2, margin: 0,
                }}
              >
                {intro.heading}
              </h2>
            </div>
            <p
              style={{
                fontSize: 14, lineHeight: 1.8, color: "#556",
                maxWidth: 440, margin: 0, fontWeight: 400, flexShrink: 0,
              }}
            >
              {intro.body}
            </p>
          </div>
        </div>
      </section>

      {/* ── 4 Production Elements — alternating split-screen ────────── */}
      <section style={{ fontFamily: "Poppins, sans-serif", scrollBehavior: "smooth" }}>
        {ELEMENTS.map((el, i) => {
          const Icon = ICONS[i];
          const accent = ACCENTS[i];
          const title = get(el.section, `title_${lang}`) || el.title[lang];
          const body  = get(el.section, `body_${lang}`)  || el.body[lang];
          const image = get(el.section, "image");
          const num   = String(i + 1).padStart(2, "0");

          /* i=0,2 → image LEFT; i=1,3 → image RIGHT (text LEFT) */
          const imageOnLeft = i % 2 === 0;
          /* Subtle gradient from image toward text for depth */
          const overlayGradient = imageOnLeft
            ? "to right, rgba(0,0,0,0.18), transparent"
            : "to left,  rgba(0,0,0,0.18), transparent";
          /* Alternate text-panel background for rhythm */
          const textBg = i % 2 === 0 ? "#f8f9fb" : "#ffffff";

          /* ── Image panel (always first in DOM → always on top on mobile) ── */
          const imagePanel = (
            <div
              className="relative overflow-hidden w-full md:w-1/2"
              style={{ minHeight: 340 }}
            >
              {image ? (
                <>
                  <img
                    src={image}
                    alt={title}
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover", display: "block",
                    }}
                  />
                  {/* directional depth overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(${overlayGradient})`,
                    pointerEvents: "none",
                  }} />
                </>
              ) : (
                /* Placeholder: solid accent + large SVG icon */
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundColor: accent,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ color: "rgba(255,255,255,0.22)", transform: "scale(2.8)" }}>
                    <Icon />
                  </div>
                  <span style={{
                    position: "absolute", bottom: 20, right: 28,
                    fontFamily: "Poppins, sans-serif", fontWeight: 800,
                    fontSize: 112, lineHeight: 1,
                    color: "rgba(255,255,255,0.06)",
                    userSelect: "none", pointerEvents: "none",
                  }}>
                    {num}
                  </span>
                </div>
              )}
            </div>
          );

          /* ── Text panel ──────────────────────────────────────────────── */
          const textPanel = (
            <div
              className="w-full md:w-1/2 flex items-center py-14 px-8 md:px-20 md:py-0"
              style={{ backgroundColor: textBg, minHeight: 340 }}
            >
              <div style={{ maxWidth: 480 }}>
                {/* Number badge + accent line */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, marginBottom: 22,
                }}>
                  <span style={{
                    display: "inline-block", width: 36, height: 2,
                    borderRadius: 2, backgroundColor: accent, flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: accent,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                  }}>
                    {num}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(22px, 2.4vw, 32px)",
                  color: "#0d1219",
                  margin: "0 0 18px",
                  lineHeight: 1.2,
                }}>
                  {title}
                </h3>

                <p style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 15,
                  lineHeight: 1.9,
                  color: "#4a5568",
                  margin: 0,
                }}>
                  {body}
                </p>
              </div>
            </div>
          );

          return (
            <div
              key={el.section}
              /* flex-col on mobile (image always on top via DOM order),
                 flex-row or flex-row-reverse on desktop for alternating pattern */
              className={`flex flex-col ${imageOnLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
              style={{
                minHeight: 560,
                borderBottom: i < ELEMENTS.length - 1
                  ? "1px solid rgba(0,0,0,0.06)"
                  : undefined,
              }}
            >
              {imagePanel}
              {textPanel}
            </div>
          );
        })}
      </section>

      {/* ── Contact block ────────────────────────────────────────────── */}
      <ContactBlock lang={lang} />
    </Layout>
  );
}
