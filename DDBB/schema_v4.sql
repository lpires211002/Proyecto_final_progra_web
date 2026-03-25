-- schema_v4.sql
-- Ejecuta este script en el "SQL Editor" de Supabase para agregar la tabla de Newsletter

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Políticas de seguridad
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede insertarse en el newsletter
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Solo usuarios autenticados (o admins) pueden ver la lista
CREATE POLICY "Authenticated users can view subscribers" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (auth.role() = 'authenticated');
