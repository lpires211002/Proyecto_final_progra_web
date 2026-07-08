import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN || ''
});

// Mapea el estado de Mercado Pago a nuestro estado interno.
function mapStatus(mpStatus) {
  if (mpStatus === 'approved') return 'approved';
  if (['rejected', 'cancelled', 'refunded', 'charged_back'].includes(mpStatus)) return 'rejected';
  return 'pending';
}

// Consulta el pago en MP y actualiza la orden asociada (por external_reference).
async function processPayment(paymentId) {
  if (!paymentId) return;

  const payment = new Payment(client);
  const data = await payment.get({ id: paymentId });

  const externalReference = data.external_reference;
  if (!externalReference) return;

  const status = mapStatus(data.status);
  const patch = {
    status,
    mp_payment_id: String(data.id),
    customer_email: data.payer?.email || null,
  };
  if (status === 'approved') patch.paid_at = new Date().toISOString();

  const { error } = await supabaseAdmin
    .from('orders')
    .update(patch)
    .eq('external_reference', externalReference);

  if (error) console.error('Webhook update error:', error.message);

  // Descontar stock una sola vez cuando el pago queda aprobado. La función
  // apply_order_stock es idempotente (chequea orders.stock_applied), así que
  // no pasa nada si MP reenvía la notificación.
  if (status === 'approved') {
    const { error: stockErr } = await supabaseAdmin.rpc('apply_order_stock', { ext_ref: externalReference });
    if (stockErr) console.error('apply_order_stock error:', stockErr.message);
  }
}

export async function POST(request) {
  try {
    const url = new URL(request.url);
    const qpType = url.searchParams.get('type') || url.searchParams.get('topic');
    let paymentId = url.searchParams.get('data.id') || url.searchParams.get('id');

    let body = {};
    try { body = await request.json(); } catch { /* MP a veces manda body vacío */ }

    const type = body.type || body.topic || qpType;
    if (!paymentId) paymentId = body?.data?.id || null;

    // Sólo procesamos notificaciones de pago.
    if (type && type !== 'payment') {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    await processPayment(paymentId);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error.message || error);
    // Devolvemos 200 igual para que MP no reintente en loop por errores nuestros.
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

// MP valida el endpoint con un GET.
export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
