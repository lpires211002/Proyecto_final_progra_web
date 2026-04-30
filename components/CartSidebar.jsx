'use client'

import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';

export default function CartSidebar() {
  const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen, user, setIsAuthOpen } = useAppContext();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!user) {
      setIsCartOpen(false);
      setIsAuthOpen(true);
      return;
    }

    setLoadingCheckout(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartItems: cart })
      });
      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Error al iniciar el checkout');
        setLoadingCheckout(false);
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión con el checkout');
      setLoadingCheckout(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      ></div>
      <div className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-50 transform transition-transform duration-500 ease-in-out shadow-2xl flex flex-col translate-x-0">
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-zinc-200">
          <h2 className="serif-headline text-2xl tracking-tighter">Shopping Bag</h2>
          <button onClick={() => setIsCartOpen(false)} className="material-symbols-outlined text-zinc-400 hover:text-black">close</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {cart.length === 0 ? (
            <p className="text-zinc-500 text-center mt-10">Your shopping bag is empty.</p>
          ) : (
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={`${item.id}-${Math.random()}`} className="flex gap-4">
                  <div className="w-20 h-[106px] bg-[#e0e0e0] shrink-0">
                    <img src={item.image_url || item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1 text-zinc-900">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-medium pr-4">{item.name}</h4>
                        <span className="text-sm font-medium shrink-0">${item.price * item.quantity}</span>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                        Size: {item.size} | Color: {item.color}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-zinc-200 w-fit">
                        <button onClick={() => updateQuantity(index, -1)} className="px-3 py-1 hover:bg-zinc-50 transition-colors text-zinc-500">-</button>
                        <span className="text-xs w-6 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, 1)} className="px-3 py-1 hover:bg-zinc-50 transition-colors text-zinc-500">+</button>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="font-label text-zinc-400 text-[10px] uppercase tracking-widest hover:text-red-900 transition-colors underline underline-offset-4 decoration-zinc-200 hover:decoration-red-900">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 md:p-8 border-t border-zinc-200 bg-white">
            <div className="flex justify-between items-center mb-6 text-zinc-900">
              <span className="font-label text-[11px] uppercase tracking-widest font-bold">Subtotal</span>
              <span className="text-lg font-medium">${cartTotal}</span>
            </div>
            <p className="text-xs text-zinc-500 font-light mb-6">Shipping and taxes calculated at checkout.</p>
            <button 
              onClick={handleCheckout} 
              disabled={loadingCheckout}
              className="w-full bg-zinc-950 text-white py-4 font-label text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-900 transition-colors disabled:opacity-50"
            >
              {loadingCheckout ? 'Placing order...' : 'Checkout securely'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
