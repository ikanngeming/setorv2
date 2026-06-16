# Vercel Deployment Guide - Setor Email Pro

Panduan lengkap untuk deploy aplikasi Setor Email Pro ke Vercel.

## Prerequisites

- [Vercel Account](https://vercel.com)
- [Git Repository](https://github.com) (GitHub, GitLab, or Bitbucket)
- Database serverless (PlanetScale, Neon, atau Railway)
- Node.js 20.x atau lebih tinggi

## Step 1: Setup Database Serverless

Pilih salah satu provider database:

### Option A: PlanetScale (MySQL - Recommended)

1. Buat akun di [PlanetScale](https://planetscale.com)
2. Buat database baru: `setor-email-pro`
3. Dapatkan connection string dari "Connect" button
4. Copy connection string (format: `mysql://...`)

### Option B: Neon (PostgreSQL)

1. Buat akun di [Neon](https://neon.tech)
2. Buat project dan database
3. Copy connection string PostgreSQL
4. Update `prisma/schema.prisma` provider ke `postgresql`

### Option C: Railway (MySQL/PostgreSQL)

1. Buat akun di [Railway](https://railway.app)
2. Add MySQL/PostgreSQL plugin
3. Copy connection string

## Step 2: Prepare Your Code

```bash
# 1. Clone atau setup repository
git clone <your-repo-url>
cd setor-email-vercel

# 2. Install dependencies
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Push schema ke database (local testing)
npx prisma db push

# 5. Commit ke Git
git add .
git commit -m "Initial commit"
git push origin main
```

## Step 3: Deploy ke Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Login ke Vercel:**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan akun Anda

2. **Import Project:**
   - Klik "Add New" → "Project"
   - Select repository dari GitHub/GitLab/Bitbucket
   - Select `setor-email-vercel` repository

3. **Configure Project:**
   - Framework: Next.js (auto-detected)
   - Root Directory: `.` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables:**
   - Klik "Environment Variables"
   - Add 3 variables:

   ```
   DATABASE_URL = mysql://user:pass@host/db
   NEXTAUTH_URL = https://your-domain.vercel.app
   NEXTAUTH_SECRET = (generate: openssl rand -base64 32)
   ```

5. **Deploy:**
   - Klik "Deploy"
   - Tunggu hingga deployment selesai (~5 menit)

### Method 2: Via Vercel CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login ke Vercel
vercel login

# 3. Deploy
vercel

# 4. Follow prompts dan add environment variables

# 5. Production deployment
vercel --prod
```

## Step 4: Post-Deployment Setup

### 1. Setup Database di Production

```bash
# Push schema ke production database
npx prisma db push --skip-generate

# Atau gunakan Prisma Studio
npx prisma studio
```

### 2. Create Admin User

Buat admin user pertama melalui:
- Register page: `/auth/register`
- Atau via Prisma Studio
- Update role ke "admin" di database

### 3. Update NEXTAUTH_URL

Setelah deployment, update environment variable:
- `NEXTAUTH_URL` = `https://your-app.vercel.app`

### 4. Test Application

- Visit: `https://your-app.vercel.app`
- Login dengan credentials yang dibuat
- Test semua fitur

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `mysql://user:pass@host/db` |
| `NEXTAUTH_URL` | Application URL | `https://app.vercel.app` |
| `NEXTAUTH_SECRET` | NextAuth secret key | Generated via openssl |

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED
```

**Solution:**
- Verify DATABASE_URL is correct
- Check database firewall/IP whitelist
- Ensure SSL is enabled in connection string

### Build Failure

```
Error: prisma generate failed
```

**Solution:**
```bash
# Regenerate Prisma Client locally
npx prisma generate

# Commit changes
git add prisma/
git commit -m "Update Prisma client"
git push
```

### 502 Bad Gateway

**Solution:**
- Check server logs: `vercel logs`
- Restart deployment: Redeploy from Vercel dashboard
- Check environment variables are set correctly

### Slow Initial Load

**Solution:**
- First request may be slow (cold start)
- This is normal for serverless
- Subsequent requests will be faster

## Monitoring & Logs

### View Logs

```bash
# Real-time logs
vercel logs --follow

# Last 100 lines
vercel logs
```

### Monitor Performance

- Vercel Analytics: https://vercel.com/docs/analytics
- Check build times in Vercel dashboard
- Monitor database query performance

## Scaling & Optimization

### Database Optimization

- Add indexes untuk frequently queried columns
- Use connection pooling (PlanetScale/Railway support ini)
- Monitor query performance

### Application Optimization

- Enable caching headers
- Optimize images
- Use CDN untuk static assets

### Cost Optimization

- Use PlanetScale free tier (recommended)
- Monitor Vercel usage
- Set up billing alerts

## Custom Domain

1. **Add Domain di Vercel:**
   - Project Settings → Domains
   - Add custom domain
   - Follow DNS setup instructions

2. **Update NEXTAUTH_URL:**
   - Change to: `https://your-domain.com`
   - Redeploy

## Backup & Recovery

### Database Backup

**PlanetScale:**
- Automatic daily backups
- Manual backup via dashboard

**Neon:**
- Automatic backups included
- Point-in-time recovery available

**Railway:**
- Backups available via dashboard

### Application Backup

- All code in Git repository
- Automatic deployment history in Vercel

## Security Checklist

- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] DATABASE_URL uses SSL connection
- [ ] Database firewall configured
- [ ] NEXTAUTH_URL matches production domain
- [ ] Environment variables are not in code
- [ ] Git repository is private
- [ ] Enable 2FA on Vercel account
- [ ] Enable 2FA on database provider account

## Next Steps

1. **Setup Monitoring:**
   - Enable Vercel Analytics
   - Setup error tracking (Sentry, etc)

2. **Setup CI/CD:**
   - Configure GitHub Actions for testing
   - Auto-deploy on push to main

3. **Setup Email Notifications:**
   - Configure SMTP for password reset emails
   - Setup transactional email service

4. **Performance Optimization:**
   - Setup caching strategy
   - Optimize database queries
   - Enable compression

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

## FAQ

**Q: Can I use SQLite?**
A: No, SQLite is not suitable for production. Use PlanetScale, Neon, or Railway.

**Q: How much does it cost?**
A: Vercel free tier includes 100GB bandwidth. Database depends on provider (PlanetScale free tier available).

**Q: How do I update the application?**
A: Push changes to Git → Vercel auto-deploys. Or use `vercel --prod` for manual deployment.

**Q: Can I rollback to previous version?**
A: Yes, use Vercel dashboard → Deployments → Click previous deployment → Promote to Production.

**Q: How do I add more admin users?**
A: Via Prisma Studio or update database directly (change role to "admin").
