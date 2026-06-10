import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "../contexts/LanguageContext";
import Layout from "../components/Layout";

const LABELS = {
  en: {
    breadcrumb: "Contact",
    heroTitle: "Contact Us",
    heroSub: "We look forward to hearing from you.",
    infoTitle: "Get in Touch",
    addressLabel: "Address",
    address: "Yemenici Lastik San. ve Tic. A.Ş.\nOrganize Sanayi Bölgesi\nTürkiye",
    phoneLabel: "Phone",
    phone: "+90 (000) 000 00 00",
    emailLabel: "Email",
    emailVal: "info@yemenici.com",
    hoursLabel: "Business Hours",
    hours: "Monday – Friday\n08:00 – 17:30",
    formTitle: "Send Us a Message",
    firstName: "First Name", firstNamePh: "John",
    lastName: "Last Name", lastNamePh: "Smith",
    email: "Email Address", emailPh: "john@company.com",
    phone2: "Phone", phonePh: "+1 555 000 0000",
    position: "Position", positionPh: "Purchasing Manager",
    companyName: "Company Name *", companyNamePh: "Acme Corporation",
    message: "Message *", messagePh: "Describe your application or requirement…",
    consentPre: "I confirm I have read and agree to Yemenici\u2019s\u00a0",
    consentTC: "Terms & Conditions",
    consentMid: "\u00a0and\u00a0",
    consentPP: "Privacy Policy",
    consentPost: ".",
    required: "This field is required.",
    emailInvalid: "Please enter a valid email address.",
    consentRequired: "You must accept the Terms & Conditions and Privacy Policy to proceed.",
    send: "Send Message",
    sending: "Sending\u2026",
    sent: "Message Sent",
    sentSub: "We\u2019ll be in touch within one business day.",
    error: "Something went wrong. Please try again.",
    optional: "Optional",
  },
  de: {
    breadcrumb: "Kontakt",
    heroTitle: "Kontakt",
    heroSub: "Wir freuen uns von Ihnen zu h\u00f6ren.",
    infoTitle: "Schreiben Sie uns",
    addressLabel: "Adresse",
    address: "Yemenici Lastik San. ve Tic. A.\u015e.\nOrganize Sanayi B\u00f6lgesi\nT\u00fcrkei",
    phoneLabel: "Telefon",
    phone: "+90 (000) 000 00 00",
    emailLabel: "E-Mail",
    emailVal: "info@yemenici.com",
    hoursLabel: "Gesch\u00e4ftszeiten",
    hours: "Montag \u2013 Freitag\n08:00 \u2013 17:30",
    formTitle: "Nachricht senden",
    firstName: "Vorname", firstNamePh: "Max",
    lastName: "Nachname", lastNamePh: "M\u00fcller",
    email: "E-Mail-Adresse", emailPh: "max@unternehmen.de",
    phone2: "Telefon", phonePh: "+49 (0) 000 000000",
    position: "Position", positionPh: "Einkaufsleiter",
    companyName: "Unternehmen *", companyNamePh: "Mustermann GmbH",
    message: "Nachricht *", messagePh: "Beschreiben Sie Ihre Anwendung oder Anforderung\u2026",
    consentPre: "Ich best\u00e4tige, dass ich die\u00a0",
    consentTC: "Allgemeinen Gesch\u00e4ftsbedingungen",
    consentMid: "\u00a0und die\u00a0",
    consentPP: "Datenschutzerkl\u00e4rung",
    consentPost: "\u00a0von Yemenici gelesen habe und zustimme.",
    required: "Dieses Feld ist erforderlich.",
    emailInvalid: "Bitte geben Sie eine g\u00fcltige E-Mail-Adresse ein.",
    consentRequired: "Sie m\u00fcssen den AGB und der Datenschutzerkl\u00e4rung zustimmen.",
    send: "Nachricht senden",
    sending: "Wird gesendet\u2026",
    sent: "Nachricht gesendet",
    sentSub: "Wir melden uns innerhalb eines Werktages bei Ihnen.",
    error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    optional: "Optional",
  },
  tr: {
    breadcrumb: "\u0130leti\u015fim",
    heroTitle: "\u0130leti\u015fim",
    heroSub: "Sizden haber almak i\u00e7in sab\u0131rs\u0131zlan\u0131yoruz.",
    infoTitle: "Bize Ula\u015f\u0131n",
    addressLabel: "Adres",
    address: "Yemenici Lastik San. ve Tic. A.\u015e.\nOrganize Sanayi B\u00f6lgesi\nT\u00fcrkiye",
    phoneLabel: "Telefon",
    phone: "+90 (000) 000 00 00",
    emailLabel: "E-posta",
    emailVal: "info@yemenici.com",
    hoursLabel: "\u00c7al\u0131\u015fma Saatleri",
    hours: "Pazartesi \u2013 Cuma\n08:00 \u2013 17:30",
    formTitle: "Bize Yaz\u0131n",
    firstName: "Ad", firstNamePh: "Ahmet",
    lastName: "Soyad", lastNamePh: "Y\u0131lmaz",
    email: "E-posta Adresi", emailPh: "ahmet@sirket.com.tr",
    phone2: "Telefon", phonePh: "+90 5XX XXX XX XX",
    position: "Pozisyon", positionPh: "Sat\u0131n Alma M\u00fcdr\u00fc",
    companyName: "\u015eirket Ad\u0131 *", companyNamePh: "\u00d6rnek A.\u015e.",
    message: "Mesaj *", messagePh: "Uygulaman\u0131z\u0131 veya gereksinimlerinizi a\u00e7\u0131klay\u0131n\u2026",
    consentPre: "Yemenici\u2019nin\u00a0",
    consentTC: "Kullan\u0131m Ko\u015fullar\u0131",
    consentMid: "\u00a0ve\u00a0",
    consentPP: "Gizlilik Politikas\u0131",
    consentPost: "\u2019n\u0131 okudu\u011fumu ve kabul etti\u011fimi onaylar\u0131m.",
    required: "Bu alan zorunludur.",
    emailInvalid: "L\u00fctfen ge\u00e7erli bir e-posta adresi girin.",
    consentRequired:
      "Devam etmek i\u00e7in Kullan\u0131m Ko\u015fullar\u0131 ve Gizlilik Politikas\u0131\u2019n\u0131 kabul etmelisiniz.",
    send: "Mesaj G\u00f6nder",
    sending: "G\u00f6nderiliyor\u2026",
    sent: "Mesaj G\u00f6nderildi",
    sentSub: "Bir i\u015f g\u00fcn\u00fc i\u00e7inde sizinle ileti\u015fime ge\u00e7ece\u011fiz.",
    error: "Bir hata olu\u015ftu. L\u00fctfen tekrar deneyin.",
    optional: "\u0130ste\u011fe Ba\u011fl\u0131",
  },
} as const;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  companyName: string;
  message: string;
  consent: boolean;
}
type FieldErrors = Partial<Record<keyof FormData, string>>;

