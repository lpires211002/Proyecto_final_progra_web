'use client'

import Link from 'next/link';

export default function ProductCard({ product, className = "" }) {
  const isNew = product.origin === 'Made in Italy'; // Example criteria or add a product.new field

  return (
    <div className={`group cursor-pointer ${className}`}>
      <Link href={`/product/${encodeURIComponent(product.name)}`}>
        <div className="aspect-[3/4] overflow-hidden bg-[#e0e0e0] mb-6 relative">
          <img 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src={product.image_url || product.img}
            alt={product.name} 
          />
          {isNew && (
            <div className="absolute top-4 right-4 bg-white/50 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-tighter">
              New
            </div>
          )}
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-label text-zinc-500 text-[10px] uppercase tracking-[0.2em] mb-1">{product.category || 'Atelier'}</h4>
            <h3 className="text-sm font-medium">{product.name}</h3>
          </div>
          <p className="text-sm font-medium">${product.price}</p>
        </div>
      </Link>
    </div>
  );
}
