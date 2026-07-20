import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  /** Number of lines to render */
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  if (lines === 1) {
    return (
      <div
        className={clsx('skeleton h-4 w-full', className)}
        role="status"
        aria-label="Loading"
      />
    );
  }

  return (
    <div className="space-y-2" role="status" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'skeleton h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full',
            className,
          )}
        />
      ))}
    </div>
  );
}
