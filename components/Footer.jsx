'use client'

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);
      
      if (error) {
        if (error.code === '23505') {
          setMessage('¡Ya estás suscrito!');
        } else {
          setMessage('Hubo un error');
        }
      } else {
        setMessage('Suscrito con éxito');
        setEmail('');
      }
    } catch (err) {
      setMessage('Error de conexión');
    }
  };

  return (
    <footer className="bg-zinc-100 border-t border-zinc-200 mt-auto w-full text-zinc-900">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 px-12 py-24 w-full max-w-[1600px] mx-auto">
        <div>
          <div className="text-xl font-serif italic mb-6">taiko nina</div>
          <p className="font-label text-zinc-500 text-[10px] uppercase tracking-[0.2em] leading-relaxed">
            Atelier Collection. Defining modern femininity through precision and grace.
          </p>
        </div>
        <div>
          <h4 className="font-label text-[10px] uppercase tracking-[0.2em] mb-8 font-bold">Navigation</h4>
          <ul className="space-y-4">
            <li><Link href="/" className="font-label text-zinc-500 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-900 transition-colors">Home</Link></li>
            <li><Link href="/shop" className="font-label text-zinc-500 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-900 transition-colors">Collection</Link></li>
            <li><Link href="/outfits" className="font-label text-zinc-500 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-900 transition-colors">Outfits</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-label text-[10px] uppercase tracking-[0.2em] mb-8 font-bold">Contact</h4>
          <ul className="space-y-4">
            <li><Link href="/client-care" className="font-label text-zinc-500 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-900 transition-colors">Client Care</Link></li>
            <li><a href="tel:+13054567890" className="font-label text-zinc-500 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-900 transition-colors">+1 (305) 456-7890</a></li>
            <li><a href="https://instagram.com/taikonina" target="_blank" rel="noreferrer" className="font-label text-zinc-500 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-900 transition-colors">Instagram</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-label text-[10px] uppercase tracking-[0.2em] mb-8 font-bold">Newsletter</h4>
          <form className="flex border-b border-zinc-300 py-2 relative" onSubmit={handleSubscribe}>
            <input
              type="email"
              aria-label="Email para el newsletter"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none text-[10px] uppercase tracking-[0.2em] focus:ring-0 w-full placeholder:text-zinc-400 text-zinc-900"
              placeholder="Email Address" 
            />
            <button type="submit" className="material-symbols-outlined text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">arrow_forward</button>
            {message && (
              <p className="absolute top-12 left-0 text-[10px] uppercase tracking-widest text-zinc-700 font-bold">{message}</p>
            )}
          </form>
        </div>
      </div>
      <div className="px-12 py-12 border-t border-zinc-200 text-center">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-400">© 2026 taiko nina. Atelier Collection.</p>
      </div>
    </footer>
  );
}
