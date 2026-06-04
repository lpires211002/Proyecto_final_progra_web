import { supabase } from '@/lib/supabase';
import ShopClient from '@/components/ShopClient';

// Server-rendered on each request so stock/prices stay fresh.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Collection',
  description: 'Explore the taiko nina Atelier Collection — modern, minimalist silhouettes crafted with precision and grace.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Collection | taiko nina',
    description: 'Explore the taiko nina Atelier Collection — modern, minimalist silhouettes.',
    url: '/shop',
    type: 'website',
  },
};

export default async function Shop() {
  // Data is fetched on the server (React Server Component) instead of the browser.
  const { data: products } = await supabase.from('products').select('*');

  return <ShopClient initialProducts={products ?? []} />;
}
