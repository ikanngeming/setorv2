# Setor Email Pro - Vercel Edition

Aplikasi web manajemen email dan deposit yang fully serverless dan siap di-deploy ke Vercel.

## 🚀 Features

- **Authentication:** NextAuth.js dengan Credentials provider
- **Database:** Prisma ORM dengan MySQL serverless (PlanetScale/Neon/Railway)
- **API Routes:** Next.js API routes untuk semua backend logic
- **Dashboard:** User dashboard dengan sidebar navigation
- **Email Management:** Generate dan manage email accounts
- **Deposit System:** Request dan track deposits
- **Admin Panel:** Approve deposits dan manage broadcasts
- **Notifications:** Real-time notifications dengan badge counter
- **Broadcasts:** Admin dapat mengirim pesan ke semua users
- **Role-Based Access:** User dan Admin roles

## 📋 Tech Stack

- **Frontend:** React 19, Next.js 16, Tailwind CSS 4
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** MySQL (PlanetScale/Neon/Railway)
- **Authentication:** NextAuth.js 4
- **Deployment:** Vercel

## 🛠️ Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd setor-email-vercel
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env.local`:
```bash
DATABASE_URL="mysql://user:password@host/database"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 4. Setup Database
```bash
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```

## 📚 Documentation

- [Database Setup Guide](./DATABASE_SETUP.md)
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)

## 🚀 Quick Deploy to Vercel

1. Push code ke GitHub
2. Buka vercel.com dan import repository
3. Add environment variables
4. Deploy!

Lihat [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) untuk panduan lengkap.

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL connection string |
| `NEXTAUTH_URL` | Application URL |
| `NEXTAUTH_SECRET` | NextAuth secret |

## 🔐 Default Credentials (Development)

```
Email: admin@example.com
Password: password123
```

## 📖 API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/emails/generate` - Generate email
- `POST /api/deposits/create` - Create deposit
- `GET /api/deposits/list` - Get deposits
- `POST /api/admin/deposits/approve` - Approve deposit (admin)
- `GET /api/notifications/list` - Get notifications
- `POST /api/broadcasts/create` - Create broadcast (admin)

## 🔧 Commands

```bash
npm run dev          # Development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push database schema
npm run db:studio    # Open Prisma Studio
```

## 📄 License

MIT License

## 🆘 Support

Untuk bantuan, buka issue di GitHub atau lihat dokumentasi di folder root.

---

**Ready to deploy! 🚀**
