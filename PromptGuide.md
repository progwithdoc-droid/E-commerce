# AURUM STORE — CURSOR PROMPT GUIDE
### Use these prompts in order. One at a time. Wait for completion before the next.

---

> **HOW TO USE THIS GUIDE**
> 1. Open your Cursor project (after Kimi has generated the frontend).
> 2. Open the AI chat panel (`Cmd+L` or `Ctrl+L`).
> 3. Copy a prompt block exactly as written. Paste. Send.
> 4. Wait for Cursor to finish writing files.
> 5. Review the output, fix if needed, then move to the next prompt.
> 6. Never skip a step — each one builds on the last.

---

## PHASE 0 — PROJECT INITIALIZATION

### Prompt 0.1 — Scaffold the project
```
Initialize a new Next.js 14 project called aurum-store with the following setup:
- TypeScript with strict mode
- Tailwind CSS
- App Router
- src/ directory structure
- ESLint + Prettier with these configs:
  - single quotes
  - 2-space indent
  - trailing commas
  - semicolons off
  - 100 char print width
- Create the complete folder structure:
  src/app/(home)/, src/app/(admin)/, src/app/api/,
  src/components/ui/, src/components/home/, src/components/admin/, src/components/shared/,
  src/lib/, src/hooks/, src/store/, src/actions/, src/types/, src/constants/
- Create tsconfig.json with @/ path alias pointing to src/
- Create .env.example with all required environment variable keys (no values)
- Create .env.local as a copy of .env.example (I will fill in values)
- Create next.config.js with images.remotePatterns for unsplash.com and uploadthing.com
Output every file completely.
```

---

### Prompt 0.2 — Install and configure dependencies
```
Install and configure the following packages for the aurum-store project. 
Output the exact terminal commands to run AND create all configuration files:

Dependencies:
- @prisma/client prisma
- next-auth@beta @auth/prisma-adapter
- stripe @stripe/stripe-js
- zustand immer
- react-hook-form @hookform/resolvers zod
- framer-motion
- @studio-freight/lenis
- uploadthing @uploadthing/next @uploadthing/react
- resend
- recharts
- @tanstack/react-table
- date-fns
- slugify
- bcryptjs @types/bcryptjs
- clsx tailwind-merge
- lucide-react

Then install all shadcn/ui components listed in the .cursorrules file using
`npx shadcn@latest add` commands.

Create:
- lib/utils.ts with cn() helper using clsx + tailwind-merge
- lib/env.ts with Zod environment variable validation
- constants/animations.ts with fadeUp, staggerContainer, fadeIn Framer Motion variants
- types/index.ts with all shared TypeScript types for the project
  (Product, Order, User, CartItem, Category — matching the Prisma schema in .cursorrules)
```

---

## PHASE 1 — DATABASE & AUTH

### Prompt 1.1 — Prisma schema
```
Create the complete Prisma schema at prisma/schema.prisma for the aurum-store project.
Include ALL models from the .cursorrules Prisma Schema Reference section, plus:
- Account, Session, VerificationToken models (required for NextAuth.js Prisma adapter)
- Category model (id, name, slug, description, image, products relation)
- Address model (id, userId, name, street, city, state, zip, country, isDefault)
- Review model (id, userId, productId, rating Int, comment, createdAt)
- Cart model (id, userId unique, items CartItem[])
- CartItem model (id, cartId, productId, quantity, size)
- Wishlist model (id, userId, productId, createdAt)

Use PostgreSQL provider. Add @@index on all foreign keys.
After the schema, provide the commands to run:
  npx prisma generate
  npx prisma db push
Also create lib/prisma.ts as a singleton following the .cursorrules Lessons rule #7.
```

---

