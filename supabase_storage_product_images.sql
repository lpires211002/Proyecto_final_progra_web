-- ============================================================
-- STORAGE: bucket para imágenes de producto (subida desde /admin/products)
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- 1. Crear el bucket público 'product-images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Policies sobre storage.objects para ese bucket
--    - Lectura pública (para que las imágenes se vean en la tienda)
--    - Escritura (subir/editar/borrar) sólo para superadmin
DROP POLICY IF EXISTS "Public read product-images"      ON storage.objects;
DROP POLICY IF EXISTS "Superadmin upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Superadmin update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Superadmin delete product-images" ON storage.objects;

CREATE POLICY "Public read product-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Superadmin upload product-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
  );

CREATE POLICY "Superadmin update product-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'product-images'
    AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
  );

CREATE POLICY "Superadmin delete product-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'product-images'
    AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
  );
