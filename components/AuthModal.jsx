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
                  aria-label="Email"
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
                  aria-label="Contraseña"
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-zinc-500 font-light">or</span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={async () => {
                setErrorMsg('');
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
                    }
                  });
                  if (error) throw error;
                } catch (err) {
                  setErrorMsg(err.message);
                }
              }}
              className="w-full bg-white text-zinc-950 border border-zinc-200 py-3.5 font-label text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Continue with Google
            </button>

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
