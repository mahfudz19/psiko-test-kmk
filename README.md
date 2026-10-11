# Gen-U Laravel & Inertia React Boilerplate

Boilerplate resmi yang diekstraksi dari ekosistem proyek **Gen-U**. Menyediakan konfigurasi dasar yang bersih (*clean architecture*), modern, dan siap dikembangkan untuk aplikasi baru tanpa dependensi yang berlebihan.

---

## 🚀 Tech Stack

- **Backend**: Laravel 13 (PHP 8.3+)
- **Adapter**: Inertia.js v3.8+
- **Frontend**: React 19 + TypeScript 5.7
- **Styling**: Tailwind CSS v4 + Google Font Inter
- **Build Tool**: Vite 8 with `@tailwindcss/vite` & `@vitejs/plugin-react`
- **Database**: SQLite (default) / MySQL ready

---

## 📂 Struktur Proyek

```
gen-u-boilerplate/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Controller.php
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php
│   ├── Models/
│   │   └── User.php
│   └── Providers/
│       └── AppServiceProvider.php
├── bootstrap/
│   ├── app.php
│   └── providers.php
├── config/
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── public/
├── resources/
│   └── views/
│       └── app.blade.php
├── routes/
│   ├── console.php
│   └── web.php                  # Hanya rute '/'
├── src/
│   ├── Pages/
│   │   └── Welcome.tsx          # Halaman beranda boilerplate
│   ├── index.css
│   └── main.tsx
├── artisan
├── composer.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Langkah Memulai (Quick Start)

### 1. Salin Environment
```bash
cp .env.example .env
```

### 2. Pasang Dependensi
```bash
composer install
npm install
```

### 3. Generate Application Key
```bash
php artisan key:generate
```

### 4. Jalankan Migrasi Database
```bash
php artisan migrate
```

### 5. Jalankan Development Server

#### Opsi 1: Satu Terminal (Rekomendasi — Hot Reload Aktif)
Jalankan process manager bawaan Laravel:
```bash
php artisan dev
```
*atau:*
```bash
composer run dev
```
> **Catatan:** Perintah ini secara otomatis menjalankan server backend Laravel (`php artisan serve`) sekaligus Vite React (`npm run dev`) secara bersamaan dalam 1 terminal dengan fitur **Hot Module Replacement (HMR / Hot Reload)** tetap aktif.

#### Opsi 2: Dua Terminal Terpisah (Tradisional)
Jika ingin melihat log backend dan frontend secara terpisah:
- **Terminal 1 (Backend)**:
  ```bash
  php artisan serve
  ```
- **Terminal 2 (Frontend)**:
  ```bash
  npm run dev
  ```

---

### 🌐 Akses Aplikasi
Buka browser dan akses melalui:
```
http://127.0.0.1:8000
```
