import { Bell, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { JSX } from 'react';

export function Header(): JSX.Element {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <header className="flex items-center justify-between mb-8 gap-4 flex-wrap">
      <h1 className="text-2xl font-bold text-slate-800">Halo, {firstName}!</h1>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 w-64">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Cari transaksi"
            className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
          />
        </div>

        <button
          type="button"
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
        >
          <Bell size={18} />
        </button>

        <div className="w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center font-semibold overflow-hidden">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            (user?.name.charAt(0) ?? "?").toUpperCase()
          )}
        </div>
      </div>
    </header>
  );
}