### Prompt 1.2 — NextAuth configuration
```
Set up NextAuth.js v5 (Auth.js beta) for aurum-store with:
- lib/auth.ts — main auth config:
  - Prisma adapter using our lib/prisma.ts singleton
  - Google OAuth provider
  - GitHub OAuth provider  
  - Credentials provider with email + bcrypt password validation
  - JWT session strategy
  - Callbacks: session callback that adds user.id and user.role to the session token
  - Pages: signIn: '/login', error: '/login'
- lib/auth.config.ts — edge-compatible config (no Prisma, just providers + callbacks)
- middleware.ts — protect /account/* and /admin/* routes. 
  /admin/* requires role === 'ADMIN'. Redirect to /login if not authenticated.
- app/api/auth/[...nextauth]/route.ts — NextAuth route handler
- actions/auth.actions.ts — server actions:
  - registerUser(formData): creates user with hashed password, returns ActionResult
  - loginUser(formData): validates credentials, returns ActionResult
- types/index.ts — extend next-auth Session type to include id and role

Use `const session = await auth()` everywhere (not getServerSession).
Output complete files.
```

---

### Prompt 1.3 — Auth UI pages
```
Create the authentication UI pages for aurum-store:
- app/(home)/login/page.tsx — Login page
- app/(home)/register/page.tsx — Register page
- components/home/LoginForm.tsx — Client Component:
  - React Hook Form + Zod validation (email, password)
  - Calls loginUser server action via useTransition
  - Shows loading state and error toast
  - "Continue with Google" and "Continue with GitHub" buttons using signIn()
  - Link to /register
- components/home/RegisterForm.tsx — Client Component:
  - React Hook Form + Zod (name, email, password, confirmPassword)
  - Calls registerUser server action
  - Redirect to /login on success

Style both pages to match the dark AURUM aesthetic:
- Full-height centered layout on #0A0A0A background
- Cream white inputs with bottom-border-only style
- Electric accent (#C8FF00) on focus
- AURUM wordmark at the top
- Glassmorphism card panel: rgba(255,255,255,0.03) bg, 1px border rgba(255,255,255,0.08)
Output complete files.
```

---

## PHASE 2 — CORE STORE FEATURES

### Prompt 2.1 — Product data layer
```
Create the complete product data layer for aurum-store:

actions/product.actions.ts — server actions:
- getProducts(filters): accepts category, search, sort, page, limit. Returns paginated products.
- getProductBySlug(slug): returns full product with category + reviews + avg rating
- getFeaturedProducts(): returns 8 newest products
- getProductsByCategory(categoryId): returns products in category
- searchProducts(query): full-text search on name + description
- createProduct(data): admin only, validates with Zod, creates product + generates slug
- updateProduct(id, data): admin only
- deleteProduct(id): admin only
- updateStock(id, quantity): used after order placed

lib/validations/product.ts — Zod schemas:
- productSchema for create/update
- productFilterSchema for query params

Each action returns ActionResult<T>. All DB queries use select to fetch only needed fields.
Use revalidatePath('/') and revalidatePath('/products') after mutations.
```

---

### Prompt 2.2 — Cart store (Zustand)
```
Create the cart system for aurum-store:

store/cart.store.ts — Zustand store with immer middleware:
State:
- items: CartItem[] (id, productId, name, price, image, quantity, size)
- isOpen: boolean (drawer open state)
- isLoading: boolean

Actions:
- addItem(product, quantity, size): adds or increments quantity
- removeItem(productId, size): removes item
- updateQuantity(productId, size, quantity): updates qty
- clearCart(): empties cart
- openCart() / closeCart() / toggleCart()

Persistence: use zustand/middleware persist with localStorage key 'aurum-cart'.
Export: useCartStore hook.
Also export derived selectors:
- useCartItems() → items array
- useCartTotal() → sum of price * quantity, formatted with formatPrice()
- useCartCount() → total item count

lib/utils.ts — add formatPrice(amount: number): string using Intl.NumberFormat USD.

components/home/CartDrawer.tsx — Client Component:
- Slides in from right (Framer Motion x: '100%' → 0)
- Dark overlay behind it (onClick closes drawer)
- backdrop-blur-xl, rgba(10,10,10,0.95) bg
- Lists cart items with image (next/image), name, size, price, qty controls (+/-)
- Remove button per item
- Subtotal row
- "Checkout →" button linking to /checkout (electric accent fill)
- "Continue Shopping" button (outlined cream)
- Empty state with a centered message and Shop Now link
Output complete files.
```

---

