'use client'

import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, user } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setIsAuthOpen(false);
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setIsAuthOpen(false);
        alert('Cuenta creada exitosamente. Por favor, revisa tu correo electrónico.');
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthOpen(false);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
        onClick={() => setIsAuthOpen(false)}
      ></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[400px] bg-white z-[70] shadow-2xl p-8">
        <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-black">
          <span className="material-symbols-outlined">close</span>
        </button>

        {user ? (
          <div>
            <h2 className="serif-headline text-2xl tracking-tighter mb-6">My Account</h2>
            <div className="mb-8">
              <span className="font-label text-zinc-500 text-[10px] uppercase tracking-widest block mb-2">Connected as</span>
              <p className="text-zinc-900 font-medium">{user.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full bg-zinc-950 text-white py-4 font-label text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <h2 className="serif-headline text-2xl tracking-tighter mb-2">{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <p className="text-zinc-500 text-sm font-light mb-8">
              {isLogin ? 'Access your orders and preferences.' : 'Join to enjoy bespoke services.'}
            </p>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" 
                  className="w-full border-b border-zinc-300 py-3 bg-transparent text-sm font-medium focus:ring-0 focus:border-black placeholder:font-light"
                />
              </div>
              <div>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" 
                  className="w-full border-b border-zinc-300 py-3 bg-transparent text-sm font-medium focus:ring-0 focus:border-black placeholder:font-light"
                />
              </div>
              
              {errorMsg && <p className="text-red-600 text-xs mt-2">{errorMsg}</p>}

              <button 
                type="submit" 
                className="w-full bg-zinc-950 text-white py-4 mt-6 font-label text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-900 transition-colors"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-label text-zinc-500 text-[10px] uppercase tracking-widest hover:text-black underline underline-offset-4 decoration-zinc-200"
              >
                {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
