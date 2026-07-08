'use client'

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import AdminGuard from '@/components/AdminGuard';
import AdminNav from '@/components/AdminNav';

const PAID = ['approved', 'paid'];
const money = (n) => '$' + Number(n || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

function SalesDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const stats = useMemo(() => {
    const paid = orders.filter((o) => PAID.includes(o.status));
    const revenue = paid.reduce((acc, o) => acc + Number(o.total || 0), 0);
    const units = paid.reduce((acc, o) => acc + (o.order_items || []).reduce((a, it) => a + (it.quantity || 0), 0), 0);
    const avg = paid.length ? revenue / paid.length : 0;

    const byProduct = {};
    paid.forEach((o) => (o.order_items || []).forEach((it) => {
      const key = it.name || 'Producto';
      if (!byProduct[key]) byProduct[key] = { name: key, qty: 0, revenue: 0 };
      byProduct[key].qty += it.quantity || 0;
      byProduct[key].revenue += (it.quantity || 0) * Number(it.unit_price || 0);
    }));
    const topProducts = Object.values(byProduct).sort((a, b) => b.qty - a.qty).slice(0, 8);

    return {
      revenue, units, avg,
      paidCount: paid.length,
      pendingCount: orders.filter((o) => o.status === 'pending').length,
      topProducts,
    };
  }, [orders]);

  const maxQty = stats.topProducts[0]?.qty || 1;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-surface">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10 border-b border-zinc-200 pb-8">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">Admin Panel</p>
          <h1 className="serif-headline text-4xl md:text-5xl italic tracking-tighter text-zinc-950">Resumen de ventas</h1>
        </div>

        <AdminNav />

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-zinc-400 text-4xl">progress_activity</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-6">
            Error cargando ventas: {error}
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Kpi label="Facturación" value={money(stats.revenue)} icon="payments" />
              <Kpi label="Órdenes pagadas" value={stats.paidCount} icon="receipt_long" />
              <Kpi label="Ticket promedio" value={money(stats.avg)} icon="trending_up" />
              <Kpi label="Unidades vendidas" value={stats.units} icon="inventory_2" />
            </div>
            {stats.pendingCount > 0 && (
              <p className="text-[11px] text-zinc-400 mb-10">{stats.pendingCount} orden{stats.pendingCount !== 1 ? 'es' : ''} pendiente{stats.pendingCount !== 1 ? 's' : ''} de pago (no cuentan en la facturación).</p>
            )}

            {orders.length === 0 ? (
              <div className="text-center py-20 border border-zinc-100 bg-white mt-6">
                <span className="material-symbols-outlined text-6xl text-zinc-200 mb-4 block">insights</span>
                <p className="text-zinc-400 text-sm">Todavía no hay ventas registradas.</p>
                <p className="text-zinc-300 text-xs mt-2">Aparecerán acá cuando se confirme un pago vía el webhook de Mercado Pago.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                {/* Top products */}
                <div className="bg-white border border-zinc-100 p-6">
                  <h2 className="font-label text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-6">Productos más vendidos</h2>
                  {stats.topProducts.length === 0 ? (
                    <p className="text-zinc-400 text-sm">Sin datos aún.</p>
                  ) : (
                    <div className="space-y-4">
                      {stats.topProducts.map((p) => (
                        <div key={p.name}>
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-sm text-zinc-800 truncate pr-4">{p.name}</span>
                            <span className="text-[11px] text-zinc-400 shrink-0 tabular-nums">{p.qty} u · {money(p.revenue)}</span>
                          </div>
                          <div className="h-1.5 bg-zinc-100 overflow-hidden">
                            <div className="h-full bg-zinc-950" style={{ width: `${Math.max(6, (p.qty / maxQty) * 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent orders */}
                <div className="bg-white border border-zinc-100 p-6">
                  <h2 className="font-label text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-6">Últimas órdenes</h2>
                  <div className="divide-y divide-zinc-50">
                    {orders.slice(0, 10).map((o) => (
                      <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm text-zinc-800 truncate">{o.customer_email || 'Cliente'}</p>
                          <p className="text-[11px] text-zinc-400">
                            {fmtDate(o.created_at)} · {(o.order_items || []).reduce((a, it) => a + (it.quantity || 0), 0)} u
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-medium text-zinc-900">{money(o.total)}</p>
                          <StatusBadge status={o.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, icon }) {
  return (
    <div className="bg-white border border-zinc-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-400">{label}</span>
        <span className="material-symbols-outlined text-[18px] text-zinc-300">{icon}</span>
      </div>
      <p className="serif-headline text-3xl italic tracking-tight text-zinc-950">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    approved: 'bg-emerald-50 text-emerald-700',
    paid: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    rejected: 'bg-red-50 text-red-600',
  };
  const label = { approved: 'Pagada', paid: 'Pagada', pending: 'Pendiente', rejected: 'Rechazada' }[status] || status;
  return <span className={`inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 mt-1 ${map[status] || 'bg-zinc-100 text-zinc-500'}`}>{label}</span>;
}

export default function AdminSalesPage() {
  return (
    <AdminGuard>
      <SalesDashboard />
    </AdminGuard>
  );
}
