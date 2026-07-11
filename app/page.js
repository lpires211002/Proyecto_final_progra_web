'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);

  // "Novedades": últimas piezas del catálogo real (no hardcodeadas).
  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => { if (data) setNewArrivals(data); });
  }, []);

  // Reveal on scroll. Se re-ejecuta cuando llegan las novedades para
  // observar también esas tarjetas.
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [newArrivals]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col justify-end bg-black">
        <div className="absolute inset-0 z-0 bg-black">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover grayscale brightness-[0.80]">
            <source src="/VIDEOS/video_taiko_index_2.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="relative z-10 w-full px-6 md:px-12 flex flex-col items-end mb-8 md:mb-16 pointer-events-none text-white font-label text-[10px] uppercase tracking-[0.2em] text-right drop-shadow-md">
          <p>AW 2026 Studio Collection</p>
          <p>Available Now</p>
        </div>
        <div className="relative z-10 w-full px-6 flex flex-col items-center pb-24 text-center pointer-events-none">
          <h2 className="text-[20vw] leading-[0.8] font-serif tracking-tighter text-white mix-blend-overlay font-bold select-none drop-shadow-lg mb-8">
            taiko nina
          </h2>
          <div className="pointer-events-auto mt-4">
            <Link href="/shop" className="border border-white/50 bg-transparent text-white backdrop-blur-sm px-12 py-4 font-label text-[10px] uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-700">
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals — desde el catálogo */}
      <section className="py-32 px-6 md:px-12 bg-zinc-50">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end mb-20 fade-up">
            <div>
              <h3 className="serif-headline text-4xl mb-2 italic">Novedades</h3>
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-500">Fresh silhouettes for the modern atelier</p>
            </div>
            <Link href="/shop" className="font-label text-[10px] uppercase tracking-[0.2em] border-b border-zinc-900/20 pb-1 hover:border-zinc-900 transition-all">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {newArrivals.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                className={`fade-up ${['', 'delay-100', 'delay-300', 'delay-500'][i] || ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-stretch">
            <div className="md:col-span-8 group relative overflow-hidden h-[600px] fade-up">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQk7OKdgfnN5bgzIGFdu5jpwTTlS2QxrAa_bUL0bat10PohtTnrdDTJmctmgyJeI-VLpbCCPj3s2A1Aq7AAiRdT1hLk53jkwBigSiZ0X_tZrFSKRQYIdrpzxd4Hq2f86jsLNgZHGomp1_6c6ji80QDQzDMszhHxK7_RrZrpugIY7VtXR9XvPM9AvRVLguMqcJzyiNoYBo52QzbcLJlJjjW3i_8fyy0lwuOGjyTnfWLWpnZp3wrDRdFSrlY1_VG2eRze48yt3NULeU"
                alt="Editorial de la colección cápsula L'Été Infini"
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover grayscale group-hover:scale-[1.02] transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute bottom-12 left-12 text-white">
                <h3 className="serif-headline text-6xl mb-4">{`L'Ete Infini`}</h3>
                <p className="font-label text-[10px] uppercase tracking-[0.3em] mb-8 opacity-80">The resort capsule collection</p>
                <Link href="/shop" className="border border-white/40 text-white px-8 py-3 font-label text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Explore Series</Link>
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col gap-12 fade-up delay-300">
              <Link href="/shop" className="flex-1 min-h-[300px] group relative overflow-hidden bg-zinc-100 cursor-pointer block">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbdi2WRzhHN4RVsBoSqvp8Awdr9KiG0iBUarFmDAMwBqj_B36r-vd3En5SGUF0BvNCrHhxQKJWJKvpdfBwIrcaYnHS9MlFhvm0qlcmq7y2EslXFUxr9M4Q70YYYebb4Di-Vtr5kY6hr8xTwNX6OShZk4Zh8VuvyZPXGTK8Bd_NpaZJYYnvfSulnZchNKmDCPjRUADPvGkxynJ_Q6e9VIhOCbYMHAjPrJkUjcuanVscFFtvRPWpyK9b7wDePRqijY529CY2yQRckXo"
                  alt="The Essentials — piezas esenciales de la colección"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-zinc-900">
                  <div>
                    <h4 className="serif-headline text-3xl mb-2">The Essentials</h4>
                    <p className="font-label text-[10px] uppercase tracking-[0.2em] mb-6">Core Pieces</p>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>
              </Link>
              <div className="flex-1 min-h-[300px] bg-zinc-900 text-white p-12 flex flex-col justify-center items-center text-center">
                <span className="font-label text-[9px] uppercase tracking-[0.5em] mb-6">Discovery</span>
                <h4 className="serif-headline text-2xl italic mb-8">Atelier Nina: Bespoke Tailoring Services</h4>
                <p className="text-sm leading-relaxed opacity-70 mb-8 max-w-xs font-light">Elevate your wardrobe with personalized craftsmanship from our master tailors.</p>
                <a className="font-label text-[10px] uppercase tracking-[0.2em] border-b border-white/30 pb-1 hover:border-white transition-colors" href="#">Inquire</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration Teaser */}
      <section className="relative h-[85vh] w-full overflow-hidden group cursor-pointer fade-up">
        <Link href="/inspo">
          <div className="absolute inset-0 z-0 bg-black">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover grayscale brightness-[0.60] scale-[1.8] group-hover:scale-[1.85] group-hover:brightness-[0.40] transition-all duration-[3000ms] ease-out">
              <source src="/VIDEOS_INSPO/video_index.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
            <span className="font-label text-[10px] uppercase tracking-[0.5em] text-white/60 mb-8 font-semibold opacity-0 translate-y-4 animate-[fade-up_1s_ease-out_forwards]">The Philosophy</span>
            <h2 className="serif-headline text-6xl md:text-[8rem] italic text-white drop-shadow-2xl leading-none">
              Nuestros<br/><span className="opacity-80">orígenes</span>
            </h2>
            <div className="mt-16 w-[1px] h-24 bg-white/20 group-hover:h-32 transition-all duration-1000 ease-in-out"></div>
            <span className="mt-6 font-label text-[9px] uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors duration-700">Explorar la inspiración</span>
          </div>
        </Link>
      </section>
    </>
  );
}
