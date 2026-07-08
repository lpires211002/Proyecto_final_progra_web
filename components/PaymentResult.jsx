import Link from 'next/link';

const TONES = {
  success: { icon: 'check_circle', color: 'text-emerald-500', label: 'Pago aprobado' },
  pending: { icon: 'schedule', color: 'text-amber-500', label: 'Pago pendiente' },
  failure: { icon: 'cancel', color: 'text-red-500', label: 'Pago rechazado' },
};

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3">
      <span className="text-zinc-400 uppercase tracking-widest text-[10px]">{label}</span>
      <span className="text-zinc-800 font-medium truncate">{value}</span>
    </div>
  );
}

// Presentational (server-safe) para las páginas de resultado de Mercado Pago.
export default function PaymentResult({ tone = 'success', title, subtitle, paymentId, reference, children }) {
  const t = TONES[tone] || TONES.success;
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-6 pt-32 pb-24">
      <div className="max-w-md w-full text-center">
        <span className={`material-symbols-outlined text-6xl ${t.color} mb-6 block`}>{t.icon}</span>
        <p className="font-label text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-3">{t.label}</p>
        <h1 className="serif-headline text-4xl italic tracking-tighter text-zinc-950 mb-4">{title}</h1>
        <p className="text-zinc-500 text-sm font-light mb-8">{subtitle}</p>

        {(paymentId || reference) && (
          <div className="border border-zinc-200 bg-white text-left divide-y divide-zinc-100 mb-8">
            {paymentId && <Row label="N° de pago" value={paymentId} />}
            {reference && <Row label="Orden" value={reference} />}
          </div>
        )}

        {children}

        <div className="flex gap-3 justify-center mt-2">
          <Link href="/shop" className="bg-zinc-950 text-white px-6 py-3 font-label text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
