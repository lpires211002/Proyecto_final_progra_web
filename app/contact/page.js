'use client'

import React from 'react';

export default function Contact() {
  return (
    <div className="min-h-screen py-32 px-12 bg-surface">
      <div className="max-w-[800px] mx-auto pt-16">
        <h1 className="serif-headline text-5xl md:text-7xl italic mb-12 text-zinc-950">Contacto</h1>
        <p className="font-body text-zinc-500 mb-16 text-lg font-light leading-relaxed">
          The taiko nina atelier is dedicated to providing an exceptional experience. For bespoke inquiries, styling advice, or press, please contact our dedicated team.
        </p>

        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <input type="text" aria-label="Nombre completo" placeholder="Full Name" className="w-full bg-transparent border-b border-zinc-300 py-4 focus:ring-0 focus:border-zinc-950 text-sm" />
            </div>
            <div>
              <input type="email" aria-label="Email" placeholder="Email Address" className="w-full bg-transparent border-b border-zinc-300 py-4 focus:ring-0 focus:border-zinc-950 text-sm" />
            </div>
          </div>
          <div>
            <textarea aria-label="Mensaje" placeholder="Your Message" rows="6" className="w-full bg-transparent border-b border-zinc-300 py-4 focus:ring-0 focus:border-zinc-950 text-sm resize-none"></textarea>
          </div>
          <button type="button" className="bg-zinc-950 text-white px-12 py-4 font-label text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">
            Send Inquiry
          </button>
        </form>
      </div>
    </div>
  );
}
