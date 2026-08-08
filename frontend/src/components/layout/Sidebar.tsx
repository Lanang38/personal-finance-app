import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Wallet,
  Receipt,
  PiggyBank,
  FileBarChart,
  Settings,
  LogOut,
  NotepadText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { JSX } from 'react';

interface MenuItem {
  label: string;
  to: string;
  icon: JSX.Element;
}

// Menu yang sudah berfungsi penuh
const menuItems: MenuItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutGrid size={20} /> },
  { label: 'Transaksi', to: '/transactions', icon: <Receipt size={20} /> },
  { label: 'Akun', to: '/accounts', icon: <Wallet size={20} /> },
];
const menuItemsPlus: MenuItem[] = [
  { label: 'Anggaran', to: '/budgets', icon: <NotepadText size={20} /> },
  { label: 'Target Tabungan', to: '/goals', icon: <PiggyBank size={20} /> },
  { label: 'Laporan', to: '/reports', icon: <FileBarChart size={20} /> },
];

// Menu fitur yang sudah direncanakan tapi belum dikembangkan (mengarah ke halaman Coming Soon)
const upcomingMenuItems: MenuItem[] = [
  { label: 'Pengaturan', to: '/settings', icon: <Settings size={20} /> },
];

export function Sidebar(): JSX.Element {
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between bg-sidebar-gradient dark:bg-none dark:bg-dark-component rounded-3xl m-4 mr-0 p-6 text-white">
      <div>
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-full bg-brand-lime flex items-center justify-center text-brand-purple font-bold">
            F
          </div>
          <span className="text-xl font-bold">Finance</span>
        </div>

        <p className="text-xs uppercase tracking-wide text-white/60 mb-3">
          Menu
        </p>
        <nav className="flex flex-col gap-1 mb-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-colors ${
                  isActive
                    ? 'bg-white text-brand-purple dark:bg-brand-blue dark:text-slate-100'
                    : 'text-white/85 hover:bg-white/10'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <p className="text-xs uppercase tracking-wide text-white/60 mb-3">
          Menu Tambahan
        </p>
        <nav className="flex flex-col gap-1 mb-6">
          {menuItemsPlus.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-colors ${
                  isActive
                    ? 'bg-white text-brand-purple dark:bg-brand-blue dark:text-slate-100'
                    : 'text-white/85 hover:bg-white/10'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <p className="text-xs uppercase tracking-wide text-white/60 mb-3">
          Segera Hadir
        </p>
        <nav className="flex flex-col gap-1">
          {upcomingMenuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-colors ${
                  isActive
                    ? 'bg-white text-brand-purple dark:bg-brand-blue dark:text-slate-100'
                    : 'text-white/70 hover:bg-white/10'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/85 dark:text-brand-red hover:bg-white/10 font-semibold"
      >
        <LogOut size={20} />
        Keluar
      </button>
    </aside>
  );
}
