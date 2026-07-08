import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client for writing orders (checkout + webhook).
// Uses the SERVICE ROLE key when available (bypasses RLS, recommended).
// Falls back to the anon key, which requires the permissive INSERT/UPDATE
// policies on orders/order_items defined in supabase_admin_panel.sql.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export const hasServiceRole = Boolean(serviceKey);

// Placeholder válido si falta env (build en CI). En runtime usa las env reales.
export const supabaseAdmin = createClient(
  url || 'https://placeholder.supabase.co',
  serviceKey || anonKey || 'placeholder-key',
  { auth: { persistSession: false, autoRefreshToken: false } }
);
