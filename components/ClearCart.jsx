'use client'

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

// Vacía el carrito al llegar a la página de pago completado.
export default function ClearCart() {
  const { setCart } = useAppContext();
  useEffect(() => {
    setCart([]);
  }, [setCart]);
  return null;
}
