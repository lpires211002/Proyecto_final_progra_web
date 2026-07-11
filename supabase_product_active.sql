-- ============================================================
-- PRODUCTOS: mostrar/ocultar en la tienda (columna active)
-- Ejecutar en Supabase → SQL Editor ANTES de desplegar el código.
-- ============================================================

-- Igual que los outfits, los productos pasan a tener un flag "active".
-- active = true  -> visible en la tienda (default, no rompe lo existente)
-- active = false -> oculto del catálogo, búsqueda y novedades
ALTER TABLE products ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

-- (Opcional) índice para filtrar rápido por productos visibles
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- VERIFICACIÓN
-- SELECT name, active FROM products ORDER BY created_at DESC;
