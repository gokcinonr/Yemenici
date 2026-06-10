import { useState } from "react";
import type { Lang } from "../contexts/LanguageContext";

const LABELS: Record<Lang, {
  eyebrow: string; title: string; subtitle: string;
  name: string; email: string; message: string;
  namePh: string; emailPh: string; messagePh: string;
  send: string; sending: string; sent: string; sentSub: string; error: string;
}> = {
  en: {
    eyebrow: "GET IN TOUCH",
    title: "Ready to Start Your Project?",
    subtitle: "Tell us about your requirements — our engineering team will respond within one business day.",
    name: "Full Name", email: "Email Address", message: "Message",
    namePh: "Your name", emailPh: "your@email.com",
    messagePh: "Describe your application or requirement...",
    send: "Send Message", sending: "Sending…",
    sent: "Message Sent", sentSub: "We'll be in touch within one business day.",
    error: "Something went wrong. Please try again.",
  },
  de: {
    eyebrow: "KONTAKT",
    title: "Bereit, Ihr Projekt zu starten?",
    subtitle: "Schildern Sie uns Ihre Anforderungen — unser Technikteam antwortet innerhalb eines Werktages.",
    name: "Name", email: "E-Mail-Adresse", message: "Nachricht",
    namePh: "Ihr Name", emailPh: "ihre@email.com",
    messagePh: "Beschreiben Sie Ihre Anwendung oder Anforderung…",
    send: "Nachricht senden", sending: "Wird gesendet…",
    sent: "Nachricht gesendet", sentSub: "Wir melden uns innerhalb eines Werktages bei Ihnen.",
    error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
  },
  tr: {
    eyebrow: "İLETİŞİM",
    title: "Projenize Başlamaya Hazır mısınız?",
    subtitle: "Gereksinimlerinizi bize iletin — mühendislik ekibimiz bir iş günü içinde yanıt verir.",
    name: "Ad Soyad", email: "E-posta Adresi", message: "Mesaj",
    namePh: "Adınız", emailPh: "siz@email.com",
    messagePh: "Uygulamanızı veya gereksinimlerinizi açıklayın…",
    send: "Mesaj Gönder", sending: "Gönderiliyor…",
    sent: "Mesaj Gönderildi", sentSub: "Bir iş günü içinde sizinle iletişime geçeceğiz.",
    error: "Bir hata oluştu. Lütfen tekrar deneyin.",
  },
};

export default function ContactBlock({ lang = "en" }: { lang?: Lang }) {
  const t = LABELS[lang];
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const inputCls = [
    "w-full bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-3",
    "text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/25",
    "transition duration-200",
  ].join(" ");

  const labelCls =
    "block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35 mb-2";

  return (
    <section
      style={{ backgroundColor: "#0d1219", fontFamily: "Poppins, sans-serif" }}
      className="py-24 md:py-32"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="max-w-[620px] mx-auto text-center mb-14">
          <p
            style={{
              fontSize: 11, letterSpacing: "0.18em", fontWeight: 600,
              color: "rgba(255,255,255,0.32)", marginBottom: 16, textTransform: "uppercase",
            }}
          >
            {t.eyebrow}
          </p>
          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700,
              color: "#fff", lineHeight: 1.2, marginBottom: 16,
            }}
          >
            {t.title}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.45)", fontWeight: 400 }}>
            {t.subtitle}
          </p>
        </div>

        {/* Success state */}
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
          <form onSubmit={submit} className="max-w-[540px] mx-auto space-y-5">
            <div>
              <label className={labelCls} style={{ fontFamily: "Poppins, sans-serif" }}>{t.name}</label>
              <input
                type="text" value={form.name} onChange={set("name")}
                placeholder={t.namePh} required className={inputCls}
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
            </div>
            <div>
              <label className={labelCls} style={{ fontFamily: "Poppins, sans-serif" }}>{t.email}</label>
              <input
                type="email" value={form.email} onChange={set("email")}
                placeholder={t.emailPh} required className={inputCls}
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
            </div>
            <div>
              <label className={labelCls} style={{ fontFamily: "Poppins, sans-serif" }}>{t.message}</label>
              <textarea
                value={form.message} onChange={set("message")}
                placeholder={t.messagePh} rows={5} required
                className={inputCls}
                style={{ fontFamily: "Poppins, sans-serif", resize: "none" }}
              />
            </div>
            {status === "error" && (
              <p style={{ fontSize: 13, color: "#f87171", fontFamily: "Poppins, sans-serif" }}>{t.error}</p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-[#004FA3] hover:bg-[#003d80] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, letterSpacing: "0.02em" }}
            >
              {status === "sending" ? t.sending : t.send}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
