-- ================================================
-- ShopFlow — Seed Data
-- Run AFTER 001_initial_schema.sql
-- ================================================

-- Insert 24 products across categories
WITH cats AS (
  SELECT id, slug FROM categories
)
INSERT INTO products (name, description, price, old_price, image_urls, category_id, brand, sku, stock, views)
SELECT * FROM (VALUES
  -- Electronics (8 items)
  ('Ноутбук Apple MacBook Air M2', 'Ультратонкий ноутбук з чіпом M2, 8 ГБ RAM, 256 ГБ SSD', 42999, 47999, ARRAY['https://picsum.photos/seed/product1/400/400'], (SELECT id FROM cats WHERE slug='electronics'), 'Apple', 'SKU-001', 15, 1200),
  ('Смартфон Samsung Galaxy S24', 'Флагманський смартфон з AI функціями, 8 ГБ RAM, 128 ГБ', 31999, NULL, ARRAY['https://picsum.photos/seed/product2/400/400'], (SELECT id FROM cats WHERE slug='electronics'), 'Samsung', 'SKU-002', 23, 980),
  ('Навушники Sony WH-1000XM5', 'Бездротові навушники з шумопоглинанням, 30 годин роботи', 11499, 13999, ARRAY['https://picsum.photos/seed/product3/400/400'], (SELECT id FROM cats WHERE slug='electronics'), 'Sony', 'SKU-003', 34, 754),
  ('Планшет iPad 10-го покоління', '10.9" Retina дисплей, A14 Bionic, Wi-Fi, 64 ГБ', 17999, 19999, ARRAY['https://picsum.photos/seed/product4/400/400'], (SELECT id FROM cats WHERE slug='electronics'), 'Apple', 'SKU-004', 18, 632),
  ('Клавіатура Logitech MX Keys', 'Бездротова клавіатура з підсвіткою, тихий набір', 3499, 3999, ARRAY['https://picsum.photos/seed/product5/400/400'], (SELECT id FROM cats WHERE slug='electronics'), 'Logitech', 'SKU-005', 45, 510),
  ('Монітор LG 27" 4K IPS', '27-дюймовий 4K монітор, 60 Гц, USB-C, HDR400', 14999, NULL, ARRAY['https://picsum.photos/seed/product6/400/400'], (SELECT id FROM cats WHERE slug='electronics'), 'LG', 'SKU-006', 12, 421),
  ('Зарядний пристрій Anker 65W', 'GaN технологія, 3 порти, USB-C + USB-A', 1299, 1599, ARRAY['https://picsum.photos/seed/product7/400/400'], (SELECT id FROM cats WHERE slug='electronics'), 'Anker', 'SKU-007', 67, 389),
  ('Миша Logitech MX Master 3S', 'Ергономічна миша, MagSpeed прокрутка, безшумні кліки', 4199, NULL, ARRAY['https://picsum.photos/seed/product8/400/400'], (SELECT id FROM cats WHERE slug='electronics'), 'Logitech', 'SKU-008', 29, 340),

  -- Clothing (4 items)
  ('Худі Champion Reverse Weave', 'Класичне худі з важкого флісу, унісекс', 2199, 2799, ARRAY['https://picsum.photos/seed/product9/400/400'], (SELECT id FROM cats WHERE slug='clothing'), 'Champion', 'SKU-009', 52, 290),
  ('Футболка Uniqlo AIRism', 'Суперлегка, охолоджуюча футболка з технологією AIRism', 699, NULL, ARRAY['https://picsum.photos/seed/product10/400/400'], (SELECT id FROM cats WHERE slug='clothing'), 'Uniqlo', 'SKU-010', 89, 245),
  ('Джинси Levi''s 501 Original', 'Класичні прямі джинси, 100% бавовна', 3499, 3999, ARRAY['https://picsum.photos/seed/product11/400/400'], (SELECT id FROM cats WHERE slug='clothing'), 'Levi''s', 'SKU-011', 37, 213),
  ('Пальто Massimo Dutti вовняне', 'Елегантне вовняне пальто, середньої довжини', 8999, 11999, ARRAY['https://picsum.photos/seed/product12/400/400'], (SELECT id FROM cats WHERE slug='clothing'), 'Massimo Dutti', 'SKU-012', 14, 198),

  -- Shoes (3 items)
  ('Кросівки Nike Air Max 270', 'Максимальний комфорт з подушкою Air Max', 4299, 4999, ARRAY['https://picsum.photos/seed/product13/400/400'], (SELECT id FROM cats WHERE slug='shoes'), 'Nike', 'SKU-013', 41, 567),
  ('Кеди Adidas Stan Smith', 'Культові шкіряні кеди, класичний білий дизайн', 2999, NULL, ARRAY['https://picsum.photos/seed/product14/400/400'], (SELECT id FROM cats WHERE slug='shoes'), 'Adidas', 'SKU-014', 28, 445),
  ('Ботинки Dr. Martens 1460', 'Класичні 8-дірочні ботинки зі шкіри', 6499, 7499, ARRAY['https://picsum.photos/seed/product15/400/400'], (SELECT id FROM cats WHERE slug='shoes'), 'Dr. Martens', 'SKU-015', 19, 321),

  -- Home (3 items)
  ('Кавоварка De''Longhi Dedica', 'Автоматична кавоварка еспресо, 15 бар', 7999, 9499, ARRAY['https://picsum.photos/seed/product16/400/400'], (SELECT id FROM cats WHERE slug='home'), 'De''Longhi', 'SKU-016', 22, 432),
  ('Блендер Vitamix E310', 'Потужний стаціонарний блендер 1400 Вт', 12999, NULL, ARRAY['https://picsum.photos/seed/product17/400/400'], (SELECT id FROM cats WHERE slug='home'), 'Vitamix', 'SKU-017', 11, 298),
  ('Набір посуду IKEA VARDAGEN', 'Набір каструль 5 предметів з нержавіючої сталі', 3299, 3999, ARRAY['https://picsum.photos/seed/product18/400/400'], (SELECT id FROM cats WHERE slug='home'), 'IKEA', 'SKU-018', 44, 267),

  -- Sport (2 items)
  ('Килимок для йоги Manduka PRO', 'Товстий нековзний килимок 6 мм, 71"', 4999, 5999, ARRAY['https://picsum.photos/seed/product19/400/400'], (SELECT id FROM cats WHERE slug='sport'), 'Manduka', 'SKU-019', 33, 378),
  ('Гантелі ProFitness 2x10 кг', 'Розбірні гантелі з покриттям, набір 2 шт.', 2799, NULL, ARRAY['https://picsum.photos/seed/product20/400/400'], (SELECT id FROM cats WHERE slug='sport'), 'ProFitness', 'SKU-020', 27, 312),

  -- Beauty (2 items)
  ('Сироватка The Ordinary Niacinamide', 'Сироватка з ніацинамідом 10% + цинк 1%, 30 мл', 399, NULL, ARRAY['https://picsum.photos/seed/product21/400/400'], (SELECT id FROM cats WHERE slug='beauty'), 'The Ordinary', 'SKU-021', 78, 534),
  ('Крем Cetaphil Moisturizing', 'М''який зволожуючий крем для чутливої шкіри, 250 мл', 599, 699, ARRAY['https://picsum.photos/seed/product22/400/400'], (SELECT id FROM cats WHERE slug='beauty'), 'Cetaphil', 'SKU-022', 56, 423),

  -- Books (1 item)
  ('Атомні звички — Джеймс Клір', 'Bestseller про формування корисних звичок. Тверда обкладинка.', 349, 399, ARRAY['https://picsum.photos/seed/product23/400/400'], (SELECT id FROM cats WHERE slug='books'), 'Vivat', 'SKU-023', 93, 687),

  -- Toys (1 item)
  ('Конструктор LEGO Classic 10696', 'Класичний набір LEGO 484 деталі, від 4 років', 1299, 1499, ARRAY['https://picsum.photos/seed/product24/400/400'], (SELECT id FROM cats WHERE slug='toys'), 'LEGO', 'SKU-024', 38, 456)
) AS v(name, description, price, old_price, image_urls, category_id, brand, sku, stock, views);

-- 3 test reviews (these require actual user IDs, so they're commented out by default)
-- Uncomment and fill in real user UUIDs after registering:
-- INSERT INTO reviews (product_id, user_id, rating, text)
-- SELECT
--   (SELECT id FROM products WHERE sku = 'SKU-001'),
--   'YOUR_USER_UUID_HERE',
--   5,
--   'Чудовий ноутбук! Батарея тримає весь день, дуже тихий і швидкий.';
