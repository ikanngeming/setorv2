# Database Setup untuk Vercel Deployment

Aplikasi ini menggunakan Prisma ORM dengan database MySQL serverless. Pilih salah satu provider di bawah:

## Option 1: PlanetScale (Recommended)

PlanetScale adalah MySQL serverless yang fully managed dan gratis untuk development.

### Setup PlanetScale:

1. **Buat akun di [PlanetScale](https://planetscale.com)**
2. **Buat database baru:**
   - Klik "Create a new database"
   - Nama: `setor-email-pro`
   - Region: Pilih yang terdekat dengan lokasi Anda
   - Klik "Create database"

3. **Dapatkan connection string:**
   - Klik database yang baru dibuat
   - Klik "Connect"
   - Pilih "Prisma"
   - Copy connection string

4. **Update `.env.local`:**
   ```
   DATABASE_URL="mysql://username:password@host/database?sslaccept=strict"
   ```

5. **Push schema ke database:**
   ```bash
   npx prisma db push
   ```

6. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

## Option 2: Neon (PostgreSQL Alternative)

Jika Anda lebih suka PostgreSQL, gunakan Neon.

### Setup Neon:

1. **Buat akun di [Neon](https://neon.tech)**
2. **Buat project baru**
3. **Copy connection string**
4. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

5. **Update `.env.local` dengan connection string Neon**

6. **Push schema:**
   ```bash
   npx prisma db push
   ```

## Option 3: Railway

Railway menyediakan MySQL managed yang mudah digunakan.

### Setup Railway:

1. **Buat akun di [Railway](https://railway.app)**
2. **Buat project baru**
3. **Add MySQL plugin**
4. **Copy connection string**
5. **Update `.env.local`**
6. **Push schema:**
   ```bash
   npx prisma db push
   ```

## Verifikasi Setup

Setelah setup database, jalankan:

```bash
# Test koneksi database
npx prisma db execute --stdin < /dev/null

# Lihat schema di database
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

## Migrasi Data (Jika dari database lama)

Jika Anda memiliki data dari aplikasi lama:

```bash
# Buat migration
npx prisma migrate dev --name init

# Atau gunakan Prisma Studio untuk input data manual
npx prisma studio
```

## Production Setup untuk Vercel

Saat deploy ke Vercel:

1. **Add environment variable di Vercel:**
   - Buka project di Vercel
   - Settings → Environment Variables
   - Add `DATABASE_URL` dengan connection string production
   - Pastikan menggunakan connection string yang aman (dengan SSL)

2. **Automatic migrations:**
   - Vercel akan otomatis menjalankan `prisma db push` saat deploy
   - Atau tambahkan di `package.json`:
     ```json
     {
       "scripts": {
         "postinstall": "prisma generate",
         "build": "prisma db push && next build"
       }
     }
     ```

## Tips & Troubleshooting

- **Connection timeout:** Pastikan firewall/IP whitelist sudah dikonfigurasi
- **SSL errors:** Gunakan `sslaccept=strict` di connection string
- **Migration conflicts:** Gunakan `npx prisma migrate resolve --rolled-back <migration_name>`
- **Reset database:** `npx prisma migrate reset` (hanya untuk development)

## Security

- Jangan commit `.env.local` ke git
- Gunakan `.env.local` untuk development
- Gunakan Vercel Environment Variables untuk production
- Rotate credentials secara berkala
- Gunakan SSL untuk semua koneksi database