### Prompt 2.3 — Homepage sections
```
Wire up the homepage for aurum-store. The visual design already exists from Kimi.
Now connect it to real data:

app/(home)/page.tsx — Server Component:
- Fetches getFeaturedProducts() and getCategories()
- Passes data as props to client section components
- Uses React Suspense with skeleton fallbacks for each section

components/home/FeaturedProducts.tsx — Client Component:
- Receives products[] as props
- Renders the 3-column product grid from the Kimi design
- Each card has: image (next/image), name, price, sale price if comparePrice exists
- "Quick Add" hover bar that calls addItem from useCartStore
- Wishlist heart icon that calls toggleWishlist server action
- Links to /products/[slug]

components/home/CategoryGrid.tsx — Client Component:
- Receives categories[] as props
- Renders the 4-column masonry category grid from the Kimi design
- Framer Motion stagger reveal on scroll (useInView, once: true)

components/home/HeroSection.tsx — Client Component (already exists from Kimi):
- Add the cart item count badge wired to useCartCount() from Zustand

app/(home)/layout.tsx — Server Component:
- Renders Header + Footer + CartDrawer + LenisProvider
- Header receives session from auth() to show account/login state

Create components/home/Header.tsx — Client Component:
- Fixed nav with backdrop-blur on scroll (useScroll from Framer Motion)
- Cart icon wired to toggleCart() from useCartStore
- Cart count badge from useCartCount()
- User avatar/login link from session prop
Output complete files.
```

---

### Prompt 2.4 — Products catalog page
```
Create the products catalog for aurum-store:

app/(home)/products/page.tsx — Server Component:
- Reads searchParams (category, search, sort, page)
- Calls getProducts(filters) server action
- Renders: ProductFilters sidebar + ProductGrid + Pagination

app/(home)/products/loading.tsx — skeleton grid

components/home/ProductFilters.tsx — Client Component:
- Left sidebar: category checkboxes, price range slider (shadcn Slider),
  sort dropdown (shadcn Select)
- Updates URL searchParams on change using useRouter + useSearchParams
- Collapses to a bottom sheet on mobile (shadcn Drawer)

components/home/ProductGrid.tsx — Client Component:
- Receives products[] and pagination info as props
- Renders product cards in the 3-column grid (matching Kimi design)
- Empty state if no products

components/home/Pagination.tsx — Client Component:
- Previous / Next / page number buttons
- Updates URL ?page= param
- Uses shadcn Pagination component

Also create app/(home)/products/[slug]/page.tsx — Server Component:
- Calls getProductBySlug(slug), notFound() if null
- Renders: image gallery, product info, size selector, add to cart,
  reviews section, related products
- generateMetadata export for SEO

components/home/ProductDetail.tsx — Client Component:
- Image gallery with thumbnail strip (active thumbnail highlighted)
- Size selector pills (XS S M L XL) — selected state in electric accent
- Quantity selector (+/-)
- "Add to Cart" button → addItem() + openCart()
- "Add to Wishlist" heart button
Output complete files.
```

---

### Prompt 2.5 — Checkout & Stripe
```
Create the checkout flow for aurum-store:

app/(home)/checkout/page.tsx — Server Component:
- Requires auth — redirect to /login?callbackUrl=/checkout if no session
- Renders CheckoutForm

components/home/CheckoutForm.tsx — Client Component:
- Step 1: Shipping info (React Hook Form + Zod):
  firstName, lastName, email, phone, address, city, state, zip, country
  Pre-fill from user's saved addresses if available
- Step 2: Order summary (read-only, from Zustand cart)
- "Pay with Stripe" button → calls createCheckoutSession server action

actions/checkout.actions.ts:
- createCheckoutSession(shippingData):
  - Auth check
  - Gets cart items from DB (verify prices server-side — never trust client prices)
  - Creates Stripe checkout session with line_items from cart
  - Stores shippingData in Stripe session metadata
  - Returns { url } for redirect to Stripe hosted checkout
  - Use stripe.checkout.sessions.create() with:
    mode: 'payment'
    success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
    cancel_url: `${process.env.NEXTAUTH_URL}/checkout`

app/api/webhooks/stripe/route.ts:
- Handles 'checkout.session.completed':
  - Verifies signature with stripe.webhooks.constructEvent()
  - Creates Order in DB with items, total, shippingAddress from metadata
  - Updates product stock (decrement)
  - Clears user's cart in DB
  - Sends order confirmation email via Resend
- Returns 200 immediately, do all processing async

app/(home)/checkout/success/page.tsx:
- Shows order confirmation with order number
- Calls clearCart() action (clear DB cart — Zustand is cleared by webhook)
- Links to /account/orders

lib/stripe.ts — Stripe singleton (same pattern as Prisma).
Output complete files.
```

