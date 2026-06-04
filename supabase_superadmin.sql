-- ============================================================
-- SUPERADMIN: Sistema de roles para admin panel
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Crear tabla de roles de usuario
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'superadmin')),
  created_at timestamptz DEFAULT now()
);

-- 2. RLS: cada usuario solo puede leer su propio rol
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- 3. Solo superadmins pueden modificar roles
CREATE POLICY "Superadmin manages roles" ON user_roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
  );

-- ============================================================
-- 4. ASIGNAR SUPERADMIN
-- ⚠️  CAMBIÁ 'TU_EMAIL_AQUI@ejemplo.com' POR TU EMAIL REAL
-- ============================================================
INSERT INTO user_roles (user_id, role)
SELECT id, 'superadmin'
FROM auth.users
WHERE email = 'lpires@itba.edu.ar';

-- ============================================================
-- 5. Actualizar RLS de outfits: solo superadmin puede escribir
-- Primero borramos las policies anteriores de escritura
-- ============================================================

-- Borrar policies de escritura anteriores
DROP POLICY IF EXISTS "Auth insert outfits" ON outfits;
DROP POLICY IF EXISTS "Auth update outfits" ON outfits;
DROP POLICY IF EXISTS "Auth delete outfits" ON outfits;
DROP POLICY IF EXISTS "Auth insert outfit_products" ON outfit_products;
DROP POLICY IF EXISTS "Auth update outfit_products" ON outfit_products;
DROP POLICY IF EXISTS "Auth delete outfit_products" ON outfit_products;

-- Crear nuevas policies que verifican rol superadmin
CREATE POLICY "Superadmin insert outfits" ON outfits
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
  );

CREATE POLICY "Superadmin update outfits" ON outfits
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
  );

CREATE POLICY "Superadmin delete outfits" ON outfits
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
  );

CREATE POLICY "Superadmin insert outfit_products" ON outfit_products
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
  );

CREATE POLICY "Superadmin update outfit_products" ON outfit_products
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
  );

CREATE POLICY "Superadmin delete outfit_products" ON outfit_products
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
  );

-- ============================================================
-- VERIFICACIÓN: Confirmar que el superadmin fue creado
-- ============================================================
-- SELECT u.email, r.role
-- FROM user_roles r
-- JOIN auth.users u ON u.id = r.user_id;
