'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Load cart
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('taiko_cart');
      if (savedCart) {
        try {
            setCart(JSON.parse(savedCart));
        } catch (e) {
            console.error(e);
        }
      }
    }
    
    // Auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      if (!newUser) setUserRole(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch user role when user changes
  useEffect(() => {
    if (user) {
      supabase.from('user_roles').select('role').eq('user_id', user.id).single()
        .then(({ data }) => {
          setUserRole(data?.role ?? 'user');
        });
    }
  }, [user]);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
        localStorage.setItem('taiko_cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product, size) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, delta) => {
    setCart(prev => {
      const newCart = [...prev];
      newCart[index].quantity += delta;
      if (newCart[index].quantity < 1) newCart[index].quantity = 1;
      return newCart;
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount, setCart,
      isCartOpen, setIsCartOpen,
      isSearchOpen, setIsSearchOpen,
      isAuthOpen, setIsAuthOpen,
      user, setUser, userRole, authLoading,
      isMounted
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
