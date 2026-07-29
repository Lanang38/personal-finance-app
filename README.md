# Finance App

Aplikasi pencatatan keuangan pribadi. Frontend dibangun dengan **Vite + React + TypeScript** (strict, tanpa tipe `any`), backend dengan **Node.js + Express + TypeScript**, database **MongoDB Atlas**, autentikasi **JWT** + **Login Google**.

Desain UI mengikuti referensi dashboard finance yang diberikan (sidebar gradient ungu, kartu statistik warna-warni, grafik wallet analytics, donut chart).

## Fitur versi awal
- Autentikasi: register/login email+password, login dengan Google, JWT
- Input transaksi + kategori (income/expense)
- Dashboard: total pemasukan/pengeluaran/saldo, grafik tren harian, breakdown kategori
- Multi-akun dasar (tunai, bank, e-wallet, dll) dengan saldo per akun
- Export data transaksi ke CSV

## Struktur folder
```
finance-app/
  backend/     -> Express API + MongoDB
  frontend/    -> Vite React SPA
```

## 1. Setup Backend

```bash
cd backend
cp .env.example .env
npm install
```

Isi file `.env`:
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/finance-app
JWT_SECRET=string_rahasia_yang_panjang
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

Cara mendapatkan `MONGODB_URI`:
1. Buat cluster gratis di https://cloud.mongodb.com (MongoDB Atlas)
2. Buat database user + whitelist IP (atau izinkan semua IP `0.0.0.0/0` untuk development)
3. Klik "Connect" → "Drivers" → salin connection string, ganti `<password>` dan tambahkan nama database (`finance-app`)

Jalankan backend (development, auto-reload):
```bash
npm run dev
```
Backend berjalan di `http://localhost:5000`.

Build untuk produksi:
```bash
npm run build
npm start
```

## 2. Setup Frontend

```bash
cd frontend
cp .env.example .env
npm install
```

Isi file `.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

Jalankan frontend:
```bash
npm run dev
```
Frontend berjalan di `http://localhost:5173`.

## 3. Setup Google Login (OAuth Client ID)

1. Buka https://console.cloud.google.com/apis/credentials
2. Buat project (jika belum ada) → "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Authorized JavaScript origins: `http://localhost:5173`
5. Salin **Client ID** yang dihasilkan, gunakan nilai yang sama di:
   - `backend/.env` → `GOOGLE_CLIENT_ID`
   - `frontend/.env` → `VITE_GOOGLE_CLIENT_ID`

Alur login Google: frontend memakai Google Identity Services (script di `index.html`) untuk mendapatkan `credential` (ID token), lalu mengirimkannya ke `POST /api/auth/google`. Backend memverifikasi token tersebut ke Google, lalu membuat/menemukan user dan mengirim balik JWT aplikasi sendiri — jadi keamanan sesi selanjutnya tetap memakai JWT internal, bukan token Google.

## 4. Alur pemakaian

1. Daftar akun baru (email/password) atau masuk dengan Google
2. Buka menu **Akun** → tambahkan minimal satu akun (misal "Tunai" atau "BCA")
3. Buka menu **Transaksi** → tambahkan kategori (misal "Gaji", "Makan"), lalu catat transaksi
4. Buka menu **Dashboard** untuk melihat ringkasan & grafik
5. Klik **Ekspor CSV** di dashboard untuk mengunduh seluruh riwayat transaksi

## Catatan teknis
- Semua konfigurasi sensitif (Mongo URI, JWT secret, Google Client ID) diatur lewat `.env`, tidak ada yang di-hardcode.
- TypeScript di kedua sisi memakai mode `strict` + `noImplicitAny`, tidak ada penggunaan tipe `any`.
- JWT disimpan di `localStorage` frontend dan dikirim lewat header `Authorization: Bearer <token>`.
- Struktur backend: `models` (Mongoose schema) → `controllers` (logika bisnis) → `routes` (endpoint) → `middleware` (auth & error handling).

## Rencana pengembangan lanjutan (belum ada di versi ini)
- Refresh token / logout otomatis saat token kedaluwarsa
- Edit transaksi & kategori dari UI (backend sudah menyediakan endpoint PATCH)
- Filter & pencarian transaksi di frontend (backend sudah mendukung query `accountId`, `categoryId`, `type`, `from`, `to`)
- Grafik perbandingan bulan ke bulan
- Export ke format PDF/Excel
