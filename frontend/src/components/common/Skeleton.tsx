import type { JSX } from 'react';

interface SkeletonProps {
  className?: string;
}

/**
 * Blok dasar skeleton loading. Gunakan className untuk atur ukuran/bentuk
 * (contoh: "h-4 w-32 rounded-full", "h-40 w-full rounded-3xl").
 */
export function Skeleton({ className = '' }: SkeletonProps): JSX.Element {
  return (
    <div
      className={`animate-pulse bg-slate-200/70 ${className}`}
      aria-hidden="true"
    />
  );
}
