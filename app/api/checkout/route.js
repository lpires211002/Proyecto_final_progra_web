import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN || ''
});

// URL pública y estable a la que MP redirige tras el pago y a la que manda
// el webhook. Configurá NEXT_PUBLIC_SITE_URL con tu dominio real de Vercel
// para evitar redirecciones a URLs de preview/prueba.
function getOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://taiko-nina.vercel.app';
}

export async function POST(request) {
  try {
    const { cartItems } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Precios verificados contra la base (no confiamos en el cliente).
    const productIds = cartItems.map((item) => item.id);
    const { data: products, error: dbError } = await supabase
      .from('products')
      .select('id, name, price')
      .in('id', productIds);

    if (dbError || !products) {
      return NextResponse.json({ error: 'Could not verify product prices' }, { status: 500 });
    }

    const priceMap = Object.fromEntries(products.map((p) => [p.id, p.price]));
    const nameMap = Object.fromEntries(products.map((p) => [p.id, p.name]));

    const invalidItems = cartItems.filter((item) => priceMap[item.id] === undefined);
    if (invalidItems.length > 0) {
      return NextResponse.json({ error: 'One or more products are invalid' }, { status: 400 });
    }

    const items = cartItems.map((item) => ({
      id: item.id,
      title: nameMap[item.id] || item.name,
      quantity: item.quantity,
      unit_price: parseFloat(priceMap[item.id]),
      currency_id: 'ARS',
      picture_url: item.image_url || item.img,
      description: `Size: ${item.size} | Color: ${item.color || 'Standard'}`
    }));

    const total = items.reduce((acc, it) => acc + it.unit_price * it.quantity, 0);
    const externalReference = randomUUID();
    const origin = getOrigin();

    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        items,
        external_reference: externalReference,
        notification_url: `${origin}/api/webhook`,
        back_urls: {
          success: `${origin}/shop?status=success`,
          failure: `${origin}/shop?status=failure`,
          pending: `${origin}/shop?status=pending`
        },
        auto_return: 'approved'
      }
    });

    // Registramos la orden como 'pending'. El webhook la confirma a 'approved'
    // cuando MP notifica el pago. Si esto falla, no bloqueamos el checkout.
    // Usamos un id explícito para no depender de RETURNING (que exige permiso
    // de SELECT); así funciona también con la anon key.
    const orderId = randomUUID();
    try {
      const { error: orderErr } = await supabaseAdmin
        .from('orders')
        .insert({
          id: orderId,
          external_reference: externalReference,
          mp_preference_id: response.id,
          status: 'pending',
          total,
          currency: 'ARS'
        });

      if (orderErr) throw orderErr;

      const orderItems = cartItems.map((item) => ({
        order_id: orderId,
        product_id: item.id,
        name: nameMap[item.id] || item.name,
        size: item.size || null,
        quantity: item.quantity,
        unit_price: parseFloat(priceMap[item.id])
      }));
      const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(orderItems);
      if (itemsErr) throw itemsErr;
    } catch (persistErr) {
      console.error('Order persist error:', persistErr.message || persistErr);
    }

    return NextResponse.json({ init_point: response.init_point });

  } catch (error) {
    console.error('Mercado Pago Error:', error);
    return NextResponse.json({ error: 'Failed to create preference', details: error.message || error.toString() }, { status: 500 });
  }
}
