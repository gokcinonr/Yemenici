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

/* ─── Types ─── */
type ElDef = { section: string; title: Record<Lang, string>; body: Record<Lang, string> };

/* ─── Element data ─── */
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

/* ─── Hero defaults ─── */
const HERO_DEFAULTS: Record<Lang, { title: string; subtitle: string; breadcrumb: string }> = {
  en: {
    title: "Integrated Production for Rubber",
    subtitle: "We combine in-house rubber mixing, metal processing, tooling, and vulcanization to deliver complete and consistent component manufacturing.",
    breadcrumb: "Solutions · Production",
  },
  de: {
    title: "Integrierte Gummifertigung",
    subtitle: "Wir vereinen internes Kautschukmischen, Metallbearbeitung, Werkzeugbau und Vulkanisation für eine vollständige und konsistente Komponentenfertigung.",
    breadcrumb: "Solutions · Produktion",
  },
  tr: {
    title: "Entegre Kauçuk Üretimi",
    subtitle: "Dahili kauçuk karıştırma, metal işleme, takım merkezi ve vulkanizasyonu birleştirerek eksiksiz ve tutarlı bileşen üretimi sunuyoruz.",
    breadcrumb: "Solutions · Üretim",
  },
};

/* ─── Accent colours per element ─── */
const ACCENTS = ["#004FA3", "#0f2a52", "#1e3d6e", "#0d2040"] as const;

/* ─── SVG Placeholder Icons ─── */
function MixingIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} width={80} height={80}>
      <circle cx={40} cy={40} r={26} strokeOpacity={0.2} />
      <path d="M40 14 C56 22 58 34 56 44 C54 54 40 66 40 66" strokeLinecap="round" />
      <path d="M40 14 C24 22 22 34 24 44 C26 54 40 66 40 66" strokeLinecap="round" />
      <circle cx={40} cy={40} r={5} fill="currentColor" fillOpacity={0.35} stroke="none" />
      <circle cx={40} cy={24} r={3} fill="currentColor" fillOpacity={0.5} stroke="none" />
    </svg>
  );
}
function VulcanIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} width={80} height={80}>
      <rect x={14} y={28} width={52} height={24} rx={3} strokeOpacity={0.2} />
      <rect x={22} y={34} width={36} height={12} rx={2} />
      <path d="M28 28 L28 18" strokeLinecap="round" />
      <path d="M40 28 L40 18" strokeLinecap="round" />
      <path d="M52 28 L52 18" strokeLinecap="round" />
      <path d="M28 52 L28 62" strokeLinecap="round" />
      <path d="M40 52 L40 62" strokeLinecap="round" />
      <path d="M52 52 L52 62" strokeLinecap="round" />
    </svg>
  );
}
function ToolIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} width={80} height={80}>
      <path d="M44 14 L66 36 L38 62 L16 40 Z" strokeLinejoin="round" />
      <path d="M14 66 L24 56" strokeLinecap="round" strokeWidth={3} />
      <circle cx={15} cy={65} r={3.5} />
      <path d="M50 10 L70 10 L70 30" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.25} />
    </svg>
  );
}
function MetalIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} width={80} height={80}>
      <rect x={12} y={22} width={56} height={36} rx={3} strokeOpacity={0.2} />
      <path d="M24 22 L24 12" strokeLinecap="round" />
      <path d="M56 22 L56 12" strokeLinecap="round" />
      <path d="M12 40 L68 40" />
      <path d="M36 22 L36 58" strokeOpacity={0.3} />
      <path d="M48 22 L48 58" strokeOpacity={0.3} />
    </svg>
  );
}
const ICONS = [MixingIcon, VulcanIcon, ToolIcon, MetalIcon];

