import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { JSX } from 'react';

export interface SettingsTabItem {
  id: string;
  label: string;
  icon: JSX.Element;
  danger?: boolean;
}

interface SettingsNavProps {
  items: SettingsTabItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function SettingsNav({
  items,
  activeId,
  onSelect,
}: SettingsNavProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  const activeColorClass = activeItem?.danger
    ? 'text-brand-red'
    : 'text-brand-purple dark:text-slate-100';

  function handleSelect(id: string): void {
    onSelect(id);
    setIsOpen(false);
  }

  return (
    <>
      {/* MOBILE + TABLET */}
      <div className="lg:hidden relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="w-full flex items-center justify-between gap-3 bg-white dark:bg-dark-component rounded-2xl px-4 py-3.5 shadow-sm"
        >
          <div
            className={`flex items-center gap-3 text-sm font-semibold ${activeColorClass}`}
          >
            {activeItem?.icon}
            <span>{activeItem?.label}</span>
          </div>

          <ChevronDown
            size={18}
            className={`text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-dark-component rounded-2xl shadow-lg p-2 border border-slate-100 dark:border-white/5">
            <nav className="flex flex-col gap-1">
              {items.map((item) => {
                const isActive = item.id === activeId;

                const colorClass = item.danger
                  ? 'text-brand-red'
                  : isActive
                    ? 'text-brand-purple dark:text-slate-100'
                    : 'text-slate-500 dark:text-slate-400';

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${colorClass} ${
                      isActive
                        ? 'bg-brand-purple/10 dark:bg-brand-blue'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <nav className="hidden lg:block bg-white dark:bg-dark-component rounded-3xl px-3 py-9 shadow-sm space-y-3">
        {items.map((item) => {
          const isActive = item.id === activeId;

          const colorClass = item.danger
            ? 'text-brand-red'
            : isActive
              ? 'text-brand-purple'
              : 'text-slate-500 dark:text-slate-400';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${colorClass} ${
                isActive
                  ? 'bg-brand-purple/10 dark:bg-brand-blue dark:text-slate-100'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
