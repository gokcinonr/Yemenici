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

/* ─── Industry Configuration ───────────────────────────────────────────────── */

type ProductDef = {
  section: string;
  defaultTitle: Record<Lang, string>;
  defaultBody: Record<Lang, string>;
};

type IndustryCfg = {
  eyebrow: Record<Lang, string>;
  overviewLabel: Record<Lang, string>;
  productsLabel: Record<Lang, string>;
  defaultHeroTitle: Record<Lang, string>;
  defaultHeroSubtitle: Record<Lang, string>;
  defaultOverview: Record<Lang, string>;
  defaultQualitySubtitle: Record<Lang, string>;
  defaultQualityBody: Record<Lang, string>;
  defaultQualityQuote: Record<Lang, string>;
  products: ProductDef[];
};

const CFG: Record<string, IndustryCfg> = {
  page_solutions_automotive: {
    eyebrow: { en: "Solutions · Automotive", de: "Lösungen · Automobil", tr: "Çözümler · Otomotiv" },
    overviewLabel: { en: "Sector Overview", de: "Sektorüberblick", tr: "Sektör Genel Bakış" },
    productsLabel: { en: "Application Areas", de: "Anwendungsbereiche", tr: "Uygulama Alanları" },
    defaultHeroTitle: { en: "Automotive", de: "Automobilbereich", tr: "Otomotiv" },
    defaultHeroSubtitle: {
      en: "Precision Elastomers for Every Vehicle Platform",
      de: "Präzisions-Elastomere für Jede Fahrzeugplattform",
      tr: "Her Araç Platformu İçin Hassas Elastomerler",
    },
    defaultOverview: {
      en: "Yemenici engineers precision elastomer components for the complete vehicle spectrum — from passenger cars to heavy commercial vehicles and buses. Our in-house compound development, precision tooling, and IATF 16949-aligned quality systems ensure that every seal, mount, and profile meets the exacting dimensional and performance requirements of today's automotive OEMs and Tier 1 suppliers.",
      de: "Yemenici konstruiert Präzisions-Elastomerkomponenten für das gesamte Fahrzeugspektrum – von Personenkraftwagen bis hin zu schweren Nutzfahrzeugen und Bussen. Unsere IATF 16949-konforme Qualitätssysteme sorgen dafür, dass jede Dichtung, Lagerung und jedes Profil den Anforderungen der Automobilindustrie gerecht wird.",
      tr: "Yemenici, binek araçlardan ağır ticari araçlara ve otobüslere kadar tüm araç yelpazesi için hassas elastomer bileşenler üretmektedir. IATF 16949 uyumlu kalite sistemlerimiz, her contanın OEM gereksinimlerini karşılamasını sağlar.",
    },
    defaultQualitySubtitle: {
      en: "Every component we produce is governed by a rigorous quality culture rooted in automotive industry standards.",
      de: "Jede Komponente unterliegt einer strengen Qualitätskultur auf Basis automobiler Standards.",
      tr: "Ürettiğimiz her bileşen, otomotiv standartlarına dayalı titiz bir kalite kültürüyle yönetilmektedir.",
    },
    defaultQualityBody: {
      en: "Our quality management system is certified to IATF 16949 and ISO 9001. Statistical process controls, capability studies, dimensional CMM inspection, and accelerated aging tests are embedded throughout the production flow — from raw-material incoming inspection to final packing audit.",
      de: "Unser QMS ist nach IATF 16949 und ISO 9001 zertifiziert. Statistische Prozesskontrollen, Fähigkeitsstudien, dimensionale KMG-Prüfung und Alterungstests sind im gesamten Produktionsablauf verankert.",
      tr: "Kalite yönetim sistemimiz IATF 16949 ve ISO 9001 ile sertifikalandırılmıştır. İstatistiksel proses kontrolleri, yeterlilik çalışmaları ve hızlandırılmış yaşlandırma testleri tüm üretim akışına entegre edilmiştir.",
    },
    defaultQualityQuote: {
      en: "\"Quality is not an act of inspection — it is the result of disciplined engineering at every step.\"",
      de: "\"Qualität ist kein Inspektionsakt — sie ist das Ergebnis disziplinierten Engineerings auf jedem Schritt.\"",
      tr: "\"Kalite bir denetim eylemi değil — her adımda disiplinli mühendisliğin sonucudur.\"",
    },
    products: [
      {
        section: "auto_prod_passenger",
        defaultTitle: { en: "Passenger Vehicles", de: "Personenkraftwagen", tr: "Binek Araçlar" },
        defaultBody: {
          en: "Door and window seals, engine mount isolators, radiator hoses, and brake system components engineered to OEM dimensional standards with full material traceability.",
          de: "Tür- und Fensterdichtungen, Motorlagerisolatoren, Kühlerschläuche und Bremssystemkomponenten nach OEM-Maßstandards mit vollständiger Materialrückverfolgbarkeit.",
          tr: "Kapı ve cam contaları, motor bağlantı yalıtımları, radyatör hortumları ve fren sistemi bileşenleri OEM boyutsal standartlarında tam malzeme izlenebilirliğiyle üretilmektedir.",
        },
      },
      {
        section: "auto_prod_commercial",
        defaultTitle: { en: "Commercial Vehicles", de: "Nutzfahrzeuge", tr: "Ticari Araçlar" },
        defaultBody: {
          en: "Cab suspension buffers, steering gaiters, exhaust hangers, and air-brake seals developed for high-cycle fatigue resistance and extreme-temperature reliability in long-haul applications.",
          de: "Fahrerhaus-Dämpfer, Lenkmanschetten, Auspuffhalter und Druckluftbremsdichtungen für hohe Ermüdungsbeständigkeit bei langen Strecken.",
          tr: "Kabin süspansiyon tamponları, direksiyon körükleri, egzoz askıları ve hava fren contalar yüksek çevrim yorulma direnci için geliştirilmiştir.",
        },
      },
      {
        section: "auto_prod_buses",
        defaultTitle: { en: "Buses", de: "Busse", tr: "Otobüsler" },
        defaultBody: {
          en: "Air-spring bellows, door-guide seals, undercarriage buffers, and HVAC flexible connectors sized for the high-duty-cycle demands of public transit and long-distance coach fleets.",
          de: "Luftfederbälge, Türführungsdichtungen, Unterbodenkarosserien und HLK-Flexverbinder für den Hochlastbetrieb im Nahverkehr und Fernreisebussen.",
          tr: "Hava yaylı körükler, kapı rehber contaları, alt şasi tamponları ve HVAC esnek bağlantılar toplu taşıma filosu için boyutlandırılmıştır.",
        },
      },
    ],
  },

  page_solutions_industrial: {
    eyebrow: { en: "Solutions · Industrial", de: "Lösungen · Industrie", tr: "Çözümler · Endüstriyel" },
    overviewLabel: { en: "Sector Overview", de: "Sektorüberblick", tr: "Sektör Genel Bakış" },
    productsLabel: { en: "Application Areas", de: "Anwendungsbereiche", tr: "Uygulama Alanları" },
    defaultHeroTitle: { en: "Industrial", de: "Industriebereich", tr: "Endüstriyel" },
    defaultHeroSubtitle: {
      en: "Elastomer Solutions for Demanding Environments",
      de: "Elastomerlösungen für Anspruchsvolle Umgebungen",
      tr: "Zorlu Ortamlar İçin Elastomer Çözümler",
    },
    defaultOverview: {
      en: "From building infrastructure to industrial machinery, Yemenici supplies elastomer solutions engineered for demanding mechanical and chemical environments. Our compound portfolio — spanning EPDM, NBR, FKM, and silicone grades — allows us to precisely match material properties to application requirements across a broad range of sectors.",
      de: "Von der Gebäudeinfrastruktur bis hin zu Industriemaschinen liefert Yemenici Elastomerlösungen für anspruchsvolle Umgebungen. Unser breites Compound-Portfolio ermöglicht es, Materialeigenschaften präzise abzustimmen.",
      tr: "Bina altyapısından endüstriyel makinelere kadar, Yemenici zorlu ortamlar için elastomer çözümler sunmaktadır. Geniş karışım portföyümüz, malzeme özelliklerini hassas biçimde eşlememizi sağlar.",
    },
    defaultQualitySubtitle: {
      en: "ISO-certified processes ensuring consistent elastomer performance across every production batch.",
      de: "ISO-zertifizierte Prozesse für gleichbleibende Elastomerleistung in jeder Charge.",
      tr: "Her üretim partisinde tutarlı elastomer performansını güvence altına alan ISO sertifikalı süreçler.",
    },
    defaultQualityBody: {
      en: "Our industrial division operates under ISO 9001 certification, with material traceability, dimensional inspection protocols, and pressure/thermal testing conducted at every batch. Custom compound development is available for non-standard media compatibility requirements.",
      de: "Unsere Industrieabteilung nach ISO 9001. Materialrückverfolgbarkeit, Dimensionsprüfprotokolle und Druck-/Wärmetests werden bei jeder Charge durchgeführt. Kundenspezifische Entwicklung steht für Sonderbedarf zur Verfügung.",
      tr: "Endüstriyel bölümümüz ISO 9001 sertifikasıyla faaliyet göstermekte olup her partide malzeme izlenebilirliği ve test protokolleri uygulanmaktadır.",
    },
    defaultQualityQuote: {
      en: "\"Precision in compound selection defines the difference between adequate and exceptional industrial sealing performance.\"",
      de: "\"Präzision bei der Compoundauswahl definiert den Unterschied zwischen ausreichender und außergewöhnlicher Industriedichtungsleistung.\"",
      tr: "\"Karışım seçimindeki hassasiyet, yeterli ile olağanüstü endüstriyel sızdırmazlık performansı arasındaki farkı belirler.\"",
    },
    products: [
      {
        section: "ind_prod_construction",
        defaultTitle: { en: "Building & Construction", de: "Bauwesen & Konstruktion", tr: "Yapı & İnşaat" },
        defaultBody: {
          en: "Expansion joints, bridge bearing pads, waterproofing profiles, and structural seismic isolation bearings engineered for decades of outdoor weathering, UV resistance, and load-bearing stability.",
          de: "Dehnungsfugen, Brückenlagerpads, Abdichtungsprofile und Seismikisolationslager für jahrzehntelange Außenbewitterung und tragende Stabilität.",
          tr: "Dilatasyon derz bağlantıları, köprü mesnet pedleri, su yalıtım profilleri ve sismik izolasyon mesnetleri; uzun yıllar dış etkilere dayanacak şekilde tasarlanmıştır.",
        },
      },
      {
        section: "ind_prod_hvac",
        defaultTitle: { en: "HVAC Industry", de: "HLK-Industrie", tr: "HVAC Endüstrisi" },
        defaultBody: {
          en: "Flexible duct connectors, anti-vibration isolators, pump seals, and expansion compensators manufactured from EPDM and silicone grades rated for wide temperature ranges and ozone resistance.",
          de: "Flexible Kanalverbinder, Schwingungsdämpfer, Pumpendichtungen aus EPDM und Silikon für breite Temperaturbereiche in HLK-Systemen.",
          tr: "EPDM ve silikon malzemeden esnek kanal bağlantıları, titreşim yalıtıcılar, pompa contaları ve genleşme kompansatörler.",
        },
      },
      {
        section: "ind_prod_appliance",
        defaultTitle: { en: "Commercial Appliance Systems", de: "Gewerbliche Gerätesysteme", tr: "Ticari Cihaz Sistemleri" },
        defaultBody: {
          en: "Pump diaphragms, door gaskets, vibration mounts, and internal sealing rings for commercial dishwashers, refrigeration compressors, and food-processing equipment — fully compliant with relevant hygiene standards.",
          de: "Pumpenmembranen, Türdichtungen, Schwingungslager für Spülmaschinen, Kühlkompressoren und Lebensmittelverarbeitungsgeräte konform mit Hygienestandards.",
          tr: "Ticari bulaşık makineleri ve gıda işleme ekipmanları için pompa diyaframları, kapı contaları ve titreşim mesnetleri — hijyen standartlarına tam uyumlu.",
        },
      },
    ],
  },

  page_solutions_agriculture: {
    eyebrow: { en: "Solutions · Agriculture", de: "Lösungen · Landwirtschaft", tr: "Çözümler · Tarım" },
    overviewLabel: { en: "Sector Overview", de: "Sektorüberblick", tr: "Sektör Genel Bakış" },
    productsLabel: { en: "Application Areas", de: "Anwendungsbereiche", tr: "Uygulama Alanları" },
    defaultHeroTitle: { en: "Agriculture", de: "Landwirtschaft", tr: "Tarım" },
    defaultHeroSubtitle: {
      en: "Robust Components for Field-Proven Performance",
      de: "Robuste Komponenten für Feldbewährte Leistung",
      tr: "Saha Kanıtlı Performans İçin Sağlam Bileşenler",
    },
    defaultOverview: {
      en: "Agricultural equipment operates in extreme dust, moisture, UV, and wide temperature cycles. Yemenici delivers elastomer seals, profiles, and vibration isolators purpose-built for tractors, harvesters, and field equipment — ensuring reliable function across the entire growing season and beyond.",
      de: "Landwirtschaftliche Maschinen arbeiten unter extremem Staub, Feuchtigkeit und UV. Yemenici liefert Elastomerdichtungen, Profile und Schwingungsdämpfer speziell für Traktoren, Mähdrescher und Feldgeräte.",
      tr: "Tarım makineleri aşırı toz, nem ve UV altında çalışır. Yemenici, traktörler ve biçerdöverler için özel üretilmiş elastomer contalar, profiller ve titreşim yalıtıcıları sunar.",
    },
    defaultQualitySubtitle: {
      en: "Field-proven reliability engineered into every seal and profile we supply.",
      de: "Feldbewährte Zuverlässigkeit in jede Dichtung und jedes Profil eingebaut.",
      tr: "Tedarik ettiğimiz her contaya saha kanıtlı güvenilirlik entegre edilmiştir.",
    },
    defaultQualityBody: {
      en: "Our agricultural components undergo accelerated UV aging, mud-immersion cycling, and low-temperature flexibility testing to simulate decades of seasonal field use. Compound selection prioritises resistance to agricultural chemicals, fuel, and hydraulic fluids.",
      de: "Unsere Agrarbauteile durchlaufen UV-Alterung, Schlammimmersionstests und Tieftemperatur-Biegeprüfungen. Compoundauswahl priorisiert Beständigkeit gegen Agrochemikalien und Hydraulikflüssigkeiten.",
      tr: "Tarımsal bileşenlerimiz hızlandırılmış UV yaşlandırma ve çamur daldırma testlerinden geçmektedir. Tarım kimyasallarına ve hidrolik sıvılara direnç önceliklendirilir.",
    },
    defaultQualityQuote: {
      en: "\"In the field, there are no second chances — which is why we engineer reliability into every component we manufacture.\"",
      de: "\"Im Feld gibt es keine zweiten Chancen — deshalb konstruieren wir Zuverlässigkeit in jede Komponente.\"",
      tr: "\"Sahada ikinci şanslar yoktur — bu nedenle ürettiğimiz her bileşene güvenilirlik mühendisliği uyguluyoruz.\"",
    },
    products: [
      {
        section: "agri_prod_vehicles",
        defaultTitle: { en: "Agricultural Vehicles", de: "Landwirtschaftliche Fahrzeuge", tr: "Tarım Araçları" },
        defaultBody: {
          en: "Cab seals, air-filter housings, fuel system rubber components, and undercarriage profiles for tractors and utility vehicles, engineered for extended service intervals and field-maintenance compatibility.",
          de: "Fahrerhausdichtungen, Luftfiltergehäuse, Kraftstoffsystemkomponenten für Traktoren mit verlängerten Serviceintervallen.",
          tr: "Traktörler için kabin contaları, hava filtre gövdeleri, yakıt sistemi bileşenleri; uzatılmış servis aralıkları için tasarlanmıştır.",
        },
      },
      {
        section: "agri_prod_equipment",
        defaultTitle: { en: "Agricultural Equipment", de: "Landwirtschaftliche Maschinen", tr: "Tarım Ekipmanları" },
        defaultBody: {
          en: "Harvester drum seals, hydraulic cylinder wiper seals, belt conveyor profiles, and grain-elevator sealing systems resistant to abrasion, chemical exposure, and fatigue across high-duty harvest cycles.",
          de: "Dreschtrommel-Dichtungen, Hydraulikzylinder-Wischerdichtungen und Förderbandsprofile für Abrieb- und Ermüdungsbeständigkeit.",
          tr: "Harman tambur contaları, hidrolik silindir silecek contaları ve bant konveyör profilleri aşınmaya, kimyasallara ve yorulmaya dirençlidir.",
        },
      },
    ],
  },
};

