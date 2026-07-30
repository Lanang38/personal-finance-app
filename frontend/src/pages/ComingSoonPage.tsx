import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Construction } from 'lucide-react';
import type { JSX } from 'react';

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export function ComingSoonPage({
  title,
  description,
}: ComingSoonPageProps): JSX.Element {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center text-center bg-white rounded-3xl shadow-sm py-24 px-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-5">
          <Construction size={28} className="text-brand-purple" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-sm font-semibold text-brand-purple mb-3">
          Coming Soon
        </p>
        <p className="text-sm text-slate-400 max-w-sm">
          {description ??
            'Menu ini sedang dalam proses pengembangan. Nantikan pembaruannya, ya!'}
        </p>
      </div>
    </DashboardLayout>
  );
}
