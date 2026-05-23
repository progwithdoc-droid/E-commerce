# Google Sign-In Setup

Google login is already wired in `lib/auth.config.ts`. You only need Google Cloud credentials.

## 1. Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. **APIs & Services → OAuth consent screen** — configure (External is fine for testing)
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
5. Application type: **Web application**
6. **Authorized redirect URIs** (add both):

```
http://localhost:3000/api/auth/callback/google
https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback/google
```

## 2. Add to `.env`

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
AUTH_URL=http://localhost:3000
AUTH_SECRET=your-secret
```

Restart `npm run dev` after saving.

## 3. Test

1. Open `/login`
2. Click **Continue with Google**
3. After sign-in, check Prisma Studio:
   - **User** table — email, name, image (no password for Google users)
   - **Account** table — row with `provider = google`

## Where passwords live

| Table | Contents |
|-------|----------|
| **User** | Email, name, **password** (hashed, email sign-up only), role |
| **Account** | OAuth links (Google/GitHub) — empty until you use social login |

Email/password users: data only in **User**.  
Google users: **User** + one row in **Account**.
