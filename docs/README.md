# Aurum Store — Quick Start

## 1) Install and run

```bash
npm install
cp .env.example .env
```

Fill `.env` with at least:

```env
DATABASE_URL=postgresql://.../neondb?sslmode=require&connect_timeout=30
AUTH_SECRET=your-long-random-secret
AUTH_URL=http://localhost:3000
ADMIN_SETUP_SECRET=your-admin-signup-secret
```

Then run:

```bash
npm run db:migrate
npm run dev
```

Open: `http://localhost:3000`

## 2) See database storage

Use Prisma Studio:

```bash
npm run db:studio
```

This opens a browser UI where you can inspect all tables:

- `users` (roles, admin accounts)
- `products`, `categories`
- `orders`, `order_items`
- `addresses`, `wishlists`, etc.

## 3) Helpful commands

```bash
npm run db:test    # checks database connectivity
npm run build      # production build check
npm run start      # run production build
```

## 4) Admin access

- Admin login page: `/admin/login`
- Admin signup page: `/admin/register`
- Signup requires `ADMIN_SETUP_SECRET`

