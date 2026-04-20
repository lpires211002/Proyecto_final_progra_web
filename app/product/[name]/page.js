'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/context/AppContext';

export default function ProductDetail() {
  const params = useParams();
  const decodedName = params?.name ? decodeURIComponent(params.name) : '';
  const { addToCart } = useAppContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (!decodedName) return;
    
    // Attempting to fetch exact product name
    supabase.from('products').select('*').eq('name', decodedName).single()
      .then(({ data, error }) => {
        if (data) setProduct(data);
        setLoading(false);
      });
  }, [decodedName]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-zinc-500 uppercase tracking-widest text-[10px]">Loading...</div>;
  if (!product) return <div className="min-h-screen pt-32 text-center text-zinc-500 uppercase tracking-widest text-[10px]">Product not found</div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product, selectedSize);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-32 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 fade-up visible">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-1 gap-4">
            <img 
              src={product.image_url || product.img} 
              alt={product.name}
              className="w-full aspect-[3/4] object-cover bg-zinc-100"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
          <div className="max-w-md">
            <div className="mb-12">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4">{product.category || 'Atelier'} / Outerwear</p>
              <h1 className="serif-headline text-4xl md:text-5xl font-bold mb-6 tracking-tight text-zinc-900">{product.name}</h1>
            </div>

            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[11px] uppercase tracking-[0.15em] font-semibold text-zinc-900">Size Guide Reference</h3>
                <a className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 hover:text-black transition-colors underline underline-offset-4" href="#">Tabla de medidas</a>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {['xs', 's', 'm', 'l'].map((size) => {
                  const stock = product[`stock_${size}`];
                  const hasStock = stock > 0;
                  return (
                    <button 
                      key={size}
                      disabled={!hasStock}
                      onClick={() => setSelectedSize(size.toUpperCase())}
                      className={`py-4 text-center text-[12px] font-medium border uppercase tracking-wider
                        ${hasStock ? 'cursor-pointer hover:border-black' : 'opacity-30 cursor-not-allowed'}
                        ${selectedSize === size.toUpperCase() ? 'border-black bg-black text-white' : 'border-zinc-200 text-zinc-900'}
                      `}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-12">
              <p className="text-xl font-medium text-zinc-900 mb-6">${product.price}</p>
              <button 
                onClick={handleAddToCart}
                className="w-full bg-zinc-950 text-white py-4 font-label text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>

            <div className="space-y-8 pt-12 border-t border-zinc-200">
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold mb-4 text-zinc-900">Description</h4>
                <p className="text-zinc-500 leading-relaxed text-sm font-light">
                  A masterclass in architectural tailoring. Crafted from premium materials featuring sharp tailored lines that create a powerful, sculpted silhouette. Unlined for a soft, structured drape.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 text-zinc-900">
                <div className="flex items-center space-x-4 py-2">
                  <span className="material-symbols-outlined text-zinc-400">eco</span>
                  <span className="text-[11px] uppercase tracking-[0.1em] font-medium">100% Responsibly Sourced</span>
                </div>
                <div className="flex items-center space-x-4 py-2">
                  <span className="material-symbols-outlined text-zinc-400">dry_cleaning</span>
                  <span className="text-[11px] uppercase tracking-[0.1em] font-medium">Dry Clean Only</span>
                </div>
                <div className="flex items-center space-x-4 py-2">
                  <span className="material-symbols-outlined text-zinc-400">public</span>
                  <span className="text-[11px] uppercase tracking-[0.1em] font-medium">{product.origin || 'Imported'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