/* ─── Component ─── */
export default function ProductionPage({
  sectionKey = "page_solutions_production",
}: {
  sectionKey?: string;
}) {
  const { lang } = useLanguage();
  const get = useAllContent();
  const hero = HERO_DEFAULTS[lang];

  const heroTitle   = get(sectionKey, "hero_title")   || hero.title;
  const heroSub     = get(sectionKey, "hero_subtitle") || hero.subtitle;
  const heroBgColor = get(sectionKey, "hero_bg_color") || "#091325";
  const heroBgImage = get(sectionKey, "hero_bg_image") || "";

  return (
    <Layout>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: 640,
          backgroundColor: heroBgColor,
          backgroundImage: heroBgImage ? `url(${heroBgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {/* Gradient overlay — always present for text legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: heroBgImage
              ? "linear-gradient(to top, rgba(4,10,22,0.95) 0%, rgba(4,10,22,0.55) 45%, rgba(4,10,22,0.18) 100%)"
              : "linear-gradient(135deg,#0b1628 0%,#0f1f3d 60%,#091325 100%)",
          }}
        />

        {/* Content — paddingTop: 107 protects the navbar zone */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1280,
            margin: "0 auto",
            width: "100%",
            padding: "171px 48px 96px",
            boxSizing: "border-box",
          }}
        >
          {/* Breadcrumb */}
          <p
            style={{
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.38)",
              marginBottom: 22,
              marginTop: 0,
            }}
          >
            {hero.breadcrumb}
          </p>

          {/* Title */}
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 200,
              fontSize: "clamp(44px,6.5vw,82px)",
              lineHeight: 1.0,
              color: "#ffffff",
              margin: "0 0 26px",
              letterSpacing: "-0.01em",
              maxWidth: 820,
            }}
          >
            {heroTitle}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: "clamp(14px,1.5vw,17px)",
              color: "rgba(255,255,255,0.52)",
              maxWidth: 600,
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {heroSub}
          </p>
        </div>
      </section>

      {/* ── 4 ALTERNATING SPLIT SECTIONS ──────────────────────────────────── */}
      <div style={{ fontFamily: "Poppins, sans-serif" }}>
        {ELEMENTS.map((el, i) => {
          const Icon = ICONS[i];
          const accent = ACCENTS[i];
          const title  = get(el.section, `title_${lang}`) || el.title[lang];
          const body   = get(el.section, `body_${lang}`)  || el.body[lang];
          const image  = get(el.section, "image");
          const num    = String(i + 1).padStart(2, "0");

          /* i=0,2 → image LEFT; i=1,3 → text LEFT, image RIGHT */
          const imageOnLeft = i % 2 === 0;
          const textBg = i % 2 === 0 ? "#ffffff" : "#f8f9fb";

          /* ── Image panel ─── */
          const imagePanel = (
            <div
              className="relative overflow-hidden w-full md:w-1/2"
              style={{ minHeight: 480 }}
            >
              {image ? (
                <>
                  <img
                    src={image}
                    alt={title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {/* Subtle directional depth overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: imageOnLeft
                        ? "linear-gradient(to right, rgba(0,0,0,0.12) 0%, transparent 50%)"
                        : "linear-gradient(to left,  rgba(0,0,0,0.12) 0%, transparent 50%)",
                      pointerEvents: "none",
                    }}
                  />
                </>
              ) : (
                /* Placeholder — dark accent panel with oversized icon */
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {/* Large watermark number */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: -16,
                      right: 16,
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 800,
                      fontSize: 180,
                      lineHeight: 1,
                      color: "rgba(255,255,255,0.05)",
                      userSelect: "none",
                      pointerEvents: "none",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {num}
                  </span>
                  {/* Centred icon */}
                  <div style={{ color: "rgba(255,255,255,0.18)", transform: "scale(3)" }}>
                    <Icon />
                  </div>
                </div>
              )}
            </div>
          );

          /* ── Text panel ─── */
          const textPanel = (
            <div
              className="w-full md:w-1/2 flex items-center"
              style={{ backgroundColor: textBg, minHeight: 480 }}
            >
              <div
                style={{
                  maxWidth: 520,
                  padding: "64px 56px",
                  boxSizing: "border-box",
                  width: "100%",
                }}
              >
                {/* Number + accent rule */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 28,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 40,
                      height: 2,
                      borderRadius: 2,
                      backgroundColor: accent,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: accent,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    }}
                  >
                    {num}
                  </span>
                </div>

                {/* Section title */}
                <h2
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(22px,2.6vw,34px)",
                    color: "#0d1219",
                    margin: "0 0 20px",
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {title}
                </h2>

                {/* Body copy */}
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: 15,
                    lineHeight: 1.9,
                    color: "#4a5568",
                    margin: 0,
                  }}
                >
                  {body}
                </p>
              </div>
            </div>
          );

          return (
            <div
              key={el.section}
              /* On mobile: image always on top (DOM order), text below.
                 On desktop: alternate left/right via flex-row-reverse. */
              className={`flex flex-col ${imageOnLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
              style={{
                borderBottom:
                  i < ELEMENTS.length - 1
                    ? "1px solid rgba(0,0,0,0.06)"
                    : undefined,
              }}
            >
              {imagePanel}
              {textPanel}
            </div>
          );
        })}
      </div>

      {/* ── CONTACT BLOCK ─────────────────────────────────────────────────── */}
      <ContactBlock lang={lang} />

    </Layout>
  );
}
