import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import type { Variant } from '../../data/product';

interface VariantSelectorProps {
  variants: Variant[];
  selected: Variant;
  onChange: (v: Variant) => void;
  /** Highlight a specific variant id (used by quiz recommendation) */
  highlightId?: string;
}

export function VariantSelector({
  variants,
  selected,
  onChange,
  highlightId,
}: VariantSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold uppercase tracking-widest text-ka-bark/60">
        Pack size
      </legend>
      <div className="grid grid-cols-3 gap-2.5" role="radiogroup">
        {variants.map((v) => {
          const isSelected = v.id === selected.id;
          const isHighlighted = v.id === highlightId && !isSelected;

          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${v.title}, ${v.capsules} capsules, ${v.priceDisplay}`}
              disabled={!v.available}
              onClick={() => onChange(v)}
              className={clsx(
                'group relative flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3.5',
                'text-center select-none',
                /* Premium micro-interaction: lift + scale on hover, press on click */
                'transition-all duration-150 ease-out',
                'hover:-translate-y-0.5 hover:shadow-md',
                'active:translate-y-0 active:scale-[0.97] active:shadow-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ka-green-500 focus-visible:ring-offset-2',
                isSelected
                  ? 'border-ka-green-500 bg-ka-green-50 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-ka-green-300',
                !v.available && 'cursor-not-allowed opacity-40 hover:translate-y-0 hover:shadow-none',
                isHighlighted && 'border-ka-gold-400 ring-1 ring-ka-gold-300',
              )}
            >
              {/* Selected checkmark — bounces in */}
              {isSelected && (
                <span
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ka-green-500 text-white shadow-sm animate-bounce-in"
                  aria-hidden="true"
                >
                  <Check size={11} strokeWidth={3} />
                </span>
              )}

              {/* Recommended badge from quiz */}
              {isHighlighted && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ka-gold-400 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm animate-fade-in">
                  Recommended
                </span>
              )}

              <span
                className={clsx(
                  'text-sm font-semibold transition-colors duration-150',
                  isSelected ? 'text-ka-green-700' : 'text-ka-bark',
                )}
              >
                {v.title}
              </span>
              <span className="text-[11px] text-stone-500">{v.capsules} caps</span>
              <span
                className={clsx(
                  'mt-1 text-base font-bold transition-colors duration-150',
                  isSelected ? 'text-ka-green-600' : 'text-ka-bark',
                )}
              >
                {v.priceDisplay}
              </span>
              <span className="text-[10px] text-stone-400">{v.perDayDisplay}</span>

              {v.tag && (
                <span
                  className={clsx(
                    'mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors duration-150',
                    isSelected
                      ? 'bg-ka-green-100 text-ka-green-700'
                      : 'bg-stone-100 text-stone-500',
                  )}
                >
                  {v.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
