'use client'

import { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';

export default function ShopClient({ initialProducts = [] }) {
  const products = initialProducts;
  const [filters, setFilters] = useState({ category: 'All', size: 'All', color: 'All', sort: 'New Arrivals' });

  // Derived state — computed during render instead of via setState in an effect.
  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filters.category !== 'All') result = result.filter(p => p.category === filters.category);
    if (filters.color !== 'All') result = result.filter(p => p.color === filters.color);
    if (filters.size !== 'All') {
      result = result.filter(p => {
        const s = filters.size.toLowerCase();
        return p[`stock_${s}`] > 0;
      });
    }
    if (filters.sort === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    else if (filters.sort === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    return result;
  }, [filters, products]);

  // Scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const timeout = setTimeout(() => {
      document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    }, 50);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [filteredProducts]);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <h1 className="serif-headline text-5xl italic tracking-tighter">Collection</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 md:gap-8 font-label text-[10px] uppercase tracking-widest text-zinc-500">
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-black transition-colors"
          >
            <option value="All">Categoría</option>
            {[...new Set(products.map(p => p.category).filter(Boolean))].sort().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filters.size}
            onChange={(e) => updateFilter('size', e.target.value)}
            className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-black transition-colors"
          >
            <option value="All">Talla</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>

          <select
            value={filters.color}
            onChange={(e) => updateFilter('color', e.target.value)}
            className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-black transition-colors"
          >
            <option value="All">Color</option>
            {[...new Set(products.map(p => p.color).filter(Boolean))].sort().map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-black transition-colors"
          >
            <option value="New Arrivals">Ordenar por</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
        {filteredProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} className={`fade-up delay-${i % 4 * 100}`} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-zinc-500 font-label text-[10px] uppercase tracking-widest">
          No products match your filters.
        </div>
      )}
    </div>
  );
}
