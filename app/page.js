'use client'

import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
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
  }, []);

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

      {/* New Arrivals */}
      <section className="py-32 px-12 bg-zinc-50">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
            {/* Products mock inside New Arrivals */}
            <div className="group cursor-pointer fade-up">
              <Link href="/product/L'Aube Silk Slip Dress">
                <div className="aspect-[3/4] overflow-hidden bg-zinc-200 mb-6 relative">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo8cH7YuSdS_GwDAPSCsdThHkb_Vez7tn7I12cGZXK4MWb-xxgbV9VM71YtRqUFAY3RkHQydjLLffN_YWEBb8jS3gFjgMSp08fGhni1R1pqPY-dw5stdtOK0x10akFDGDhQM3ehmg5GvbIx_aiD2iIHycb1a6sFQEazhiX09MbtLePfmyJ2u5UFWnwMb08y_jmGCvPftA8bZTsD7OCK0fbHoLzNSn4D4Hb9O-jGSctQdnD1RmxCmtEkNg9vVEriUK1hjgPxWCRK6w" alt="" />
                  <div className="absolute top-4 right-4 bg-white/50 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-tighter">New</div>
                </div>
                <h4 className="font-label text-[11px] uppercase tracking-widest mb-1">L'Aube Silk Slip Dress</h4>
              </Link>
            </div>
            <div className="group cursor-pointer fade-up delay-100">
              <Link href="/product/Architectural Wool Blazer">
                <div className="aspect-[3/4] overflow-hidden bg-zinc-200 mb-6 relative">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJaKSXm46NogY8QpT0xvjoIweButcXDEgBbnq1fwjyTcDL0FHfOc78-Q6i2KEOlFtTN-vkTPP7gL8R_Sr6rQJbcZy2pn_53dzj34F9fsGqD7Zwvqz54dcqD1FwOhlDpg0-YLx25ZrcwKqflpEN2W2GAgISZGLaENfZ_kUyIe6cbyTjy3tAFO4v-unjXPJGUksD2z9LKI7E-y4zknjGVKwCxF1mmWGFLT9pEf8L5Z7F5TI55bJQcpBh6Zulsqx8OTh09tOCi95XhSs" alt="" />
                </div>
                <h4 className="font-label text-[11px] uppercase tracking-widest mb-1">Architectural Wool Blazer</h4>
              </Link>
            </div>
            <div className="group cursor-pointer fade-up delay-300">
              <Link href="/product/High-Rise Linen Trouser">
                <div className="aspect-[3/4] overflow-hidden bg-zinc-200 mb-6 relative">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyoCog4gPz6toSSZVoUKkEYS7yvXAGdP1HICNpvtRAmj4Pm4fcZ74drkJzoeUFifuLJWXJSUr5jGeomM5ev7dviuGK9Tg1ZvLZVfBc5slW-ogdlC5a62Fy2gZ2asJnAkfOaRlxqTf_UV2BnYI5DdsaqJI9n8Gt2p_qIYUyKU-2s7Qnyl03bNxIBMJ_8SoAQVzpXRfBG5bAWKPQFaOTgt9NduR0loK3wiSJnfvqP6VcGcfhwhdAAnK5qMc_KJCXjtNt59ngOEANDAQ" alt="" />
                </div>
                <h4 className="font-label text-[11px] uppercase tracking-widest mb-1">High-Rise Linen Trouser</h4>
              </Link>
            </div>
            <div className="group cursor-pointer fade-up delay-500">
              <Link href="/product/Double-Face Cashmere Coat">
                <div className="aspect-[3/4] overflow-hidden bg-zinc-200 mb-6 relative">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIeK20R4nKkMDQ15PnlfrdfhtPDk2r8fksRQA9jzLfTtB8PnAu5CAii0aDQHVk2IFQNicFhUQYTg6dWeSDw2sUC9mCoGY4y7eVcdxAQYfqEfxtndZ9J12dRvHee_0ZH3gvbmFic4sZiM3pyhVLKa72fJKzL7jmWBbpK78XGemnQ1Odyqc_OtfQkEzf9D_CRezMayAxjMpGGrkKEjylDCPSFgL1r1QAAh4rX6dKIgLiUHsfm9D-bsboXYIeEVtn_7hvA4k_ekMcQM8" alt="" />
                </div>
                <h4 className="font-label text-[11px] uppercase tracking-widest mb-1">Double-Face Cashmere Coat</h4>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 px-12 bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-stretch">
            <div className="md:col-span-8 group relative overflow-hidden h-[600px] fade-up">
              <img className="w-full h-full object-cover grayscale group-hover:scale-[1.02] transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQk7OKdgfnN5bgzIGFdu5jpwTTlS2QxrAa_bUL0bat10PohtTnrdDTJmctmgyJeI-VLpbCCPj3s2A1Aq7AAiRdT1hLk53jkwBigSiZ0X_tZrFSKRQYIdrpzxd4Hq2f86jsLNgZHGomp1_6c6ji80QDQzDMszhHxK7_RrZrpugIY7VtXR9XvPM9AvRVLguMqcJzyiNoYBo52QzbcLJlJjjW3i_8fyy0lwuOGjyTnfWLWpnZp3wrDRdFSrlY1_VG2eRze48yt3NULeU" alt=""/>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute bottom-12 left-12 text-white">
                <h3 className="serif-headline text-6xl mb-4">{`L'Ete Infini`}</h3>
                <p className="font-label text-[10px] uppercase tracking-[0.3em] mb-8 opacity-80">The resort capsule collection</p>
                <Link href="/shop" className="border border-white/40 text-white px-8 py-3 font-label text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Explore Series</Link>
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col gap-12 fade-up delay-300">
              <Link href="/shop" className="flex-1 group relative overflow-hidden bg-zinc-100 cursor-pointer block">
                <img className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbdi2WRzhHN4RVsBoSqvp8Awdr9KiG0iBUarFmDAMwBqj_B36r-vd3En5SGUF0BvNCrHhxQKJWJKvpdfBwIrcaYnHS9MlFhvm0qlcmq7y2EslXFUxr9M4Q70YYYebb4Di-Vtr5kY6hr8xTwNX6OShZk4Zh8VuvyZPXGTK8Bd_NpaZJYYnvfSulnZchNKmDCPjRUADPvGkxynJ_Q6e9VIhOCbYMHAjPrJkUjcuanVscFFtvRPWpyK9b7wDePRqijY529CY2yQRckXo" alt="" />
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-zinc-900">
                  <div>
                    <h4 className="serif-headline text-3xl mb-2">The Essentials</h4>
                    <p className="font-label text-[10px] uppercase tracking-[0.2em] mb-6">Core Pieces</p>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>
              </Link>
              <div className="flex-1 bg-zinc-900 text-white p-12 flex flex-col justify-center items-center text-center">
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
