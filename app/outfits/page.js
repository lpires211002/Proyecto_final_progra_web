'use client'

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

const OUTFITS = [
  {
    id: "outfit-saco_theo",
    title: "Saco Theo",
    video: "/VIDEOS_OUTFITS/saco_theo/saco_theo.mp4",
    products: [
      "High-Rise Linen Trouser",
      "Architectural Wool Blazer"
    ]
  },
  {
    id: "outfit-sweater_clara",
    title: "Sweater Clara",
    video: "/VIDEOS_OUTFITS/sweater_clara/sweater_clara.mp4",
    products: [
      "High-Rise Linen Trouser",
      "The Atelier Poplin Shirt",
      "Fine Merino Turtleneck"
    ]
  }
];

export default function Outfits() {
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [outfitProducts, setOutfitProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectOutfit = async (outfit) => {
    setSelectedOutfit(outfit);
    setLoading(true);
    setOutfitProducts([]);

    const { data } = await supabase
      .from('products')
      .select('*')
      .in('name', outfit.products);

    if (data) setOutfitProducts(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-32 px-12 bg-surface">
      <div className="max-w-[1600px] mx-auto text-center mb-16 pt-16">
        <h2 className="serif-headline text-5xl md:text-7xl italic mb-6 text-zinc-950">Outfits Collection</h2>
        <p className="font-body text-zinc-500 max-w-2xl mx-auto">Hover to pause previews, click an outfit to shop the look.</p>
      </div>

      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {OUTFITS.map(outfit => (
            <div 
              key={outfit.id} 
              className="group relative aspect-[3/4] bg-zinc-100 cursor-pointer overflow-hidden"
              onClick={() => handleSelectOutfit(outfit)}
            >
              <video 
                src={outfit.video}
                autoPlay loop muted playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onMouseEnter={(e) => e.target.pause()}
                onMouseLeave={(e) => e.target.play()}
              ></video>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-label text-[10px] uppercase tracking-widest border border-white/50 px-6 py-2 backdrop-blur-sm">Shop Look</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split-screen modal for Outfit Details */}
      <div className={`fixed inset-0 bg-white z-[200] transition-opacity duration-500 flex flex-col md:flex-row ${selectedOutfit ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button 
          onClick={() => setSelectedOutfit(null)}
          className="absolute top-6 right-6 md:right-auto md:left-6 z-10 material-symbols-outlined hover:text-black transition-colors text-zinc-400 text-3xl shrink-0 p-2 bg-white/80 rounded-full drop-shadow-lg"
        >
          close
        </button>

        <div className="w-full h-1/2 md:w-1/2 md:h-full bg-zinc-100 relative flex items-center justify-center border-r border-zinc-200">
          {selectedOutfit && (
            <video src={selectedOutfit.video} className="w-full h-full object-cover" loop playsInline autoPlay muted></video>
          )}
        </div>

        <div className="w-full h-1/2 md:w-1/2 md:h-full overflow-y-auto px-6 py-12 md:px-16 md:py-24 bg-surface">
          <h3 className="serif-headline text-3xl md:text-5xl italic mb-4 text-zinc-950">Shop the Look</h3>
          <p className="font-label text-[10px] uppercase tracking-widest text-zinc-500 mb-12 pb-6 border-b border-zinc-200">Selected pieces from this outfit</p>

          {loading ? (
             <div className="flex justify-center items-center py-20">
               <span className="material-symbols-outlined animate-spin text-zinc-400 text-4xl">progress_activity</span>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
              {outfitProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
              {outfitProducts.length === 0 && <p className="text-zinc-500 text-sm">No products found for this look.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
