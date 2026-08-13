import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { JSX } from 'react';

export function Header(): JSX.Element {
  const { user } = useAuth();
  const firstName = user?.nickname?.split(' ')[0] ?? '';
  const [imgFailed, setImgFailed] = useState(false);

  const showImage = Boolean(user?.avatarUrl) && !imgFailed;

  return (
    <header className="hidden lg:flex items-center justify-between mb-8 gap-4 flex-wrap">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Halo, {firstName}!
      </h1>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-dark-component dark:text-slate-100 flex items-center justify-center text-slate-600"
        >
          <Bell size={18} />
        </button>

        <div className="w-10 h-10 rounded-full bg-brand-purple text-white dark:bg-brand-blue flex items-center justify-center font-semibold overflow-hidden shrink-0">
          {showImage ? (
            <img
              src={user!.avatarUrl}
              alt={user!.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            (user?.name.charAt(0) ?? '?').toUpperCase()
          )}
        </div>
      </div>
    </header>
  );
}