---

### Prompt 2.6 — User account dashboard
```
Create the user account section for aurum-store:

app/(home)/account/layout.tsx — Server Component:
- Auth check — redirect to /login if no session
- Left sidebar navigation: Orders / Profile / Addresses / Wishlist
- Renders children

app/(home)/account/orders/page.tsx — Server Component:
- Fetches user's orders with order items + product images
- Table: Order # / Date / Items / Total / Status badge (colored by status)
- Click row → /account/orders/[id]

app/(home)/account/orders/[id]/page.tsx — Server Component:
- Full order detail: items, quantities, prices, shipping address, status timeline

app/(home)/account/profile/page.tsx:
- Form: name, email, profile image (UploadThing)
- Change password form (current + new + confirm)
- Calls updateProfile server action

app/(home)/account/addresses/page.tsx:
- List saved addresses with edit/delete
- Add new address form
- Set default address

app/(home)/account/wishlist/page.tsx:
- Grid of wishlisted products (image, name, price, "Move to Cart" button)

actions/account.actions.ts:
- updateProfile(data)
- changePassword(currentPassword, newPassword)
- addAddress(data) / updateAddress(id, data) / deleteAddress(id)
- toggleWishlist(productId): add if not in wishlist, remove if exists
- getUserOrders(userId)

Style all pages: dark #0A0A0A background, cream text, shadcn Table for order history.
Output complete files.
```

---

## PHASE 3 — ADMIN DASHBOARD

### Prompt 3.1 — Admin layout and auth guard
```
Create the admin dashboard foundation for aurum-store:

app/(admin)/layout.tsx — Server Component:
- Auth check: if no session OR session.user.role !== 'ADMIN', redirect to /
- Renders: AdminSidebar + main content area

components/admin/AdminSidebar.tsx — Client Component:
- Fixed left sidebar, dark #111111 bg, cream text
- AURUM logo + "Admin" badge at top
- Nav links with Lucide icons:
  Dashboard (LayoutDashboard) / Products (Package) / Orders (ShoppingBag) /
  Customers (Users) / Analytics (BarChart3) / Settings (Settings)
- Active link highlighted with electric accent left border
- Collapse/expand toggle on mobile
- Logout button at bottom

app/(admin)/admin/page.tsx — Server Component:
- Fetches dashboard metrics using Promise.all:
  - getTotalRevenue() — sum of completed order totals
  - getTotalOrders() — count
  - getTotalCustomers() — user count with role CUSTOMER
  - getAverageOrderValue() — revenue / orders
  - getRecentOrders(10) — last 10 orders with user name
  - getRevenueByDay(30) — last 30 days revenue grouped by date
  - getLowStockProducts() — products with stock < 10

actions/admin.actions.ts — all the above query functions.

components/admin/MetricCard.tsx — displays a single KPI:
- Icon (Lucide), label, value, percentage change vs last period (green up / red down)
- shadcn Card, cream/dark styling

Output complete files.
```

---

