# Testing & Running Aurum Store

## Prerequisites

- Node.js 18+
- A Neon PostgreSQL database (`DATABASE_URL` in `.env`)
- `AUTH_SECRET` and `AUTH_URL` in `.env`

## Setup

```bash
npm install
cp .env.example .env
# Fill in DATABASE_URL, AUTH_SECRET, ADMIN_SETUP_SECRET
npm run db:migrate    # create tables + seed products
npm run dev
```

Open **http://localhost:3000**

## Environment variables (minimum)

```env
DATABASE_URL=postgresql://...?sslmode=require&connect_timeout=30
AUTH_SECRET=your-random-secret
AUTH_URL=http://localhost:3000
ADMIN_SETUP_SECRET=your-admin-access-code
```

## Test checklist

### Storefront
| Test | Steps | Expected |
|------|-------|----------|
| Home | Visit `/` | Hero, categories, featured products load |
| Collections | Click **Collections** or `/products` | Product grid loads |
| Product detail | Click any product | `/products/[slug]` with images, add to cart |
| Search | Click search icon or `Ctrl+K` | Modal opens, type 2+ chars, results appear |
| About / Journal | Nav links | `/about` and `/journal` pages load |
| Lookbook | Click **Lookbook** | Scrolls to lookbook section on home |

### Customer auth
| Test | Steps | Expected |
|------|-------|----------|
| Register | `/register` | Create account → redirected to `/account` |
| Login | `/login` | Sign in → `/account` |
| Protected account | Visit `/account` logged out | Redirect to `/login?callbackUrl=/account` |
| Protected checkout | Add to cart → **Sign in to checkout** | Redirect to login, then checkout after sign-in |

### Admin
| Test | Steps | Expected |
|------|-------|----------|
| Admin sign up | Header **Admin Sign Up** → use `ADMIN_SETUP_SECRET` | Auto sign-in → `/admin` dashboard |
| Admin login | **Admin Login** with admin credentials | Lands on `/admin` |
| Non-admin blocked | Customer tries `/admin` | Redirect to `/admin/login?error=not_admin` |

### Cart & checkout
- **Browsing and cart** work without login (guest cart in localStorage).
- **Checkout** requires sign-in (middleware + cart button).

## Useful commands

```bash
npm run dev          # development server
npm run build        # production build
npm run db:test      # verify database connection
npm run db:studio    # Prisma Studio (edit users, roles)
npm run lint         # ESLint
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Database connection error | Wake Neon project in dashboard; restart dev server; check `DATABASE_URL` |
| Admin can't login | Use **Admin Login** (not customer Sign In); ensure `ADMIN_SETUP_SECRET` matches sign-up code |
| First page load slow | Neon cold start — wait ~30s, refresh |
| Images broken | Products need image URLs; fallback uses Unsplash |
| MetaMask / wallet error overlay | Not used by this store — caused by the browser extension. Disable MetaMask on localhost or ignore; the app suppresses extension noise in dev |
