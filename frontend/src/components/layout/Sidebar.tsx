import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  PieChart,
  Wallet,
  Receipt,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface MenuItem {
  label: string;
  to: string;
  icon: JSX.Element;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: <LayoutGrid size={20} /> },
  { label: "Transaksi", to: "/transactions", icon: <Receipt size={20} /> },
  { label: "Akun", to: "/accounts", icon: <Wallet size={20} /> },
  { label: "Analitik", to: "/dashboard#analitik", icon: <PieChart size={20} /> },
];

export function Sidebar(): JSX.Element {
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between bg-sidebar-gradient rounded-3xl m-4 mr-0 p-6 text-white">
      <div>
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-full bg-brand-lime flex items-center justify-center text-brand-purple font-bold">
            F
          </div>
          <span className="text-xl font-bold">Finance</span>
        </div>

        <p className="text-xs uppercase tracking-wide text-white/60 mb-3">Menu</p>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-colors ${
                  isActive
                    ? "bg-white text-brand-purple"
                    : "text-white/85 hover:bg-white/10"
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
        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/85 hover:bg-white/10 font-semibold"
      >
        <LogOut size={20} />
        Keluar
      </button>
    </aside>
  );
}
