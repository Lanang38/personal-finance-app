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
  return (
    <nav className="bg-white dark:bg-slate-800 rounded-3xl p-3 shadow-sm space-y-1">
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
                ? 'bg-brand-purple/10 dark:bg-brand-purple/20'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
