# Vercel Deployment

## Error: `Environment variable not found: DATABASE_URL`

Vercel runs `npm run build` **without** your local `.env` file. You must add variables in the Vercel dashboard.

### Required environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Name | Value | Environments |
|------|--------|--------------|
| `DATABASE_URL` | Neon **pooled** connection string | Production, Preview, Development |
| `AUTH_SECRET` | Same as local (`npx auth secret`) | Production, Preview, Development |
| `AUTH_URL` | `https://your-app.vercel.app` | Production |
| `AUTH_URL` | `https://your-preview-xxx.vercel.app` or `http://localhost:3000` | Preview / Development |

Optional (Google login):

| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |

### Where to copy `DATABASE_URL`

1. [Neon Console](https://console.neon.tech) → your project → **Connect**
2. Copy the **pooled** connection string (not unpooled unless you know you need it)
3. Paste as `DATABASE_URL` in Vercel

### After adding variables

1. **Redeploy** (Deployments → … → Redeploy) — env vars only apply on new builds
2. For production `AUTH_URL`, use your real domain, e.g. `https://aurum-store.vercel.app`

### Google OAuth on production

Add this redirect URI in Google Cloud:

```
https://YOUR-DOMAIN.vercel.app/api/auth/callback/google
```
