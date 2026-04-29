import { useState, useEffect, useRef } from "react";

const API = "/api";

type ContentRow = {
  id: number;
  section: string;
  key: string;
  value: string;
  label: string;
  updatedAt: string;
};

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: options?.body instanceof FormData ? {} : { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* ────────────────────────────── Login ────────────────────────────── */
function LoginPage({ onLogin }: { onLogin: (u: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const d = await apiFetch("/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      onLogin(d.username);
    } catch {
      setError("Kullanıcı adı veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Yemenici Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Yönetim paneline giriş yapın</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kullanıcı Adı</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
              placeholder="admin" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
              placeholder="••••••••" required />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-60">
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ────────────────────────────── Sidebar ────────────────────────────── */
type SectionKey = "hero" | "cards" | "industries" | "quality" | "footer";

const NAV: { group: string; items: { key: SectionKey; label: string }[] }[] = [
  {
    group: "Ana Sayfa",
    items: [
      { key: "hero", label: "Hero" },
      { key: "cards", label: "Kartlar" },
      { key: "industries", label: "Endüstriler" },
      { key: "quality", label: "Kalite" },
    ],
  },
  {
    group: "Genel",
    items: [{ key: "footer", label: "Footer" }],
  },
];

/* ────────────────────────────── Field helpers ────────────────────────────── */
function TextField({
  label, value, onChange, onSave, saving, dirty, multiline = false, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  onSave: () => void; saving: boolean; dirty: boolean;
  multiline?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      {multiline ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition resize-none" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition" />
      )}
      <div className="flex justify-end mt-2">
        <SaveButton onSave={onSave} saving={saving} dirty={dirty} />
      </div>
    </div>
  );
}

function ImageField({
  label, value, onChange, onSave, saving, dirty,
}: {
  label: string; value: string; onChange: (v: string) => void;
  onSave: () => void; saving: boolean; dirty: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API}/admin/upload`, { method: "POST", credentials: "include", body: form });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      onChange(url);
    } catch { alert("Yükleme başarısız."); }
    finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="flex gap-3 items-start">
        {value && (
          <div className="w-20 h-14 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://... veya fotoğraf yükleyin"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition" />
          <div className="flex gap-2">
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition disabled:opacity-50">
              {uploading ? "Yükleniyor..." : "Fotoğraf Yükle"}
            </button>
            <SaveButton onSave={onSave} saving={saving} dirty={dirty} />
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>
    </div>
  );
}

function SaveButton({ onSave, saving, dirty }: { onSave: () => void; saving: boolean; dirty: boolean }) {
  return (
    <button onClick={onSave} disabled={saving || !dirty}
      className="px-4 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-40 bg-blue-600 hover:bg-blue-700 text-white">
      {saving ? "Kaydediliyor..." : "Kaydet"}
    </button>
  );
}

/* ────────────────────────────── Section views ────────────────────────────── */
function useField(rows: ContentRow[], section: string, key: string, onSave: (id: number, value: string) => Promise<void>) {
  const row = rows.find((r) => r.section === section && r.key === key);
  const [value, setValue] = useState(row?.value ?? "");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);

  useEffect(() => { if (row) setValue(row.value); }, [row?.id, row?.value]);

  const dirty = value !== (row?.value ?? "");

  const save = async () => {
    if (!row) return;
    setSaving(true);
    try {
      await onSave(row.id, value);
      setSavedId(row.id);
      setTimeout(() => setSavedId(null), 2500);
    } finally { setSaving(false); }
  };

  return { value, setValue, saving, dirty, save, hasSaved: savedId === row?.id };
}

/* Hero */
function HeroSection({ rows, onSave }: { rows: ContentRow[]; onSave: (id: number, v: string) => Promise<void> }) {
  const title1 = useField(rows, "hero", "title_line1", onSave);
  const title2 = useField(rows, "hero", "title_line2", onSave);
  const subtitle = useField(rows, "hero", "subtitle", onSave);
  const cta = useField(rows, "hero", "cta_button", onSave);

  return (
    <div className="space-y-6">
      <TextField label="Başlık Satır 1" {...title1} onChange={title1.setValue} />
      <TextField label="Başlık Satır 2" {...title2} onChange={title2.setValue} />
      <TextField label="Alt Başlık" multiline {...subtitle} onChange={subtitle.setValue} />
      <TextField label="Buton Metni" {...cta} onChange={cta.setValue} />
    </div>
  );
}

/* Card group */
function CardGroup({ rows, prefix, title, onSave }: {
  rows: ContentRow[]; prefix: string; title: string; onSave: (id: number, v: string) => Promise<void>;
}) {
  const cardTitle = useField(rows, "cards", `${prefix}_title`, onSave);
  const desc = useField(rows, "cards", `${prefix}_desc`, onSave);
  const image = useField(rows, "cards", `${prefix}_image`, onSave);
  const link = useField(rows, "cards", `${prefix}_link`, onSave);

  return (
    <div className="border border-gray-200 rounded-xl p-5 space-y-5 bg-white">
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      <TextField label="Kart Başlık" {...cardTitle} onChange={cardTitle.setValue} />
      <TextField label="Kart Açıklama" multiline {...desc} onChange={desc.setValue} />
      <ImageField label="Kart Arkaplan Görseli" {...image} onChange={image.setValue} />
      <TextField label="Kart Link" placeholder="https://..." {...link} onChange={link.setValue} />
    </div>
  );
}

function CardsSection({ rows, onSave }: { rows: ContentRow[]; onSave: (id: number, v: string) => Promise<void> }) {
  return (
    <div className="space-y-5">
      <CardGroup rows={rows} prefix="mobility" title="KART 1 — Mobilite" onSave={onSave} />
      <CardGroup rows={rows} prefix="industries" title="KART 2 — Endüstriler" onSave={onSave} />
      <CardGroup rows={rows} prefix="agriculture" title="KART 3 — Tarım" onSave={onSave} />
    </div>
  );
}

/* Industries */
function IndustriesSection({ rows, onSave }: { rows: ContentRow[]; onSave: (id: number, v: string) => Promise<void> }) {
  const text = useField(rows, "industries", "section_text", onSave);
  const btn = useField(rows, "industries", "discover_button", onSave);
  const btnUrl = useField(rows, "industries", "discover_button_url", onSave);

  return (
    <div className="space-y-6">
      <TextField label="Bölüm Metni" multiline {...text} onChange={text.setValue} />
      <TextField label="Buton Metni" {...btn} onChange={btn.setValue} />
      <TextField label="Buton URL" placeholder="https://..." {...btnUrl} onChange={btnUrl.setValue} />
    </div>
  );
}

/* Quality */
function QualitySection({ rows, onSave }: { rows: ContentRow[]; onSave: (id: number, v: string) => Promise<void> }) {
  const text = useField(rows, "quality", "text", onSave);
  const btn = useField(rows, "quality", "button", onSave);
  const btnUrl = useField(rows, "quality", "button_url", onSave);

  return (
    <div className="space-y-6">
      <TextField label="Bölüm Metni" multiline {...text} onChange={text.setValue} />
      <TextField label="Buton Metni" {...btn} onChange={btn.setValue} />
      <TextField label="Buton URL" placeholder="https://..." {...btnUrl} onChange={btnUrl.setValue} />
    </div>
  );
}

/* Footer */
function FooterSection({ rows, onSave }: { rows: ContentRow[]; onSave: (id: number, v: string) => Promise<void> }) {
  const copy = useField(rows, "footer", "copyright", onSave);
  return (
    <div className="space-y-6">
      <TextField label="Telif Hakkı" {...copy} onChange={copy.setValue} />
    </div>
  );
}

/* ────────────────────────────── Main editor ────────────────────────────── */
const SECTION_TITLES: Record<SectionKey, string> = {
  hero: "Hero",
  cards: "Kartlar",
  industries: "Endüstriler",
  quality: "Kalite",
  footer: "Footer",
};

function ContentEditor({ username, onLogout }: { username: string; onLogout: () => void }) {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<SectionKey>("hero");

  useEffect(() => {
    apiFetch("/admin/content")
      .then((r: ContentRow[]) => setRows(r))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (id: number, value: string) => {
    const updated: ContentRow = await apiFetch(`/admin/content/${id}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    });
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleLogout = async () => {
    await apiFetch("/admin/logout", { method: "POST" });
    onLogout();
  };

  const renderSection = () => {
    if (loading) return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
    );
    switch (active) {
      case "hero": return <HeroSection rows={rows} onSave={handleSave} />;
      case "cards": return <CardsSection rows={rows} onSave={handleSave} />;
      case "industries": return <IndustriesSection rows={rows} onSave={handleSave} />;
      case "quality": return <QualitySection rows={rows} onSave={handleSave} />;
      case "footer": return <FooterSection rows={rows} onSave={handleSave} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <span className="font-semibold text-sm text-gray-900">Yemenici Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">{username}</span>
          <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-gray-900 transition">
            Çıkış Yap
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto py-5 px-3">
          {NAV.map((group) => (
            <div key={group.group} className="mb-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">
                {group.group}
              </p>
              {group.items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition mb-0.5 ${
                    active === item.key
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{SECTION_TITLES[active]}</h2>
            <p className="text-sm text-gray-500 mb-6">
              {active === "cards"
                ? "Kartları düzenleyip her alanı ayrı ayrı kaydedin."
                : "Bu bölümdeki içerikleri düzenleyip kaydedin."}
            </p>
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ────────────────────────────── Root ────────────────────────────── */
export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    apiFetch("/admin/me")
      .then((d: { username: string }) => setUser(d.username))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginPage onLogin={setUser} />;
  return <ContentEditor username={user} onLogout={() => setUser(null)} />;
}
