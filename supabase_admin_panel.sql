-- ============================================================
-- ADMIN PANEL: rol superadmin + stock de productos + ventas
-- Ejecutar TODO este script en Supabase → SQL Editor
-- (Proyecto: taiko_nina)
-- ============================================================

-- ------------------------------------------------------------
-- 1. Asignar rol SUPERADMIN a la cuenta de admin
--    (la cuenta ya existe porque iniciaste sesión con ella)
-- ------------------------------------------------------------
INSERT INTO user_roles (user_id, role)
SELECT id, 'superadmin'
FROM auth.users
WHERE email = 'superadminprograweb@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'superadmin';

-- ------------------------------------------------------------
-- 2. Asegurar columnas de stock por talle en products
--    (IF NOT EXISTS: no rompe si ya existen)
-- ------------------------------------------------------------
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_xs int NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_s  int NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_m  int NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_l  int NOT NULL DEFAULT 0;

-- ------------------------------------------------------------
-- 3. RLS de products: lectura pública (ya existe) + escritura
--    SOLO para superadmin (crear / editar / borrar productos)
-- ------------------------------------------------------------
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Superadmin insert products" ON products;
DROP POLICY IF EXISTS "Superadmin update products" ON products;
DROP POLICY IF EXISTS "Superadmin delete products" ON products;

CREATE POLICY "Superadmin insert products" ON products
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin'));

CREATE POLICY "Superadmin update products" ON products
  FOR UPDATE TO authenticated
  USING     (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin'))
  WITH CHECK(EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin'));

CREATE POLICY "Superadmin delete products" ON products
  FOR DELETE TO authenticated
  USING     (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin'));

-- ------------------------------------------------------------
-- 4. Tablas de VENTAS (orders + order_items)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  external_reference text UNIQUE,               -- id que mandamos a Mercado Pago
  mp_payment_id      text,                      -- id del pago que devuelve MP
  mp_preference_id   text,
  status             text NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  total              numeric(12,2) NOT NULL DEFAULT 0,
  currency           text DEFAULT 'ARS',
  customer_email     text,
  created_at         timestamptz DEFAULT now(),
  paid_at            timestamptz
);

CREATE TABLE IF NOT EXISTS order_items (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id    uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  uuid REFERENCES products(id) ON DELETE SET NULL,
  name        text NOT NULL,
  size        text,
  quantity    int NOT NULL DEFAULT 1,
  unit_price  numeric(12,2) NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at   ON orders(created_at);

-- ------------------------------------------------------------
-- 5. RLS de ventas
--    - SELECT: solo superadmin (para el resumen de ventas)
--    - INSERT/UPDATE: permitido para que el checkout y el webhook
--      puedan registrar/confirmar la orden.
--
--    NOTA de seguridad: lo ideal en producción es que el servidor
--    escriba con la SERVICE ROLE KEY (que saltea RLS). Si definís
--    SUPABASE_SERVICE_ROLE_KEY en el .env, el webhook la usa y NO
--    hace falta abrir el insert/update público. Estas policies son
--    el fallback para que funcione solo con la anon key.
-- ------------------------------------------------------------
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Superadmin read orders"        ON orders;
DROP POLICY IF EXISTS "Superadmin read order_items"   ON order_items;
DROP POLICY IF EXISTS "Server insert orders"          ON orders;
DROP POLICY IF EXISTS "Server update orders"          ON orders;
DROP POLICY IF EXISTS "Server insert order_items"     ON order_items;

CREATE POLICY "Superadmin read orders" ON orders
  FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin'));

CREATE POLICY "Superadmin read order_items" ON order_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin'));

CREATE POLICY "Server insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Server update orders" ON orders
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Server insert order_items" ON order_items
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- 6. (OPCIONAL) Datos de ejemplo para ver el resumen con datos
--    ANTES de tener una compra real. Descomentá y ejecutá.
-- ============================================================
-- WITH o AS (
--   INSERT INTO orders (external_reference, status, total, currency, customer_email, paid_at)
--   VALUES (gen_random_uuid()::text, 'approved', 730.00, 'ARS', 'cliente.demo@gmail.com', now())
--   RETURNING id
-- )
-- INSERT INTO order_items (order_id, name, size, quantity, unit_price)
-- SELECT o.id, 'Architectural Wool Blazer', 'M', 1, 450.00 FROM o
-- UNION ALL SELECT o.id, 'High-Rise Linen Trouser', 'S', 1, 280.00 FROM o;

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
-- SELECT u.email, r.role FROM user_roles r JOIN auth.users u ON u.id = r.user_id;
-- SELECT status, count(*), sum(total) FROM orders GROUP BY status;
