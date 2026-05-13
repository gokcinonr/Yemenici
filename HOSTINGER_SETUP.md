# Hostinger Web Apps Hosting — Kurulum Kılavuzu

## Nasıl Çalışır?

Bu proje **pre-built** olarak GitHub'a gönderilir. Hostinger'ın bir build adımı
çalıştırmasına gerek yoktur — derlenmiş sunucu dosyaları (`artifacts/api-server/dist/`)
ve statik siteler (`artifacts/api-server/public/`) doğrudan repo'da bulunur.

## 1. Deploy Öncesi (Replit'te)

Her deploy öncesinde Replit'te bir kez çalıştırın:

```bash
node scripts/build-hostinger.mjs
```

Sonra oluşan dosyaları **GitHub'a commit edin** (Replit'in Git sekmesi).
Git izlenecek dosyalar:
- `artifacts/api-server/dist/`   ← derlenmiş Express sunucu
- `artifacts/api-server/public/` ← Yemenici + Admin statik dosyaları

## 2. Hostinger Ayarları

| Alan | Değer |
|------|-------|
| **Framework** | Express |
| **Paket yöneticisi** | npm |
| **Giriş dosyası** | `artifacts/api-server/dist/index.mjs` |

> **Önemli:** Build / postinstall adımı yoktur. Hostinger sadece sunucuyu başlatır.

## 3. Environment Variables

hPanel → **Web Apps** → uygulamanız → **Environment Variables**:

| Değişken | Değer | Açıklama |
|----------|-------|----------|
| `NODE_ENV` | `production` | Zorunlu |
| `SUPABASE_DATABASE_URL` | `postgresql://...` | Supabase bağlantı URL'si |
| `SESSION_SECRET` | güçlü rastgele string | Admin oturumu için |
| `ADMIN_PASSWORD` | istediğiniz şifre | İlk admin kullanıcısı (default: admin123) |

### SUPABASE_DATABASE_URL Nasıl Alınır?

1. [Supabase](https://supabase.com) → projeniz → **Settings** → **Database**
2. **Transaction Pooler** bağlantı string'ini kopyalayın
3. Sonuna `?sslmode=require` ekleyin (yoksa)

### SESSION_SECRET Üretme

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4. Tekrar Deploy (Kod Değişikliğinde)

1. Replit'te `node scripts/build-hostinger.mjs` çalıştırın
2. Git sekmesinden değişiklikleri commit + push edin
3. Hostinger otomatik olarak yeni versiyonu deploy eder

## 5. Deploy Sonrası Kontrol

- `https://alanadi.com/` → Yemenici sitesi
- `https://alanadi.com/admin/` → Admin paneli (admin / ADMIN_PASSWORD)
- `https://alanadi.com/api/healthz` → API sağlık kontrolü
