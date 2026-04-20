'use client'

import React from 'react';

export default function ClientCare() {
  return (
    <div className="min-h-screen py-32 px-12 bg-surface">
      <div className="max-w-[800px] mx-auto pt-16">
        <h1 className="serif-headline text-5xl md:text-7xl italic mb-12 text-zinc-950">Client Care</h1>
        <p className="font-body text-zinc-500 mb-16 text-lg font-light leading-relaxed">
          At taiko nina, we believe in enduring quality. Our client care team is here to assist you with order inquiries, returns, and product maintenance.
        </p>

        <div className="space-y-12 text-zinc-900 border-l border-zinc-200 pl-8">
          <div>
            <h3 className="font-label text-[11px] uppercase tracking-[0.2em] mb-4">Shipping & Returns</h3>
            <p className="font-body text-zinc-500 text-sm leading-relaxed">
              We offer complimentary worldwide shipping on all orders over $500. Returns are accepted within 30 days of delivery, provided the garments are unworn and retain all original tags.
            </p>
          </div>
          <div>
            <h3 className="font-label text-[11px] uppercase tracking-[0.2em] mb-4">Atelier Repair Services</h3>
            <p className="font-body text-zinc-500 text-sm leading-relaxed">
              We stand by our craftsmanship. If your taiko nina piece requires specialized repair, our master tailors will restore it. Please contact us for an assessment.
            </p>
          </div>
          <div>
            <h3 className="font-label text-[11px] uppercase tracking-[0.2em] mb-4">Contact Hours</h3>
            <p className="font-body text-zinc-500 text-sm leading-relaxed">
              Monday - Friday: 9:00 AM - 6:00 PM (EST)<br/>
              Email: care@taikonina.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
