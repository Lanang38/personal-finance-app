import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, WifiOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const { user, isLoading, authError, retryLoadProfile } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#EFEAFB] dark:bg-dark-background text-slate-500 dark:text-slate-300">
        <Loader2
          size={28}
          className="animate-spin text-brand-purple dark:text-brand-blue"
        />
        <p className="text-sm">Memuat...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#EFEAFB] dark:bg-dark-background text-slate-500 dark:text-slate-300 px-4 text-center">
        <WifiOff size={28} className="text-brand-red" />
        <p className="text-sm max-w-xs">{authError}</p>
        <button
          type="button"
          onClick={retryLoadProfile}
          className="text-xs font-semibold text-white bg-brand-purple dark:bg-brand-blue px-4 py-2 rounded-full hover:opacity-90 transition"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
