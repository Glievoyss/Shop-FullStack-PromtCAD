-- ================================================
-- ShopFlow — Initial Schema Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- ================================================

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO categories (name, slug, icon) VALUES
  ('Електроніка', 'electronics', '💻'),
  ('Одяг', 'clothing', '👕'),
  ('Взуття', 'shoes', '👟'),
  ('Дім і сад', 'home', '🏠'),
  ('Спорт', 'sport', '⚽'),
  ('Краса', 'beauty', '💄'),
  ('Книги', 'books', '📚'),
  ('Іграшки', 'toys', '🧸')
ON CONFLICT (slug) DO NOTHING;

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2),
  image_urls TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id),
  brand TEXT,
  sku TEXT UNIQUE,
  stock INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Products viewable by everyone" ON products;
CREATE POLICY "Products viewable by everyone" ON products FOR SELECT USING (is_active = true);

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Cart
CREATE TABLE IF NOT EXISTS cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own cart" ON cart;
CREATE POLICY "Users manage own cart" ON cart
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Orders
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('new', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  status order_status DEFAULT 'new',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users see own orders" ON orders;
DROP POLICY IF EXISTS "Users create own orders" ON orders;
CREATE POLICY "Users see own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own favorites" ON favorites;
CREATE POLICY "Users manage own favorites" ON favorites
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    rating = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id),
    reviews_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_review_change ON reviews;
CREATE TRIGGER after_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Reviews viewable by all" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can review" ON reviews;
CREATE POLICY "Reviews viewable by all" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can review" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
