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
type PageKey =
  | "homepage"
  | "solutions" | "solutions_production" | "solutions_industries"
  | "solutions_automotive" | "solutions_industrial" | "solutions_agriculture"
  | "quality" | "quality_certification" | "quality_laboratory"
  | "company" | "company_about" | "company_values"
  | "contact"
  | "menu_solutions" | "menu_quality"
  | "prod_elements"
  | "footer" | "media";

type NavItem = { key: PageKey; label: string; indent?: 1 | 2 };
type NavGroup = { groupLabel: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: "Sayfalar",
    items: [
      { key: "homepage", label: "Ana Sayfa" },
      { key: "solutions", label: "Solutions" },
      { key: "solutions_production", label: "Production", indent: 1 },
      { key: "prod_elements", label: "Elementler", indent: 2 },
      { key: "solutions_industries", label: "Industries", indent: 1 },
      { key: "solutions_automotive", label: "Automotive", indent: 2 },
      { key: "solutions_industrial", label: "Industrial", indent: 2 },
      { key: "solutions_agriculture", label: "Agriculture", indent: 2 },
      { key: "quality", label: "Quality" },
      { key: "quality_certification", label: "Certification", indent: 1 },
      { key: "quality_laboratory", label: "Lab. & Testing", indent: 1 },
      { key: "company", label: "Company" },
      { key: "company_about", label: "About Us", indent: 1 },
      { key: "company_values", label: "Our Values", indent: 1 },
      { key: "contact", label: "Contact" },
    ],
  },
  {
    groupLabel: "Menü",
    items: [
      { key: "menu_solutions", label: "Solutions Menü" },
      { key: "menu_quality", label: "Quality Menü" },
    ],
  },
  {
    groupLabel: "Genel",
    items: [
      { key: "footer", label: "Footer" },
      { key: "media", label: "Medya Kütüphanesi" },
    ],
  },
];

/* ────────────────────────────── Site pages ────────────────────────────── */
const SITE_PAGES = [
  { label: "Ana Sayfa", value: "/" },
  { label: "Solutions", value: "/solutions" },
  { label: "Solutions — Production", value: "/solutions/production" },
  { label: "Solutions — Industries", value: "/solutions/industries" },
  { label: "Solutions — Automotive", value: "/solutions/industries/automotive" },
  { label: "Solutions — Industrial", value: "/solutions/industries/industrial" },
  { label: "Solutions — Agriculture", value: "/solutions/industries/agriculture" },
  { label: "Quality", value: "/quality" },
  { label: "Quality — Certification", value: "/quality/certification" },
  { label: "Quality — Laboratory & Testing", value: "/quality/laboratory-testing" },
  { label: "Company", value: "/company" },
  { label: "Company — About Us", value: "/company/about-us" },
  { label: "Company — Our Values", value: "/company/our-values" },
  { label: "Contact", value: "/contact" },
];

const KNOWN_PATHS = new Set(SITE_PAGES.map((p) => p.value));

function isExternalUrl(v: string) {
  return !!v && !KNOWN_PATHS.has(v);
}

function LinkSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [mode, setMode] = useState<"page" | "external">(() =>
    isExternalUrl(value) ? "external" : "page",
  );
  const [extUrl, setExtUrl] = useState(() => (isExternalUrl(value) ? value : ""));

  useEffect(() => {
    if (isExternalUrl(value)) {
      setMode("external");
      setExtUrl(value);
    } else {
      setMode("page");
    }
  }, [value]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    if (v === "__external__") {
      setMode("external");
      if (extUrl) onChange(extUrl);
    } else {
      setMode("page");
      onChange(v);
    }
  };

  const handleExtUrl = (v: string) => {
    setExtUrl(v);
    onChange(v);
  };

  const selectValue = mode === "external" ? "__external__" : (KNOWN_PATHS.has(value) ? value : "");

  return (
    <div className="space-y-2">
      <select
        value={selectValue}
        onChange={handleSelect}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition bg-white"
      >
        <option value="">— Sayfa seçin —</option>
        {SITE_PAGES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
        <option value="__external__">🌐 Harici URL</option>
      </select>
      {mode === "external" && (
        <input
          type="text"
          value={extUrl}
          onChange={(e) => handleExtUrl(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
        />
      )}
    </div>
  );
}

/* ────────────────────────────── useField hook ────────────────────────────── */
type SaveRowFn = (id: number | null, section: string, key: string, value: string) => Promise<void>;

function useField(rows: ContentRow[], section: string, key: string, onSaveRow: SaveRowFn) {
  const row = rows.find((r) => r.section === section && r.key === key);
  const [value, setValue] = useState(row?.value ?? "");
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (row) setValue(row.value);
  }, [row?.id, row?.value]);

  const dirty = value !== (row?.value ?? "");

  const onSave = useCallback(async (overrideValue?: string) => {
    const val = overrideValue !== undefined ? overrideValue : value;
    setSaving(true);
    try {
      await onSaveRow(row?.id ?? null, section, key, val);
      if (overrideValue !== undefined) setValue(overrideValue);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    } catch { alert("Kaydetme başarısız."); }
    finally { setSaving(false); }
  }, [row, value, onSaveRow, section, key]);

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

function LinkField({
  label, value, setValue, onSave, saving, dirty, justSaved,
}: ReturnType<typeof useField> & { label: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <LinkSelector value={value} onChange={setValue} />
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
function HeroSection({ rows, onSaveRow }: { rows: ContentRow[]; onSaveRow: SaveRowFn }) {
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
  rows: ContentRow[]; prefix: string; title: string; onSaveRow: SaveRowFn;
}) {
  const getRow = (k: string) => rows.find((r) => r.section === "cards" && r.key === `${prefix}_${k}`);

  const initVals = () => ({
    title: getRow("title")?.value ?? "",
    desc: getRow("desc")?.value ?? "",
    image: getRow("image")?.value ?? "",
    link: getRow("link")?.value ?? "",
  });

  const [vals, setVals] = useState(initVals);
  const [orig, setOrig] = useState(initVals);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Sync when rows load/change
  useEffect(() => {
    const v = {
      title: getRow("title")?.value ?? "",
      desc: getRow("desc")?.value ?? "",
      image: getRow("image")?.value ?? "",
      link: getRow("link")?.value ?? "",
    };
    setVals(v);
    setOrig(v);
  }, [
    getRow("title")?.value, getRow("desc")?.value,
    getRow("image")?.value, getRow("link")?.value,
  ]);

  const dirty = vals.title !== orig.title || vals.desc !== orig.desc
    || vals.image !== orig.image || vals.link !== orig.link;

  const set = (k: keyof typeof vals) => (v: string) => setVals((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const rows4 = [
      { fieldKey: "title", row: getRow("title"), val: vals.title },
      { fieldKey: "desc", row: getRow("desc"), val: vals.desc },
      { fieldKey: "image", row: getRow("image"), val: vals.image },
      { fieldKey: "link", row: getRow("link"), val: vals.link },
    ];
    setSaving(true);
    try {
      await Promise.all(rows4.map(({ fieldKey, row, val }) =>
        onSaveRow(row?.id ?? null, "cards", `${prefix}_${fieldKey}`, val),
      ));
      setOrig({ ...vals });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { alert("Kaydetme başarısız."); }
    finally { setSaving(false); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API}/admin/upload`, { method: "POST", credentials: "include", body: form });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      set("image")(url);
    } catch { alert("Yükleme başarısız."); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  return (
    <>
      {showPicker && (
        <MediaPickerModal
          onSelect={(url) => { set("image")(url); setShowPicker(false); }}
          onClose={() => setShowPicker(false)}
        />
      )}
      <div className="border border-gray-200 rounded-xl p-5 bg-white">
        <h3 className="text-sm font-bold text-gray-800 pb-3 mb-4 border-b border-gray-100">{title}</h3>
        <div className="space-y-4">
          {/* Başlık */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Kart Başlık</label>
            <input type="text" value={vals.title} onChange={(e) => set("title")(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition" />
          </div>
          {/* Açıklama */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Kart Açıklama</label>
            <textarea rows={3} value={vals.desc} onChange={(e) => set("desc")(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition resize-none" />
          </div>
          {/* Görsel */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Kart Arkaplan Görseli</label>
            <div className="flex gap-3 items-start">
              <div className="w-20 h-14 rounded-lg border border-gray-200 flex-shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center text-gray-300">
                {vals.image
                  ? <img src={vals.image} alt="" className="w-full h-full object-cover" />
                  : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                }
              </div>
              <div className="flex-1 space-y-2">
                <input type="text" value={vals.image} onChange={(e) => set("image")(e.target.value)}
                  placeholder="https://... veya aşağıdan seçin"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition" />
                <div className="flex gap-2">
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition disabled:opacity-50">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    {uploading ? "Yükleniyor..." : "Yükle"}
                  </button>
                  <button onClick={() => setShowPicker(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Kütüphaneden Seç
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </div>
            </div>
          </div>
          {/* Link */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Kart Link</label>
            <LinkSelector value={vals.link} onChange={set("link")} />
          </div>
        </div>
        {/* Tek kaydet butonu */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={handleSave} disabled={saving || !dirty}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-40 ${saved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
            {saving ? "Kaydediliyor..." : saved ? "✓ Kaydedildi" : "Kartı Kaydet"}
          </button>
        </div>
      </div>
    </>
  );
}

function CardsSection({ rows, onSaveRow }: { rows: ContentRow[]; onSaveRow: SaveRowFn }) {
  return (
    <div className="space-y-5">
      <CardGroup rows={rows} prefix="mobility" title="KART 1 — Mobilite" onSaveRow={onSaveRow} />
      <CardGroup rows={rows} prefix="industries" title="KART 2 — Endüstriler" onSaveRow={onSaveRow} />
      <CardGroup rows={rows} prefix="agriculture" title="KART 3 — Tarım" onSaveRow={onSaveRow} />
    </div>
  );
}

function IndustriesSection({ rows, onSaveRow }: { rows: ContentRow[]; onSaveRow: SaveRowFn }) {
  const text = useField(rows, "industries", "section_text", onSaveRow);
  const btn = useField(rows, "industries", "discover_button", onSaveRow);
  const btnUrl = useField(rows, "industries", "discover_button_url", onSaveRow);
  return (
    <div className="space-y-6">
      <TextField label="Bölüm Metni" multiline {...text} />
      <TextField label="Buton Metni" {...btn} />
      <LinkField label="Buton URL" {...btnUrl} />
    </div>
  );
}

function QualitySection({ rows, onSaveRow }: { rows: ContentRow[]; onSaveRow: SaveRowFn }) {
  const text = useField(rows, "quality", "text", onSaveRow);
  const btn = useField(rows, "quality", "button", onSaveRow);
  const btnUrl = useField(rows, "quality", "button_url", onSaveRow);
  return (
    <div className="space-y-6">
      <TextField label="Bölüm Metni" multiline {...text} />
      <TextField label="Buton Metni" {...btn} />
      <LinkField label="Buton URL" {...btnUrl} />
    </div>
  );
}

function FooterSection({ rows, onSaveRow }: { rows: ContentRow[]; onSaveRow: SaveRowFn }) {
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

/* ────────────────────────────── Section divider ────────────────────────────── */
function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
        <h3 className="text-sm font-bold text-gray-800 tracking-tight">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

/* ────────────────────────────── Homepage panel ────────────────────────────── */
function HomepagePanel({ rows, onSaveRow, loading }: {
  rows: ContentRow[];
  onSaveRow: SaveRowFn;
  loading: boolean;
}) {
  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );
  return (
    <div className="space-y-6">
      <SectionBlock title="Hero">
        <HeroSection rows={rows} onSaveRow={onSaveRow} />
      </SectionBlock>
      <SectionBlock title="Kartlar">
        <CardsSection rows={rows} onSaveRow={onSaveRow} />
      </SectionBlock>
      <SectionBlock title="Endüstriler Bölümü">
        <IndustriesSection rows={rows} onSaveRow={onSaveRow} />
      </SectionBlock>
      <SectionBlock title="Kalite Bölümü">
        <QualitySection rows={rows} onSaveRow={onSaveRow} />
      </SectionBlock>
    </div>
  );
}

/* ────────────────────────────── Page section map ────────────────────────────── */
const PAGE_SECTION: Record<PageKey, string> = {
  homepage: "hero",
  solutions: "page_solutions",
  solutions_production: "page_solutions_production",
  solutions_industries: "page_solutions_industries",
  solutions_automotive: "page_solutions_automotive",
  solutions_industrial: "page_solutions_industrial",
  solutions_agriculture: "page_solutions_agriculture",
  quality: "page_quality",
  quality_certification: "page_quality_certification",
  quality_laboratory: "page_quality_laboratory",
  company: "page_company",
  company_about: "page_company_about",
  company_values: "page_company_values",
  contact: "page_contact",
  prod_elements: "prod_elements",
  menu_solutions: "nav_menu_solutions",
  menu_quality: "nav_menu_quality",
  footer: "footer",
  media: "media",
};

/* ────────────────────────────── ColorField ────────────────────────────── */
function ColorField({ label, value, setValue, onSave, saving, dirty, justSaved }: ReturnType<typeof useField> & { label: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || "#1e3a5f"}
          onChange={(e) => setValue(e.target.value)}
          className="h-9 w-14 rounded-lg border border-gray-300 cursor-pointer p-1 flex-shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#1e3a5f"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
        />
        <SaveBtn onSave={onSave} saving={saving} dirty={dirty} justSaved={justSaved} />
      </div>
    </div>
  );
}

/* ────────────────────────────── InnerPagePanel ────────────────────────────── */
function InnerPagePanel({ pageKey, rows, onSaveRow, loading }: {
  pageKey: PageKey;
  rows: ContentRow[];
  onSaveRow: SaveRowFn;
  loading: boolean;
}) {
  const section = PAGE_SECTION[pageKey];
  const heroTitle = useField(rows, section, "hero_title", onSaveRow);
  const heroSubtitle = useField(rows, section, "hero_subtitle", onSaveRow);
  const heroBgColor = useField(rows, section, "hero_bg_color", onSaveRow);
  const heroBgImage = useField(rows, section, "hero_bg_image", onSaveRow);
  const [imgUploading, setImgUploading] = useState(false);
  const imgFileRef = useRef<HTMLInputElement>(null);

  const handleBgImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API}/admin/upload`, { method: "POST", credentials: "include", body: form });
      const { url } = await res.json() as { url: string };
      await heroBgImage.onSave(url);
    } catch { alert("Yükleme başarısız."); }
    finally { setImgUploading(false); if (imgFileRef.current) imgFileRef.current.value = ""; }
  };

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );
  return (
    <SectionBlock title="Hero Bölümü">
      <div className="space-y-6">
        <TextField label="Başlık" placeholder="Sayfa başlığı" {...heroTitle} />
        <TextField label="Alt Başlık" multiline placeholder="Kısa açıklama..." {...heroSubtitle} />
        <ColorField label="Arkaplan Rengi" {...heroBgColor} />
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Hero Arka Plan Görseli</label>
          <div className="flex gap-3 items-start">
            <div className="w-24 h-16 rounded-lg border border-gray-200 flex-shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center text-gray-300">
              {heroBgImage.value
                ? <img src={heroBgImage.value} alt="" className="w-full h-full object-cover" />
                : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              }
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={heroBgImage.value}
                onChange={(e) => heroBgImage.setValue(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
              />
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => imgFileRef.current?.click()}
                  disabled={imgUploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  {imgUploading ? "Yükleniyor..." : "Yükle"}
                </button>
                <SaveBtn onSave={heroBgImage.onSave} saving={heroBgImage.saving} dirty={heroBgImage.dirty} justSaved={heroBgImage.justSaved} />
              </div>
              <input ref={imgFileRef} type="file" accept="image/*" className="hidden" onChange={handleBgImgUpload} />
            </div>
          </div>
        </div>
      </div>
    </SectionBlock>
  );
}

/* ────────────────────────────── NavBoxEditor ────────────────────────────── */
function NavBoxEditor({ section, title, hasImage = false, rows, onSaveRow }: {
  section: string;
  title: string;
  hasImage?: boolean;
  rows: ContentRow[];
  onSaveRow: SaveRowFn;
}) {
  const boxTitle = useField(rows, section, "title", onSaveRow);
  const boxDesc = useField(rows, section, "desc", onSaveRow);
  const boxHref = useField(rows, section, "href", onSaveRow);
  const boxImage = useField(rows, section, "image", onSaveRow);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API}/admin/upload`, { method: "POST", credentials: "include", body: form });
      const { url } = await res.json() as { url: string };
      await boxImage.onSave(url);
    } catch { alert("Yükleme başarısız."); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-4">
      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">{title}</p>
      <TextField label="Başlık" {...boxTitle} />
      <TextField label="Açıklama" multiline {...boxDesc} />
      <LinkField label="Link" {...boxHref} />
      {hasImage && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Görsel</label>
          <div className="flex gap-3 items-start">
            <div className="w-20 h-14 rounded-lg border border-gray-200 flex-shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center text-gray-300">
              {boxImage.value
                ? <img src={boxImage.value} alt="" className="w-full h-full object-cover" />
                : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              }
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={boxImage.value}
                onChange={(e) => boxImage.setValue(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
              />
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  {uploading ? "Yükleniyor..." : "Yükle"}
                </button>
                <SaveBtn onSave={boxImage.onSave} saving={boxImage.saving} dirty={boxImage.dirty} justSaved={boxImage.justSaved} />
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────── SolutionsMenuPanel ────────────────────────── */
function SolutionsMenuPanel({ rows, onSaveRow, loading }: { rows: ContentRow[]; onSaveRow: SaveRowFn; loading: boolean }) {
  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );
  return (
    <div className="space-y-6">
      <SectionBlock title="Production Kutusu (Sol)">
        <NavBoxEditor section="nav_box_production" title="Production" hasImage rows={rows} onSaveRow={onSaveRow} />
      </SectionBlock>
      <SectionBlock title="Industries Kutuları (Sağ)">
        <div className="space-y-3">
          <NavBoxEditor section="nav_box_automotive" title="Automotive" rows={rows} onSaveRow={onSaveRow} />
          <NavBoxEditor section="nav_box_industrial" title="Industrial" rows={rows} onSaveRow={onSaveRow} />
          <NavBoxEditor section="nav_box_agriculture" title="Agriculture" rows={rows} onSaveRow={onSaveRow} />
        </div>
      </SectionBlock>
    </div>
  );
}

/* ────────────────────────────── QualityMenuPanel ────────────────────────── */
function QualityMenuPanel({ rows, onSaveRow, loading }: { rows: ContentRow[]; onSaveRow: SaveRowFn; loading: boolean }) {
  if (loading) return (
    <div className="space-y-4">
      {[1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );
  return (
    <SectionBlock title="Quality Kutuları">
      <div className="space-y-3">
        <NavBoxEditor section="nav_box_certification" title="Certification" rows={rows} onSaveRow={onSaveRow} />
        <NavBoxEditor section="nav_box_laboratory" title="Laboratory & Testing" rows={rows} onSaveRow={onSaveRow} />
      </div>
    </SectionBlock>
  );
}

/* ────────────────────────────── ProductionElementsPanel ───────────────────── */
function LangTabs({ lang, setLang }: { lang: string; setLang: (l: string) => void }) {
  return (
    <div className="flex gap-1.5 border-b border-gray-100 pb-3 mb-4">
      {[{ code: "en", label: "English" }, { code: "de", label: "Deutsch" }, { code: "tr", label: "Türkçe" }].map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition ${
            lang === code ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ProdElementEditor({ section, label, rows, onSaveRow }: {
  section: string;
  label: string;
  rows: ContentRow[];
  onSaveRow: SaveRowFn;
}) {
  const [lang, setLang] = useState("en");
  const [showPicker, setShowPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const getVal = (key: string) =>
    rows.find((r) => r.section === section && r.key === key)?.value ?? "";

  const initVals = () => ({
    title_en: getVal("title_en"), title_de: getVal("title_de"), title_tr: getVal("title_tr"),
    body_en:  getVal("body_en"),  body_de:  getVal("body_de"),  body_tr:  getVal("body_tr"),
    image:    getVal("image"),
  });

  const [vals, setVals] = useState(initVals);
  const [orig, setOrig] = useState(initVals);

  useEffect(() => {
    const v = initVals();
    setVals(v);
    setOrig(v);
  }, [
    getVal("title_en"), getVal("title_de"), getVal("title_tr"),
    getVal("body_en"),  getVal("body_de"),  getVal("body_tr"),
    getVal("image"),
  ]);

  const set = (k: keyof typeof vals) => (v: string) => setVals((p) => ({ ...p, [k]: v }));
  const dirty = JSON.stringify(vals) !== JSON.stringify(orig);

  const handleSave = async () => {
    const KEYS = ["title_en","title_de","title_tr","body_en","body_de","body_tr","image"] as const;
    setSaving(true);
    try {
      await Promise.all(KEYS.map((key) => {
        const row = rows.find((r) => r.section === section && r.key === key);
        return onSaveRow(row?.id ?? null, section, key, vals[key]);
      }));
      setOrig({ ...vals });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { alert("Kaydetme başarısız."); }
    finally { setSaving(false); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API}/admin/upload`, { method: "POST", credentials: "include", body: form });
      if (!res.ok) throw new Error();
      const { url } = await res.json() as { url: string };
      set("image")(url);
    } catch { alert("Yükleme başarısız."); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const titleKey = `title_${lang}` as "title_en" | "title_de" | "title_tr";
  const bodyKey  = `body_${lang}`  as "body_en"  | "body_de"  | "body_tr";

  return (
    <>
      {showPicker && (
        <MediaPickerModal
          onSelect={(url) => { set("image")(url); setShowPicker(false); }}
          onClose={() => setShowPicker(false)}
        />
      )}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">{label}</p>
        </div>
        <div className="p-4 space-y-4">
          <LangTabs lang={lang} setLang={setLang} />

          {/* Başlık */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Başlık</label>
            <input
              type="text" value={vals[titleKey]}
              onChange={(e) => set(titleKey)(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
          </div>

          {/* İçerik */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">İçerik</label>
            <textarea
              rows={4} value={vals[bodyKey]}
              onChange={(e) => set(bodyKey)(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Görsel */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Görsel</label>
            <div className="flex gap-3 items-start">
              <div className="w-24 h-16 rounded-lg border border-gray-200 flex-shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center text-gray-300">
                {vals.image
                  ? <img src={vals.image} alt="" className="w-full h-full object-cover" />
                  : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                }
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text" value={vals.image}
                  onChange={(e) => set("image")(e.target.value)}
                  placeholder="https://... veya aşağıdan seçin"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    {uploading ? "Yükleniyor..." : "Yükle"}
                  </button>
                  <button
                    onClick={() => setShowPicker(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Kütüphaneden Seç
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </div>
            </div>
          </div>
        </div>

        {/* Tek kaydet butonu */}
        <div className="px-4 py-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave} disabled={saving || !dirty}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-40 ${saved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            {saving ? "Kaydediliyor..." : saved ? "✓ Kaydedildi" : "Kaydet"}
          </button>
        </div>
      </div>
    </>
  );
}

function ProductionElementsPanel({ rows, onSaveRow, loading }: { rows: ContentRow[]; onSaveRow: SaveRowFn; loading: boolean }) {
  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );
  const elements = [
    { section: "prod_element_mixing",       label: "01 — Compound Mixing" },
    { section: "prod_element_vulcanization", label: "02 — Vulcanization" },
    { section: "prod_element_toolcenter",   label: "03 — Tool Center" },
    { section: "prod_element_metalprep",    label: "04 — Metal Preparation" },
  ];
  return (
    <div className="space-y-4">
      {elements.map((el) => (
        <ProdElementEditor key={el.section} section={el.section} label={el.label} rows={rows} onSaveRow={onSaveRow} />
      ))}
    </div>
  );
}

/* ────────────────────────────── Content Editor ────────────────────────────── */
const PAGE_TITLES: Record<PageKey, string> = {
  homepage: "Ana Sayfa",
  solutions: "Solutions",
  solutions_production: "Production",
  solutions_industries: "Industries",
  solutions_automotive: "Automotive",
  solutions_industrial: "Industrial",
  solutions_agriculture: "Agriculture",
  quality: "Quality",
  quality_certification: "Certification",
  quality_laboratory: "Laboratory & Testing",
  company: "Company",
  company_about: "About Us",
  company_values: "Our Values",
  contact: "Contact",
  prod_elements: "Production Elementleri",
  menu_solutions: "Solutions Menü",
  menu_quality: "Quality Menü",
  footer: "Footer",
  media: "Medya Kütüphanesi",
};

const PAGE_SUBTITLES: Record<PageKey, string> = {
  homepage: "Ana sayfanın tüm bölümlerini buradan düzenleyin.",
  solutions: "Solutions sayfası hero bölümünü düzenleyin.",
  solutions_production: "Production sayfası hero bölümünü düzenleyin.",
  solutions_industries: "Industries sayfası hero bölümünü düzenleyin.",
  solutions_automotive: "Automotive sayfası hero bölümünü düzenleyin.",
  solutions_industrial: "Industrial sayfası hero bölümünü düzenleyin.",
  solutions_agriculture: "Agriculture sayfası hero bölümünü düzenleyin.",
  quality: "Quality sayfası hero bölümünü düzenleyin.",
  quality_certification: "Certification sayfası hero bölümünü düzenleyin.",
  quality_laboratory: "Laboratory & Testing sayfası hero bölümünü düzenleyin.",
  company: "Company sayfası hero bölümünü düzenleyin.",
  company_about: "About Us sayfası hero bölümünü düzenleyin.",
  company_values: "Our Values sayfası hero bölümünü düzenleyin.",
  contact: "Contact sayfası hero bölümünü düzenleyin.",
  prod_elements: "Production sayfasındaki 4 elementi yönetin — başlık, içerik ve görsel (EN/DE/TR).",
  menu_solutions: "Solutions mega menüsündeki Industries ve Production kutularını yönetin.",
  menu_quality: "Quality mega menüsündeki Certification ve Laboratory kutularını yönetin.",
  footer: "Footer bölümü içeriklerini düzenleyin.",
  media: "Yüklenen görselleri yönetin, URL kopyalayın veya silin.",
};

function ContentEditor({ username, onLogout }: { username: string; onLogout: () => void }) {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<PageKey>("homepage");

  useEffect(() => {
    apiFetch("/admin/content").then((r: ContentRow[]) => setRows(r)).finally(() => setLoading(false));
  }, []);

  const onSaveRow = useCallback<SaveRowFn>(async (id, section, key, value) => {
    if (id !== null) {
      const updated: ContentRow = await apiFetch(`/admin/content/${id}`, {
        method: "PUT",
        body: JSON.stringify({ value }),
      });
      setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } else {
      const created: ContentRow = await apiFetch("/admin/content", {
        method: "POST",
        body: JSON.stringify({ section, key, value, label: key }),
      });
      setRows((prev) => {
        const idx = prev.findIndex((r) => r.section === created.section && r.key === created.key);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = created;
          return next;
        }
        return [...prev, created];
      });
    }
  }, []);

  const handleLogout = async () => {
    await apiFetch("/admin/logout", { method: "POST" });
    onLogout();
  };

  const renderPage = () => {
    switch (active) {
      case "homepage":
        return <HomepagePanel rows={rows} onSaveRow={onSaveRow} loading={loading} />;
      case "footer":
        return loading
          ? <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          : <div className="border border-gray-200 rounded-2xl bg-white p-6"><FooterSection rows={rows} onSaveRow={onSaveRow} /></div>;
      case "media":
        return <MediaLibrary />;
      case "prod_elements":
        return <ProductionElementsPanel rows={rows} onSaveRow={onSaveRow} loading={loading} />;
      case "menu_solutions":
        return <SolutionsMenuPanel rows={rows} onSaveRow={onSaveRow} loading={loading} />;
      case "menu_quality":
        return <QualityMenuPanel rows={rows} onSaveRow={onSaveRow} loading={loading} />;
      default:
        return <InnerPagePanel pageKey={active} rows={rows} onSaveRow={onSaveRow} loading={loading} />;
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
        <aside className="w-52 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto py-5 px-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.groupLabel} className="mb-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1.5">
                {group.groupLabel}
              </p>
              {group.items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className={`w-full text-left py-1.5 rounded-lg text-sm font-medium transition mb-0.5 ${
                    active === item.key ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={{ paddingLeft: `${12 + (item.indent ?? 0) * 14}px` }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <div className={active === "media" ? "max-w-4xl mx-auto" : "max-w-2xl mx-auto"}>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{PAGE_TITLES[active]}</h2>
            <p className="text-sm text-gray-500 mb-6">{PAGE_SUBTITLES[active]}</p>
            {renderPage()}
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
