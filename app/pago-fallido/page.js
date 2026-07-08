import PaymentResult from '@/components/PaymentResult';

// Destino de back_urls.failure de Mercado Pago.
export const dynamic = 'force-dynamic';

export default async function PagoFallido({ searchParams }) {
  const sp = (await searchParams) || {};
  const reference = sp.external_reference || null;

  return (
    <PaymentResult
      tone="failure"
      title="El pago no se pudo completar"
      subtitle="Hubo un problema con el pago. Podés volver al carrito e intentar de nuevo."
      reference={reference}
    />
  );
}
