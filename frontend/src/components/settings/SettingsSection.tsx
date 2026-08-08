import type { JSX, ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps): JSX.Element {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
