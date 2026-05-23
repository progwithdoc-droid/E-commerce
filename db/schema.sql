-- Aurum Store — PostgreSQL schema (Neon)
-- Run via: npm run db:migrate

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users & Auth (NextAuth-compatible) ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  password TEXT,
  image TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE (provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_token TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ─── Catalog ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  compare_price NUMERIC(10, 2),
  images TEXT[] NOT NULL DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);

-- ─── Orders ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_number TEXT UNIQUE NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (
    status IN ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED')
  ),
  stripe_payment_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  size TEXT,
  price NUMERIC(10, 2) NOT NULL
);

-- ─── Reviews ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- ─── Cart (server-side, logged-in users) ────────────────────────────────────

CREATE TABLE IF NOT EXISTS carts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cart_id TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  size TEXT,
  UNIQUE (cart_id, product_id, size)
);

-- ─── Addresses & Wishlist ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS addresses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlists (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);
