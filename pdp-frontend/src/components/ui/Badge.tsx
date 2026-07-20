import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'gold' | 'bark';
  className?: string;
}

export function Badge({
  children,
  variant = 'green',
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide',
        variant === 'green' && 'bg-ka-green-100 text-ka-green-700',
        variant === 'gold'  && 'bg-ka-gold-100 text-ka-gold-700',
        variant === 'bark'  && 'bg-stone-100 text-ka-bark',
        className,
      )}
    >
      {children}
    </span>
  );
}
