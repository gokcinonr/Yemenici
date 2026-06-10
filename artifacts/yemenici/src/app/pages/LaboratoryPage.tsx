import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ContactBlock from "../components/ContactBlock";
import { useLanguage, type Lang } from "../contexts/LanguageContext";

type ContentRow = { section: string; key: string; value: string };

function useAllContent() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then(setRows).catch(() => {});
  }, []);
  return (section: string, key: string, fallback = "") =>
    rows.find((c) => c.section === section && c.key === key)?.value || fallback;
}

/* ─── Icon SVG Library ──────────────────────────────────────────────────────── */
const STROKE = { fill: "none" as const, stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const LAB_SVG = {
  rheometer: <svg viewBox="0 0 24 24" {...STROKE}><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 22A10 10 0 0 1 2 12"/><polyline points="16 2 12 2 12 6"/><polyline points="8 22 12 22 12 18"/></svg>,
  tensometer: <svg viewBox="0 0 24 24" {...STROKE}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 8 2 5 5 2"/><polyline points="19 22 22 19 19 16"/><line x1="2" y1="5" x2="12" y2="5"/><line x1="12" y1="19" x2="22" y2="19"/></svg>,
  ozone: <svg viewBox="0 0 24 24" {...STROKE}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/><circle cx="12" cy="21" r="1"/></svg>,
  temperature: <svg viewBox="0 0 24 24" {...STROKE}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>,
  hardness: <svg viewBox="0 0 24 24" {...STROKE}><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="8.5" x2="22" y2="8.5"/><line x1="2" y1="15.5" x2="22" y2="15.5"/></svg>,
  compression: <svg viewBox="0 0 24 24" {...STROKE}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="9 8 5 12 9 16"/><polyline points="15 8 19 12 15 16"/></svg>,
  viscosity: <svg viewBox="0 0 24 24" {...STROKE}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
  uv: <svg viewBox="0 0 24 24" {...STROKE}><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  load: <svg viewBox="0 0 24 24" {...STROKE}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/><line x1="5" y1="5" x2="19" y2="5"/></svg>,
  torque: <svg viewBox="0 0 24 24" {...STROKE}><path d="M5 12a7 7 0 1 0 14 0"/><polyline points="16 7 19 12 22 7"/></svg>,
  collapse: <svg viewBox="0 0 24 24" {...STROKE}><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="9 9 12 12 15 9"/><polyline points="9 15 12 12 15 15"/></svg>,
  durability: <svg viewBox="0 0 24 24" {...STROKE}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  abrasion: <svg viewBox="0 0 24 24" {...STROKE}><polyline points="2 17 6 13 10 17 14 13 18 17 22 13"/><line x1="2" y1="12" x2="22" y2="12"/></svg>,
  microscope: <svg viewBox="0 0 24 24" {...STROKE}><path d="M6 18H4a2 2 0 0 1-2-2v-1h20v1a2 2 0 0 1-2 2h-2"/><path d="M14 10c.34.54.34 1.46 0 2"/><path d="M12 12a2 2 0 0 1 0-4V5l-2-2V2h4v1l-2 2v3a2 2 0 0 1 0 4z"/><line x1="12" y1="18" x2="12" y2="15"/></svg>,
  aging: <svg viewBox="0 0 24 24" {...STROKE}><path d="M5 21V8a7 7 0 0 1 14 0v13"/><path d="M5 12h14"/><path d="M9 12v4l3 2 3-2v-4"/></svg>,
  density: <svg viewBox="0 0 24 24" {...STROKE}><circle cx="6" cy="6" r="1.5"/><circle cx="12" cy="6" r="1.5"/><circle cx="18" cy="6" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/><circle cx="6" cy="18" r="1.5"/><circle cx="12" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>,
};

function LabIcon({ iconKey, size = 24, color = "currentColor" }: { iconKey: string; size?: number; color?: string }) {
  const svg = (LAB_SVG as Record<string, typeof LAB_SVG.density>)[iconKey] ?? LAB_SVG.density;
  return (
    <div style={{ width: size, height: size, color, flexShrink: 0 }}>
      {svg}
    </div>
  );
}

/* ─── Data defaults ─────────────────────────────────────────────────────────── */
type CapDefault = { section: string; icon: string; name: Record<Lang, string>; desc: Record<Lang, string> };
type TestDefault = { section: string; icon: string; name: Record<Lang, string> };

const DEFAULT_CAPS: CapDefault[] = [
  { section: "lab_cap_1", icon: "rheometer",   name: { en: "Rheometer", de: "Rheometer", tr: "Reometre" }, desc: { en: "Measures viscoelastic properties and vulcanisation kinetics of rubber compounds.", de: "Misst viskoelastische Eigenschaften und Vulkanisationskinetik.", tr: "Kauçuk karışımlarının viskoelastik özelliklerini ve vulkanizasyon kinetiğini ölçer." } },
  { section: "lab_cap_2", icon: "tensometer",  name: { en: "Tensometer", de: "Tensometer", tr: "Tensometre" }, desc: { en: "Evaluates tensile strength, elongation at break, and modulus to ISO 37.", de: "Bewertet Zugfestigkeit, Bruchdehnung und Modul gemäß ISO 37.", tr: "ISO 37'ye göre çekme mukavemeti, kopma uzaması ve modülü değerlendirir." } },
  { section: "lab_cap_3", icon: "ozone",       name: { en: "Ozone Test Equipment", de: "Ozonprüfgerät", tr: "Ozon Test Cihazı" }, desc: { en: "Simulates field ozone exposure conditions to assess environmental resistance.", de: "Simuliert Ozonbelastungsbedingungen zur Beurteilung der Umweltbeständigkeit.", tr: "Çevresel direnci değerlendirmek için saha ozon maruziyeti koşullarını simüle eder." } },
  { section: "lab_cap_4", icon: "temperature", name: { en: "Temperature Chambers", de: "Temperaturkammern", tr: "Sıcaklık Kabinleri" }, desc: { en: "Tests performance across −60 °C to +200 °C, covering thermal aging and cold flexibility.", de: "Testet Leistung von −60 °C bis +200 °C, einschließlich Wärmealterung.", tr: "−60 °C ile +200 °C arasında performansı, ısıl yaşlanma dahil test eder." } },
  { section: "lab_cap_5", icon: "hardness",    name: { en: "Shore A Hardness Tester", de: "Shore-A-Härteprüfer", tr: "Shore A Sertlik Ölçer" }, desc: { en: "Measures indentation hardness per ISO 7619-1 for quality release decisions.", de: "Misst Eindruckhärte gemäß ISO 7619-1 für Qualitätsfreigabeentscheidungen.", tr: "ISO 7619-1'e göre kalite serbest bırakma kararları için sertlik ölçümü yapar." } },
  { section: "lab_cap_6", icon: "compression", name: { en: "Compression Set Apparatus", de: "Druckverformungsgerät", tr: "Basınç Deformasyon Cihazı" }, desc: { en: "Determines permanent deformation under sustained compression per ISO 815.", de: "Bestimmt bleibende Verformung unter dauerhafter Kompression gemäß ISO 815.", tr: "ISO 815'e göre sürekli basınç altında kalıcı deformasyonu belirler." } },
  { section: "lab_cap_7", icon: "viscosity",   name: { en: "Mooney Viscometer", de: "Mooney-Viskosimeter", tr: "Mooney Viskozimetre" }, desc: { en: "Controls compound viscosity and scorch time to ensure consistent processability.", de: "Überwacht Viskosität und Anbrennzeit für gleichmäßige Verarbeitbarkeit.", tr: "Tutarlı işlenebilirlik için karışım viskozitesini ve yanma süresini kontrol eder." } },
  { section: "lab_cap_8", icon: "uv",          name: { en: "UV Aging Chamber", de: "UV-Alterungskammer", tr: "UV Yaşlandırma Kabini" }, desc: { en: "Evaluates long-term photochemical degradation resistance per ISO 4892.", de: "Bewertet langzeitige photochemische Abbaubeständigkeit gemäß ISO 4892.", tr: "ISO 4892'ye göre uzun süreli fotokimyasal bozunma direncini değerlendirir." } },
];

const DEFAULT_TESTS: TestDefault[] = [
  { section: "lab_test_1", icon: "load",        name: { en: "Load / Deflection", de: "Last / Durchbiegung", tr: "Yük / Sehim" } },
  { section: "lab_test_2", icon: "hardness",    name: { en: "Hardness", de: "Härte", tr: "Sertlik" } },
  { section: "lab_test_3", icon: "torque",      name: { en: "Torque", de: "Drehmoment", tr: "Tork" } },
  { section: "lab_test_4", icon: "collapse",    name: { en: "Collapse Resistance", de: "Knickwiderstand", tr: "Çökme Direnci" } },
  { section: "lab_test_5", icon: "durability",  name: { en: "Durability", de: "Dauerhaftigkeit", tr: "Dayanıklılık" } },
  { section: "lab_test_6", icon: "abrasion",    name: { en: "Abrasion Resistance", de: "Abriebfestigkeit", tr: "Aşınma Direnci" } },
];

const DEFAULT_REPORTING: Record<Lang, { internal: string; external: string }> = {
  en: {
    internal: "All test results are documented in controlled laboratory reports compliant with ISO 17025 traceability requirements. Critical parameters are monitored via inline Statistical Process Control (SPC), and nonconformance triggers an automated 8D corrective action workflow.",
    external: "External test reports are issued upon request in English, German, and Turkish. Certificates of Conformance accompany every shipment. Third-party laboratory audits are conducted annually to validate our internal measurement system.",
  },
  de: {
    internal: "Alle Prüfergebnisse werden in kontrollierten Laborberichten gemäß den Rückverfolgbarkeitsanforderungen der ISO 17025 dokumentiert. Kritische Parameter werden über SPC überwacht; Nichtkonformität löst einen 8D-Korrekturworkflow aus.",
    external: "Externe Prüfberichte werden auf Anfrage in Englisch, Deutsch und Türkisch ausgestellt. Konformitätszertifikate begleiten jede Lieferung. Jährliche Drittlaboraudits validieren unser internes Messsystem.",
  },
  tr: {
    internal: "Tüm test sonuçları, ISO 17025 izlenebilirlik gereksinimlerine uygun kontrollü laboratuvar raporlarında belgelenir. Kritik parametreler SPC ile izlenir; uygunsuzluk durumunda otomatik 8D düzeltici eylem iş akışı başlatılır.",
    external: "Harici test raporları talep üzerine İngilizce, Almanca ve Türkçe olarak düzenlenir. Uygunluk sertifikaları her sevkiyata eşlik eder. Yıllık üçüncü taraf laboratuvar denetimleri iç ölçüm sistemimizi doğrular.",
  },
};

/* ─── Capability Card ─────────────────────────────────────────────────────── */
function CapCard({ index, icon, name, desc }: { index: number; icon: string; name: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderTop: `2px solid ${hovered ? "#004FA3" : "#e5e7eb"}`,
        paddingTop: 28,
        paddingBottom: 12,
        transition: "border-color 0.22s ease",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: hovered ? "#004FA3" : "#f1f5f9",
            color: hovered ? "#ffffff" : "#475569",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.22s ease, color 0.22s ease",
            flexShrink: 0,
          }}
        >
          <LabIcon iconKey={icon} size={22} />
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "rgba(0,0,0,0.18)",
          }}
        >
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <h3 style={{ fontWeight: 600, fontSize: 15, color: "#0d1219", marginBottom: 10, marginTop: 0, fontFamily: "Poppins, sans-serif" }}>
        {name}
      </h3>
      <p style={{ fontWeight: 400, fontSize: 13, color: "#64748b", lineHeight: 1.75, margin: 0, fontFamily: "Poppins, sans-serif" }}>
        {desc}
      </p>
    </div>
  );
}

