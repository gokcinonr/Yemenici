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

function LoginPage({ onLogin }: { onLogin: (username: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      onLogin(data.username);
    } catch {
      setError("Kullanıcı adı veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-xl shadow-sm p-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Yemenici Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Yönetim paneline giriş yapın</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-60"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Bölümü",
  industries: "Endüstriler",
  cards: "Kartlar",
  quality: "Kalite",
  footer: "Footer",
};

function ImageUploadField({
  row,
  value,
  onChange,
  onSave,
  saving,
  saved,
}: {
  row: ContentRow;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
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
      const res = await fetch(`${API}/admin/upload`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      onChange(url);
    } catch {
      alert("Yükleme başarısız.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <label className="block text-sm font-medium text-foreground mb-3">{row.label}</label>
      <div className="flex gap-3 items-start">
        {value && (
          <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... veya fotoğraf yükleyin"
          />
          <div className="flex gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-border bg-muted hover:bg-accent text-foreground transition disabled:opacity-50"
            >
              {uploading ? "Yükleniyor..." : "Fotoğraf Yükle"}
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {saving ? "Kaydediliyor..." : saved ? "✓ Kaydedildi" : "Kaydet"}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>
    </div>
  );
}

function SelectField({
  row,
  value,
  onChange,
  onSave,
  saving,
  saved,
  options,
}: {
  row: ContentRow;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <label className="block text-sm font-medium text-foreground mb-2">{row.label}</label>
      <div className="flex gap-2 items-center">
        <select
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {saving ? "..." : saved ? "✓" : "Kaydet"}
        </button>
      </div>
    </div>
  );
}

function ContentEditor({ username, onLogout }: { username: string; onLogout: () => void }) {
  const [content, setContent] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [saving, setSaving] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Record<number, string>>({});

  useEffect(() => {
    apiFetch("/admin/content")
      .then((rows: ContentRow[]) => {
        setContent(rows);
        const initial: Record<number, string> = {};
        rows.forEach((r) => (initial[r.id] = r.value));
        setEditValues(initial);
      })
      .finally(() => setLoading(false));
  }, []);

  const sections = [...new Set(content.map((r) => r.section))];
  const filtered = content.filter((r) => r.section === activeSection);

  const handleSave = async (row: ContentRow) => {
    setSaving(row.id);
    try {
      const updated = await apiFetch(`/admin/content/${row.id}`, {
        method: "PUT",
        body: JSON.stringify({ value: editValues[row.id] }),
      });
      setContent((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setSaved(row.id);
      setTimeout(() => setSaved(null), 2500);
    } catch {
      alert("Kaydetme başarısız.");
    } finally {
      setSaving(null);
    }
  };

  const handleLogout = async () => {
    await apiFetch("/admin/logout", { method: "POST" });
    onLogout();
  };

  const renderField = (row: ContentRow) => {
    const key = row.key;
    const value = editValues[row.id] ?? row.value;
    const onChange = (v: string) => setEditValues((prev) => ({ ...prev, [row.id]: v }));
    const isSaving = saving === row.id;
    const isSaved = saved === row.id;

    if (key.endsWith("_image")) {
      return (
        <ImageUploadField
          key={row.id}
          row={row}
          value={value}
          onChange={onChange}
          onSave={() => handleSave(row)}
          saving={isSaving}
          saved={isSaved}
        />
      );
    }

    if (key.endsWith("_hover_text")) {
      return (
        <SelectField
          key={row.id}
          row={row}
          value={value}
          onChange={onChange}
          onSave={() => handleSave(row)}
          saving={isSaving}
          saved={isSaved}
          options={[
            { value: "white", label: "Beyaz metin (koyu arka plan için)" },
            { value: "dark", label: "Koyu metin (açık arka plan için)" },
          ]}
        />
      );
    }

    return (
      <div key={row.id} className="bg-card border border-border rounded-xl p-5">
        <label className="block text-sm font-medium text-foreground mb-2">{row.label}</label>
        {value.length > 80 ? (
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-muted-foreground">
            Son güncelleme: {new Date(row.updatedAt).toLocaleString("tr-TR")}
          </p>
          <button
            onClick={() => handleSave(row)}
            disabled={isSaving || editValues[row.id] === row.value}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving ? "Kaydediliyor..." : isSaved ? "✓ Kaydedildi" : "Kaydet"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <span className="font-semibold text-foreground">Yemenici Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{username}</span>
          <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-foreground transition">
            Çıkış
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-56 border-r border-border bg-card py-6 px-4 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">Bölümler</p>
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeSection === sec ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
              }`}
            >
              {SECTION_LABELS[sec] ?? sec}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              {SECTION_LABELS[activeSection] ?? activeSection}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Bu bölümdeki içerikleri düzenleyip kaydedin.</p>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((row) => renderField(row))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    apiFetch("/admin/me")
      .then((data: { username: string }) => setUser(data.username))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginPage onLogin={setUser} />;
  return <ContentEditor username={user} onLogout={() => setUser(null)} />;
}
