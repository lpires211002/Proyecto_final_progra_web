import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { supabase } from '@/lib/supabase';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN || ''
});

export async function POST(request) {
  try {
    const { cartItems } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const productIds = cartItems.map(item => item.id);
    const { data: products, error: dbError } = await supabase
      .from('products')
      .select('id, price')
      .in('id', productIds);

    if (dbError || !products) {
      return NextResponse.json({ error: 'Could not verify product prices' }, { status: 500 });
    }

    const priceMap = Object.fromEntries(products.map(p => [p.id, p.price]));

    const invalidItems = cartItems.filter(item => priceMap[item.id] === undefined);
    if (invalidItems.length > 0) {
      return NextResponse.json({ error: 'One or more products are invalid' }, { status: 400 });
    }

    const items = cartItems.map(item => ({
      id: item.id,
      title: item.name,
      quantity: item.quantity,
      unit_price: parseFloat(priceMap[item.id]),
      currency_id: 'ARS',
      picture_url: item.image_url || item.img,
      description: `Size: ${item.size} | Color: ${item.color || 'Standard'}`
    }));

    const preference = new Preference(client);

    // MercadoPago exige HTTPS o URLs públicas válidas.  
    // Usamos la de Vercel si existe, o caemos al dominio de producción para que no falle en local.
    const origin = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://taiko-nina.vercel.app';

    const body = {
      items,
      back_urls: {
        success: `${origin}/shop?status=success`,
        failure: `${origin}/shop?status=failure`,
        pending: `${origin}/shop?status=pending`
      },
      auto_return: 'approved'
    };

    const response = await preference.create({ body });
    return NextResponse.json({ init_point: response.init_point });

  } catch (error) {
    console.error('Mercado Pago Error:', error);
    return NextResponse.json({ error: 'Failed to create preference', details: error.message || error.toString() }, { status: 500 });
  }
}
