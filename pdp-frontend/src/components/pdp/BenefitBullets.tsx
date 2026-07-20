import React from 'react';
import {
  Leaf,
  Zap,
  Moon,
  Shield,
  Award,
  LucideIcon,
} from 'lucide-react';
import type { Benefit } from '../../data/product';

const ICON_MAP: Record<string, LucideIcon> = {
  Leaf,
  Zap,
  Moon,
  Shield,
  Award,
};

interface BenefitBulletsProps {
  benefits: Benefit[];
}

export function BenefitBullets({ benefits }: BenefitBulletsProps) {
  return (
    <section aria-labelledby="benefits-heading">
      <h2
        id="benefits-heading"
        className="mb-4 text-xs font-semibold uppercase tracking-widest text-ka-bark/50"
      >
        Why it works
      </h2>
      <ul className="space-y-3.5">
        {benefits.map((b, i) => {
          const Icon = ICON_MAP[b.icon] ?? Leaf;
          return (
            <li
              key={b.heading}
              className="flex items-start gap-3 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span
                className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-ka-green-100 text-ka-green-600"
                aria-hidden="true"
              >
                <Icon size={15} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ka-bark">{b.heading}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-ka-bark/70">{b.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
