-- ============================================================
-- MIGRACIÓN: Outfits a Supabase
-- Ejecutar TODO este script en Supabase SQL Editor
-- ============================================================

-- 1. Crear tabla de outfits
CREATE TABLE IF NOT EXISTS outfits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  video_url text NOT NULL,
  active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 2. Crear tabla de relación outfit ↔ products (muchos a muchos)
CREATE TABLE IF NOT EXISTS outfit_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_id uuid NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(outfit_id, product_id)
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_outfit_products_outfit ON outfit_products(outfit_id);
CREATE INDEX IF NOT EXISTS idx_outfit_products_product ON outfit_products(product_id);

-- 4. Habilitar Row Level Security
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_products ENABLE ROW LEVEL SECURITY;

-- 5. Policies: lectura pública para que el frontend funcione
CREATE POLICY "Public read outfits" ON outfits
  FOR SELECT USING (true);

CREATE POLICY "Public read outfit_products" ON outfit_products
  FOR SELECT USING (true);

-- 6. Policies: escritura solo para usuarios autenticados (para el admin)
CREATE POLICY "Auth insert outfits" ON outfits
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth update outfits" ON outfits
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete outfits" ON outfits
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert outfit_products" ON outfit_products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth update outfit_products" ON outfit_products
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete outfit_products" ON outfit_products
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 7. SEED DATA - Insertar los 3 outfits actuales
-- Los videos se mantienen en /public por ahora, pueden migrarse
-- a Supabase Storage después.
-- ============================================================

-- Outfit 1: Blusa Greta
INSERT INTO outfits (title, video_url, active, sort_order)
VALUES ('Blusa Greta', '/VIDEOS_OUTFITS/blusa_greta/blusa_greta.mp4', true, 1);

-- Outfit 2: Saco Theo
INSERT INTO outfits (title, video_url, active, sort_order)
VALUES ('Saco Theo', '/VIDEOS_OUTFITS/saco_theo/saco_theo.mp4', true, 2);

-- Outfit 3: Sweater Clara
INSERT INTO outfits (title, video_url, active, sort_order)
VALUES ('Sweater Clara', '/VIDEOS_OUTFITS/sweater_clara/sweater_clara.mp4', true, 3);

-- ============================================================
-- 8. Vincular outfits con productos (por nombre)
-- Esto crea las relaciones buscando los product IDs automáticamente
-- ============================================================

-- Blusa Greta → High-Rise Linen Trouser
INSERT INTO outfit_products (outfit_id, product_id)
SELECT o.id, p.id
FROM outfits o, products p
WHERE o.title = 'Blusa Greta' AND p.name = 'High-Rise Linen Trouser';

-- Saco Theo → High-Rise Linen Trouser
INSERT INTO outfit_products (outfit_id, product_id)
SELECT o.id, p.id
FROM outfits o, products p
WHERE o.title = 'Saco Theo' AND p.name = 'High-Rise Linen Trouser';

-- Saco Theo → Architectural Wool Blazer
INSERT INTO outfit_products (outfit_id, product_id)
SELECT o.id, p.id
FROM outfits o, products p
WHERE o.title = 'Saco Theo' AND p.name = 'Architectural Wool Blazer';

-- Sweater Clara → High-Rise Linen Trouser
INSERT INTO outfit_products (outfit_id, product_id)
SELECT o.id, p.id
FROM outfits o, products p
WHERE o.title = 'Sweater Clara' AND p.name = 'High-Rise Linen Trouser';

-- Sweater Clara → The Atelier Poplin Shirt
INSERT INTO outfit_products (outfit_id, product_id)
SELECT o.id, p.id
FROM outfits o, products p
WHERE o.title = 'Sweater Clara' AND p.name = 'The Atelier Poplin Shirt';

-- Sweater Clara → Fine Merino Turtleneck
INSERT INTO outfit_products (outfit_id, product_id)
SELECT o.id, p.id
FROM outfits o, products p
WHERE o.title = 'Sweater Clara' AND p.name = 'Fine Merino Turtleneck';

-- ============================================================
-- VERIFICACIÓN: Correr esto después para confirmar que todo está bien
-- ============================================================
-- SELECT o.title, p.name
-- FROM outfits o
-- JOIN outfit_products op ON op.outfit_id = o.id
-- JOIN products p ON p.id = op.product_id
-- ORDER BY o.sort_order;
