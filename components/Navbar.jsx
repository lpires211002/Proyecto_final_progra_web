'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { setIsCartOpen, setIsSearchOpen, setIsAuthOpen, cartCount } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';
  // On home with video background, use text-white initially. Otherwise, use text-zinc-950 immediately.
  const navbarClasses = scrolled || !isHome
    ? 'bg-[#f9f9f9]/90 backdrop-blur-3xl text-zinc-950 border-b border-zinc-200 shadow-sm'
    : 'bg-transparent text-white';

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${navbarClasses}`}>
        <div className="flex items-center w-full px-4 md:px-12 py-4 md:py-8 max-w-[1600px] mx-auto">
          {/* Left: Navigation Links */}
          <div className="flex-1 flex items-center">
            <span className="material-symbols-outlined cursor-pointer md:!hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>menu</span>
            <div className="hidden md:flex items-center gap-4 lg:gap-12">
              <Link href="/" className="font-medium tracking-[0.15em] text-[11px] uppercase transition-all duration-500 hover:opacity-100 opacity-70">Home</Link>
              <Link href="/shop" className="font-medium tracking-[0.15em] text-[11px] uppercase transition-all duration-500 opacity-70 hover:opacity-100">Collection</Link>
              <Link href="/outfits" className="font-medium tracking-[0.15em] text-[11px] uppercase transition-all duration-500 opacity-70 hover:opacity-100">Outfits</Link>
              <Link href="/contact" className="font-medium tracking-[0.15em] text-[11px] uppercase transition-all duration-500 opacity-70 hover:opacity-100">Contact</Link>
            </div>
          </div>
          {/* Center: Logo */}
          <div className="shrink-0 flex justify-center text-center">
            <Link href="/" className="text-xl md:text-2xl font-serif italic tracking-tighter whitespace-nowrap">
              taiko nina
            </Link>
          </div>
          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end gap-3 lg:gap-8">
            <button className="scale-100 active:scale-95 transition-transform" onClick={() => setIsSearchOpen(true)}>
              <span className="material-symbols-outlined text-[20px] md:text-[24px]">search</span>
            </button>
            <button className="scale-100 active:scale-95 transition-transform" onClick={() => setIsAuthOpen(true)}>
              <span className="material-symbols-outlined text-[20px] md:text-[24px]">person</span>
            </button>
            <button className="scale-100 active:scale-95 transition-transform relative" onClick={() => setIsCartOpen(true)}>
              <span className="material-symbols-outlined text-[20px] md:text-[24px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className={`absolute -top-1 -right-2 ${!isHome || scrolled ? 'bg-zinc-950 text-white' : 'bg-white text-black'} border border-zinc-200 text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center`}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white text-black border-t border-zinc-200 flex flex-col items-center py-6 gap-6 shadow-xl">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-semibold tracking-[0.15em] text-[12px] uppercase">Home</Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-zinc-500 font-medium tracking-[0.15em] text-[12px] uppercase">Collection</Link>
            <Link href="/outfits" onClick={() => setMobileMenuOpen(false)} className="text-zinc-500 font-medium tracking-[0.15em] text-[12px] uppercase">Outfits</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-zinc-500 font-medium tracking-[0.15em] text-[12px] uppercase">Contact</Link>
          </div>
        )}
      </nav>
    </>
  );
}