### Prompt 3.2 — Admin analytics charts
```
Create the analytics charts for aurum-store admin dashboard:

components/admin/RevenueChart.tsx — Client Component:
- Recharts LineChart showing daily revenue for last 30 days
- Props: data: { date: string, revenue: number }[]
- Custom tooltip with formatted price and date
- Period filter buttons: 7D / 30D / 90D / 1Y (updates data via server action call)
- Dark theme: #0A0A0A bg, cream lines, electric accent for the line stroke
- Use dynamic import in the parent (ssr: false) since Recharts is client-only

components/admin/OrdersChart.tsx — Client Component:
- Recharts BarChart for order volume by day
- Same period filter controls
- Order status breakdown as stacked bars (colors per status)

components/admin/TopProducts.tsx — Client Component:
- Table of top 5 best-selling products (by quantity sold)
- Columns: image, name, units sold, revenue
- shadcn Table

components/admin/RecentOrdersTable.tsx — Client Component:
- Receives recentOrders[] as props
- Columns: Order #, Customer, Items, Total, Status, Date, Actions
- Status badge with color per status (PENDING=amber, PROCESSING=blue,
  SHIPPED=purple, DELIVERED=green, CANCELLED=red)
- Actions dropdown: View / Update Status / Refund
- Update Status → calls updateOrderStatus server action, revalidates

actions/admin.actions.ts — add:
- getRevenueByPeriod(period: '7d'|'30d'|'90d'|'1y')
- updateOrderStatus(orderId, status)
- getTopProducts(limit)
Output complete files.
```

---

### Prompt 3.3 — Product management (admin)
```
Create the admin product management section for aurum-store:

app/(admin)/admin/products/page.tsx — Server Component:
- Fetches all products with category + stock count
- Passes to ProductsTable

components/admin/ProductsTable.tsx — Client Component:
- @tanstack/react-table for the data table
- Columns: image (32px thumbnail), name, category, price, stock (red if <10), status, actions
- Bulk select with checkboxes
- Bulk delete action
- Search input filters rows client-side
- "Add Product" button → opens ProductFormModal

components/admin/ProductFormModal.tsx — Client Component:
- shadcn Dialog
- React Hook Form + Zod (productSchema from lib/validations/product.ts)
- Fields: name (auto-generates slug), description (Textarea), price, comparePrice,
  category (Select — fetches categories), stock, SKU
- Image upload section: UploadThing dropzone, shows uploaded image previews,
  stores URL array in form state
- Submit → createProduct or updateProduct server action
- Close on success, toast notification

app/(admin)/admin/products/[id]/page.tsx — edit page:
- Fetches product by id
- Renders ProductFormModal in edit mode with pre-filled data

lib/uploadthing.ts — UploadThing configuration:
- imageUploader route for product images (max 4MB, max 8 files)
app/api/uploadthing/route.ts — UploadThing route handler
Output complete files.
```

---

### Prompt 3.4 — Order management (admin)
```
Create the admin order management section for aurum-store:

app/(admin)/admin/orders/page.tsx — Server Component:
- Fetches all orders with user name, item count, total, status
- Passes to OrdersTable

components/admin/OrdersTable.tsx — Client Component:
- @tanstack/react-table
- Columns: Order #, Customer, Date, Items, Total, Status, Payment, Actions
- Filter by status (shadcn Select dropdown above table)
- Date range filter (from/to inputs)
- Actions: View Details / Update Status / Issue Refund

app/(admin)/admin/orders/[id]/page.tsx — Server Component:
- Full order detail view:
  - Order header: number, date, status badge, payment status
  - Customer info card: name, email, link to customer profile
  - Items table: image, name, size, qty, unit price, line total
  - Shipping address card
  - Order totals: subtotal, shipping, tax, total
  - Status update dropdown + "Save" button
  - Refund button (calls issueRefund server action)
  - Order timeline: status history with timestamps

actions/admin.actions.ts — add:
- getAllOrders(filters): accepts status, dateFrom, dateTo, page
- getOrderById(id): full order details
- updateOrderStatus(id, status): updates + logs to order history
- issueRefund(orderId): calls stripe.refunds.create(), updates order status
Output complete files.
```

---

