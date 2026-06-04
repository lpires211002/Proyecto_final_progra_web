'use client'

import { useAppContext } from '@/context/AppContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function SearchSidebar() {
  const { isSearchOpen, setIsSearchOpen } = useAppContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    if (isSearchOpen && allProducts.length === 0) {
      supabase.from('products').select('*').then(({ data }) => {
        if (data) setAllProducts(data);
      });
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = allProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.category && p.category.toLowerCase().includes(q))
    );
    setResults(filtered);
  }, [query, allProducts]);

  if (!isSearchOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-white/95 z-[60] backdrop-blur-md transition-opacity"
      >
        <div className="absolute top-8 right-8">
          <button onClick={() => setIsSearchOpen(false)} className="text-zinc-400 hover:text-black">
            <span className="material-symbols-outlined text-[32px]">close</span>
          </button>
        </div>

        <div className="flex flex-col items-center pt-32 px-6 h-full w-full max-w-4xl mx-auto">
          <div className="w-full max-w-2xl relative mb-16">
            <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-[32px] text-zinc-300">search</span>
            <input 
              type="text" 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search collection..." 
              className="w-full bg-transparent border-none text-2xl md:text-4xl pl-12 py-4 focus:ring-0 text-zinc-900 placeholder:text-zinc-200 font-serif italic"
            />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-200"></div>
          </div>

          <div className="w-full max-w-4xl overflow-y-auto pb-32">
            {query.trim() !== '' && results.length === 0 && (
              <p className="text-center text-zinc-400 font-label text-[10px] uppercase tracking-widest mt-12">
                No products found
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {results.map(product => (
                <div key={product.id} className="group cursor-pointer">
                  <Link href={`/product/${encodeURIComponent(product.name)}`} onClick={() => setIsSearchOpen(false)}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 mb-4">
                      {(product.image_url || product.img) && (
                        <Image
                          src={product.image_url || product.img}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                    </div>
                    <h4 className="font-label text-[9px] uppercase tracking-widest text-zinc-400 mb-1">{product.category || 'Atelier'}</h4>
                    <h3 className="text-xs font-medium text-zinc-900">{product.name}</h3>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