/* ─── Test Item ─────────────────────────────────────────────────────────────── */
function TestItem({ icon, name }: { icon: string; name: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "18px 20px",
        borderRadius: 14,
        backgroundColor: hovered ? "#ffffff" : "transparent",
        border: `1px solid ${hovered ? "rgba(0,79,163,0.14)" : "rgba(0,0,0,0.06)"}`,
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
        transition: "all 0.2s ease",
        fontFamily: "Poppins, sans-serif",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: hovered ? "#004FA3" : "#e2e8f0",
          color: hovered ? "#ffffff" : "#475569",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.2s, color 0.2s",
          flexShrink: 0,
        }}
      >
        <LabIcon iconKey={icon} size={18} />
      </div>
      <span style={{ fontWeight: 600, fontSize: 14, color: "#0d1219", fontFamily: "Poppins, sans-serif" }}>
        {name}
      </span>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────────── */
export default function LaboratoryPage() {
  const { lang } = useLanguage();
  const get = useAllContent();
  const [caps, setCaps] = useState<Array<{ icon: string; name: string; desc: string }>>([]);
  const [tests, setTests] = useState<Array<{ icon: string; name: string }>>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((rows: ContentRow[]) => {
        const gv = (section: string, key: string) =>
          rows.find((c) => c.section === section && c.key === key)?.value || "";

        const capCount = parseInt(gv("page_quality_laboratory", "cap_count") || "0", 10);
        const testCount = parseInt(gv("page_quality_laboratory", "test_count") || "0", 10);

        if (capCount > 0) {
          const loaded = [];
          for (let i = 1; i <= capCount; i++) {
            const s = `lab_cap_${i}`;
            const name = gv(s, `name_${lang}`);
            if (name) loaded.push({ icon: gv(s, "icon") || "density", name, desc: gv(s, `desc_${lang}`) });
          }
          setCaps(loaded);
        }

        if (testCount > 0) {
          const loaded = [];
          for (let i = 1; i <= testCount; i++) {
            const s = `lab_test_${i}`;
            const name = gv(s, `name_${lang}`);
            if (name) loaded.push({ icon: gv(s, "icon") || "density", name });
          }
          setTests(loaded);
        }

        setDataLoaded(true);
      })
      .catch(() => setDataLoaded(true));
  }, [lang]);

  const heroTitle    = get("page_quality_laboratory", "hero_title")    || "Laboratory & Testing";
  const heroSubtitle = get("page_quality_laboratory", "hero_subtitle") || {
    en: "Material development and validation through precision laboratory measurement and long-term durability testing.",
    de: "Materialentwicklung und Validierung durch Präzisionslabormessung und Langzeit-Haltbarkeitstests.",
    tr: "Hassas laboratuvar ölçümü ve uzun süreli dayanıklılık testleri aracılığıyla malzeme geliştirme ve doğrulama.",
  }[lang];
  const heroBgColor = get("page_quality_laboratory", "hero_bg_color") || "#0a1628";
  const heroBgImage = get("page_quality_laboratory", "hero_bg_image");

  const reportingInternal = get("page_quality_laboratory", `reporting_internal_${lang}`) || DEFAULT_REPORTING[lang].internal;
  const reportingExternal = get("page_quality_laboratory", `reporting_external_${lang}`) || DEFAULT_REPORTING[lang].external;

  const displayCaps  = dataLoaded && caps.length  > 0 ? caps  : DEFAULT_CAPS.map((c)  => ({ icon: c.icon, name: c.name[lang],  desc: c.desc[lang]  }));
  const displayTests = dataLoaded && tests.length > 0 ? tests : DEFAULT_TESTS.map((t) => ({ icon: t.icon, name: t.name[lang] }));

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
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,10,22,0.93) 0%, rgba(4,10,22,0.50) 45%, rgba(4,10,22,0.16) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", width: "100%", padding: "0 48px 80px", boxSizing: "border-box" }}>
          <p style={{ fontWeight: 600, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", marginBottom: 20, marginTop: 0 }}>
            Quality · Laboratory
          </p>
          <h1 style={{ fontWeight: 200, fontSize: "clamp(48px, 7vw, 82px)", lineHeight: 1.0, color: "#ffffff", margin: "0 0 22px", letterSpacing: "-0.01em" }}>
            {heroTitle}
          </h1>
          <p style={{ fontWeight: 400, fontSize: "clamp(14px, 1.5vw, 17px)", color: "rgba(255,255,255,0.55)", maxWidth: 560, lineHeight: 1.6, margin: 0 }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── 2A. TESTING CAPABILITIES ──────────────────────────────────────── */}
      <section style={{ backgroundColor: "#ffffff", padding: "96px 0 80px", fontFamily: "Poppins, sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", boxSizing: "border-box" }}>
          {/* Header */}
          <div style={{ display: "flex", gap: 80, alignItems: "flex-start", marginBottom: 64 }}>
            <div style={{ flexShrink: 0, width: 200, paddingTop: 4 }}>
              <div style={{ width: 36, height: 2, backgroundColor: "#004FA3", marginBottom: 20 }} />
              <p style={{ fontWeight: 700, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#004FA3", marginBottom: 12, marginTop: 0 }}>
                Element 1
              </p>
              <p style={{ fontWeight: 300, fontSize: 24, lineHeight: 1.25, color: "#0d1219", margin: 0 }}>
                {lang === "de" ? "Prüf­fähig­keiten" : lang === "tr" ? "Test\nKapasiteleri" : "Key Testing\nCapabilities"}
              </p>
            </div>
            <div style={{ flex: 1, maxWidth: 540 }}>
              <p style={{ fontWeight: 300, fontSize: 16, lineHeight: 1.9, color: "#2c3e50", margin: 0 }}>
                {lang === "de"
                  ? "Unsere Laborausstattung deckt jeden kritischen Messpunkt im Kautschuk-Entwicklungszyklus ab — von der Compoundcharakterisierung bis zur Bauteilvalidierung."
                  : lang === "tr"
                  ? "Laboratuvar ekipmanlarımız, karışım karakterizasyonundan parça doğrulamaya kadar kauçuk geliştirme döngüsündeki her kritik ölçüm noktasını kapsar."
                  : "Our laboratory equipment covers every critical measurement point in the rubber development cycle — from compound characterisation to finished-part validation."}
              </p>
            </div>
          </div>

          {/* Capabilities grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0 36px" }}>
            {displayCaps.map((cap, i) => (
              <CapCard key={i} index={i + 1} icon={cap.icon} name={cap.name} desc={cap.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 2B. PRODUCT-SPECIFIC TESTS ────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f8f9fb", padding: "80px 0", fontFamily: "Poppins, sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", gap: 80, alignItems: "flex-start", marginBottom: 48 }}>
            <div style={{ flexShrink: 0, width: 200, paddingTop: 4 }}>
              <div style={{ width: 36, height: 2, backgroundColor: "#004FA3", marginBottom: 20 }} />
              <p style={{ fontWeight: 700, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#004FA3", marginBottom: 12, marginTop: 0 }}>
                Element 2
              </p>
              <p style={{ fontWeight: 300, fontSize: 24, lineHeight: 1.25, color: "#0d1219", margin: 0 }}>
                {lang === "de" ? "Produkt­spezifische Tests" : lang === "tr" ? "Ürüne Özel\nTestler" : "Product-Specific\nTests"}
              </p>
            </div>
            <div style={{ flex: 1, maxWidth: 540 }}>
              <p style={{ fontWeight: 300, fontSize: 16, lineHeight: 1.9, color: "#2c3e50", margin: 0 }}>
                {lang === "de"
                  ? "Neben der Materialcharakterisierung führen wir produktspezifische Validierungstests durch, die die tatsächlichen Betriebsanforderungen replizieren."
                  : lang === "tr"
                  ? "Malzeme karakterizasyonuna ek olarak, gerçek çalışma gereksinimlerini taklit eden ürüne özgü doğrulama testleri yürütüyoruz."
                  : "Alongside material characterisation, we conduct product-specific validation tests that replicate real-world operating requirements of each rubber component."}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginLeft: 280 }}>
            {displayTests.map((t, i) => (
              <TestItem key={i} icon={t.icon} name={t.name} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 2C. CONTROL & REPORTING ───────────────────────────────────────── */}
      <section style={{ backgroundColor: "#0a1628", padding: "80px 0", fontFamily: "Poppins, sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", boxSizing: "border-box" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ width: 36, height: 2, backgroundColor: "#4a7cbf", marginBottom: 20 }} />
            <p style={{ fontWeight: 700, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#4a7cbf", marginBottom: 0, marginTop: 0 }}>
              Element 3
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
            {/* Internal */}
            <div>
              <h3 style={{ fontWeight: 600, fontSize: 17, color: "#ffffff", marginBottom: 20, marginTop: 0, fontFamily: "Poppins, sans-serif", letterSpacing: "-0.01em" }}>
                {lang === "de" ? "Interne Qualitätskontrolle" : lang === "tr" ? "İç Kalite Kontrolü" : "Internal Quality Control"}
              </h3>
              <p style={{ fontWeight: 300, fontSize: 15, color: "rgba(255,255,255,0.62)", lineHeight: 1.9, margin: 0, fontFamily: "Poppins, sans-serif" }}>
                {reportingInternal}
              </p>
            </div>

            {/* External */}
            <div>
              <h3 style={{ fontWeight: 600, fontSize: 17, color: "#ffffff", marginBottom: 20, marginTop: 0, fontFamily: "Poppins, sans-serif", letterSpacing: "-0.01em" }}>
                {lang === "de" ? "Externe Berichterstattung" : lang === "tr" ? "Harici Raporlama" : "External Reporting"}
              </h3>
              <p style={{ fontWeight: 300, fontSize: 15, color: "rgba(255,255,255,0.62)", lineHeight: 1.9, margin: 0, fontFamily: "Poppins, sans-serif" }}>
                {reportingExternal}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. CONTACT ────────────────────────────────────────────────────── */}
      <ContactBlock lang={lang} />

    </Layout>
  );
}
