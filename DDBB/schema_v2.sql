-- schema_v2.sql
-- Ejecuta este script en el "SQL Editor" de Supabase para actualizar tu base de datos.
-- 1. Agregar columnas de stock a los productos existentes (por defecto tendrán 10 unidades de cada talle)
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS stock_s INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS stock_m INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS stock_l INTEGER DEFAULT 10;

-- (Opcional) Pongamos un producto sin stock de talle M para probar:
UPDATE public.products SET stock_m = 0 WHERE name = 'The Sculpted Wool Coat';

-- 2. Crear tabla de perfiles (clientes) vinculada a los usuarios autenticados
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Políticas de seguridad para perfiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Trigger para crear automáticamente un perfil cuando un cliente se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar el trigger si existe para no duplicar
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
