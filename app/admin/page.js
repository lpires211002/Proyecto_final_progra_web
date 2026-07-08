'use client'

import Link from 'next/link';
import AdminGuard from '@/components/AdminGuard';
import AdminNav from '@/components/AdminNav';

const CARDS = [
  {
    href: '/admin/outfits',
    icon: 'styler',
    title: 'Outfits',
    desc: 'Gestioná los looks: videos, orden y productos de cada outfit.',
  },
  {
    href: '/admin/products',
    icon: 'inventory_2',
    title: 'Productos y stock',
    desc: 'Alta, edición y baja de productos. Precio, imagen y stock por talle.',
  },
  {
    href: '/admin/sales',
    icon: 'insights',
    title: 'Resumen de ventas',
    desc: 'Facturación, cantidad de órdenes y productos más vendidos.',
  },
];

export default function AdminHome() {
  return (
    <AdminGuard>
      <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-surface">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-10 border-b border-zinc-200 pb-8">
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">Admin Panel</p>
            <h1 className="serif-headline text-4xl md:text-5xl italic tracking-tighter text-zinc-950">taiko nina · Administración</h1>
          </div>

          <AdminNav />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CARDS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group bg-white border border-zinc-200 p-8 hover:border-zinc-950 transition-colors flex flex-col"
              >
                <span className="material-symbols-outlined text-[32px] text-zinc-950 mb-6">{c.icon}</span>
                <h2 className="serif-headline text-2xl italic text-zinc-950 mb-2">{c.title}</h2>
                <p className="text-zinc-500 text-sm font-light leading-relaxed flex-1">{c.desc}</p>
                <span className="mt-6 font-label text-[11px] uppercase tracking-[0.15em] text-zinc-400 group-hover:text-black transition-colors flex items-center gap-1">
                  Entrar <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
