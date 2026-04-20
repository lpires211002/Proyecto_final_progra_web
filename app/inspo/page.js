'use client'

import { useEffect } from 'react';
import Link from 'next/link';

export default function Inspo() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Title */}
      <section className="pt-48 pb-32 px-12 md:px-24 max-w-[1400px] mx-auto text-center fade-up mt-12">
        <span className="font-label text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-12 block">Manifiesto</span>
        <h2 className="serif-headline text-6xl md:text-[6rem] italic text-zinc-950 leading-[0.9] tracking-tighter mb-16">
          El lujo de lo<br/>imperceptible.
        </h2>
        <div className="w-[1px] h-32 bg-zinc-300 mx-auto fade-up delay-300"></div>
      </section>

      {/* Chapter 1: Video Split */}
      <section className="py-32 px-12 md:px-24">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-32 items-center">
          <div className="md:col-span-5 space-y-12 fade-up">
            <h3 className="serif-headline text-4xl md:text-5xl italic text-zinc-950">Nuestros Orígenes</h3>
            <p className="text-lg text-zinc-500 leading-relaxed font-light">
              taiko nina nació de una búsqueda obsesiva por la quietud. En un mundo saturado de ruido visual y estéticas efímeras, decidimos volver a lo esencial. Cada silueta que diseñamos no busca gritar por atención, sino que invita a quien la lleva a habitar su propio espacio con una confianza serena.
            </p>
            <p className="text-lg text-zinc-500 leading-relaxed font-light">
              Nos inspiran las formas orgánicas, la arquitectura brutalista y la poesía de los materiales nobles que envejecen con gracia.
            </p>
          </div>
          <div className="md:col-span-7 aspect-[3/4] md:aspect-square relative flex justify-end fade-up delay-300">
            <div className="w-full h-full bg-zinc-100 overflow-hidden group">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALxE5sZOprJs-kmRuzqFB4zsGOfASZiSWR-sqB1OfvMX2pjLluo_zS9KmqsjOzompX-tIxiWIVWBbFX60nvKbuGfV5s95ko_NI22CwrngnD8A_DsrzNtHRTamnIFvlpYSN-4_KW4mltdeoAklPxlLiEYo0b3QLQw8u0CHZF1naeYsUWKlW-UxMkIctB0ltY7Ulakw2CI1E9aA-KxZvzDXWSxwdUfvJrgrKvwepu770C9DWv9tPFSNmEN9vLizPoOeBrCt4iOhTrxo"
                className="w-full h-full object-cover grayscale brightness-90 group-hover:scale-105 transition-transform duration-[3s] ease-out"
                alt="Atelier Origin" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Huge Quote Parallax */}
      <section className="py-48 px-12 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-[1200px] mx-auto text-center fade-up">
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-zinc-400 mb-8 block">La Filosofía</span>
          <p className="serif-headline text-3xl md:text-6xl italic text-zinc-900 leading-[1.3] tracking-tight">
            "No hacemos ropa para adornar el cuerpo, construimos refugios de tela para habitar el presente."
          </p>
          <div className="mt-16 flex justify-center fade-up delay-500">
            <Link href="/shop" className="border border-zinc-300 text-zinc-800 px-12 py-4 font-label text-[10px] uppercase tracking-widest hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all duration-700">
              Explorar Colección
            </Link>
          </div>
        </div>
      </section>

      {/* Chapter 2 */}
      <section className="py-32 px-12 md:px-24">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-up">
            <div className="aspect-[4/5] bg-zinc-100 overflow-hidden group">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQk7OKdgfnN5bgzIGFdu5jpwTTlS2QxrAa_bUL0bat10PohtTnrdDTJmctmgyJeI-VLpbCCPj3s2A1Aq7AAiRdT1hLk53jkwBigSiZ0X_tZrFSKRQYIdrpzxd4Hq2f86jsLNgZHGomp1_6c6ji80QDQzDMszhHxK7_RrZrpugIY7VtXR9XvPM9AvRVLguMqcJzyiNoYBo52QzbcLJlJjjW3i_8fyy0lwuOGjyTnfWLWpnZp3wrDRdFSrlY1_VG2eRze48yt3NULeU"
                className="w-full h-full object-cover grayscale brightness-95 group-hover:scale-105 transition-transform duration-[3s] ease-out" 
                alt=""
              />
            </div>
            <div className="aspect-[4/5] bg-zinc-100 overflow-hidden group flex items-center justify-center p-12 md:p-24 text-center">
              <div>
                <span className="font-label text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-8 block">Artesanía</span>
                <h3 className="serif-headline text-4xl italic text-zinc-950 mb-8">El valor del tiempo</h3>
                <p className="text-lg text-zinc-500 leading-relaxed font-light">
                  La confección de una pieza taiko nina es un antídoto contra la prisa. Colaboramos con maestros sastres que respetan la caída natural de los tejidos. Creemos que una prenda solo alcanza su máximo esplendor después de años de uso, adaptándose silenciosamente a la vida de quien la viste.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-[1px] bg-zinc-200"></div>
    </div>
  );
}
