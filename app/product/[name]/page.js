import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductDetailClient from '@/components/ProductDetailClient';

// Server-rendered on each request so stock/prices stay fresh.
export const dynamic = 'force-dynamic';

// En el App Router los params ya vienen URI-decodificados. Un segundo
// decodeURIComponent rompe con nombres que tienen '%' (ej: "100% real"),
// porque '% r' es un escape inválido y lanza URIError -> error 500.
// Decodificamos de forma segura: si el decode falla, usamos el valor tal cual.
function safeDecodeName(raw) {
  if (!raw) return '';
  try { return decodeURIComponent(raw); } catch { return raw; }
}

async function getProduct(rawName) {
  const name = safeDecodeName(rawName);
  if (!name) return null;
  const { data } = await supabase.from('products').select('*').eq('name', name).single();
  return data ?? null;
}

// Dynamic per-product SEO (title, description, social preview image).
export async function generateMetadata({ params }) {
  const { name } = await params;
  const product = await getProduct(name);

  if (!product) {
    return { title: 'Product not found' };
  }

  const image = product.image_url || product.img;
  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} — part of the taiko nina Atelier Collection. ${product.category || 'Atelier'}.`,
    alternates: { canonical: `/product/${encodeURIComponent(product.name)}` },
    openGraph: {
      title: `${product.name} | taiko nina`,
      description: product.description || `${product.name} — taiko nina Atelier Collection.`,
      url: `/product/${encodeURIComponent(product.name)}`,
      type: 'website',
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductDetail({ params }) {
  const { name } = await params;
  const product = await getProduct(name);

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
