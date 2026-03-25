-- schema_v3.sql
-- Ejecuta este script en el "SQL Editor" de Supabase para agregar el origen y existencias

-- 1. Agregar columna origin si no existe
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS origin TEXT DEFAULT 'Imported';

-- 2. Asegurar que las columnas de stock existan (por si acaso no se corrió el esquema anterior)
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS stock_s INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS stock_m INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS stock_l INTEGER DEFAULT 15;

-- 3. Actualizar productos existentes con orígenes de ejemplo
UPDATE public.products SET origin = 'Italy' WHERE name ILIKE '%Wool%';
UPDATE public.products SET origin = 'Argentina' WHERE name ILIKE '%Leather%' OR name ILIKE '%Bag%';
UPDATE public.products SET origin = 'France' WHERE name ILIKE '%Silk%';
UPDATE public.products SET origin = 'Japan' WHERE name ILIKE '%Denim%' OR name ILIKE '%Cashmere%';

-- 4. Fijar valores por defecto para que todos los productos tengan existencias para testing
UPDATE public.products 
SET stock_s = 15, stock_m = 15, stock_l = 15 
WHERE stock_s = 0 OR stock_s IS NULL OR stock_m = 0 OR stock_m IS NULL OR stock_l = 0 OR stock_l IS NULL;