### Prompt 3.5 — Customer management (admin)
```
Create the admin customer management section for aurum-store:

app/(admin)/admin/customers/page.tsx — Server Component:
- Fetches all customers (role: CUSTOMER) with order count + total spent
- Passes to CustomersTable

components/admin/CustomersTable.tsx — Client Component:
- Columns: avatar+name, email, joined date, orders, total spent, status, actions
- Search by name/email (client-side filter)
- Actions: View Profile / Send Email / Suspend Account

app/(admin)/admin/customers/[id]/page.tsx:
- Customer profile: avatar, name, email, join date
- Stats: total orders, total spent, avg order value
- Order history table (last 10 orders)
- Saved addresses
- "Send Email" button → opens compose modal

components/admin/EmailComposeModal.tsx — Client Component:
- shadcn Dialog
- Fields: subject, body (Textarea)
- Submit → calls sendCustomerEmail server action using Resend

actions/admin.actions.ts — add:
- getAllCustomers(search?)
- getCustomerById(id): profile + orders + stats
- sendCustomerEmail(customerId, subject, body): sends via Resend
- suspendCustomer(id) / activateCustomer(id)

lib/resend.ts — Resend client singleton
Output complete files.
```

---

## PHASE 4 — ADVANCED FEATURES

### Prompt 4.1 — Email system (Resend)
```
Create the complete email system for aurum-store using Resend:

Create React Email templates in emails/ folder:
- emails/OrderConfirmation.tsx — React Email component:
  - AURUM header with logo text
  - "Thank you for your order" heading
  - Order items table with images, names, quantities, prices
  - Shipping address
  - Order total
  - "Track Your Order" CTA button linking to /account/orders/[id]
  - Dark theme matching brand

- emails/ShippingUpdate.tsx:
  - Order has shipped notification
  - Tracking number + carrier
  - Estimated delivery date
  - "Track Package" CTA

- emails/WelcomeEmail.tsx:
  - Welcome to AURUM message
  - Brief brand intro
  - "Start Shopping" CTA

lib/email.ts — email sending functions:
- sendOrderConfirmation(order, user)
- sendShippingUpdate(order, trackingNumber)
- sendWelcomeEmail(user)
- sendPasswordReset(user, resetToken)

Each function uses Resend to send from 'orders@aurumstore.com' (or configured domain).
Install: npm install @react-email/components react-email resend
Output complete files.
```

---

### Prompt 4.2 — Search and filtering
```
Enhance the product search for aurum-store:

components/home/SearchModal.tsx — Client Component:
- Full-screen search overlay (Framer Motion opacity + scale in)
- Opens on clicking search icon in nav (or Cmd+K)
- Large search input at top
- As user types (debounced 300ms), calls searchProducts server action
- Results appear below in a grid:
  - Product image, name, price, category
  - Click → navigate to /products/[slug], close modal
- "No results" empty state
- Recent searches stored in localStorage (show when input empty)
- Keyboard navigation: arrow keys cycle results, Enter selects, Esc closes

hooks/useSearch.ts:
- Manages search state, debouncing, results fetching
- Uses useTransition for non-blocking search

Update Header.tsx to:
- Wire search icon to open SearchModal
- Add keyboard shortcut listener for Cmd+K

app/(home)/products/page.tsx:
- Update to handle server-side search + filter combination
- Generate proper og:title and description from searchParams for SEO

Output complete files.
```

---

### Prompt 4.3 — Reviews system
```
Create the product reviews system for aurum-store:

components/home/ProductReviews.tsx — Client Component:
- Props: reviews[], productId, averageRating, totalReviews
- Rating summary: large average score + 5 star bars (like Amazon)
- "Write a Review" button (only shown if user is authenticated + has purchased product)
- Review cards: avatar, name, rating stars, date, comment
- Pagination (5 per page)

components/home/ReviewForm.tsx — Client Component:
- Star rating selector (click to set 1-5 stars, hover preview)
- Textarea for comment (min 20 chars)
- Submit → createReview server action
- Shows success message, new review appears optimistically

actions/review.actions.ts:
- createReview(productId, rating, comment):
  - Auth check
  - Verify user has a completed order containing the product
  - Check no existing review from this user for this product
  - Create review, recalculate product avgRating
  - Revalidate product page
- getProductReviews(productId, page)
- deleteReview(id): admin or review owner only

Update app/(home)/products/[slug]/page.tsx:
- Pass reviews + rating data to ProductReviews component
- Include review schema markup (JSON-LD) for SEO

Output complete files.
```

---

