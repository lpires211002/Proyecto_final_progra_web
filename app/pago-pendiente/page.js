import PaymentResult from '@/components/PaymentResult';

// Destino de back_urls.pending de Mercado Pago.
export const dynamic = 'force-dynamic';

export default async function PagoPendiente({ searchParams }) {
  const sp = (await searchParams) || {};
  const paymentId = sp.payment_id || sp.collection_id || null;
  const reference = sp.external_reference || null;

  return (
    <PaymentResult
      tone="pending"
      title="Tu pago está pendiente"
      subtitle="Cuando se acredite vas a recibir la confirmación. Podés seguir navegando mientras tanto."
      paymentId={paymentId}
      reference={reference}
    />
  );
}
