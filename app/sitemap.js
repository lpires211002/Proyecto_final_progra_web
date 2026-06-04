import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://proyecto-final-progra-web.vercel.app';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const staticRoutes = ['', '/shop', '/outfits', '/inspo', '/contact', '/client-care'].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));

  let productRoutes = [];
  try {
    const { data: products } = await supabase.from('products').select('name');
    productRoutes = (products ?? []).map((p) => ({
      url: `${BASE_URL}/product/${encodeURIComponent(p.name)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch {
    // If the DB is unreachable at build/request time, still return static routes.
  }

  return [...staticRoutes, ...productRoutes];
}
