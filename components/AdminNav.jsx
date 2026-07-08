'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Panel', icon: 'dashboard' },
  { href: '/admin/outfits', label: 'Outfits', icon: 'styler' },
  { href: '/admin/products', label: 'Productos', icon: 'inventory_2' },
  { href: '/admin/sales', label: 'Ventas', icon: 'insights' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-1 mb-10 border border-zinc-200 bg-white p-1 w-full sm:w-fit overflow-x-auto">
      {LINKS.map((l) => {
        const active = l.href === '/admin' ? pathname === '/admin' : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 font-label text-[11px] uppercase tracking-[0.15em] whitespace-nowrap transition-colors
              ${active ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:text-black hover:bg-zinc-50'}`}
          >
            <span className="material-symbols-outlined text-[16px]">{l.icon}</span>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
