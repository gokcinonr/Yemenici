import { useState } from "react";
import { Link } from "wouter";
import type { Lang } from "../contexts/LanguageContext";

const LABELS = {
  en: {
    eyebrow: "GET IN TOUCH",
    title: "Ready to Start Your Project?",
    subtitle:
      "Tell us about your requirements — our engineering team will respond within one business day.",
    firstName: "First Name", firstNamePh: "John",
    lastName: "Last Name", lastNamePh: "Smith",
    email: "Email Address", emailPh: "john@company.com",
    phone: "Phone", phonePh: "+1 555 000 0000",
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
    eyebrow: "KONTAKT",
    title: "Bereit, Ihr Projekt zu starten?",
    subtitle:
      "Schildern Sie uns Ihre Anforderungen \u2014 unser Technikteam antwortet innerhalb eines Werktages.",
    firstName: "Vorname", firstNamePh: "Max",
    lastName: "Nachname", lastNamePh: "M\u00fcller",
    email: "E-Mail-Adresse", emailPh: "max@unternehmen.de",
    phone: "Telefon", phonePh: "+49 (0) 000 000000",
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
    eyebrow: "\u0130LET\u0130\u015e\u0130M",
    title: "Projenize Ba\u015flamaya Haz\u0131r m\u0131s\u0131n\u0131z?",
    subtitle:
      "Gereksinimlerinizi bize iletin \u2014 m\u00fchendislik ekibimiz bir i\u015f g\u00fcn\u00fc i\u00e7inde yan\u0131t verir.",
    firstName: "Ad", firstNamePh: "Ahmet",
    lastName: "Soyad", lastNamePh: "Y\u0131lmaz",
    email: "E-posta Adresi", emailPh: "ahmet@sirket.com.tr",
    phone: "Telefon", phonePh: "+90 5XX XXX XX XX",
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
  "w-full bg-white/[0.06] border rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none transition duration-200";
const inputOk = "border-white/[0.10] focus:border-white/25";
const inputErr = "border-red-500/60 focus:border-red-500/60";
const labelCls =
  "block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35 mb-2";

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
        <p
          className="mt-1.5"
          style={{ fontSize: 12, color: "#f87171", fontFamily: "Poppins, sans-serif" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactBlock({ lang = "en" }: { lang?: Lang }) {
  const t = LABELS[lang];
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    companyName: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set =
    (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
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
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          position: form.position.trim() || undefined,
          companyName: form.companyName.trim(),
          message: form.message.trim(),
          lang,
          consent: form.consent,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      style={{ backgroundColor: "#0d1219", fontFamily: "Poppins, sans-serif" }}
      className="py-24 md:py-32"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="max-w-[620px] mx-auto text-center mb-14">
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              fontWeight: 600,
              color: "rgba(255,255,255,0.32)",
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            {t.eyebrow}
          </p>
          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 42px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            {t.title}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.45)", fontWeight: 400 }}>
            {t.subtitle}
          </p>
        </div>

        {status === "sent" ? (
          <div className="max-w-[480px] mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15 mb-5">
              <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p style={{ fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 8 }}>
              {t.sent}
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{t.sentSub}</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="max-w-[620px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <Field label={`${t.firstName} *`} error={errors.firstName}>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={set("firstName")}
                  placeholder={t.firstNamePh}
                  className={`${inputBase} ${errors.firstName ? inputErr : inputOk}`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                />
              </Field>
              <Field label={`${t.lastName} *`} error={errors.lastName}>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={set("lastName")}
                  placeholder={t.lastNamePh}
                  className={`${inputBase} ${errors.lastName ? inputErr : inputOk}`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <Field label={`${t.email} *`} error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder={t.emailPh}
                  className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                />
              </Field>
              <Field label={`${t.phone} (${t.optional})`}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder={t.phonePh}
                  className={`${inputBase} ${inputOk}`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <Field label={`${t.position} (${t.optional})`}>
                <input
                  type="text"
                  value={form.position}
                  onChange={set("position")}
                  placeholder={t.positionPh}
                  className={`${inputBase} ${inputOk}`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                />
              </Field>
              <Field label={t.companyName} error={errors.companyName}>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={set("companyName")}
                  placeholder={t.companyNamePh}
                  className={`${inputBase} ${errors.companyName ? inputErr : inputOk}`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                />
              </Field>
            </div>

            <div className="mb-5">
              <Field label={t.message} error={errors.message}>
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  placeholder={t.messagePh}
                  rows={5}
                  className={`${inputBase} ${errors.message ? inputErr : inputOk}`}
                  style={{ fontFamily: "Poppins, sans-serif", resize: "none" }}
                />
              </Field>
            </div>

            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={set("consent")}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors duration-150 ${
                      form.consent
                        ? "bg-[#004FA3] border-[#004FA3]"
                        : errors.consent
                        ? "border-red-500/70 bg-white/[0.04]"
                        : "border-white/25 bg-white/[0.04]"
                    }`}
                  >
                    {form.consent && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, fontFamily: "Poppins, sans-serif" }}>
                  {t.consentPre}
                  <Link
                    href="/terms-conditions"
                    style={{ color: "rgba(255,255,255,0.75)", textDecoration: "underline", textUnderlineOffset: "2px" }}
                  >
                    {t.consentTC}
                  </Link>
                  {t.consentMid}
                  <Link
                    href="/privacy-policy"
                    style={{ color: "rgba(255,255,255,0.75)", textDecoration: "underline", textUnderlineOffset: "2px" }}
                  >
                    {t.consentPP}
                  </Link>
                  {t.consentPost}
                </span>
              </label>
              {errors.consent && (
                <p className="mt-2 ml-7" style={{ fontSize: 12, color: "#f87171", fontFamily: "Poppins, sans-serif" }}>
                  {errors.consent}
                </p>
              )}
            </div>

            {status === "error" && (
              <p className="mb-4" style={{ fontSize: 13, color: "#f87171", fontFamily: "Poppins, sans-serif" }}>
                {t.error}
              </p>
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
        )}
      </div>
    </section>
  );
}
