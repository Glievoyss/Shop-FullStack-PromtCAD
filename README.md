# ShopFlow 🛒

Повноцінний інтернет-магазин на **Next.js 14** + **Supabase**.

## Стек

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth + Database + Storage)
- **State**: Zustand (корзина)
- **Auth**: Google OAuth через Supabase

## Швидкий старт

### 1. Встановити залежності

```bash
npm install
```

### 2. Заповнити `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Ключі беруться з: **Supabase Dashboard → Settings → API**

### 3. Запустити міграції БД

У **Supabase Dashboard → SQL Editor** виконай по черзі:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/seed.sql`

### 4. Налаштувати Google OAuth

1. Supabase Dashboard → Auth → Providers → Google → увімкнути
2. Створити OAuth app у [Google Cloud Console](https://console.cloud.google.com/)
3. Додати Callback URL: `https://[project].supabase.co/auth/v1/callback`
4. Вставити Google Client ID та Secret у Supabase

### 5. Запустити локально

```bash
npm run dev
```

Відкрий [http://localhost:3000](http://localhost:3000)

---

## Деплой на Vercel

1. Запушити на GitHub
2. Підключити репо на [vercel.com](https://vercel.com)
3. В Vercel → Settings → Environment Variables додати:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. В Supabase → Auth → URL Configuration → додати Vercel домен у **Site URL**
5. Deploy! 🚀

---

## Структура проекту

```
app/
  page.tsx              # Головна сторінка
  catalog/page.tsx      # Каталог з фільтрами
  product/[id]/page.tsx # Сторінка товару
  cart/page.tsx         # Кошик
  profile/page.tsx      # Особистий кабінет
  api/
    products/route.ts   # GET products
    cart/route.ts       # CRUD кошик
    orders/route.ts     # POST замовлення
    favorites/route.ts  # Toggle обране
    reviews/route.ts    # POST відгук
    auth/callback/route.ts

components/
  layout/Header.tsx
  layout/Footer.tsx
  product/ProductCard.tsx
  product/ProductGallery.tsx
  product/CatalogFilters.tsx
  product/AddToCartButton.tsx
  product/ReviewsSection.tsx
  profile/ProfileSidebar.tsx
  profile/OrdersList.tsx
  ui/StarRating.tsx

store/cartStore.ts       # Zustand
lib/supabase/            # Клієнти Supabase
types/database.ts        # TypeScript типи
supabase/
  migrations/001_initial_schema.sql
  seed.sql
```
