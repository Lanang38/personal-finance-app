import type { JSX } from 'react';

interface SkeletonProps {
  className?: string;
}
export function Skeleton({ className = '' }: SkeletonProps): JSX.Element {
  return (
    <div
      className={`animate-pulse bg-slate-200/70 dark:bg-dark-skeleton ${className}`}
      aria-hidden="true"
    />
  );
}
