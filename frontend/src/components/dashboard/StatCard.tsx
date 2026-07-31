import { AnimatePresence, motion } from 'framer-motion';
import type { JSX } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  colorClass: string;
}

export function StatCard({
  label,
  value,
  subtitle = 'Nilai Saat Ini',
  colorClass,
}: StatCardProps): JSX.Element {
  return (
    <motion.div
      layout
      className={`rounded-3xl p-5 text-white shadow-lg overflow-hidden ${colorClass}`}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="font-bold">{label}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${subtitle}-${value}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <p className="text-xs text-white/80 mb-1">{subtitle}</p>
          <p className="text-2xl font-bold">{value}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