### Prompt 4.4 — Performance & SEO
```
Optimize the aurum-store application for performance and SEO:

1. Metadata — update every page:
   - app/layout.tsx: default metadata with site name, description, og:image
   - app/(home)/products/[slug]/page.tsx: generateMetadata using product name/description
   - app/(home)/products/page.tsx: dynamic metadata from category/search params
   - All admin pages: noindex, nofollow robots meta

2. Loading skeletons — create for every major page:
   - components/home/skeletons/ProductGridSkeleton.tsx
   - components/home/skeletons/ProductDetailSkeleton.tsx
   - components/home/skeletons/OrderHistorySkeleton.tsx
   - components/admin/skeletons/DashboardSkeleton.tsx
   Each uses shadcn Skeleton component matching the actual layout.

3. Error boundaries — create error.tsx for:
   - app/(home)/products/error.tsx
   - app/(home)/products/[slug]/error.tsx
   - app/(admin)/admin/error.tsx
   Each shows a friendly message with a retry button.

4. Caching strategy:
   - Add unstable_cache wrapper to: getProducts, getFeaturedProducts, getCategories
   - Tag-based revalidation: products tagged 'products', orders tagged 'orders'
   - Add revalidateTag('products') in all product mutation actions

5. robots.ts and sitemap.ts:
   - app/robots.ts: allow all except /admin, /account, /api
   - app/sitemap.ts: generates sitemap from all products + categories

Output complete files.
```

---

## PHASE 5 — TESTING & FINAL POLISH

### Prompt 5.1 — Seed data
```
Create a database seed script for aurum-store with realistic data:

prisma/seed.ts:
- Create 1 admin user: admin@aurumstore.com / Admin123!
- Create 5 customer users with hashed passwords
- Create 6 categories: Outerwear, Tops, Bottoms, Footwear, Accessories, Essentials
- Create 24 products spread across categories with:
  - Realistic names and descriptions for luxury fashion
  - Prices between $80 and $850
  - comparePrice on 6 products (sale items)
  - Stock between 0 and 50
  - Use the Unsplash URLs from the IMAGES array in the master prompt
- Create 10 orders in various statuses for the customer users
- Create 15 reviews across products

Add to package.json:
  "prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }

Run with: npx prisma db seed
Output the complete seed.ts file.
```

---

### Prompt 5.2 — Final integration check
```
Perform a final integration pass on aurum-store. Check and fix:

1. Verify all imports use @/ path alias — fix any relative imports.

2. Verify every page that needs auth has the auth check at the top.

3. Add missing loading.tsx files for:
   app/(home)/loading.tsx
   app/(home)/products/loading.tsx
   app/(home)/checkout/loading.tsx
   app/(admin)/admin/loading.tsx
   Each should be a skeleton matching the page layout.

4. Verify next.config.js has ALL external image domains used in the app.

5. Create a health check API route at app/api/health/route.ts that returns:
   { status: 'ok', db: 'connected', timestamp: ISO string }
   Tests Prisma connection on each request.

6. Add a global error boundary at app/global-error.tsx.

7. Create README.md with:
   - Project overview
   - Tech stack list
   - Local development setup steps
   - Environment variables documentation
   - Database setup commands
   - Deployment guide (Vercel)

8. Create a Vercel deployment checklist comment at the top of README.md.

Output all files completely.
```

---

## QUICK REFERENCE

| Phase | What it builds | Est. Cursor sessions |
|-------|---------------|---------------------|
| 0 — Init | Project scaffold + deps | 2 prompts |
| 1 — Auth | DB schema + auth system + login UI | 3 prompts |
| 2 — Store | Products, cart, checkout, account | 6 prompts |
| 3 — Admin | Dashboard, analytics, management | 5 prompts |
| 4 — Advanced | Email, search, reviews, SEO | 4 prompts |
| 5 — Polish | Seed data + final checks | 2 prompts |

**Total: 22 prompts. One at a time. In order. Done.**

---

> **TIPS FOR USING CURSOR**
> - If Cursor stops mid-file, type: "Continue from where you stopped, complete the file."
> - If it hallucinates an import: "The import X does not exist. Use Y instead."
> - After each phase, run `npx tsc --noEmit` to catch type errors.
> - Keep the terminal open alongside Cursor chat — run the app after each phase.
> - Commit to Git after every phase completes successfully.
