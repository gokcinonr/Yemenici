# Hostinger Web Apps Hosting — Kurulum Kılavuzu

## 1. GitHub Repo Bağlama

1. Projeyi GitHub'a push edin
2. Hostinger hPanel → **Web Apps** → **Create New App**
3. Bağlantı türü: **GitHub**
4. Repo ve branch seçin (genellikle `main`)

## 2. Framework Seçimi

Otomatik algılama başarısız olursa **Express** seçin.

## 3. Build & Start Komutları

Bu proje pnpm monorepo yapısında olduğu için Hostinger'ın kendi `npm install`
adımı **çalışmaz**. Aşağıdaki ayarlarla tüm kurulum build komutuna bırakılmalı:

| Alan | Değer |
|------|-------|
| **Install command** | `echo "Handled by build script"` |
| **Build command** | `npm install -g pnpm && node scripts/build-hostinger.mjs` |
| **Start command** | `node artifacts/api-server/dist/index.mjs` |
| **Node.js version** | 20 veya üzeri |

> **Kritik:** Install command'ı `echo "Handled by build script"` olarak girin.
> Build komutu pnpm'i kurar ve tüm workspace bağımlılıklarını doğru şekilde halleder.

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

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 5. Veritabanı

Veritabanı Supabase'de. Hostinger'de ayrıca kurulum gerekmez.
Sunucu ilk açılışta `admin_users` tablosu boşsa `admin / ADMIN_PASSWORD` kullanıcısını otomatik oluşturur.

## 6. Deploy Sonrası Kontrol

- `https://alanadi.com/` → Yemenici sitesi
- `https://alanadi.com/admin/` → Admin paneli
- `https://alanadi.com/api/healthz` → API sağlık kontrolü
