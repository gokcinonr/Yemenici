import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import Layout from "../components/Layout";
import { useLanguage, type Lang } from "../contexts/LanguageContext";

/* ─── Types ─── */
type ContentRow = { section: string; key: string; value: string };

function useContent() {
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

interface LegalSection {
  id: string;
  title: string;
  body: string;
}

/* ─── Markdown Parser ─── */
function parseMarkdown(text: string): LegalSection[] {
  const sections: LegalSection[] = [];
  const parts = text.split(/\n(?=## )/);
  for (const part of parts) {
    const lines = part.trim().split("\n");
    const headingLine = lines[0];
    if (!headingLine.startsWith("## ")) continue;
    const title = headingLine.slice(3).trim();
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    const body = lines.slice(1).join("\n").trim();
    sections.push({ id, title, body });
  }
  return sections;
}

/* ─── Body Renderer ─── */
function renderBody(text: string): React.ReactNode[] {
  const paragraphs = text.split(/\n{2,}/);
  return paragraphs.map((para, pi) => {
    const lines = para.trim().split("\n");
    const isList = lines.every((l) => l.startsWith("- ") || l.trim() === "");
    if (isList && lines.some((l) => l.startsWith("- "))) {
      return (
        <ul key={pi} style={{ marginBottom: 16, paddingLeft: 20, listStyleType: "disc" }}>
          {lines.filter((l) => l.startsWith("- ")).map((l, li) => (
            <li key={li} style={{ fontSize: 15, lineHeight: 1.85, color: "#374151", marginBottom: 6, fontFamily: "Poppins, sans-serif" }}>
              {renderInline(l.slice(2))}
            </li>
          ))}
        </ul>
      );
    }
    const joined = lines.join(" ").trim();
    if (!joined) return null;
    return (
      <p key={pi} style={{ fontSize: 15, lineHeight: 1.9, color: "#374151", marginBottom: 16, fontFamily: "Poppins, sans-serif" }}>
        {renderInline(joined)}
      </p>
    );
  }).filter(Boolean);
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ fontWeight: 600, color: "#111827" }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/* ─── Labels ─── */
const UI: Record<Lang, {
  breadcrumb_home: string;
  toc_label: string;
  updated: string;
  terms_title: string;
  privacy_title: string;
}> = {
  en: {
    breadcrumb_home: "Home",
    toc_label: "Contents",
    updated: "Last updated:",
    terms_title: "Terms & Conditions",
    privacy_title: "Privacy Policy",
  },
  de: {
    breadcrumb_home: "Startseite",
    toc_label: "Inhalt",
    updated: "Zuletzt aktualisiert:",
    terms_title: "Allgemeine Geschäftsbedingungen",
    privacy_title: "Datenschutzerklärung",
  },
  tr: {
    breadcrumb_home: "Ana Sayfa",
    toc_label: "İçindekiler",
    updated: "Son güncelleme:",
    terms_title: "Kullanım Koşulları",
    privacy_title: "Gizlilik Politikası",
  },
};

/* ─── Default Content ─── */
const DEFAULT_TERMS: Record<Lang, string> = {
  en: `## 1. Introduction
These Terms and Conditions ("Terms") govern the purchase of products and use of services provided by Yemenici Rubber Industry and Trade Inc. ("Yemenici", "we", "our"). By placing an order or using our services, you confirm that you have read, understood, and agree to be bound by these Terms.

## 2. Definitions
**"Buyer"** or **"Customer"** means any legal or natural person placing an order with Yemenici. **"Products"** means all rubber components, seals, and technical parts manufactured and supplied by Yemenici. **"Order"** means a purchase order or written agreement accepted by Yemenici.

## 3. Orders and Acceptance
All orders are subject to written acceptance by Yemenici. We reserve the right to decline any order at our discretion. Orders become binding only upon issuance of an order confirmation or written acceptance. Specifications, quantities, and delivery dates must be agreed upon in writing before production commences.

## 4. Prices and Payment
Prices are quoted in the agreed currency and are valid for the period stated in the quotation. Unless otherwise agreed, payment is due within 30 days from the invoice date. We reserve the right to apply interest on overdue payments at the maximum rate permitted by applicable law.

## 5. Delivery and Risk
Delivery terms are as agreed in writing (e.g., EXW, FOB, CIF per Incoterms 2020). Risk of loss or damage transfers to the Buyer upon delivery. Delivery dates are estimates and Yemenici is not liable for delays caused by circumstances beyond our reasonable control.

## 6. Warranty
Yemenici warrants that its products will conform to the agreed technical specifications at the time of delivery. This warranty does not apply to defects arising from misuse, improper installation, or modifications made without our written consent. Warranty claims must be submitted in writing within 30 days of discovery.

## 7. Intellectual Property
All designs, technical drawings, moulds, and product specifications developed by Yemenici remain our exclusive property. Nothing in these Terms transfers any intellectual property rights to the Buyer.

## 8. Limitation of Liability
To the maximum extent permitted by law, Yemenici's liability shall not exceed the invoice value of the specific products giving rise to the claim. We shall not be liable for indirect, incidental, or consequential damages.

## 9. Governing Law and Jurisdiction
These Terms are governed by the laws of the Republic of Turkey. Any disputes shall be submitted to the exclusive jurisdiction of the courts located in Gaziantep, Turkey.

## 10. Changes to These Terms
We may update these Terms from time to time. The version posted on our website and communicated at the time of order confirmation shall apply to each transaction.`,

  de: `## 1. Einleitung
Diese Allgemeinen Geschäftsbedingungen ("AGB") regeln den Kauf von Produkten und die Inanspruchnahme von Dienstleistungen der Yemenici Kautschuk Industrie und Handel AG ("Yemenici"). Mit der Aufgabe einer Bestellung erkennen Sie diese AGB an.

## 2. Definitionen
**"Käufer"** oder **"Kunde"** bezeichnet jede natürliche oder juristische Person, die eine Bestellung bei Yemenici aufgibt. **"Produkte"** bezeichnet alle von Yemenici hergestellten Kautschukkomponenten, Dichtungen und technischen Teile.

## 3. Bestellungen und Annahme
Alle Bestellungen bedürfen der schriftlichen Bestätigung durch Yemenici. Wir behalten uns das Recht vor, Bestellungen nach eigenem Ermessen abzulehnen. Bestellungen werden erst mit der Auftragsbestätigung verbindlich.

## 4. Preise und Zahlung
Preise verstehen sich in der vereinbarten Währung und gelten für den im Angebot genannten Zeitraum. Sofern nicht anders vereinbart, ist die Zahlung innerhalb von 30 Tagen ab Rechnungsdatum fällig.

## 5. Lieferung und Gefahrenübergang
Lieferbedingungen werden schriftlich vereinbart (z.B. EXW, FOB, CIF gemäß Incoterms 2020). Der Gefahrenübergang erfolgt bei Übergabe an den Käufer. Liefertermine sind unverbindliche Schätzungen.

## 6. Gewährleistung
Yemenici gewährleistet, dass seine Produkte zum Zeitpunkt der Lieferung den vereinbarten technischen Spezifikationen entsprechen. Gewährleistungsansprüche sind innerhalb von 30 Tagen nach Entdeckung schriftlich geltend zu machen.

## 7. Geistiges Eigentum
Alle von Yemenici entwickelten Designs, technischen Zeichnungen, Formen und Produktspezifikationen verbleiben in unserem ausschließlichen Eigentum.

## 8. Haftungsbeschränkung
Die Haftung von Yemenici ist auf den Rechnungswert der betroffenen Produkte begrenzt. Wir haften nicht für mittelbare oder Folgeschäden.

## 9. Anwendbares Recht und Gerichtsstand
Diese AGB unterliegen dem Recht der Republik Türkei. Streitigkeiten werden den Gerichten in Gaziantep vorgelegt.

## 10. Änderungen der AGB
Wir können diese AGB von Zeit zu Zeit aktualisieren. Die zum Zeitpunkt der Bestellbestätigung gültige Fassung gilt für jede Transaktion.`,

  tr: `## 1. Giriş
Bu Kullanım Koşulları ("Koşullar"), Yemenici Lastik San. ve Tic. A.Ş. ("Yemenici", "biz", "bizim") tarafından sunulan ürünlerin satın alınmasını ve hizmetlerin kullanımını düzenler. Sipariş vererek veya hizmetlerimizi kullanarak bu Koşulları okuduğunuzu, anladığınızı ve bağlı olmayı kabul ettiğinizi onaylarsınız.

## 2. Tanımlar
**"Alıcı"** veya **"Müşteri"**, Yemenici'ye sipariş veren herhangi bir gerçek veya tüzel kişiyi ifade eder. **"Ürünler"**, Yemenici tarafından üretilen ve tedarik edilen tüm kauçuk bileşenleri, contaları ve teknik parçaları ifade eder.

## 3. Siparişler ve Kabul
Tüm siparişler Yemenici'nin yazılı kabulüne tabidir. Yemenici, herhangi bir siparişi takdirine bağlı olarak reddetme hakkını saklı tutar. Siparişler yalnızca sipariş onayının verilmesiyle bağlayıcı hale gelir.

## 4. Fiyatlar ve Ödeme
Fiyatlar anlaşılan para biriminde belirtilir. Aksi kararlaştırılmadıkça ödeme, fatura tarihinden itibaren 30 gün içinde yapılmalıdır.

## 5. Teslimat ve Risk
Teslimat koşulları yazılı olarak kararlaştırılır (örn. EXW, FOB, CIF, Incoterms 2020 uyarınca). Hasar veya kayıp riski, teslimat anında Alıcı'ya geçer.

## 6. Garanti
Yemenici, ürünlerinin teslimat anında kararlaştırılan teknik özelliklere uygun olacağını garanti eder. Garanti talepleri, tespitten itibaren 30 gün içinde yazılı olarak iletilmelidir.

## 7. Fikri Mülkiyet
Yemenici tarafından geliştirilen tüm tasarımlar, teknik çizimler, kalıplar ve ürün özellikleri münhasıran şirketimize aittir.

## 8. Sorumluluk Sınırlaması
Yemenici'nin sorumluluğu, talebe konu ürünlerin fatura değeriyle sınırlıdır. Dolaylı veya sonuç kayıplarından sorumlu değiliz.

## 9. Geçerli Hukuk ve Yargı Yetkisi
Bu Koşullar, Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklar Gaziantep mahkemelerine sunulacaktır.

## 10. Koşullardaki Değişiklikler
Bu Koşulları zaman zaman güncelleyebiliriz. Sipariş onayı anında geçerli olan versiyon her işlem için geçerlidir.`,
};

const DEFAULT_PRIVACY: Record<Lang, string> = {
  en: `## 1. Introduction
Yemenici Rubber Industry and Trade Inc. ("Yemenici", "we", "us") is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and share information about you when you visit our website or interact with our business. It complies with the EU General Data Protection Regulation (GDPR) and applicable Turkish data protection law (KVKK).

## 2. Data Controller
The data controller responsible for your personal data is Yemenici Rubber Industry and Trade Inc., Organize Sanayi Bölgesi, Gaziantep, Turkey. For privacy enquiries, contact: info@yemenici.com

## 3. Data We Collect
We collect information you provide directly — such as name, email address, phone number, company name, position, and any details submitted via our contact form — and technical data collected automatically (IP address, browser type, pages visited, time spent, referring URL) when you visit our website.

## 4. How We Use Your Data
We use your data to respond to enquiries and communicate about your request; to manage our business relationship if you are a customer or supplier; to improve and maintain our website; to comply with legal obligations; and to send relevant product and company news where you have given consent.

## 5. Legal Basis for Processing
Depending on the purpose, we rely on the following legal bases under GDPR: **Contractual necessity** (Art. 6(1)(b)) for order and service delivery; **Legitimate interests** (Art. 6(1)(f)) for website analytics and security; **Consent** (Art. 6(1)(a)) for marketing communications and non-essential cookies; **Legal obligation** (Art. 6(1)(c)) for statutory record-keeping.

## 6. Data Sharing
We do not sell your personal data. We may share it with trusted third-party service providers (IT infrastructure, email delivery) under strict data processing agreements, and with authorities where required by law.

## 7. International Transfers
If we transfer your data outside the European Economic Area (EEA), we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.

## 8. Data Retention
We retain your personal data only for as long as necessary. Contact enquiries are retained for up to 3 years. Customer transaction records are retained for up to 10 years for legal and accounting purposes.

## 9. Your Rights Under GDPR
You have the right to: access your personal data; rectify inaccurate data; request erasure ("right to be forgotten"); restrict or object to processing; data portability; and withdraw consent at any time. To exercise these rights, contact us at info@yemenici.com. You have the right to lodge a complaint with your supervisory authority.

## 10. Cookies
We use cookies and similar technologies to operate and improve our website. Please see our cookie banner for detailed information and to manage your preferences.

## 11. Security
We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure.

## 12. Changes to this Policy
We may update this Privacy Policy periodically. The effective date at the top of this page will reflect any changes. We encourage you to review this page regularly.

## 13. Contact
For any privacy-related questions, contact our Data Protection contact at: info@yemenici.com`,

  de: `## 1. Einleitung
Yemenici Lastik San. ve Tic. A.Ş. ("Yemenici") verpflichtet sich zum Schutz Ihrer personenbezogenen Daten. Diese Datenschutzerklärung erläutert, wie wir Informationen über Sie erheben und verwenden. Sie entspricht der EU-Datenschutz-Grundverordnung (DSGVO) und dem türkischen Datenschutzgesetz (KVKK).

## 2. Verantwortlicher
Verantwortlicher für Ihre personenbezogenen Daten ist Yemenici Lastik San. ve Tic. A.Ş., Organize Sanayi Bölgesi, Gaziantep, Türkei. Kontakt: info@yemenici.com

## 3. Erhobene Daten
Wir erheben von Ihnen direkt bereitgestellte Informationen (Name, E-Mail, Telefon, Unternehmen, Position) sowie technische Daten (IP-Adresse, Browsertyp, besuchte Seiten) bei Ihrem Website-Besuch.

## 4. Zwecke der Datenverarbeitung
Wir verwenden Ihre Daten zur Beantwortung von Anfragen, zur Verwaltung unserer Geschäftsbeziehung, zur Verbesserung unserer Website, zur Erfüllung gesetzlicher Pflichten und zum Versand relevanter Informationen mit Ihrer Einwilligung.

## 5. Rechtsgrundlage der Verarbeitung
Je nach Zweck stützen wir uns auf: **Vertragliche Notwendigkeit** (Art. 6(1)(b) DSGVO); **Berechtigte Interessen** (Art. 6(1)(f) DSGVO); **Einwilligung** (Art. 6(1)(a) DSGVO); **Gesetzliche Verpflichtung** (Art. 6(1)(c) DSGVO).

## 6. Datenweitergabe
Wir verkaufen Ihre Daten nicht. Wir können sie unter strikten Datenverarbeitungsverträgen an Dienstleister weitergeben sowie an Behörden, wenn gesetzlich vorgeschrieben.

## 7. Internationale Übermittlungen
Bei Übermittlungen außerhalb des EWR stellen wir geeignete Garantien sicher, z.B. Standardvertragsklauseln der EU-Kommission.

## 8. Datenspeicherung
Kontaktanfragen werden bis zu 3 Jahre aufbewahrt. Kundentransaktionsdaten werden bis zu 10 Jahre für gesetzliche Zwecke gespeichert.

## 9. Ihre Rechte nach der DSGVO
Sie haben das Recht auf Zugang, Berichtigung, Löschung ("Recht auf Vergessenwerden"), Einschränkung oder Widerspruch der Verarbeitung, Datenübertragbarkeit und Widerruf Ihrer Einwilligung. Kontakt: info@yemenici.com

## 10. Cookies
Wir verwenden Cookies und ähnliche Technologien. Weitere Informationen und die Verwaltung Ihrer Einstellungen finden Sie im Cookie-Banner.

## 11. Sicherheit
Wir implementieren geeignete technische und organisatorische Maßnahmen zum Schutz Ihrer Daten.

## 12. Änderungen dieser Erklärung
Wir können diese Datenschutzerklärung gelegentlich aktualisieren. Das Datum der letzten Aktualisierung wird oben auf dieser Seite angezeigt.

## 13. Kontakt
Für datenschutzbezogene Fragen: info@yemenici.com`,

  tr: `## 1. Giriş
Yemenici Lastik San. ve Tic. A.Ş. ("Yemenici") kişisel verilerinizin korunmasına kararlıdır. Bu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde veya şirketimizle etkileşime geçtiğinizde bilgilerinizi nasıl topladığımızı, kullandığımızı ve sakladığımızı açıklar. AB Genel Veri Koruma Yönetmeliği (GDPR) ve Türk Kişisel Verilerin Korunması Kanunu'na (KVKK) uygundur.

## 2. Veri Sorumlusu
Kişisel verilerinizden sorumlu veri sorumlusu: Yemenici Lastik San. ve Tic. A.Ş., Organize Sanayi Bölgesi, Gaziantep, Türkiye. İletişim: info@yemenici.com

## 3. Topladığımız Veriler
Doğrudan iletişim formu aracılığıyla sağladığınız bilgileri (ad, e-posta, telefon, şirket adı, pozisyon) ve web sitemizi ziyaret ettiğinizde otomatik olarak toplanan teknik verileri (IP adresi, tarayıcı türü, ziyaret edilen sayfalar) toplarız.

## 4. Verilerinizi Nasıl Kullanıyoruz
Verilerinizi; taleplere yanıt vermek, iş ilişkisini yönetmek, web sitemizi geliştirmek, yasal yükümlülükleri yerine getirmek ve onayınız dahilinde ilgili bilgileri göndermek amacıyla kullanırız.

## 5. İşlemenin Hukuki Dayanağı
GDPR kapsamında şu hukuki dayanakları kullanırız: **Sözleşme gerekliliği** (Mad. 6(1)(b)); **Meşru menfaat** (Mad. 6(1)(f)); **Rıza** (Mad. 6(1)(a)); **Yasal yükümlülük** (Mad. 6(1)(c)).

## 6. Veri Paylaşımı
Kişisel verilerinizi satmayız. Yalnızca katı veri işleme sözleşmeleri çerçevesinde güvenilen hizmet sağlayıcılarla ve yasal zorunluluk halinde makamlarla paylaşabiliriz.

## 7. Uluslararası Aktarımlar
Verilerinizi AEA dışına aktarırsak, AB Komisyonu tarafından onaylanan Standart Sözleşme Maddeleri gibi uygun güvencelerin mevcut olmasını sağlarız.

## 8. Veri Saklama
İletişim talepleri en fazla 3 yıl saklanır. Müşteri işlem kayıtları yasal ve muhasebe amaçlarıyla en fazla 10 yıl saklanır.

## 9. GDPR Kapsamındaki Haklarınız
Kişisel verilerinize erişim, yanlış verileri düzeltme, silme ("unutulma hakkı"), işlemeyi kısıtlama veya itiraz etme, veri taşınabilirliği ve onayınızı geri çekme haklarına sahipsiniz. Haklarınızı kullanmak için: info@yemenici.com

## 10. Çerezler
Web sitemizi işletmek ve iyileştirmek için çerezler kullanıyoruz. Ayrıntılar ve tercihlerinizi yönetmek için çerez banner'ımıza bakınız.

## 11. Güvenlik
Kişisel verilerinizi yetkisiz erişim, kayıp veya ifşaya karşı korumak için uygun teknik ve organizasyonel önlemler uyguluyoruz.

## 12. Politika Değişiklikleri
Bu Gizlilik Politikasını periyodik olarak güncelleyebiliriz. Sayfanın üstündeki tarih son güncellemeyi yansıtır.

## 13. İletişim
Gizlilikle ilgili sorularınız için: info@yemenici.com`,
};

const DEFAULT_UPDATED: Record<Lang, string> = {
  en: "June 10, 2026",
  de: "10. Juni 2026",
  tr: "10 Haziran 2026",
};

/* ─── TOC Component ─── */
function TableOfContents({
  sections,
  activeId,
  label,
}: {
  sections: LegalSection[];
  activeId: string;
  label: string;
}) {
  return (
    <nav style={{ fontFamily: "Poppins, sans-serif" }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 14 }}>
        {label}
      </p>
      <div className="space-y-0.5">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            style={{
              display: "block",
              fontSize: 13,
              lineHeight: 1.5,
              padding: "5px 10px",
              borderRadius: 6,
              borderLeft: activeId === s.id ? "2px solid #004FA3" : "2px solid transparent",
              background: activeId === s.id ? "rgba(0,79,163,0.06)" : "transparent",
              color: activeId === s.id ? "#004FA3" : "#6b7280",
              fontWeight: activeId === s.id ? 600 : 400,
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
          >
            {s.title}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ─── Main Component ─── */
export default function LegalPage({
  pageSection,
}: {
  pageSection: "legal_terms" | "legal_privacy";
}) {
  const { lang } = useLanguage();
  const get = useContent();
  const ui = UI[lang];

  const isTerms = pageSection === "legal_terms";
  const pageTitle = isTerms ? ui.terms_title : ui.privacy_title;
  const breadcrumb = isTerms
    ? (lang === "en" ? "Terms & Conditions" : lang === "de" ? "AGB" : "Kullanım Koşulları")
    : (lang === "en" ? "Privacy Policy" : lang === "de" ? "Datenschutz" : "Gizlilik");

  const defaults = isTerms ? DEFAULT_TERMS : DEFAULT_PRIVACY;
  const rawContent = get(pageSection, `content_${lang}`, defaults[lang]);
  const lastUpdated = get(pageSection, `updated_${lang}`, DEFAULT_UPDATED[lang]);

  const sections = parseMarkdown(rawContent);
  const [activeId, setActiveId] = useState(sections[0]?.id || "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [sections.length, lang]);

  return (
    <Layout>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg,#0b1628 0%,#0f1f3d 60%,#091325 100%)",
          fontFamily: "Poppins, sans-serif",
        }}
        className="pt-[107px]"
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/"
              style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}
            >
              {ui.breadcrumb_home}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>/</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em" }}>
              {breadcrumb}
            </span>
          </div>
          <h1
            style={{ fontWeight: 200, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.01em" }}
            className="text-[clamp(32px,5vw,64px)] mb-4"
          >
            {pageTitle}
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontFamily: "Poppins, sans-serif" }}>
            {ui.updated} {lastUpdated}
          </p>
        </div>
      </section>

      {/* Body */}
      <section style={{ backgroundColor: "#fafbfc", fontFamily: "Poppins, sans-serif" }} className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <div className="flex gap-14 items-start">
            {/* Sticky TOC — hidden on mobile */}
            <div className="hidden lg:block w-[220px] flex-shrink-0">
              <div className="sticky top-8">
                <TableOfContents sections={sections} activeId={activeId} label={ui.toc_label} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="max-w-[720px]">
                {sections.map((section, idx) => (
                  <div
                    key={section.id}
                    id={section.id}
                    style={{ scrollMarginTop: 32, marginBottom: idx < sections.length - 1 ? 52 : 0 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        marginBottom: 18,
                        paddingBottom: 14,
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <h2
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#0b1628",
                          lineHeight: 1.3,
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {section.title}
                      </h2>
                    </div>
                    <div>{renderBody(section.body)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
