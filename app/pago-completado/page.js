import PaymentResult from '@/components/PaymentResult';
import ClearCart from '@/components/ClearCart';

// Destino de back_urls.success de Mercado Pago. MP agrega payment_id, status
// y external_reference como query params al redirigir.
export const dynamic = 'force-dynamic';

export default async function PagoCompletado({ searchParams }) {
  const sp = (await searchParams) || {};
  const paymentId = sp.payment_id || sp.collection_id || null;
  const reference = sp.external_reference || null;

  return (
    <PaymentResult
      tone="success"
      title="¡Gracias por tu compra!"
      subtitle="Tu pago fue aprobado. Te enviaremos la confirmación por email."
      paymentId={paymentId}
      reference={reference}
    >
      <ClearCart />
    </PaymentResult>
  );
}
