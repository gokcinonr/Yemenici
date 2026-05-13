# Hostinger Web Apps Hosting — Kurulum Kılavuzu

## 1. GitHub Repo Bağlama

1. Projeyi GitHub'a push edin
2. Hostinger hPanel → **Web Apps** → **Create New App**
3. Bağlantı türü: **GitHub**
4. Repo ve branch seçin (genellikle `main`)

## 2. Framework Seçimi

Otomatik algılama başarısız olursa **Express** seçin.

## 3. Build & Start Komutları

| Alan | Değer |
|------|-------|
| **Build command** | `node scripts/build-hostinger.mjs` |
| **Start command** | `node artifacts/api-server/dist/index.mjs` |
| **Node.js version** | 20 veya üzeri |

> Build komutu hem pnpm kurulumunu hem de tüm derleme adımlarını otomatik yapar.

## 4. Environment Variables

hPanel → **Web Apps** → uygulamanız → **Environment Variables** bölümünden ekleyin:

| Değişken | Değer | Açıklama |
|----------|-------|----------|
| `NODE_ENV` | `production` | Zorunlu |
| `SUPABASE_DATABASE_URL` | `postgresql://...` | Supabase bağlantı URL'si |
| `SESSION_SECRET` | güçlü rastgele string | Admin oturumu için |
| `ADMIN_PASSWORD` | istediğiniz şifre | İlk admin kullanıcısı (default: admin123) |

### SUPABASE_DATABASE_URL Nasıl Alınır?

1. [Supabase](https://supabase.com) → projeniz → **Settings** → **Database**
2. **Connection string** bölümünden **Transaction Pooler** URI'sini kopyalayın
3. Sonuna `?sslmode=require` ekleyin (yoksa)

### SESSION_SECRET Üretme

Terminal veya [random.org](https://www.random.org/strings/) ile:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 5. Veritabanı

Veritabanı Supabase'de. Hostinger'de ayrıca veritabanı kurmanıza gerek yok.
`SUPABASE_DATABASE_URL` env variable'ı ile Supabase'e bağlanıyor.

Sunucu ilk açılışta tablolar boşsa otomatik olarak `admin / ADMIN_PASSWORD` kullanıcısını oluşturur.

## 6. Yüklenen Görseller (Uploads)

Admin panelinden yüklenen görseller sunucunun `public/uploads/` klasöründe tutulur.
Bu klasör her deploy'da sıfırlanabilir.

**Kalıcı depolama için:** Hostinger hPanel → **File Manager** üzerinden mevcut görselleri yeni deployment sonrası yeniden yükleyin, ya da ilerleyen süreçte Supabase Storage / Cloudflare R2 gibi bir çözüme geçin.

## 7. Deploy Sonrası Kontrol

- `https://alanadi.com/` → Yemenici sitesi
- `https://alanadi.com/admin/` → Admin paneli (admin / ADMIN_PASSWORD)
- `https://alanadi.com/api/healthz` → API sağlık kontrolü
