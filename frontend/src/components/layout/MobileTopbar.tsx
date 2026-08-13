import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { menuItems, menuItemsPlus, upcomingMenuItems } from './Sidebar';
import type { JSX } from 'react';

const allMenuItems = [...menuItems, ...menuItemsPlus, ...upcomingMenuItems];

export function MobileTopbar(): JSX.Element {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const showImage = Boolean(user?.avatarUrl) && !imgFailed;

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent): void {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="lg:hidden flex items-center justify-between mb-4">
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Buka menu"
          className="w-10 h-10 rounded-full bg-white dark:bg-dark-component shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-100"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {isOpen && (
          <div className="absolute left-0 top-12 z-50 w-56 bg-white dark:bg-dark-component rounded-2xl shadow-lg p-2">
            <nav className="flex flex-col gap-1">
              {allMenuItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-brand-purple text-white dark:bg-brand-blue'
                        : 'text-slate-600 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="h-px bg-slate-100 dark:bg-white/10 my-2" />

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-red hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-white dark:bg-dark-component dark:text-slate-100 shadow-sm flex items-center justify-center text-slate-600"
        >
          <Bell size={16} />
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
    </div>
  );
}