/* ─── Hover-lift product card ──────────────────────────────────────────────── */
function ProductCard({
  title,
  body,
  image,
}: {
  title: string;
  body: string;
  image: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 20px 48px rgba(0,0,0,0.14)"
          : "0 2px 14px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        transition: "transform 0.28s ease, box-shadow 0.28s ease",
      }}
    >
      {/* Image / gradient header */}
      <div
        style={{
          height: 220,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#0a1628",
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!image && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: hovered
                ? "linear-gradient(135deg, #0a2050 0%, #0060d0 100%)"
                : "linear-gradient(135deg, #0a1f44 0%, #004FA3 80%, #1a5cb8 100%)",
              transition: "background 0.3s ease",
            }}
          />
        )}
        {/* Subtle texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.05) 0%, transparent 60%)",
          }}
        />
        {/* Gear icon placeholder */}
        {!image && (
          <svg
            style={{
              position: "absolute",
              bottom: 20,
              right: 24,
              width: 52,
              height: 52,
              color: "rgba(255,255,255,0.12)",
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "28px 28px 32px", fontFamily: "Poppins, sans-serif" }}>
        <h3
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: "#0d1219",
            marginBottom: 12,
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontWeight: 400,
            fontSize: 13.5,
            color: "#64748b",
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

/* ─── Main page component ─────────────────────────────────────────────────── */
export default function IndustryDetailPage({ sectionKey }: { sectionKey: string }) {
  const { lang } = useLanguage();
  const get = useAllContent();
  const cfg = CFG[sectionKey];

  if (!cfg) return null;

  const heroTitle    = get(sectionKey, "hero_title")    || cfg.defaultHeroTitle[lang];
  const heroSubtitle = get(sectionKey, "hero_subtitle") || cfg.defaultHeroSubtitle[lang];
  const heroBgColor  = get(sectionKey, "hero_bg_color") || "#0a1628";
  const heroBgImage  = get(sectionKey, "hero_bg_image");

  const overview = get(sectionKey, `overview_${lang}`) || cfg.defaultOverview[lang];

  const qualitySubtitle = get(sectionKey, `quality_subtitle_${lang}`) || cfg.defaultQualitySubtitle[lang];
  const qualityBody     = get(sectionKey, `quality_body_${lang}`)     || cfg.defaultQualityBody[lang];
  const qualityQuote    = get(sectionKey, `quality_quote_${lang}`)    || cfg.defaultQualityQuote[lang];

  const products = cfg.products.map((p) => ({
    ...p,
    title: get(p.section, `title_${lang}`) || p.defaultTitle[lang],
    body:  get(p.section, `body_${lang}`)  || p.defaultBody[lang],
    image: get(p.section, "image"),
  }));

  const cols = Math.min(products.length, 3);

  return (
    <Layout>

      {/* ── 1. HERO ───────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: 580,
          backgroundColor: heroBgColor,
          backgroundImage: heroBgImage ? `url(${heroBgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(4,10,22,0.93) 0%, rgba(4,10,22,0.52) 45%, rgba(4,10,22,0.18) 100%)",
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
          {/* Eyebrow */}
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
            {cfg.eyebrow[lang]}
          </p>

          {/* Title */}
          <h1
            style={{
              fontWeight: 200,
              fontSize: "clamp(54px, 8vw, 92px)",
              lineHeight: 1.0,
              color: "#ffffff",
              margin: "0 0 22px",
              letterSpacing: "-0.01em",
            }}
          >
            {heroTitle}
          </h1>

          {/* Subtitle */}
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

      {/* ── 2. OVERVIEW ───────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#ffffff",
          padding: "100px 0",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 48px",
            display: "flex",
            gap: 80,
            alignItems: "flex-start",
            boxSizing: "border-box",
          }}
        >
          {/* Left — decorative label column */}
          <div style={{ flexShrink: 0, width: 200, paddingTop: 6 }}>
            <div
              style={{
                width: 36,
                height: 2,
                backgroundColor: "#004FA3",
                marginBottom: 22,
              }}
            />
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
              {cfg.eyebrow[lang]}
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
              {cfg.overviewLabel[lang]}
            </p>
          </div>

          {/* Right — overview paragraph */}
          <div style={{ flex: 1 }}>
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

      {/* ── 3. PRODUCTS GRID ──────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#f4f6f9",
          padding: "100px 0",
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
          {/* Section header */}
          <div style={{ marginBottom: 56 }}>
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
              Products &amp; Applications
            </p>
            <h2
              style={{
                fontWeight: 300,
                fontSize: "clamp(28px, 3.2vw, 42px)",
                color: "#0d1219",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {cfg.productsLabel[lang]}
            </h2>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: 24,
            }}
          >
            {products.map((p) => (
              <ProductCard
                key={p.section}
                title={p.title}
                body={p.body}
                image={p.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. QUALITY HIGHLIGHT ──────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#0d1219",
          padding: "100px 0",
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
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            {/* Eyebrow */}
            <p
              style={{
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#004FA3",
                marginBottom: 24,
                marginTop: 0,
              }}
            >
              Quality as a Culture
            </p>

            {/* Main quality subtitle */}
            <h2
              style={{
                fontWeight: 300,
                fontSize: "clamp(24px, 3vw, 38px)",
                color: "#ffffff",
                lineHeight: 1.35,
                marginBottom: 36,
                marginTop: 0,
              }}
            >
              {qualitySubtitle}
            </h2>

            {/* Body */}
            <p
              style={{
                fontWeight: 400,
                fontSize: 15,
                lineHeight: 1.9,
                color: "rgba(255,255,255,0.48)",
                marginBottom: 48,
                marginTop: 0,
              }}
            >
              {qualityBody}
            </p>

            {/* Divider */}
            <div
              style={{
                width: 48,
                height: 1,
                backgroundColor: "rgba(255,255,255,0.10)",
                margin: "0 auto 44px",
              }}
            />

            {/* Quote */}
            <blockquote
              style={{
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.7vw, 19px)",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.75,
                margin: 0,
                padding: 0,
                border: "none",
              }}
            >
              {qualityQuote}
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── 5. CONTACT ────────────────────────────────────────────────────── */}
      <ContactBlock lang={lang} />

    </Layout>
  );
}
