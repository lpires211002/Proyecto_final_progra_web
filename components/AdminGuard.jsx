'use client'

import { useAppContext } from '@/context/AppContext';

// Shared access gate for every /admin page: waits for auth + role, then
// only renders children for a logged-in superadmin.
export default function AdminGuard({ children }) {
  const { user, userRole, authLoading } = useAppContext();

  if (authLoading || (user && userRole === null)) {
    return (
      <div className="min-h-screen pt-48 flex items-center justify-center bg-surface">
        <span className="material-symbols-outlined animate-spin text-zinc-400 text-4xl">progress_activity</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-48 text-center bg-surface">
        <span className="material-symbols-outlined text-6xl text-zinc-300 mb-6 block">lock</span>
        <h2 className="serif-headline text-3xl italic text-zinc-950 mb-4">Admin Access Required</h2>
        <p className="text-zinc-500 text-sm">Iniciá sesión para acceder al panel de administración.</p>
      </div>
    );
  }

  if (userRole !== 'superadmin') {
    return (
      <div className="min-h-screen pt-48 text-center bg-surface">
        <span className="material-symbols-outlined text-6xl text-zinc-300 mb-6 block">shield</span>
        <h2 className="serif-headline text-3xl italic text-zinc-950 mb-4">Acceso Denegado</h2>
        <p className="text-zinc-500 text-sm">No tenés permisos de superadmin para acceder a esta sección.</p>
        <p className="text-zinc-400 text-xs mt-2">Sesión: {user.email}</p>
      </div>
    );
  }

  return children;
}
