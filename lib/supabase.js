import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials. Falling back to placeholder (solo build sin env).');
}

// Fallback a un placeholder VÁLIDO para que createClient no tire
// "supabaseUrl is required" durante el build cuando no hay env (CI o clone).
// En runtime (Vercel) siempre están las env reales, así que no cambia nada.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