const inputBase =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#004FA3]/20 focus:border-[#004FA3] transition duration-200";
const inputErr =
  "w-full bg-white border border-red-400 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition duration-200";
const labelCls =
  "block text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-2";

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label className={labelCls} style={{ fontFamily: "Poppins, sans-serif" }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5" style={{ fontSize: 12, color: "#ef4444", fontFamily: "Poppins, sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: "rgba(0,79,163,0.08)" }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4, fontFamily: "Poppins, sans-serif" }}>
          {label}
        </p>
        {value.split("\n").map((line, i) => (
          <p key={i} style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, fontFamily: "Poppins, sans-serif" }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const { lang } = useLanguage();
  const t = LABELS[lang];

  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    position: "", companyName: "", message: "", consent: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set =
    (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val =
        e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm((f) => ({ ...f, [k]: val }));
      if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
    };

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!form.firstName.trim()) errs.firstName = t.required;
    if (!form.lastName.trim()) errs.lastName = t.required;
    if (!form.email.trim()) errs.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = t.emailInvalid;
    if (!form.companyName.trim()) errs.companyName = t.required;
    if (!form.message.trim()) errs.message = t.required;
    if (!form.consent) errs.consent = t.consentRequired;
    return errs;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(), lastName: form.lastName.trim(),
          email: form.email.trim(), phone: form.phone.trim() || undefined,
          position: form.position.trim() || undefined, companyName: form.companyName.trim(),
          message: form.message.trim(), lang, consent: form.consent,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Layout>
      {/* ── Hero ── */}
      <section
        style={{ background: "linear-gradient(135deg,#0b1628 0%,#0f1f3d 60%,#091325 100%)", fontFamily: "Poppins, sans-serif" }}
        className="pt-[107px]"
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-20 md:py-28">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>/</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em" }}>{t.breadcrumb}</span>
          </div>
          <h1
            style={{ fontWeight: 200, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.01em" }}
            className="text-[clamp(40px,6vw,80px)] mb-6 max-w-[700px]"
          >
            {t.heroTitle}
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", fontWeight: 400, lineHeight: 1.7 }}>
            {t.heroSub}
          </p>
        </div>
      </section>

      {/* ── Main ── */}
      <section style={{ backgroundColor: "#f8f9fb", fontFamily: "Poppins, sans-serif" }} className="py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-20 items-start">

            {/* Left: info */}
            <div className="space-y-8">
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", color: "#004FA3", textTransform: "uppercase", marginBottom: 12 }}>
                  {t.breadcrumb}
                </p>
                <h2 style={{ fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#0b1628", lineHeight: 1.2, marginBottom: 8 }}>
                  {t.infoTitle}
                </h2>
                <div style={{ width: 40, height: 3, backgroundColor: "#004FA3", borderRadius: 2, marginBottom: 32 }} />
              </div>

              <div className="space-y-6">
                <InfoItem
                  label={t.addressLabel}
                  value={t.address}
                  icon={
                    <svg className="w-5 h-5" style={{ color: "#004FA3" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                />
                <InfoItem
                  label={t.phoneLabel}
                  value={t.phone}
                  icon={
                    <svg className="w-5 h-5" style={{ color: "#004FA3" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  }
                />
                <InfoItem
                  label={t.emailLabel}
                  value={t.emailVal}
                  icon={
                    <svg className="w-5 h-5" style={{ color: "#004FA3" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
                <InfoItem
                  label={t.hoursLabel}
                  value={t.hours}
                  icon={
                    <svg className="w-5 h-5" style={{ color: "#004FA3" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              </div>
            </div>

            {/* Right: form card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
              {status === "sent" ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-5">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, fontFamily: "Poppins, sans-serif" }}>
                    {t.sent}
                  </p>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, fontFamily: "Poppins, sans-serif" }}>
                    {t.sentSub}
                  </p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0b1628", marginBottom: 24, fontFamily: "Poppins, sans-serif" }}>
                    {t.formTitle}
                  </h3>

                  <form onSubmit={submit} noValidate className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label={`${t.firstName} *`} error={errors.firstName}>
                        <input type="text" value={form.firstName} onChange={set("firstName")}
                          placeholder={t.firstNamePh}
                          className={errors.firstName ? inputErr : inputBase}
                          style={{ fontFamily: "Poppins, sans-serif" }} />
                      </Field>
                      <Field label={`${t.lastName} *`} error={errors.lastName}>
                        <input type="text" value={form.lastName} onChange={set("lastName")}
                          placeholder={t.lastNamePh}
                          className={errors.lastName ? inputErr : inputBase}
                          style={{ fontFamily: "Poppins, sans-serif" }} />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label={`${t.email} *`} error={errors.email}>
                        <input type="email" value={form.email} onChange={set("email")}
                          placeholder={t.emailPh}
                          className={errors.email ? inputErr : inputBase}
                          style={{ fontFamily: "Poppins, sans-serif" }} />
                      </Field>
                      <Field label={`${t.phone2} (${t.optional})`}>
                        <input type="tel" value={form.phone} onChange={set("phone")}
                          placeholder={t.phonePh}
                          className={inputBase}
                          style={{ fontFamily: "Poppins, sans-serif" }} />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label={`${t.position} (${t.optional})`}>
                        <input type="text" value={form.position} onChange={set("position")}
                          placeholder={t.positionPh}
                          className={inputBase}
                          style={{ fontFamily: "Poppins, sans-serif" }} />
                      </Field>
                      <Field label={t.companyName} error={errors.companyName}>
                        <input type="text" value={form.companyName} onChange={set("companyName")}
                          placeholder={t.companyNamePh}
                          className={errors.companyName ? inputErr : inputBase}
                          style={{ fontFamily: "Poppins, sans-serif" }} />
                      </Field>
                    </div>

                    <Field label={t.message} error={errors.message}>
                      <textarea value={form.message} onChange={set("message")}
                        placeholder={t.messagePh} rows={5}
                        className={errors.message ? inputErr : inputBase}
                        style={{ fontFamily: "Poppins, sans-serif", resize: "none" }} />
                    </Field>

                    {/* Consent */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <div className="relative flex-shrink-0 mt-0.5">
                          <input type="checkbox" checked={form.consent} onChange={set("consent")} className="sr-only" />
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors duration-150 ${
                            form.consent ? "bg-[#004FA3] border-[#004FA3]"
                              : errors.consent ? "border-red-400 bg-red-50"
                              : "border-gray-300 bg-white"}`}>
                            {form.consent && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, fontFamily: "Poppins, sans-serif" }}>
                          {t.consentPre}
                          <Link href="/terms-conditions" style={{ color: "#004FA3", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                            {t.consentTC}
                          </Link>
                          {t.consentMid}
                          <Link href="/privacy-policy" style={{ color: "#004FA3", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                            {t.consentPP}
                          </Link>
                          {t.consentPost}
                        </span>
                      </label>
                      {errors.consent && (
                        <p className="mt-2 ml-7" style={{ fontSize: 12, color: "#ef4444", fontFamily: "Poppins, sans-serif" }}>
                          {errors.consent}
                        </p>
                      )}
                    </div>

                    {status === "error" && (
                      <p style={{ fontSize: 13, color: "#ef4444", fontFamily: "Poppins, sans-serif" }}>{t.error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full flex items-center justify-center gap-2.5 bg-[#004FA3] hover:bg-[#003d80] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200"
                      style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, letterSpacing: "0.02em" }}
                    >
                      {status === "sending" ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          {t.sending}
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          {t.send}
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
