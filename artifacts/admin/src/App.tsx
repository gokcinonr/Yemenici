import { useState, useEffect, useRef, useCallback } from "react";

const API = "/api";

type ContentRow = {
  id: number;
  section: string;
  key: string;
  value: string;
  label: string;
  updatedAt: string;
};

type MediaFile = {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
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
      const d = await apiFetch("/admin/login", { method: "POST", body: JSON.stringify({ username, password }) });
      onLogin(d.username);
    } catch { setError("Kullanıcı adı veya şifre hatalı."); }
    finally { setLoading(false); }
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

/* ────────────────────────────── Sidebar nav ────────────────────────────── */
type SectionKey = "hero" | "cards" | "industries" | "quality" | "footer" | "media";

const NAV: { group: string; items: { key: SectionKey; label: string; icon: string }[] }[] = [
  {
    group: "Ana Sayfa",
    items: [
      { key: "hero", label: "Hero", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
      { key: "cards", label: "Kartlar", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
      { key: "industries", label: "Endüstriler", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
      { key: "quality", label: "Kalite", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
    ],
  },
  {
    group: "Genel",
    items: [
      { key: "footer", label: "Footer", icon: "M4 6h16M4 12h16M4 18h7" },
      { key: "media", label: "Medya Kütüphanesi", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    ],
  },
];

/* ────────────────────────────── useField hook ────────────────────────────── */
function useField(rows: ContentRow[], section: string, key: string, onSaveRow: (id: number, value: string) => Promise<void>) {
  const row = rows.find((r) => r.section === section && r.key === key);
  const [value, setValue] = useState(row?.value ?? "");
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (row) setValue(row.value);
  }, [row?.id, row?.value]);

  const dirty = value !== (row?.value ?? "");

  const onSave = useCallback(async (overrideValue?: string) => {
    if (!row) return;
    const val = overrideValue !== undefined ? overrideValue : value;
    setSaving(true);
    try {
      await onSaveRow(row.id, val);
      if (overrideValue !== undefined) setValue(overrideValue);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    } catch { alert("Kaydetme başarısız."); }
    finally { setSaving(false); }
  }, [row, value, onSaveRow]);

  return { value, setValue, saving, dirty, onSave, justSaved };
}

/* ────────────────────────────── UI atoms ────────────────────────────── */
function SaveBtn({ onSave, saving, dirty, justSaved }: { onSave: () => void; saving: boolean; dirty: boolean; justSaved: boolean }) {
  return (
    <button onClick={onSave} disabled={saving || !dirty}
      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-40 ${justSaved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
      {saving ? "Kaydediliyor..." : justSaved ? "✓ Kaydedildi" : "Kaydet"}
    </button>
  );
}

function TextField({
  label, value, setValue, onSave, saving, dirty, justSaved, multiline = false, placeholder,
}: ReturnType<typeof useField> & { label: string; multiline?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition resize-none" />
        : <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition" />
      }
      <div className="flex justify-end mt-2">
        <SaveBtn onSave={onSave} saving={saving} dirty={dirty} justSaved={justSaved} />
      </div>
    </div>
  );
}

/* ────────────────────────────── Media Picker Modal ────────────────────────────── */
function MediaPickerModal({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/admin/media").then(setFiles).catch(() => setFiles([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm">Medya Kütüphanesi</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="grid grid-cols-4 gap-3">
              {[1,2,3,4,5,6,7,8].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Kütüphanede görsel yok</p>
              <p className="text-xs mt-1">Önce Medya Kütüphanesi'nden görsel yükleyin</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {files.map((f) => (
                <button key={f.filename} onClick={() => onSelect(f.url)}
                  className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition focus:outline-none focus:border-blue-500">
                  <img src={f.url} alt={f.filename} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition">
                    <p className="text-white text-[10px] truncate">{f.filename}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ImageField({
  label, value, setValue, onSave, saving, dirty, justSaved,
}: ReturnType<typeof useField> & { label: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [autoSaveState, setAutoSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const autoSave = async (url: string) => {
    setAutoSaveState("saving");
    try {
      await onSave(url);
      setAutoSaveState("saved");
      setTimeout(() => setAutoSaveState("idle"), 2500);
    } catch {
      setAutoSaveState("idle");
    }
  };

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
      await autoSave(url);
    } catch { alert("Yükleme başarısız."); }
    finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handlePickerSelect = async (url: string) => {
    setShowPicker(false);
    await autoSave(url);
  };

  return (
    <>
      {showPicker && <MediaPickerModal onSelect={handlePickerSelect} onClose={() => setShowPicker(false)} />}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
        <div className="flex gap-3 items-start">
          <div className={`w-20 h-14 rounded-lg border border-gray-200 flex-shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center ${!value && "text-gray-300"}`}>
            {value
              ? <img src={value} alt="" className="w-full h-full object-cover" />
              : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            }
          </div>
          <div className="flex-1 space-y-2">
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)}
              onBlur={() => { if (dirty) onSave(); }}
              placeholder="https://... veya aşağıdan seçin"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition" />
            <div className="flex gap-2 items-center">
              <button onClick={() => fileRef.current?.click()} disabled={uploading || saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition disabled:opacity-50">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {uploading ? "Yükleniyor..." : "Yükle"}
              </button>
              <button onClick={() => setShowPicker(true)} disabled={uploading || saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition disabled:opacity-50">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Kütüphaneden Seç
              </button>
              {autoSaveState !== "idle" && (
                <span className={`text-xs font-medium ${autoSaveState === "saved" ? "text-green-600" : "text-gray-400"}`}>
                  {autoSaveState === "saving" ? "Kaydediliyor..." : "✓ Kaydedildi"}
                </span>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ────────────────────────────── Section components ────────────────────────────── */
function HeroSection({ rows, onSaveRow }: { rows: ContentRow[]; onSaveRow: (id: number, v: string) => Promise<void> }) {
  const title1 = useField(rows, "hero", "title_line1", onSaveRow);
  const title2 = useField(rows, "hero", "title_line2", onSaveRow);
  const subtitle = useField(rows, "hero", "subtitle", onSaveRow);
  const cta = useField(rows, "hero", "cta_button", onSaveRow);
  return (
    <div className="space-y-6">
      <TextField label="Başlık Satır 1" {...title1} />
      <TextField label="Başlık Satır 2" {...title2} />
      <TextField label="Alt Başlık" multiline {...subtitle} />
      <TextField label="Buton Metni" {...cta} />
    </div>
  );
}

function CardGroup({ rows, prefix, title, onSaveRow }: {
  rows: ContentRow[]; prefix: string; title: string; onSaveRow: (id: number, v: string) => Promise<void>;
}) {
  const cardTitle = useField(rows, "cards", `${prefix}_title`, onSaveRow);
  const desc = useField(rows, "cards", `${prefix}_desc`, onSaveRow);
  const image = useField(rows, "cards", `${prefix}_image`, onSaveRow);
  const link = useField(rows, "cards", `${prefix}_link`, onSaveRow);
  return (
    <div className="border border-gray-200 rounded-xl p-5 space-y-5 bg-white">
      <h3 className="text-sm font-bold text-gray-800 pb-2 border-b border-gray-100">{title}</h3>
      <TextField label="Kart Başlık" {...cardTitle} />
      <TextField label="Kart Açıklama" multiline {...desc} />
      <ImageField label="Kart Arkaplan Görseli" {...image} />
      <TextField label="Kart Link" placeholder="https://..." {...link} />
    </div>
  );
}

function CardsSection({ rows, onSaveRow }: { rows: ContentRow[]; onSaveRow: (id: number, v: string) => Promise<void> }) {
  return (
    <div className="space-y-5">
      <CardGroup rows={rows} prefix="mobility" title="KART 1 — Mobilite" onSaveRow={onSaveRow} />
      <CardGroup rows={rows} prefix="industries" title="KART 2 — Endüstriler" onSaveRow={onSaveRow} />
      <CardGroup rows={rows} prefix="agriculture" title="KART 3 — Tarım" onSaveRow={onSaveRow} />
    </div>
  );
}

function IndustriesSection({ rows, onSaveRow }: { rows: ContentRow[]; onSaveRow: (id: number, v: string) => Promise<void> }) {
  const text = useField(rows, "industries", "section_text", onSaveRow);
  const btn = useField(rows, "industries", "discover_button", onSaveRow);
  const btnUrl = useField(rows, "industries", "discover_button_url", onSaveRow);
  return (
    <div className="space-y-6">
      <TextField label="Bölüm Metni" multiline {...text} />
      <TextField label="Buton Metni" {...btn} />
      <TextField label="Buton URL" placeholder="https://..." {...btnUrl} />
    </div>
  );
}

function QualitySection({ rows, onSaveRow }: { rows: ContentRow[]; onSaveRow: (id: number, v: string) => Promise<void> }) {
  const text = useField(rows, "quality", "text", onSaveRow);
  const btn = useField(rows, "quality", "button", onSaveRow);
  const btnUrl = useField(rows, "quality", "button_url", onSaveRow);
  return (
    <div className="space-y-6">
      <TextField label="Bölüm Metni" multiline {...text} />
      <TextField label="Buton Metni" {...btn} />
      <TextField label="Buton URL" placeholder="https://..." {...btnUrl} />
    </div>
  );
}

function FooterSection({ rows, onSaveRow }: { rows: ContentRow[]; onSaveRow: (id: number, v: string) => Promise<void> }) {
  const copy = useField(rows, "footer", "copyright", onSaveRow);
  return (
    <div className="space-y-6">
      <TextField label="Telif Hakkı" {...copy} />
    </div>
  );
}

/* ────────────────────────────── Media Library ────────────────────────────── */
function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setFiles(await apiFetch("/admin/media")); }
    catch { setFiles([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files ?? []);
    if (!fileList.length) return;
    setUploading(true);
    try {
      await Promise.all(fileList.map(async (file) => {
        const form = new FormData();
        form.append("file", file);
        await fetch(`${API}/admin/upload`, { method: "POST", credentials: "include", body: form });
      }));
      await load();
    } catch { alert("Yükleme başarısız."); }
    finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm("Bu görseli silmek istediğinizden emin misiniz?")) return;
    setDeleting(filename);
    try {
      await apiFetch(`/admin/media/${filename}`, { method: "DELETE" });
      setFiles((prev) => prev.filter((f) => f.filename !== filename));
    } catch { alert("Silme başarısız."); }
    finally { setDeleting(null); }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">{files.length} görsel yüklü</p>
        </div>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-60">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {uploading ? "Yükleniyor..." : "Görsel Yükle"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-video bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium">Henüz görsel yüklenmedi</p>
          <p className="text-xs mt-1">Görsel Yükle butonunu kullanın</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {files.map((f) => (
            <div key={f.filename} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img src={f.url} alt={f.filename} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-600 font-medium truncate" title={f.filename}>{f.filename}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{formatSize(f.size)}</p>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-white via-white to-transparent pt-6">
                <button onClick={() => handleCopy(f.url)}
                  className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-700 transition">
                  {copied === f.url ? "✓ Kopyalandı" : "URL Kopyala"}
                </button>
                <button onClick={() => handleDelete(f.filename)} disabled={deleting === f.filename}
                  className="py-1.5 px-3 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50">
                  {deleting === f.filename ? "..." : "Sil"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────── Content Editor ────────────────────────────── */
const SECTION_TITLES: Record<SectionKey, string> = {
  hero: "Hero",
  cards: "Kartlar",
  industries: "Endüstriler",
  quality: "Kalite",
  footer: "Footer",
  media: "Medya Kütüphanesi",
};

function ContentEditor({ username, onLogout }: { username: string; onLogout: () => void }) {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<SectionKey>("hero");

  useEffect(() => {
    apiFetch("/admin/content").then((r: ContentRow[]) => setRows(r)).finally(() => setLoading(false));
  }, []);

  const onSaveRow = useCallback(async (id: number, value: string) => {
    const updated: ContentRow = await apiFetch(`/admin/content/${id}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    });
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }, []);

  const handleLogout = async () => {
    await apiFetch("/admin/logout", { method: "POST" });
    onLogout();
  };

  const renderSection = () => {
    if (active === "media") return <MediaLibrary />;
    if (loading) return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
    );
    switch (active) {
      case "hero": return <HeroSection rows={rows} onSaveRow={onSaveRow} />;
      case "cards": return <CardsSection rows={rows} onSaveRow={onSaveRow} />;
      case "industries": return <IndustriesSection rows={rows} onSaveRow={onSaveRow} />;
      case "quality": return <QualitySection rows={rows} onSaveRow={onSaveRow} />;
      case "footer": return <FooterSection rows={rows} onSaveRow={onSaveRow} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
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
          <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-gray-900 transition">Çıkış Yap</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-52 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto py-5 px-3">
          {NAV.map((group) => (
            <div key={group.group} className="mb-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">{group.group}</p>
              {group.items.map((item) => (
                <button key={item.key} onClick={() => setActive(item.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition mb-0.5 flex items-center gap-2.5 ${active === item.key ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <div className={active === "media" ? "max-w-4xl mx-auto" : "max-w-2xl mx-auto"}>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{SECTION_TITLES[active]}</h2>
            <p className="text-sm text-gray-500 mb-6">
              {active === "cards" && "Her kartı ayrı ayrı düzenleyip kaydedin."}
              {active === "media" && "Yüklenen görselleri yönetin, URL kopyalayın veya silin."}
              {active === "hero" && "Ana sayfa hero bölümü içeriklerini düzenleyin."}
              {active === "industries" && "Endüstriler bölümü içeriklerini düzenleyin."}
              {active === "quality" && "Kalite bölümü içeriklerini düzenleyin."}
              {active === "footer" && "Footer bölümü içeriklerini düzenleyin."}
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

  if (checking) return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <LoginPage onLogin={setUser} />;
  return <ContentEditor username={user} onLogout={() => setUser(null)} />;
}
