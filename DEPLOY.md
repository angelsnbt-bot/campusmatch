# CampusMatch - Production Deployment

## Architecture

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend (React/Vite) | Vercel | campusmatch.vercel.app |
| API Server (Express) | Railway/Render | api.campusmatch.in |
| Database | Neon | (internal) |
| File Storage | Cloudflare R2 | (internal) |
| Email | Resend | (internal) |

## Quick Setup

```bash
bash scripts/setup-production.sh
```

## Step 1: Frontend → Vercel

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Set **Root Directory** to `artifacts/campusmatch`
5. Framework: **Vite**
6. Add Environment Variables:
   ```
   VITE_API_URL=https://api.campusmatch.in/api
   ```
7. Deploy

### Custom Domain on Vercel
1. Vercel Dashboard → Settings → Domains
2. Add `campusmatch.in`
3. Update DNS as instructed (A record or CNAME)

## Step 2: API Server → Railway

1. Go to https://railway.app/new
2. Deploy from GitHub Repo (same repo)
3. Set **Root Directory** to `artifacts/api-server`
4. Build Command: `pnpm install && pnpm run build`
5. Start Command: `node dist/index.mjs`
6. Add all env vars from `.env.production`:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=9a7c0729e29e3540475547d10f77a88dae1c50e688f677833853fc10b88f4d42
   RESEND_API_KEY=re_DfY3b1pd_43k66h9fN5P91G35QbggPRfV
   RESEND_FROM=onboarding@campusmatch.in
   ALLOWED_ORIGINS=https://campusmatch.in,https://campusmatch.vercel.app
   STORAGE_DRIVER=s3
   S3_ENDPOINT=...
   S3_BUCKET=campusmatch-uploads
   S3_PUBLIC_URL=...
   S3_ACCESS_KEY_ID=...
   S3_SECRET_ACCESS_KEY=
   NODE_ENV=production
   PORT=3000
   ```

### Custom Domain on Railway
1. Railway Dashboard → Settings → Custom Domains
2. Add `api.campusmatch.in`
3. Update DNS: CNAME `api` → `your-app.up.railway.app`

## Step 3: Database → Neon

1. Go to https://neon.tech
2. Create Project → copy connection string
3. Run migration:
   ```bash
   DATABASE_URL="postgresql://..." pnpm --filter @workspace/db run migrate
   ```

## Step 4: File Storage → Cloudflare R2

1. Go to https://dash.cloudflare.com/sign-up
2. R2 Object Storage → Create Bucket `campusmatch-uploads`
3. R2 API Tokens → Create Token (Object Read & Write)
4. Copy Access Key ID + Secret Access Key
5. Bucket → Settings → Enable Public Access → copy Public URL

## Step 5: Email → Resend ✅ DONE

- API Key: `re_DfY3b1pd_43k66h9fN5P91G35QbggPRfV`
- From: `onboarding@campusmatch.in`

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Random 64-char hex string |
| `RESEND_API_KEY` | Yes | Resend API key for emails |
| `ALLOWED_ORIGINS` | Yes | Comma-separated allowed origins |
| `STORAGE_DRIVER` | No | `local` (default) or `s3` |
| `S3_ENDPOINT` | If S3 | S3/R2 endpoint URL |
| `S3_BUCKET` | If S3 | Bucket name |
| `S3_PUBLIC_URL` | If S3 | Public URL for uploads |
| `S3_ACCESS_KEY_ID` | If S3 | S3 access key |
| `S3_SECRET_ACCESS_KEY` | If S3 | S3 secret key |
| `REDIS_URL` | No | Redis connection URL |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `NODE_ENV` | Yes | `production` |
| `PORT` | No | Server port (default: 3000) |

## First Deploy Checklist

- [ ] Push code to GitHub
- [ ] Deploy frontend on Vercel
- [ ] Deploy API on Railway
- [ ] Set up Neon database
- [ ] Run database migration
- [ ] Set up Cloudflare R2
- [ ] Update env vars with real values
- [ ] Verify: `curl https://api.campusmatch.in/api/healthz`
- [ ] Test register/login flow
- [ ] (Optional) Connect custom domain
