import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import type { JSX } from 'react';

const OPTIONS: { mode: ThemeMode; icon: JSX.Element; label: string }[] = [
  { mode: 'light', icon: <Sun size={14} />, label: 'Terang' },
  { mode: 'dark', icon: <Moon size={14} />, label: 'Gelap' },
  { mode: 'system', icon: <Monitor size={14} />, label: 'Sistem' },
];

export function ThemeToggle(): JSX.Element {
  const { mode, setMode } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-full p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.mode}
          type="button"
          onClick={() => setMode(option.mode)}
          aria-label={option.label}
          title={option.label}
          className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
            mode === option.mode
              ? 'bg-white dark:bg-slate-700 text-brand-purple shadow-sm'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}
